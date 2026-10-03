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

export async function GET() {
  try {
    if (!fs.existsSync(unitsFilePath)) {
      return NextResponse.json(defaultUnits);
    }
    const fileContent = fs.readFileSync(unitsFilePath, 'utf8');
    const units = JSON.parse(fileContent);
    return NextResponse.json({ ...defaultUnits, ...units });
  } catch (error) {
    console.error('Error reading units:', error);
    return NextResponse.json(defaultUnits);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    fs.writeFileSync(unitsFilePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true, units: data });
  } catch (error) {
    console.error('Error saving units:', error);
    return NextResponse.json({ error: 'Failed to save units' }, { status: 500 });
  }
}
