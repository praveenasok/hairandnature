"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'CAD' | 'USD' | 'AUD' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', flag: '🇦🇪' },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  symbols: Record<CurrencyCode, string>;
  ratesLoading: boolean;
  convertPrice: (usdAmount: number) => number;
  formatPrice: (usdAmount: number, unit?: string) => string;
}

const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  CAD: 1.4246,
  AUD: 1.4432,
  AED: 3.6725,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  CAD: 'CA$',
  USD: '$',
  AUD: 'AU$',
  AED: 'AED ',
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'CAD',
  setCurrency: () => {},
  rates: DEFAULT_RATES,
  symbols: SYMBOLS,
  ratesLoading: false,
  convertPrice: (p) => Math.round(p * 1.4246),
  formatPrice: (p, u) => u ? `CA$${Math.round(p * 1.4246)}/${u}` : `CA$${Math.round(p * 1.4246)}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // CAD is the default currency as required
  const [currency, setCurrencyState] = useState<CurrencyCode>('CAD');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(DEFAULT_RATES);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    // Check saved preference in localStorage
    const saved = localStorage.getItem('hn_currency') as CurrencyCode | null;
    if (saved && (saved in SUPPORTED_CURRENCIES)) {
      setCurrencyState(saved);
    } else {
      setCurrencyState('CAD');
    }

    // Fetch live rates from Google Finance API endpoint
    fetch('/api/exchange-rates')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates({
            USD: Number(data.rates.USD) || 1.0,
            CAD: Number(data.rates.CAD) || 1.4246,
            AUD: Number(data.rates.AUD) || 1.4432,
            AED: Number(data.rates.AED) || 3.6725,
          });
        }
      })
      .catch(err => {
        console.warn('Using default exchange rates:', err);
      })
      .finally(() => {
        setRatesLoading(false);
      });
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('hn_currency', newCurrency);
    } catch (e) {
      // Ignore in private browsing
    }
  };

  // Convert USD price to current currency and round off to the nearest whole number
  const convertPrice = (usdAmount: number): number => {
    const rate = rates[currency] || 1.0;
    return Math.round(usdAmount * rate);
  };

  // Format price with symbol and optional unit (e.g., "$77/unit" or "CA$105/pack")
  const formatPrice = (usdAmount: number, unit?: string): string => {
    const symbol = SYMBOLS[currency] || '$';
    const rounded = convertPrice(usdAmount);
    if (unit) {
      return `${symbol}${rounded}/${unit}`;
    }
    return `${symbol}${rounded}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        symbols: SYMBOLS,
        ratesLoading,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
