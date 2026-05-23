import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Secure one-way SHA-256 hashes of the admin credentials
const HASHED_USERNAME = '4775e033b4cf95a2b5f0988a3172c911ab6b6787d0cd993fcda0af7fbb260a14'; // viprongo
const HASHED_PASSWORD = '70215c1bb01df7fbcda2bf7cdc2c33ad981021b6812e11d28f79870b0477d213'; // venkatesan@vipro

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const inputUserHash = crypto.createHash('sha256').update(username || '').digest('hex');
    const inputPassHash = crypto.createHash('sha256').update(password || '').digest('hex');

    if (inputUserHash === HASHED_USERNAME && inputPassHash === HASHED_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'auth_token',
        value: 'admin-session-token-vipro-2026',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
