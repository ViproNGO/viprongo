import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
  console.error("Missing required Google Environment variables in .env.local");
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive'
  ],
});

const drive = google.drive({ version: 'v3', auth });
const FILE_ID = '1VTyGRyyGkW0LZCGG5G1mpqlv3qp7MZiv';

async function downloadLogo() {
  console.log(`Downloading high-resolution logo from Google Drive (ID: ${FILE_ID})...`);
  try {
    const response = await drive.files.get(
      { fileId: FILE_ID, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const buffer = Buffer.from(response.data);
    const targetDir = path.join(process.cwd(), 'public');
    await fs.mkdir(targetDir, { recursive: true });
    
    const targetPath = path.join(targetDir, 'logo.png');
    await fs.writeFile(targetPath, buffer);
    
    console.log(`Successfully downloaded and saved logo to: ${targetPath}`);
  } catch (error) {
    console.error("Error downloading logo from Google Drive:", error);
    process.exit(1);
  }
}

downloadLogo().catch(console.error);
