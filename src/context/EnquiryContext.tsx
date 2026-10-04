"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCurrency } from './CurrencyContext';

export interface EnquiryItem {
  id: string;
  productId: string; // e.g. "tape-extensions"
  title: string;     // e.g. "Tape Extensions"
  image: string;
  length: string;    // e.g. "20 Inch"
  weight: string;    // e.g. "100 Grams"
  style: string;     // e.g. "Natural Straight"
  color: string;     // e.g. "Frost & Polar Ash (#60/18)"
  unit: string;      // e.g. "pack"
  quantity: number;
  basePriceUsd?: number;
  addedAt: string;
}

export interface CustomerDetails {
  name?: string;
  salonName?: string;
  country?: string;
  city?: string;
  notes?: string;
}

interface EnquiryContextType {
  items: EnquiryItem[];
  addItem: (item: Omit<EnquiryItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearAll: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalCount: number;
  lastAddedItem: EnquiryItem | null;
  customerDetails: CustomerDetails;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerDetails>>;
  sendCombinedEnquiry: (details?: CustomerDetails) => void;
  generateCombinedMessage: (details?: CustomerDetails) => string;
}

const STORAGE_KEY = 'hairandnature_global_enquiries_v1';

const EnquiryContext = createContext<EnquiryContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearAll: () => {},
  isOpen: false,
  setIsOpen: () => {},
  totalCount: 0,
  lastAddedItem: null,
  customerDetails: {},
  setCustomerDetails: () => {},
  sendCombinedEnquiry: () => {},
  generateCombinedMessage: () => '',
});

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<EnquiryItem | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({});
  const { currency, formatPrice, convertPrice } = useCurrency();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load enquiries from localStorage:', e);
    }
  }, []);

  // Save to localStorage whenever items change
  const saveItems = (newItems: EnquiryItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save enquiries to localStorage:', e);
    }
  };

  const addItem = (itemData: Omit<EnquiryItem, 'id' | 'addedAt'>) => {
    // Check if duplicate config exists
    const existingIndex = items.findIndex(
      it =>
        it.title === itemData.title &&
        it.length === itemData.length &&
        it.weight === itemData.weight &&
        it.style === itemData.style &&
        it.color === itemData.color
    );

    let updatedList: EnquiryItem[];
    let targetItem: EnquiryItem;

    if (existingIndex > -1) {
      targetItem = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + itemData.quantity
      };
      updatedList = [...items];
      updatedList[existingIndex] = targetItem;
    } else {
      targetItem = {
        ...itemData,
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        addedAt: new Date().toISOString()
      };
      updatedList = [targetItem, ...items];
    }

    saveItems(updatedList);
    setLastAddedItem(targetItem);
  };

  const removeItem = (id: string) => {
    const filtered = items.filter(it => it.id !== id);
    saveItems(filtered);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    const updated = items.map(it => it.id === id ? { ...it, quantity: qty } : it);
    saveItems(updated);
  };

  const clearAll = () => {
    saveItems([]);
  };

  const totalCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const generateCombinedMessage = (details?: CustomerDetails) => {
    const cust = { ...customerDetails, ...details };
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    let msg = `🌟 *hair&nature® Global Wholesale Enquiry* 🌟\n`;
    msg += `📅 *Date:* ${dateStr}\n`;
    
    if (cust.name || cust.salonName || cust.country) {
      msg += `\n👤 *Client / Salon Profile:*\n`;
      if (cust.name) msg += `• Contact Person: ${cust.name}\n`;
      if (cust.salonName) msg += `• Salon / Studio: ${cust.salonName}\n`;
      if (cust.city || cust.country) msg += `• Location: ${[cust.city, cust.country].filter(Boolean).join(', ')}\n`;
      if (cust.notes) msg += `• Notes: ${cust.notes}\n`;
    }

    msg += `\n📦 *Enquired Products (${items.length} types, ${totalCount} total units):*\n`;
    msg += `────────────────────────────\n`;

    let totalEst = 0;
    items.forEach((item, index) => {
      const singlePriceStr = item.basePriceUsd !== undefined ? formatPrice(item.basePriceUsd, item.unit) : 'Factory Direct Tier';
      let subtotalStr = '';
      if (item.basePriceUsd !== undefined) {
        const itemConverted = convertPrice(item.basePriceUsd);
        const subtotalConverted = itemConverted * item.quantity;
        totalEst += subtotalConverted;
        subtotalStr = ` ≈ ${formatPrice(item.basePriceUsd * item.quantity)}`;
      }

      msg += `\n*${index + 1}. ${item.title}* (${item.quantity} ${item.unit || 'unit'}${item.quantity > 1 ? 's' : ''})\n`;
      msg += `   • Length: ${item.length}\n`;
      msg += `   • Weight: ${item.weight}\n`;
      msg += `   • Style: ${item.style}\n`;
      msg += `   • Color: ${item.color}\n`;
      msg += `   • Est. Rate: ${singlePriceStr}${subtotalStr ? ` (Subtotal:${subtotalStr})` : ''}\n`;
    });

    msg += `\n────────────────────────────\n`;
    if (totalEst > 0) {
      msg += `💰 *Estimated Total Value:* ${formatPrice(items.reduce((acc, it) => acc + (it.basePriceUsd || 0) * it.quantity, 0))} (${currency})\n`;
    }
    msg += `✈️ *Dispatch:* Express Worldwide from New Delhi Factory\n\n`;
    msg += `Please confirm stock availability, wholesale tiered discounts, and dispatch timeframe. Thank you!`;

    return msg;
  };

  const sendCombinedEnquiry = async (details?: CustomerDetails) => {
    if (items.length === 0) return;

    const message = generateCombinedMessage(details);
    const cust = { ...customerDetails, ...details };

    // Asynchronously log the enquiry to backend /api/enquiries for tracking in admin
    try {
      fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: cust.name || 'Anonymous Stylist',
          salonName: cust.salonName || 'Salon Partner',
          location: [cust.city, cust.country].filter(Boolean).join(', ') || 'Global Client',
          items: items.map(it => ({
            title: it.title,
            length: it.length,
            weight: it.weight,
            style: it.style,
            color: it.color,
            quantity: it.quantity,
            unit: it.unit
          })),
          totalItems: totalCount,
          currency: currency,
          estimatedTotal: items.reduce((acc, it) => acc + (it.basePriceUsd || 0) * it.quantity, 0),
          notes: cust.notes || ''
        })
      }).catch(err => console.error('Could not log enquiry:', err));
    } catch (e) {
      // Non-blocking
    }

    // Open WhatsApp with the 1 combined message
    const whatsappUrl = `https://wa.me/919871171978?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <EnquiryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearAll,
        isOpen,
        setIsOpen,
        totalCount,
        lastAddedItem,
        customerDetails,
        setCustomerDetails,
        sendCombinedEnquiry,
        generateCombinedMessage,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}
