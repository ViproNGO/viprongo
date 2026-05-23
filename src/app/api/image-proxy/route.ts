import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const urlParam = searchParams.get('url');

    let fileId = id;
    if (!fileId && urlParam) {
      // Extract file ID from googleusercontent or drive URL
      const match = urlParam.match(/\/d\/([a-zA-Z0-9_-]+)/) || urlParam.match(/id=([a-zA-Z0-9_-]+)/);
      if (match) {
        fileId = match[1];
      }
    }

    if (!fileId) {
      return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }

    // Google Drive direct download URL
    const googleDriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const res = await fetch(googleDriveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) {
      throw new Error(`Google Drive returned status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });

  } catch (error: any) {
    console.error("Image proxy failed:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
