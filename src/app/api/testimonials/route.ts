import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  salon: string;
  location: string;
  rating: number;
  product: string;
  image: string;
  content: string;
  date: string;
  verified: boolean;
}

const testimonialsFilePath = path.join(process.cwd(), 'src/data/testimonials.json');

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Master Stylist & Salon Director",
    salon: "Mane Allure Studio",
    location: "Mayfair, London, UK",
    rating: 5,
    product: "Tape Extensions (Frost & Polar Ash)",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    content: "The quality of hair&nature tape extensions has completely elevated our salon offering. The cuticle alignment is genuine single-donor, zero tangling after 8 months of client wear, and the shades bleach and tone like a dream.",
    date: "September 2026",
    verified: true
  },
  {
    id: "2",
    name: "Chloé Dubois",
    role: "Celebrity Hair Extensionist",
    salon: "Atelier Chloé",
    location: "Paris, France",
    rating: 5,
    product: "Genius Wefts (Natural Wave)",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    content: "Zero return hair (mustache-free) Genius Wefts from hair&nature are the thinnest and most durable on the global market. My clients experience absolutely zero scalp irritation, and the blend is completely invisible.",
    date: "August 2026",
    verified: true
  },
  {
    id: "3",
    name: "Marcus Vance",
    role: "Creative Director",
    salon: "Vance Hair Lounge",
    location: "SoHo, New York, USA",
    rating: 5,
    product: "K-Tips (Italian Keratin Matrix)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    content: "Direct factory export pricing combined with luxury temple remy hair is unheard of. Their K-Tips fuse cleanly at 180°C and maintain their fullness right down to the ends without tapering or shedding.",
    date: "August 2026",
    verified: true
  },
  {
    id: "4",
    name: "Jessica Taylor",
    role: "Extension Specialist & Educator",
    salon: "Crown & Glory Extensions",
    location: "Sydney, Australia",
    rating: 5,
    product: "Butterfly Wefts (Body Wave)",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    content: "The density of the hair from root to tip is phenomenal. Even our most demanding bridal clients are in awe of the softness and natural wave luster. Fast international dispatch directly from Delhi.",
    date: "July 2026",
    verified: true
  }
];

let memoryTestimonials: Testimonial[] = [...defaultTestimonials];

export async function GET() {
  try {
    if (fs.existsSync(testimonialsFilePath)) {
      const fileContent = fs.readFileSync(testimonialsFilePath, 'utf8');
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryTestimonials = parsed;
      }
    }
    return NextResponse.json(memoryTestimonials);
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return NextResponse.json(memoryTestimonials);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Payload must be an array of testimonials' }, { status: 400 });
    }
    memoryTestimonials = data;
    try {
      fs.writeFileSync(testimonialsFilePath, JSON.stringify(memoryTestimonials, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Filesystem write warning in serverless environment:', fsErr);
    }
    return NextResponse.json({ success: true, testimonials: memoryTestimonials });
  } catch (error) {
    console.error('Error saving testimonials:', error);
    return NextResponse.json({ error: 'Failed to save testimonials' }, { status: 500 });
  }
}
