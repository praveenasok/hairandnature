import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const pricesFilePath = path.join(process.cwd(), 'src/data/prices.json');

export async function GET() {
  try {
    if (!fs.existsSync(pricesFilePath)) {
      return NextResponse.json({});
    }
    const fileContent = fs.readFileSync(pricesFilePath, 'utf8');
    const prices = JSON.parse(fileContent);
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error reading prices:', error);
    return NextResponse.json({ error: 'Failed to read prices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    fs.writeFileSync(pricesFilePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving prices:', error);
    return NextResponse.json({ error: 'Failed to save prices' }, { status: 500 });
  }
}
