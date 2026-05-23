import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let fileType = 'image/jpeg';
  let buffer: Buffer | null = null;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    fileType = file.type || 'image/jpeg';
    buffer = Buffer.from(await file.arrayBuffer());

    const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!url) {
      throw new Error("Missing GOOGLE_APPS_SCRIPT_URL in environment variables.");
    }

    const base64Data = buffer.toString('base64');

    // POST the base64 data to the Google Apps Script Web App
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'upload',
        base64Data: base64Data,
        contentType: fileType,
        fileName: filename,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Apps Script upload failed: ${response.status} - ${errorText}`);
    }

    const resJson = await response.json();
    if (!resJson.success || !resJson.url) {
      throw new Error(resJson.error || "Google Apps Script returned an unsuccessful status");
    }

    // Convert raw Google Drive URL into our secure local image proxy URL
    let finalUrl = resJson.url;
    const match = resJson.url.match(/\/d\/([a-zA-Z0-9_-]+)/) || resJson.url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) {
      finalUrl = `/api/image-proxy?id=${match[1]}`;
    }

    return NextResponse.json({ success: true, url: finalUrl });
  } catch (error) {
    console.warn("Apps Script upload failed, falling back to Base64 storage:", error);

    if (buffer) {
      const base64Str = buffer.toString('base64');
      const base64DataUrl = `data:${fileType};base64,${base64Str}`;

      return NextResponse.json({
        success: true,
        url: base64DataUrl,
        fallback: true,
        message: "Google Drive storage bypassed. Image saved directly to sheets database successfully."
      });
    }

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
