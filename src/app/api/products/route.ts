import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

let memoryProducts: string[] = [
  "Tape Extensions",
  "K Tips",
  "Genius Wefts",
  "Butterfly Wefts",
  "ClipOn Extensions"
];

export async function GET() {
  try {
    if (fs.existsSync(productsFilePath)) {
      const fileContent = fs.readFileSync(productsFilePath, 'utf8');
      memoryProducts = JSON.parse(fileContent);
    } else {
      fs.writeFileSync(productsFilePath, JSON.stringify(memoryProducts, null, 2), 'utf8');
    }
    return NextResponse.json(memoryProducts);
  } catch (error) {
    console.error('Error reading products:', error);
    return NextResponse.json(memoryProducts);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Expected to be an array of strings
    if (Array.isArray(data)) {
      memoryProducts = data;
      try {
        if (!fs.existsSync(path.dirname(productsFilePath))) {
           fs.mkdirSync(path.dirname(productsFilePath), { recursive: true });
        }
        fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2), 'utf8');
      } catch (fsErr) {
        console.warn('Filesystem write warning in serverless environment:', fsErr);
      }
      return NextResponse.json({ success: true, products: memoryProducts });
    }
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
  } catch (error) {
    console.error('Error saving products:', error);
    return NextResponse.json({ error: 'Failed to save products' }, { status: 500 });
  }
}
