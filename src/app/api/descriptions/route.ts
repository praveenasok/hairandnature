import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const descriptionsFilePath = path.join(process.cwd(), 'src/data/descriptions.json');

const defaultDescriptions: Record<string, string> = {
  "Tape Extensions": "Lightweight and discreet tape-ins that provide a natural, full-bodied look with long-lasting hold. Effortless to install and maintain, ensuring a flawlessly blended appearance.",
  "K Tips": "Premium keratin-tipped extensions for individual strand-by-strand application and natural movement. These extensions offer a 360-degree range of motion for endless styling possibilities.",
  "Genius Wefts": "Ultra-thin and flexible wefts that lay perfectly flat against your scalp for seamless blending. Incredibly durable with zero return hair for maximum scalp comfort.",
  "Butterfly Wefts": "Innovative weft design providing maximum volume with incredible comfort and durability. Featherlight and engineered for natural movement.",
  "ClipOn Extensions": "Instantly add length and volume with our easy-to-use, damage-free clip-on extensions. Designed for quick self-installation and all-day comfort.",
  "Premium DIY Hair Bun": "Instantly add volume and elegance with our premium DIY Hair Bun. Made with high-quality synthetic fibers that seamlessly blend with Indian hair textures.",
  "Caramel Brown Highlights": "Get that salon-finish highlighted look in seconds without damaging your natural hair. Easy to clip in and style.",
  "Sleek Flatclip Ponytail": "Achieve a long, sleek, and voluminous ponytail effortlessly. Our secure flatclip design ensures all-day comfort.",
  "Elegant Clutch Bun": "The perfect quick-fix for bad hair days. Just clutch it over your natural bun for an instantly polished look.",
  "Volume Boost Cover Patch": "Conceal thinning areas and add instant volume at the crown with our lightweight, breathable single clip cover patch."
};

let memoryDescriptions: Record<string, string> = { ...defaultDescriptions };

export async function GET() {
  try {
    if (fs.existsSync(descriptionsFilePath)) {
      const fileContent = fs.readFileSync(descriptionsFilePath, 'utf8');
      const parsed = JSON.parse(fileContent);
      memoryDescriptions = { ...defaultDescriptions, ...parsed };
    }
    return NextResponse.json(memoryDescriptions);
  } catch (error) {
    console.error('Error reading descriptions:', error);
    return NextResponse.json(memoryDescriptions);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (typeof data !== 'object' || data === null) {
      return NextResponse.json({ error: 'Invalid descriptions payload' }, { status: 400 });
    }
    memoryDescriptions = { ...memoryDescriptions, ...data };
    try {
      fs.writeFileSync(descriptionsFilePath, JSON.stringify(memoryDescriptions, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Filesystem write warning in serverless environment:', fsErr);
    }
    return NextResponse.json({ success: true, descriptions: memoryDescriptions });
  } catch (error) {
    console.error('Error saving descriptions:', error);
    return NextResponse.json({ error: 'Failed to save descriptions' }, { status: 500 });
  }
}
