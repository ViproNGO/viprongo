import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

async function run() {
  console.log("Fetching local CMS data...");
  const dataPath = path.join(process.cwd(), 'src', 'data', 'cms.json');
  const cmsData = JSON.parse(await fs.readFile(dataPath, 'utf8'));

  console.log("Checking existing sheets...");
  const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existingTitles = sheetMeta.data.sheets.map(s => s.properties.title);
  
  const requiredSheets = ['Visibility', 'Content', 'Gallery', 'Impact'];
  
  const requests = [];
  for (const title of requiredSheets) {
    if (!existingTitles.includes(title)) {
      requests.push({
        addSheet: { properties: { title } }
      });
    }
  }

  if (requests.length > 0) {
    console.log("Creating missing sheets...");
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests }
    });
  }

  console.log("Populating data into sheets...");
  const visibilityRows = [['Section', 'IsVisible']];
  for (const [section, isVisible] of Object.entries(cmsData.sections)) {
    visibilityRows.push([section, isVisible ? 'TRUE' : 'FALSE']);
  }

  const contentRows = [['Section', 'Field', 'Value']];
  for (const [section, fields] of Object.entries(cmsData.content)) {
    for (const [field, value] of Object.entries(fields)) {
      let stringValue = value;
      if (typeof value === 'object') stringValue = JSON.stringify(value);
      contentRows.push([section, field, stringValue]);
    }
  }

  const galleryRows = [['ID', 'URL', 'Category', 'Alt', 'DescEn', 'DescTa']];
  for (const img of cmsData.gallery) {
    galleryRows.push([img.id, img.src, img.category, img.alt, img.descEn || '', img.descTa || '']);
  }

  const impactRows = [['ID', 'Name', 'Role', 'Quote', 'Image']];
  for (const story of cmsData.stories || []) {
    impactRows.push([story.id, story.name, story.role, story.quote, story.image]);
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: [
        { range: 'Visibility!A:B', values: visibilityRows },
        { range: 'Content!A:C', values: contentRows },
        { range: 'Gallery!A:F', values: galleryRows },
        { range: 'Impact!A:E', values: impactRows },
      ]
    }
  });

  console.log("Data successfully migrated to Google Sheets!");
}

run().catch(console.error);
