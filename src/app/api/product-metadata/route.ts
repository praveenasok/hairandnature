import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const metadataFilePath = path.join(process.cwd(), 'src/data/product-metadata.json');

let memoryMetadata: Record<string, any> = {};

export async function GET() {
  try {
    if (fs.existsSync(metadataFilePath)) {
      const fileContent = fs.readFileSync(metadataFilePath, 'utf8');
      memoryMetadata = JSON.parse(fileContent);
    }
    return NextResponse.json(memoryMetadata);
  } catch (error) {
    console.error('Error reading product metadata:', error);
    return NextResponse.json(memoryMetadata);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    memoryMetadata = { ...data };
    try {
      if (!fs.existsSync(path.dirname(metadataFilePath))) {
         fs.mkdirSync(path.dirname(metadataFilePath), { recursive: true });
      }
      fs.writeFileSync(metadataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Filesystem write warning in serverless environment:', fsErr);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving product metadata:', error);
    return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500 });
  }
}
