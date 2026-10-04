import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Seed in-memory cache for serverless environments
let memoryEnquiries: any[] | null = null;

function getEnquiriesFilePath() {
  return path.join(process.cwd(), 'src', 'data', 'enquiries.json');
}

function loadEnquiries(): any[] {
  if (memoryEnquiries) return memoryEnquiries;
  const filePath = getEnquiriesFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryEnquiries = parsed;
        return memoryEnquiries;
      }
    }
  } catch (err) {
    console.error('Error reading enquiries file:', err);
  }
  memoryEnquiries = [];
  return memoryEnquiries;
}

function saveEnquiries(list: any[]) {
  memoryEnquiries = list;
  const filePath = getEnquiriesFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write failed (expected on serverless read-only), saved to memory:', err);
  }
}

export async function GET() {
  const enquiries = loadEnquiries();
  return NextResponse.json(enquiries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = loadEnquiries();

    // If body is an array, we are replacing/updating the entire list (from admin)
    if (Array.isArray(body)) {
      saveEnquiries(body);
      return NextResponse.json({ success: true, count: body.length });
    }

    // Otherwise, append the new enquiry item
    const newEnquiry = {
      id: `enq_${Date.now()}`,
      date: new Date().toISOString(),
      clientName: body.clientName || 'Anonymous Stylist',
      salonName: body.salonName || 'Salon Partner',
      location: body.location || 'Global Inquiry',
      items: body.items || [],
      totalItems: body.totalItems || (body.items ? body.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0) : 1),
      currency: body.currency || 'CAD',
      estimatedTotal: body.estimatedTotal || 0,
      status: 'New Inquiry',
      notes: body.notes || ''
    };

    const updated = [newEnquiry, ...current];
    saveEnquiries(updated);

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  } catch (err) {
    console.error('Error saving enquiry:', err);
    return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 });
  }
}
