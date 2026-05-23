import { NextResponse } from 'next/server';
import { fetchCmsData } from '@/lib/cms';

export async function GET() {
  try {
    const data = await fetchCmsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET CMS Error:", error);
    return NextResponse.json({ error: "Failed to read CMS data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!url) {
      throw new Error("Missing GOOGLE_APPS_SCRIPT_URL in environment variables.");
    }

    const newData = await request.json();

    // Forward the update request directly to Google Apps Script
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Apps Script save failed: ${response.status} - ${errorText}`);
    }

    const resJson = await response.json();
    return NextResponse.json(resJson);
  } catch (err: any) {
    console.error("POST CMS Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to write to Google Sheets" }, { status: 500 });
  }
}
