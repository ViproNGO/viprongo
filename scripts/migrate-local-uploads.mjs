import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !FOLDER_ID) {
  console.error("Missing required Google Environment variables in .env.local");
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ],
});

const drive = google.drive({ version: 'v3', auth });

async function uploadFileToDrive(filePath, mimeType, filename) {
  console.log(`Uploading ${filename} to Google Drive...`);
  try {
    const fileContent = await fs.readFile(filePath);
    
    // Create Readable stream from Buffer
    const { Readable } = await import('stream');
    const stream = new Readable();
    stream.push(fileContent);
    stream.push(null);

    const driveFile = await drive.files.create({
      requestBody: {
        name: filename,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: mimeType,
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = driveFile.data.id;
    console.log(`Uploaded successfully! File ID: ${fileId}`);

    if (fileId) {
      console.log(`Making file public on Drive...`);
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      console.log(`File is now public.`);
    }

    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch (error) {
    console.error(`Error uploading ${filename} to Google Drive:`, error);
    throw error;
  }
}

async function run() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'cms.json');
  const cmsData = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  let modified = false;

  console.log("Checking gallery items for local uploads...");
  for (let i = 0; i < cmsData.gallery.length; i++) {
    const img = cmsData.gallery[i];
    if (img.src.startsWith('/uploads/')) {
      const filename = img.src.replace('/uploads/', '');
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', filename);

      try {
        // Simple MIME type resolver
        let mimeType = 'image/jpeg';
        if (filename.endsWith('.png')) mimeType = 'image/png';
        else if (filename.endsWith('.svg')) mimeType = 'image/svg+xml';
        else if (filename.endsWith('.webp')) mimeType = 'image/webp';

        const driveUrl = await uploadFileToDrive(localFilePath, mimeType, filename);
        img.src = driveUrl;
        modified = true;
      } catch (err) {
        console.error(`Failed to process local image ${filename}:`, err);
      }
    }
  }

  if (modified) {
    await fs.writeFile(dataPath, JSON.stringify(cmsData, null, 2), 'utf8');
    console.log("Successfully updated cms.json with Google Drive URLs!");
  } else {
    console.log("No local uploads found to migrate.");
  }
}

run().catch(console.error);
