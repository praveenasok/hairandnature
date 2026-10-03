import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const unitsFilePath = path.join(process.cwd(), 'src/data/units.json');

const defaultUnits: Record<string, string> = {
  "Tape Extensions": "pack",
  "K Tips": "pack",
  "Genius Wefts": "weft",
  "Butterfly Wefts": "bundle",
  "ClipOn Extensions": "set"
};

let memoryUnits: Record<string, string> = { ...defaultUnits };

export async function GET() {
  try {
    if (fs.existsSync(unitsFilePath)) {
      const fileContent = fs.readFileSync(unitsFilePath, 'utf8');
      const units = JSON.parse(fileContent);
      memoryUnits = { ...defaultUnits, ...units };
    }
    return NextResponse.json(memoryUnits);
  } catch (error) {
    console.error('Error reading units:', error);
    return NextResponse.json(memoryUnits);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    memoryUnits = { ...memoryUnits, ...data };
    try {
      fs.writeFileSync(unitsFilePath, JSON.stringify(memoryUnits, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Filesystem write warning in serverless environment:', fsErr);
    }
    return NextResponse.json({ success: true, units: memoryUnits });
  } catch (error) {
    console.error('Error saving units:', error);
    return NextResponse.json({ error: 'Failed to save units' }, { status: 500 });
  }
}
