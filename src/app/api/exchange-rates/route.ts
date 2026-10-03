import { NextResponse } from 'next/server';

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

async function fetchGoogleRate(pair: string): Promise<number | null> {
  try {
    const res = await fetch(`https://www.google.com/finance/quote/${pair}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Extracts the real-time quote span next to the pair title on Google Finance
    const match = html.match(/class=\"gO24Ff\">[^<]*<\/div><\/div>[\s\S]*?<span jsname=\"Pdsbrc\"[^>]*><span>([0-9.]+)<\/span>/);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (!isNaN(val) && val > 0) return val;
    }
  } catch (err) {
    console.warn(`[exchange-rates] Google Finance fetch failed for ${pair}:`, err);
  }
  return null;
}

async function fetchFallbackRates(): Promise<{ CAD: number; AUD: number; AED: number } | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(4000),
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
    console.warn('[exchange-rates] Fallback API failed:', err);
  }
  return null;
}

export async function GET() {
  const now = Date.now();

  if (cachedRates && (now - cachedRates.timestamp < CACHE_TTL_MS)) {
    return NextResponse.json(cachedRates);
  }

  // Fetch live rates from Google Finance
  const [googleCad, googleAud, googleAed] = await Promise.all([
    fetchGoogleRate('USD-CAD'),
    fetchGoogleRate('USD-AUD'),
    fetchGoogleRate('USD-AED'),
  ]);

  let cad = googleCad;
  let aud = googleAud;
  let aed = googleAed;
  let source = 'google-finance';

  // If any rate failed to parse from Google, try secondary provider
  if (!cad || !aud || !aed) {
    const secondary = await fetchFallbackRates();
    if (secondary) {
      cad = cad || secondary.CAD;
      aud = aud || secondary.AUD;
      aed = aed || secondary.AED;
      source = 'google-finance+open-er-api';
    }
  }

  // Ultimate resilient hardcoded fallbacks
  cad = cad || 1.42;
  aud = aud || 1.44;
  aed = aed || 3.6725;

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

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
