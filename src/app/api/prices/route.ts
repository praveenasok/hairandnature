import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const pricesFilePath = path.join(process.cwd(), 'src/data/prices.json');

const unitsFilePath = path.join(process.cwd(), 'src/data/units.json');

const defaultUnits: Record<string, string> = {
  "Tape Extensions": "pack",
  "K Tips": "pack",
  "Genius Wefts": "weft",
  "Butterfly Wefts": "bundle",
  "ClipOn Extensions": "set"
};

let memoryPrices: Record<string, number> = {};

export async function GET(request: Request) {
  try {
    if (fs.existsSync(pricesFilePath)) {
      const fileContent = fs.readFileSync(pricesFilePath, 'utf8');
      memoryPrices = JSON.parse(fileContent);
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || (searchParams.get('download') === 'csv' ? 'csv' : null);

    if (format === 'csv') {
      let units = { ...defaultUnits };
      if (fs.existsSync(unitsFilePath)) {
        try {
          units = { ...units, ...JSON.parse(fs.readFileSync(unitsFilePath, 'utf8')) };
        } catch (e) {
          console.error('Error reading units for CSV export:', e);
        }
      }

      const escapeCsv = (val: string | number | undefined | null): string => {
        if (val === undefined || val === null) return '""';
        const str = String(val).trim();
        return `"${str.replace(/"/g, '""')}"`;
      };

      const headers = [
        'Product',
        'Length',
        'Weight',
        'Style',
        'Color / Shade',
        'Unit of Sale',
        'Price (USD)',
        'Display Price'
      ];

      const csvRows = [headers.join(',')];

      for (const [key, price] of Object.entries(memoryPrices)) {
        const parts = key.split('|');
        const prod = parts[0] || '';
        const length = parts[1] || '';
        const style = parts[2] || '';
        const color = parts[3] || '';
        const weight = parts[4] || '100 Grams';
        const unit = units[prod] || 'unit';
        const displayPrice = `$${Math.round(price)}/${unit}`;

        csvRows.push([
          escapeCsv(prod),
          escapeCsv(length),
          escapeCsv(weight),
          escapeCsv(style),
          escapeCsv(color),
          escapeCsv(unit),
          escapeCsv(Math.round(price)),
          escapeCsv(displayPrice)
        ].join(','));
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const csv = '\uFEFF' + csvRows.join('\r\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="hair-and-nature-price-list-${dateStr}.csv"`
        }
      });
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
