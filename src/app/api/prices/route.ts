import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const pricesFilePath = path.join(process.cwd(), 'src/data/prices.json');

let memoryPrices: Record<string, number> = {};

export async function GET() {
  try {
    if (fs.existsSync(pricesFilePath)) {
      const fileContent = fs.readFileSync(pricesFilePath, 'utf8');
      memoryPrices = JSON.parse(fileContent);
    }
    return NextResponse.json(memoryPrices);
  } catch (error) {
    console.error('Error reading prices:', error);
    return NextResponse.json(memoryPrices);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    memoryPrices = { ...data };
    try {
      fs.writeFileSync(pricesFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Filesystem write warning in serverless environment:', fsErr);
    }
    return NextResponse.json({ success: true, count: Object.keys(memoryPrices).length });
  } catch (error) {
    console.error('Error saving prices:', error);
    return NextResponse.json({ error: 'Failed to save prices' }, { status: 500 });
  }
}
