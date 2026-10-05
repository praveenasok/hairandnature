import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RateCache {
  rates: {
    USD: number;
    CAD: number;
    AUD: number;
    AED: number;
  };
  timestamp: number;
  source: string;
}

let cachedRates: RateCache | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

async function fetchRates(): Promise<{ CAD: number; AUD: number; AED: number } | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return {
          CAD: data.rates.CAD || 1.42,
          AUD: data.rates.AUD || 1.44,
          AED: data.rates.AED || 3.6725,
        };
      }
    }
  } catch (err) {
    console.warn('[exchange-rates] ER API failed:', err);
  }
  return null;
}

export async function GET() {
  const now = Date.now();

  if (cachedRates && (now - cachedRates.timestamp < CACHE_TTL_MS)) {
    return NextResponse.json(cachedRates);
  }

  const liveRates = await fetchRates();

  let cad = 1.42;
  let aud = 1.44;
  let aed = 3.6725;
  let source = 'fallback-hardcoded';

  if (liveRates) {
    cad = liveRates.CAD;
    aud = liveRates.AUD;
    aed = liveRates.AED;
    source = 'open-er-api';
  }

  const result: RateCache = {
    rates: {
      USD: 1.0,
      CAD: cad,
      AUD: aud,
      AED: aed,
    },
    timestamp: now,
    source,
  };

  cachedRates = result;
  return NextResponse.json(result);
}
