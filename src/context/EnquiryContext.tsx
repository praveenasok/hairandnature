"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCurrency } from './CurrencyContext';
import { getProductThumbnail } from '../data/productImages';

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

  // Load items and customer profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Normalize any legacy stored model photos into physical product photos
          const sanitized = parsed.map((item: EnquiryItem) => ({
            ...item,
            image: getProductThumbnail(item.title, item.image, item.productId)
          }));
          setItems(sanitized);
          if (JSON.stringify(sanitized) !== stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          }
        }
      }
      const storedProfile = localStorage.getItem('hairandnature_customer_profile');
      if (storedProfile) {
        setCustomerDetails(JSON.parse(storedProfile));
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

  const updateCustomerDetails: React.Dispatch<React.SetStateAction<CustomerDetails>> = (detailsOrFn) => {
    setCustomerDetails(prev => {
      const next = typeof detailsOrFn === 'function' ? detailsOrFn(prev) : detailsOrFn;
      try {
        localStorage.setItem('hairandnature_customer_profile', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save customer profile:', e);
      }
      return next;
    });
  };

  const addItem = (itemData: Omit<EnquiryItem, 'id' | 'addedAt'>) => {
    const safeProductImage = getProductThumbnail(itemData.title, itemData.image, itemData.productId);
    const normalizedItemData = {
      ...itemData,
      image: safeProductImage
    };

    // Check if duplicate config exists
    const existingIndex = items.findIndex(
      it =>
        it.title === normalizedItemData.title &&
        it.length === normalizedItemData.length &&
        it.weight === normalizedItemData.weight &&
        it.style === normalizedItemData.style &&
        it.color === normalizedItemData.color
    );

    let updatedList: EnquiryItem[];
    let targetItem: EnquiryItem;

    if (existingIndex > -1) {
      targetItem = {
        ...items[existingIndex],
        image: safeProductImage,
        quantity: items[existingIndex].quantity + normalizedItemData.quantity
      };
      updatedList = [...items];
      updatedList[existingIndex] = targetItem;
    } else {
      targetItem = {
        ...normalizedItemData,
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

    let msg = `✨ *hair&nature® Factory Wholesale Enquiry Manifest* ✨\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📅 *Date:* ${dateStr}\n`;
    msg += `🏭 *Dispatch Origin:* Direct Factory Export Hub (New Delhi, India)\n`;
    
    if (cust.name || cust.salonName || cust.country) {
      msg += `\n👤 *Salon / Master Stylist Profile:*\n`;
      if (cust.name) msg += `• Contact Person: ${cust.name}\n`;
      if (cust.salonName) msg += `• Salon / Studio: ${cust.salonName}\n`;
      if (cust.city || cust.country) msg += `• Location: ${[cust.city, cust.country].filter(Boolean).join(', ')}\n`;
      if (cust.notes) msg += `• Special Notes: ${cust.notes}\n`;
    }

    msg += `\n📦 *Order Manifest (${items.length} Product Types • ${totalCount} Total Units):*\n`;
    msg += `────────────────────────────\n`;

    let totalEst = 0;
    items.forEach((item, index) => {
      const singlePriceStr = item.basePriceUsd !== undefined ? formatPrice(item.basePriceUsd, item.unit) : 'Direct Factory Rate';
      let subtotalStr = '';
      if (item.basePriceUsd !== undefined) {
        const itemConverted = convertPrice(item.basePriceUsd);
        const subtotalConverted = itemConverted * item.quantity;
        totalEst += subtotalConverted;
        subtotalStr = ` (Subtotal: ${formatPrice(item.basePriceUsd * item.quantity)})`;
      }

      msg += `\n*${index + 1}. ${item.title}* [${item.quantity} ${item.unit || 'pack'}${item.quantity > 1 ? 's' : ''}]\n`;
      msg += `   • Length: ${item.length}\n`;
      msg += `   • Weight: ${item.weight}\n`;
      msg += `   • Texture: ${item.style}\n`;
      msg += `   • Shade: ${item.color}\n`;
      msg += `   • Rate: ${singlePriceStr}${subtotalStr}\n`;
    });

    msg += `\n────────────────────────────\n`;
    if (totalEst > 0) {
      msg += `💰 *Estimated Portfolio Total:* ${formatPrice(items.reduce((acc, it) => acc + (it.basePriceUsd || 0) * it.quantity, 0))} (${currency})\n`;
    }
    msg += `💎 *Quality Standard:* 100% Pure Virgin Temple Remy Hair (Cuticle Aligned)\n`;
    msg += `✈️ *Shipping:* Express International via DHL / FedEx Priority\n\n`;
    msg += `Please verify current factory inventory, tiered wholesale discounts, and express dispatch lead time. Thank you!`;

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
        setCustomerDetails: updateCustomerDetails,
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
