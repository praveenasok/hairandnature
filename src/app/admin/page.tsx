"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { SPECTRUM_COLORS, COLOR_CATEGORIES, HairColor, getSpectrumColors } from "@/data/colors";
import { HAIR_STYLES, STYLE_NAMES } from "@/data/styles";
import { Testimonial } from "@/app/api/testimonials/route";
import { fuzzySearch } from "@/lib/fuzzySearch";


const LENGTHS = ['16 Inches', '18 Inches', '20 Inches', '22 Inches', '24 Inches', '26 Inches', '28 Inches', '30 Inches'];
const WEIGHTS = ['50 Grams', '100 Grams', '150 Grams', '200 Grams'];
const STYLES = STYLE_NAMES;
const CATEGORIES = COLOR_CATEGORIES.filter(c => c !== 'All');

type SortKey = 'product' | 'length' | 'weight' | 'style' | 'category' | 'price' | 'unit';
type SortDirection = 'asc' | 'desc';

export default function AdminPage() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [units, setUnits] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  
  const [products, setProducts] = useState<string[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  const [product, setProduct] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("pack");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  
  const [selectedLengths, setSelectedLengths] = useState<string[]>([LENGTHS[0]]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([WEIGHTS[1]]); // default 100g
  const [selectedStyles, setSelectedStyles] = useState<string[]>([STYLES[0]]);
  const [selectedPricingColors, setSelectedPricingColors] = useState<string[]>([]);
  const [pricingColorFilter, setPricingColorFilter] = useState<string>("All");
  
  const [actionType, setActionType] = useState<"exact" | "percentage" | "delete">("exact");
  const [inputValue, setInputValue] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [savingPrices, setSavingPrices] = useState(false);
  const [savingUnit, setSavingUnit] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);
  
  // Feedback badges
  const [unitSavedMsg, setUnitSavedMsg] = useState("");
  const [descSavedMsg, setDescSavedMsg] = useState("");
  const [metadataSavedMsg, setMetadataSavedMsg] = useState("");

  const [modelImage, setModelImage] = useState<string>("");
  const [productImages, setProductImages] = useState<string>(""); // comma separated
  const [optLengths, setOptLengths] = useState<string[]>([]);
  const [optWeights, setOptWeights] = useState<string[]>([]);
  const [optStyles, setOptStyles] = useState<string[]>([]);
  const [optColors, setOptColors] = useState<string[]>([]);
  const [adminColorTab, setAdminColorTab] = useState<string>("All");
  const [adminColorSearch, setAdminColorSearch] = useState<string>("");
  const [savingMetadata, setSavingMetadata] = useState(false);

  // Color Manager state
  const [allColors, setAllColors] = useState<HairColor[]>(SPECTRUM_COLORS);
  const [customColorNames, setCustomColorNames] = useState<Record<string, string>>({});
  const [editingColorNames, setEditingColorNames] = useState<Record<string, string>>({});
  const [savingColors, setSavingColors] = useState(false);
  const [colorSavedMsg, setColorSavedMsg] = useState("");
  const [colorManagerSearch, setColorManagerSearch] = useState("");
  const [colorManagerTab, setColorManagerTab] = useState("All");

  // Navigation tab state
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'colors' | 'testimonials' | 'enquiries'>('products');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [savingTestimonials, setSavingTestimonials] = useState(false);
  const [testimonialSuccessMsg, setTestimonialSuccessMsg] = useState("");
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  const initialTestimonialForm: Testimonial = {
    id: "",
    name: "",
    role: "Master Stylist & Salon Director",
    salon: "",
    location: "London, UK",
    rating: 5,
    product: "Tape Extensions",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    content: "",
    date: "October 2026",
    verified: true
  };
  const [testimonialForm, setTestimonialForm] = useState<Testimonial>(initialTestimonialForm);

  // For the select-and-delete feature in the table
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Search and Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: SortDirection } | null>(null);

  // Download price list state
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState("");
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showDownloadMenu]);

  useEffect(() => {
    Promise.all([
      fetch('/api/prices').then(res => res.json()).catch(() => ({})),
      fetch('/api/units').then(res => res.json()).catch(() => ({})),
      fetch('/api/descriptions').then(res => res.json()).catch(() => ({})),
      fetch('/api/testimonials').then(res => res.json()).catch(() => ([])),
      fetch('/api/enquiries').then(res => res.json()).catch(() => ([])),
      fetch('/api/product-metadata').then(res => res.json()).catch(() => ({})),
      fetch('/api/products').then(res => res.json()).catch(() => ([])),
      fetch('/api/colors').then(res => res.json()).catch(() => ({ colors: SPECTRUM_COLORS, customNames: {} }))
    ]).then(([priceData, unitData, descData, testimonialsData, enquiriesData, metadataData, productsData, colorsData]) => {
      const loadedProducts = Array.isArray(productsData) && productsData.length > 0 ? productsData : [];
      setProducts(loadedProducts);
      const defaultProduct = loadedProducts[0] || "";
      setProduct(defaultProduct);

      setPrices(priceData || {});
      const loadedUnits = unitData || {};
      setUnits(loadedUnits);
      if (defaultProduct) setSelectedUnit(loadedUnits[defaultProduct] || "pack");
      
      const loadedDescs = descData || {};
      setDescriptions(loadedDescs);
      if (defaultProduct) setSelectedDescription(loadedDescs[defaultProduct] || "");

      setMetadata(metadataData || {});
      const pMeta = metadataData?.[defaultProduct] || {};
      setModelImage(pMeta.modelImage || "");
      setProductImages((pMeta.productImages || []).join(", "));
      const initLengths = pMeta.availableLengths || [];
      const initWeights = pMeta.availableWeights || [];
      const initStyles = pMeta.availableStyles || [];
      const initColors = pMeta.availableColors || [];
      setOptLengths(initLengths);
      setOptWeights(initWeights);
      setOptStyles(initStyles);
      setOptColors(initColors);

      if (initLengths.length > 0) setSelectedLengths([initLengths[0]]);
      if (initWeights.length > 0) setSelectedWeights([initWeights[0]]);
      if (initStyles.length > 0) setSelectedStyles([initStyles[0]]);
      if (initColors.length > 0) setSelectedPricingColors(initColors);

      if (colorsData && Array.isArray(colorsData.colors) && colorsData.colors.length > 0) {
        setAllColors(colorsData.colors);
        if (colorsData.customNames) {
          setCustomColorNames(colorsData.customNames);
          setEditingColorNames(colorsData.customNames);
        }
      }

      if (Array.isArray(testimonialsData) && testimonialsData.length > 0) {
        setTestimonials(testimonialsData);
      }

      if (Array.isArray(enquiriesData)) {
        setEnquiries(enquiriesData);
      }
      
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSaveTestimonialsList = async (newList: Testimonial[]) => {
    setSavingTestimonials(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
      if (res.ok) {
        setTestimonials(newList);
        setTestimonialSuccessMsg("✓ Testimonials saved and updated live!");
        setTimeout(() => setTestimonialSuccessMsg(""), 3500);
      } else {
        alert("Failed to save testimonials.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving testimonials.");
    } finally {
      setSavingTestimonials(false);
    }
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name.trim() || !testimonialForm.content.trim()) {
      alert("Please provide at least a Name and Testimonial quote.");
      return;
    }

    let newList: Testimonial[];
    if (editingTestimonialId) {
      newList = testimonials.map(t => t.id === editingTestimonialId ? { ...testimonialForm } : t);
    } else {
      const newItem: Testimonial = {
        ...testimonialForm,
        id: Date.now().toString(),
        date: testimonialForm.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      newList = [newItem, ...testimonials];
    }

    handleSaveTestimonialsList(newList);
    setTestimonialForm(initialTestimonialForm);
    setEditingTestimonialId(null);
  };

  const handleStartEditTestimonial = (item: Testimonial) => {
    setTestimonialForm({ ...item });
    setEditingTestimonialId(item.id);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleCancelEditTestimonial = () => {
    setTestimonialForm(initialTestimonialForm);
    setEditingTestimonialId(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const filtered = testimonials.filter(t => t.id !== id);
    handleSaveTestimonialsList(filtered);
    if (editingTestimonialId === id) {
      handleCancelEditTestimonial();
    }
  };

  const handleProductChange = (newProduct: string) => {
    setProduct(newProduct);
    setSelectedUnit(units[newProduct] || "pack");
    setSelectedDescription(descriptions[newProduct] || "");
    const pMeta = metadata[newProduct] || {};
    setModelImage(pMeta.modelImage || "");
    setProductImages((pMeta.productImages || []).join(", "));
    const pOptLengths = pMeta.availableLengths || [];
    setOptLengths(pOptLengths);
    const validLengths = pOptLengths.length > 0 ? pOptLengths : LENGTHS;
    setSelectedLengths([validLengths[0]]);

    const pOptWeights = pMeta.availableWeights || [];
    setOptWeights(pOptWeights);
    const validWeights = pOptWeights.length > 0 ? pOptWeights : WEIGHTS;
    setSelectedWeights([validWeights[0]]);

    const pOptStyles = pMeta.availableStyles || [];
    setOptStyles(pOptStyles);
    const validStyles = pOptStyles.length > 0 ? pOptStyles : STYLES;
    setSelectedStyles([validStyles[0]]);

    const pOptColors = pMeta.availableColors || [];
    setOptColors(pOptColors);
    if (pOptColors.length > 0) {
      setSelectedPricingColors(pOptColors);
    } else {
      setSelectedPricingColors(allColors.map(c => c.name));
    }
    setUnitSavedMsg("");
    setDescSavedMsg("");
    setMetadataSavedMsg("");
  };

  const handleSaveMetadata = async () => {
    setSavingMetadata(true);
    const updatedMeta = { ...metadata };
    updatedMeta[product] = {
      modelImage,
      productImages: productImages.split(',').map(s => s.trim()).filter(Boolean),
      availableLengths: optLengths,
      availableWeights: optWeights,
      availableStyles: optStyles,
      availableColors: optColors
    };

    try {
      const res = await fetch('/api/product-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMeta)
      });
      if (res.ok) {
        setMetadata(updatedMeta);
        setMetadataSavedMsg("Options & Images saved successfully!");
        setTimeout(() => setMetadataSavedMsg(""), 3500);
      } else {
        alert("Failed to save product options.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving product options.");
    } finally {
      setSavingMetadata(false);
    }
  };

  const handleAddProduct = async () => {
    const trimmed = newProductName.trim();
    if (!trimmed) return;
    if (products.includes(trimmed)) return alert("Product already exists!");
    
    setAddingProduct(true);
    const updatedProducts = [...products, trimmed];
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProducts)
      });
      if (res.ok) {
        setProducts(updatedProducts);
        setNewProductName("");
        handleProductChange(trimmed);
      } else {
        alert("Failed to save product.");
      }
    } catch (e) {
      console.error(e);
      alert("Error adding product.");
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (products.length <= 1) {
      alert("You must have at least one product.");
      return;
    }
    if (!confirm(`Are you sure you want to delete "${product}"? This will also remove its prices, description, and metadata.`)) return;

    const updatedProducts = products.filter(p => p !== product);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProducts)
      });
      if (res.ok) {
        setProducts(updatedProducts);
        handleProductChange(updatedProducts[0]);
        alert(`Successfully deleted "${product}"!`);
      } else {
        alert("Failed to delete product.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting product.");
    }
  };

  const handleSaveUnit = async (prodName: string, unitVal: string) => {
    const cleaned = unitVal.trim() || 'unit';
    const updatedUnits = { ...units, [prodName]: cleaned };
    setSavingUnit(true);
    try {
      const res = await fetch('/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUnits)
      });
      if (res.ok) {
        setUnits(updatedUnits);
        setUnitSavedMsg(`Saved: "${cleaned}"`);
        setTimeout(() => setUnitSavedMsg(""), 3500);
      } else {
        alert("Failed to save unit.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving unit.");
    } finally {
      setSavingUnit(false);
    }
  };

  const handleSaveDescription = async (prodName: string, descVal: string) => {
    const cleaned = descVal.trim();
    const updatedDescs = { ...descriptions, [prodName]: cleaned };
    setSavingDesc(true);
    try {
      const res = await fetch('/api/descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDescs)
      });
      if (res.ok) {
        setDescriptions(updatedDescs);
        setDescSavedMsg("Description updated successfully!");
        setTimeout(() => setDescSavedMsg(""), 3500);
      } else {
        alert("Failed to save description.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving description.");
    } finally {
      setSavingDesc(false);
    }
  };

  const toggleSelection = (item: string, currentList: string[], setList: (v: string[]) => void) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const toggleRowSelection = (key: string) => {
    if (selectedRows.includes(key)) {
      setSelectedRows(selectedRows.filter(k => k !== key));
    } else {
      setSelectedRows([...selectedRows, key]);
    }
  };

  const handleSave = async () => {
    if (actionType !== "delete" && (!inputValue || isNaN(Number(inputValue)))) {
      alert("Please enter a valid number.");
      return;
    }
    if (selectedLengths.length === 0 || selectedWeights.length === 0 || selectedStyles.length === 0 || selectedPricingColors.length === 0) {
      alert("Please select at least one length, one weight, one style, and one color.");
      return;
    }
    
    if (actionType === "delete") {
      if (!confirm("Are you sure you want to delete the prices for all selected combinations?")) return;
    }
    
    setSavingPrices(true);
    const updatedPrices = { ...prices };
    const numValue = Number(inputValue);
    
    let updatedCount = 0;
    
    // Generate all selected combinations (Length x Weight x Style x Color)
    for (const len of selectedLengths) {
      for (const wt of selectedWeights) {
        for (const st of selectedStyles) {
          // Find base price for Product + Length + Weight + Style across colors
          let basePrice: number | undefined = undefined;
          for (const col of productColors) {
            const checkKeyWithWeight = `${product}|${len}|${st}|${col.name}|${wt}`;
            const checkKey100g = `${product}|${len}|${st}|${col.name}|100 Grams`;
            const checkKeyLegacy = `${product}|${len}|${st}|${col.name}`;
            if (updatedPrices[checkKeyWithWeight] !== undefined) {
              basePrice = updatedPrices[checkKeyWithWeight];
              break;
            } else if (updatedPrices[checkKey100g] !== undefined) {
              basePrice = updatedPrices[checkKey100g];
              break;
            } else if (updatedPrices[checkKeyLegacy] !== undefined) {
              basePrice = updatedPrices[checkKeyLegacy];
              break;
            }
          }
          if (basePrice === undefined) {
            const prefix = `${product}|${len}|${st}|`;
            for (const [k, p] of Object.entries(updatedPrices)) {
              if (k.startsWith(prefix)) {
                basePrice = p;
                break;
              }
            }
          }

          for (const colorName of selectedPricingColors) {
            const colKey = `${product}|${len}|${st}|${colorName}|${wt}`;
            const colObj = allColors.find(c => c.name === colorName);
            const catKey = colObj ? `${product}|${len}|${st}|${colObj.category}|${wt}` : null;
            
            if (actionType === "exact") {
              updatedPrices[colKey] = numValue;
              if (catKey && updatedPrices[catKey] === undefined) {
                updatedPrices[catKey] = numValue;
              }
              updatedCount++;
            } else if (actionType === "percentage") {
              if (basePrice !== undefined) {
                const increaseAmount = basePrice * (numValue / 100);
                const finalPrice = Math.round((basePrice + increaseAmount) * 100) / 100;
                updatedPrices[colKey] = finalPrice;
                if (catKey && updatedPrices[catKey] === undefined) {
                  updatedPrices[catKey] = finalPrice;
                }
                updatedCount++;
              }
            } else if (actionType === "delete") {
              if (updatedPrices[colKey] !== undefined) {
                delete updatedPrices[colKey];
                updatedCount++;
              }
              const legacyColKey = `${product}|${len}|${st}|${colorName}`;
              if (wt === '100 Grams' && updatedPrices[legacyColKey] !== undefined) {
                delete updatedPrices[legacyColKey];
              }
            }
          }
        }
      }
    }
    
    if (actionType === "percentage" && updatedCount === 0) {
      alert("No base price found. To apply a percentage, you must first define an exact price for at least one color for the selected length, weight, and style.");
      setSavingPrices(false);
      return;
    }

    if (actionType === "delete" && updatedCount === 0) {
      alert("No prices were found to delete for the selected combinations.");
      setSavingPrices(false);
      return;
    }
    
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPrices)
      });
      if (res.ok) {
        setPrices(updatedPrices);
        setSelectedRows(prev => prev.filter(k => updatedPrices[k] !== undefined));
        
        if (actionType === "delete") {
          alert(`Successfully deleted ${updatedCount} combinations.`);
        } else {
          alert(`Successfully updated price for ${updatedCount} combinations!`);
        }
      } else {
        alert('Failed to save prices.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving prices.');
    }
    setSavingPrices(false);
  };

  const handleDelete = async (keyToRemove: string) => {
    if (!confirm('Are you sure you want to delete this price?')) return;
    
    const updatedPrices = { ...prices };
    delete updatedPrices[keyToRemove];
    
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPrices)
      });
      if (res.ok) {
        setPrices(updatedPrices);
        setSelectedRows(prev => prev.filter(k => k !== keyToRemove));
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting price.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedRows.length} selected prices?`)) return;
    
    const updatedPrices = { ...prices };
    selectedRows.forEach(key => {
      delete updatedPrices[key];
    });
    
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPrices)
      });
      if (res.ok) {
        setPrices(updatedPrices);
        setSelectedRows([]);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting selected prices.');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('WARNING: Are you absolutely sure you want to delete ALL prices in the database? This cannot be undone.')) return;
    
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        setPrices({});
        setSelectedRows([]);
        alert('All prices have been cleared.');
      }
    } catch (err) {
      console.error(err);
      alert('Error clearing prices.');
    }
  };

  // Color Manager Actions
  const handleColorNameChange = (id: string, newName: string) => {
    setEditingColorNames(prev => ({
      ...prev,
      [id]: newName
    }));
  };

  const handleSaveSingleColor = async (id: string) => {
    const rawVal = editingColorNames[id];
    const defaultObj = SPECTRUM_COLORS.find(c => c.id === id);
    const finalName = rawVal !== undefined ? rawVal.trim() : (defaultObj?.name || id);

    setSavingColors(true);
    try {
      const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: finalName })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomColorNames(data.customNames || {});
        setAllColors(data.colors || []);
        const [refreshedPrices, refreshedMeta] = await Promise.all([
          fetch('/api/prices').then(r => r.json()).catch(() => null),
          fetch('/api/product-metadata').then(r => r.json()).catch(() => null)
        ]);
        if (refreshedPrices) setPrices(refreshedPrices);
        if (refreshedMeta) setMetadata(refreshedMeta);

        setColorSavedMsg(`Renamed shade to "${finalName}"! Prices and product options automatically synced.`);
        setTimeout(() => setColorSavedMsg(""), 4000);
      } else {
        alert("Failed to save color name.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving color name.");
    } finally {
      setSavingColors(false);
    }
  };

  const handleSaveAllColors = async () => {
    setSavingColors(true);
    try {
      const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customNames: editingColorNames })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomColorNames(data.customNames || {});
        setAllColors(data.colors || []);
        const [refreshedPrices, refreshedMeta] = await Promise.all([
          fetch('/api/prices').then(r => r.json()).catch(() => null),
          fetch('/api/product-metadata').then(r => r.json()).catch(() => null)
        ]);
        if (refreshedPrices) setPrices(refreshedPrices);
        if (refreshedMeta) setMetadata(refreshedMeta);

        setColorSavedMsg(`All custom shade names saved successfully! (${data.renamesCount || 0} renamed, ${data.priceMigratedCount || 0} price entries updated)`);
        setTimeout(() => setColorSavedMsg(""), 5000);
      } else {
        alert("Failed to save color names.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving color names.");
    } finally {
      setSavingColors(false);
    }
  };

  const handleResetSingleColor = async (id: string) => {
    const defaultObj = SPECTRUM_COLORS.find(c => c.id === id);
    if (!defaultObj) return;
    const newNames = { ...editingColorNames };
    delete newNames[id];
    setEditingColorNames(newNames);

    setSavingColors(true);
    try {
      const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: defaultObj.name })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomColorNames(data.customNames || {});
        setAllColors(data.colors || []);
        const [refreshedPrices, refreshedMeta] = await Promise.all([
          fetch('/api/prices').then(r => r.json()).catch(() => null),
          fetch('/api/product-metadata').then(r => r.json()).catch(() => null)
        ]);
        if (refreshedPrices) setPrices(refreshedPrices);
        if (refreshedMeta) setMetadata(refreshedMeta);

        setColorSavedMsg(`Reset "${defaultObj.name}" to factory default!`);
        setTimeout(() => setColorSavedMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingColors(false);
    }
  };

  const handleResetAllColors = async () => {
    if (!confirm("Are you sure you want to reset ALL 39 hair shade names back to factory defaults?")) return;
    setSavingColors(true);
    try {
      const res = await fetch('/api/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetAll: true })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomColorNames({});
        setEditingColorNames({});
        setAllColors(SPECTRUM_COLORS);
        const [refreshedPrices, refreshedMeta] = await Promise.all([
          fetch('/api/prices').then(r => r.json()).catch(() => null),
          fetch('/api/product-metadata').then(r => r.json()).catch(() => null)
        ]);
        if (refreshedPrices) setPrices(refreshedPrices);
        if (refreshedMeta) setMetadata(refreshedMeta);

        setColorSavedMsg("All 39 shades reset to factory defaults!");
        setTimeout(() => setColorSavedMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingColors(false);
    }
  };

  const productLengths = useMemo(() => {
    if (optLengths && optLengths.length > 0) {
      const standard = LENGTHS.filter(l => optLengths.includes(l));
      const custom = optLengths.filter(l => !LENGTHS.includes(l));
      const combined = [...standard, ...custom];
      if (combined.length > 0) return combined;
    }
    return LENGTHS;
  }, [optLengths]);

  const productWeights = useMemo(() => {
    if (optWeights && optWeights.length > 0) {
      const standard = WEIGHTS.filter(w => optWeights.includes(w));
      const custom = optWeights.filter(w => !WEIGHTS.includes(w));
      const combined = [...standard, ...custom];
      if (combined.length > 0) return combined;
    }
    return WEIGHTS;
  }, [optWeights]);

  const productStyles = useMemo(() => {
    if (optStyles && optStyles.length > 0) {
      const list = HAIR_STYLES.filter(s => optStyles.includes(s.name) || optStyles.includes(s.id));
      if (list.length > 0) return list;
      return optStyles.map(name => ({
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name,
        image: '/images/styles/natural_straight.jpg',
        pattern: 'Texture',
        description: '',
        curlType: ''
      }));
    }
    return HAIR_STYLES;
  }, [optStyles]);

  const productColors = useMemo(() => {
    if (optColors && optColors.length > 0) {
      const list = allColors.filter(c => optColors.includes(c.name) || optColors.includes(c.id));
      if (list.length > 0) return list;
    }
    return allColors;
  }, [optColors, allColors]);

  const filteredPricingColors = useMemo(() => {
    if (pricingColorFilter === 'All') return productColors;
    return productColors.filter(c => c.category === pricingColorFilter);
  }, [productColors, pricingColorFilter]);

  useEffect(() => {
    if (productLengths.length > 0) {
      setSelectedLengths(prev => {
        const stillValid = prev.filter(l => productLengths.includes(l));
        if (stillValid.length > 0) return stillValid;
        return [productLengths[0]];
      });
    }
  }, [productLengths]);

  useEffect(() => {
    if (productWeights.length > 0) {
      setSelectedWeights(prev => {
        const stillValid = prev.filter(w => productWeights.includes(w));
        if (stillValid.length > 0) return stillValid;
        return [productWeights[0]];
      });
    }
  }, [productWeights]);

  useEffect(() => {
    if (productStyles.length > 0) {
      setSelectedStyles(prev => {
        const stillValid = prev.filter(name => productStyles.some(s => s.name === name));
        if (stillValid.length > 0) return stillValid;
        return [productStyles[0].name];
      });
    }
  }, [productStyles]);

  useEffect(() => {
    if (productColors.length > 0) {
      setSelectedPricingColors(prev => {
        const stillValid = prev.filter(name => productColors.some(c => c.name === name));
        if (stillValid.length > 0) return stillValid;
        return productColors.map(c => c.name);
      });
    }
  }, [productColors]);

  const filteredAdminColors = useMemo(() => {
    let list = allColors;
    if (adminColorTab !== 'All') {
      list = list.filter(c => c.category === adminColorTab);
    }
    const q = adminColorSearch.trim();
    if (q) {
      const fuzzy = fuzzySearch(list, q, {
        fields: [
          { key: 'name', weight: 1.5 },
          { key: 'category', weight: 1.2 },
          { key: 'id', weight: 1.0 }
        ],
        threshold: 30
      });
      return fuzzy.map(f => f.item);
    }
    return list;
  }, [allColors, adminColorTab, adminColorSearch]);

  const filteredColorManagerColors = useMemo(() => {
    let list = allColors;
    if (colorManagerTab !== 'All') {
      list = list.filter(c => c.category === colorManagerTab);
    }
    const q = colorManagerSearch.trim();
    if (q) {
      const fuzzy = fuzzySearch(list, q, {
        fields: [
          { key: c => editingColorNames[c.id] !== undefined ? editingColorNames[c.id] : c.name, weight: 1.5 },
          { key: c => SPECTRUM_COLORS.find(d => d.id === c.id)?.name || c.name, weight: 1.2 },
          { key: 'id', weight: 1.0 },
          { key: 'category', weight: 1.0 }
        ],
        threshold: 30
      });
      return fuzzy.map(f => f.item);
    }
    return list;
  }, [allColors, colorManagerTab, colorManagerSearch, editingColorNames]);

  // Process data for rendering (fuzzy searching and sorting)
  const processedPrices = useMemo(() => {
    let result = Object.entries(prices).map(([key, price]) => {
      const parts = key.split('|');
      const prodName = parts[0];
      const length = parts[1] || '';
      const style = parts[2] || '';
      const category = parts[3] || '';
      const weight = parts[4] || '100 Grams';
      const unit = units[prodName] || 'unit';
      return { key, product: prodName, length, weight, style, category, price, unit };
    });

    const isSearchActive = !!searchQuery.trim();

    if (isSearchActive) {
      const fuzzy = fuzzySearch(result, searchQuery, {
        fields: [
          { key: 'product', weight: 1.5 },
          { key: 'category', weight: 1.3 },
          { key: 'style', weight: 1.2 },
          { key: 'length', weight: 1.2 },
          { key: 'weight', weight: 1.0 },
          { key: 'unit', weight: 1.0 },
          { key: item => `${item.price}`, weight: 0.9 }
        ],
        threshold: 28
      });
      result = fuzzy.map(f => f.item);
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (sortConfig.key === 'price') {
          return sortConfig.direction === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (sortConfig.key === 'length') {
          const numA = parseInt(a.length) || 0;
          const numB = parseInt(b.length) || 0;
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        } else if (sortConfig.key === 'weight') {
          const numA = parseInt(a.weight) || 0;
          const numB = parseInt(b.weight) || 0;
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        } else {
          const valA = a[sortConfig.key];
          const valB = b[sortConfig.key];
          if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }

    return result;
  }, [prices, units, searchQuery, sortConfig]);

  const toggleAllRows = () => {
    if (selectedRows.length === processedPrices.length && processedPrices.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(processedPrices.map(p => p.key));
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return <span style={{ color: '#ccc', marginLeft: '5px' }}>↕</span>;
    return <span style={{ color: 'var(--color-primary)', marginLeft: '5px' }}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  // Download price list functions
  const downloadPricesAsCsv = (
    subset: 'all' | 'filtered' | 'selected' | 'product',
    customFilename?: string
  ) => {
    let rowsToExport: Array<{
      product: string;
      length: string;
      weight: string;
      style: string;
      category: string;
      unit: string;
      price: number;
    }> = [];

    if (subset === 'selected') {
      rowsToExport = processedPrices.filter(p => selectedRows.includes(p.key));
    } else if (subset === 'filtered') {
      rowsToExport = processedPrices;
    } else if (subset === 'product') {
      rowsToExport = processedPrices.filter(p => p.product === product);
    } else {
      // 'all'
      rowsToExport = Object.entries(prices).map(([key, price]) => {
        const parts = key.split('|');
        const prodName = parts[0] || '';
        const length = parts[1] || '';
        const style = parts[2] || '';
        const category = parts[3] || '';
        const weight = parts[4] || '100 Grams';
        const unit = units[prodName] || 'unit';
        return { key, product: prodName, length, weight, style, category, price, unit };
      });
    }

    if (rowsToExport.length === 0) {
      alert('No price entries found to export.');
      return;
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
      'Style / Texture',
      'Color Shade',
      'Color Category',
      'Unit of Sale',
      'Price (USD)',
      'Display Price'
    ];

    const csvRows = [headers.join(',')];

    for (const row of rowsToExport) {
      const colorObj = allColors.find(c => c.name === row.category || c.id === row.category);
      const colorCategory = colorObj?.category || '';
      const displayPrice = `$${Math.round(row.price)} / ${row.unit}`;

      csvRows.push([
        escapeCsv(row.product),
        escapeCsv(row.length),
        escapeCsv(row.weight),
        escapeCsv(row.style),
        escapeCsv(row.category),
        escapeCsv(colorCategory),
        escapeCsv(row.unit),
        escapeCsv(Math.round(row.price)),
        escapeCsv(displayPrice)
      ].join(','));
    }

    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const dateStr = new Date().toISOString().slice(0, 10);
    const defaultFilename = subset === 'product'
      ? `price-list-${product.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${dateStr}.csv`
      : subset === 'selected'
      ? `price-list-selected-${rowsToExport.length}-${dateStr}.csv`
      : subset === 'filtered'
      ? `price-list-filtered-${dateStr}.csv`
      : `hair-and-nature-price-list-${dateStr}.csv`;

    link.href = url;
    link.setAttribute('download', customFilename || defaultFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMsg(`✓ Downloaded ${rowsToExport.length} price combinations!`);
    setTimeout(() => setDownloadSuccessMsg(''), 4000);
  };

  const downloadPricesAsJson = () => {
    if (Object.keys(prices).length === 0) {
      alert('No price entries found to export.');
      return;
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      totalEntries: Object.keys(prices).length,
      units,
      descriptions,
      prices
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `hair-and-nature-prices-backup-${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMsg(`✓ Downloaded JSON backup with ${Object.keys(prices).length} prices!`);
    setTimeout(() => setDownloadSuccessMsg(''), 4000);
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ paddingTop: 'clamp(90px, 12vh, 120px)', paddingBottom: 'clamp(40px, 8vh, 80px)', minHeight: '100vh', background: '#f9f9f9' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--color-primary)', fontWeight: 600, margin: 0 }}>
              Store Management Panel
            </h1>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>100% Ethical. 100% Natural. 100% You. • Configure products, dynamic prices, and home page salon testimonials</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => downloadPricesAsCsv('all')}
              disabled={Object.keys(prices).length === 0}
              style={{
                fontSize: '0.88rem',
                color: '#ffffff',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1f1c19 0%, #12100f 100%)',
                border: '1px solid rgba(197, 148, 58, 0.45)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: Object.keys(prices).length === 0 ? 'not-allowed' : 'pointer',
                opacity: Object.keys(prices).length === 0 ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              title="Download all defined price lists as CSV spreadsheet"
            >
              <span>📥</span>
              <span>Download Price List</span>
              <span style={{
                fontSize: '0.72rem',
                background: 'rgba(197, 148, 58, 0.25)',
                color: '#DFB76C',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: 700
              }}>
                {Object.keys(prices).length}
              </span>
            </button>
            <a href="/" target="_blank" style={{ fontSize: '0.88rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', background: '#fff', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px' }}>
              ↗ View Live Store
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={() => setActiveAdminTab('products')} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              background: activeAdminTab === 'products' ? 'var(--color-primary)' : '#ffffff',
              color: activeAdminTab === 'products' ? '#ffffff' : '#444444',
              border: activeAdminTab === 'products' ? '2px solid var(--color-primary)' : '1px solid #dddddd',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeAdminTab === 'products' ? '0 4px 15px rgba(228,82,88,0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📦</span> Products & Pricing Matrix
          </button>
          <button 
            type="button"
            onClick={() => setActiveAdminTab('colors')} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              background: activeAdminTab === 'colors' ? 'var(--color-primary)' : '#ffffff',
              color: activeAdminTab === 'colors' ? '#ffffff' : '#444444',
              border: activeAdminTab === 'colors' ? '2px solid var(--color-primary)' : '1px solid #dddddd',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeAdminTab === 'colors' ? '0 4px 15px rgba(228,82,88,0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🎨</span> Color & Shade Names ({allColors.length})
            {Object.keys(customColorNames).length > 0 && (
              <span style={{ fontSize: '0.72rem', background: activeAdminTab === 'colors' ? 'rgba(255,255,255,0.3)' : 'var(--color-primary)', color: '#fff', padding: '1px 6px', borderRadius: '10px' }}>
                {Object.keys(customColorNames).length} custom
              </span>
            )}
          </button>
          <button 
            type="button"
            onClick={() => setActiveAdminTab('testimonials')} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              background: activeAdminTab === 'testimonials' ? 'var(--color-primary)' : '#ffffff',
              color: activeAdminTab === 'testimonials' ? '#ffffff' : '#444444',
              border: activeAdminTab === 'testimonials' ? '2px solid var(--color-primary)' : '1px solid #dddddd',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeAdminTab === 'testimonials' ? '0 4px 15px rgba(228,82,88,0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⭐</span> Home Page Testimonials ({testimonials.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveAdminTab('enquiries')} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              background: activeAdminTab === 'enquiries' ? 'var(--color-primary)' : '#ffffff',
              color: activeAdminTab === 'enquiries' ? '#ffffff' : '#444444',
              border: activeAdminTab === 'enquiries' ? '2px solid var(--color-primary)' : '1px solid #dddddd',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeAdminTab === 'enquiries' ? '0 4px 15px rgba(228,82,88,0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📋</span> Global Enquiries ({enquiries.length})
          </button>
        </div>

        {activeAdminTab === 'products' && (
          <>
        {/* CARD 1: Product Information, Unit of Sale & Description */}
        <div style={{ background: 'white', padding: 'clamp(18px, 4vw, 30px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', fontWeight: 600 }}>1. Product Information & Description</h2>
          <p style={{ color: '#666', marginBottom: '22px', lineHeight: 1.6, fontSize: '0.95rem' }}>Select a product to edit its front-end description and selling unit (e.g. pack, bundle, weft, piece, unit).</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Active Product</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select 
                  value={product} 
                  onChange={e => handleProductChange(e.target.value)} 
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fff' }}
                >
                  {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button
                  type="button"
                  onClick={handleDeleteProduct}
                  style={{ padding: '0 16px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Delete
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                  placeholder="New product name..."
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={addingProduct || !newProductName.trim()}
                  style={{ padding: '10px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  {addingProduct ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Unit of Sale</label>
                {unitSavedMsg ? (
                  <span style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: 600 }}>✓ {unitSavedMsg}</span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Active: <strong style={{ color: 'var(--color-primary)' }}>{units[product] || 'unit'}</strong></span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={selectedUnit} 
                  onChange={e => setSelectedUnit(e.target.value)} 
                  placeholder="e.g. pack, bundle, weft, unit"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
                <button 
                  onClick={() => handleSaveUnit(product, selectedUnit)}
                  disabled={savingUnit}
                  type="button"
                  className="btn-gold"
                  style={{ padding: '10px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                >
                  {savingUnit ? 'Saving...' : 'Save Unit'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#888' }}>Quick select:</span>
                {['pack', 'bundle', 'weft', 'piece', 'set', 'unit'].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      setSelectedUnit(u);
                      handleSaveUnit(product, u);
                    }}
                    style={{
                      background: selectedUnit === u ? 'var(--color-primary)' : '#f0f0f0',
                      color: selectedUnit === u ? 'white' : '#444',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: selectedUnit === u ? 600 : 400
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Description Textarea */}
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ fontWeight: 600 }}>Product Description for "{product}"</label>
              {descSavedMsg && (
                <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 600, background: '#e8f5e9', padding: '3px 10px', borderRadius: '12px' }}>
                  ✓ {descSavedMsg}
                </span>
              )}
            </div>
            <textarea 
              rows={3}
              value={selectedDescription}
              onChange={e => setSelectedDescription(e.target.value)}
              placeholder={`Enter detailed product description for ${product}...`}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', color: '#777' }}>
                {selectedDescription.length} characters • Appears on product page and customer catalogs
              </span>
              <button
                type="button"
                onClick={() => handleSaveDescription(product, selectedDescription)}
                disabled={savingDesc}
                className="btn-gold"
                style={{ padding: '10px 20px', fontSize: '0.9rem', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
              >
                {savingDesc ? 'Saving Description...' : 'Save Description'}
              </button>
            </div>
          </div>

          {/* Product Images and Available Options */}
          <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Product Media & Available Options</h3>
              {metadataSavedMsg && (
                <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 600, background: '#e8f5e9', padding: '3px 10px', borderRadius: '12px' }}>
                  ✓ {metadataSavedMsg}
                </span>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Model Image URL</label>
                <input 
                  type="text" 
                  value={modelImage}
                  onChange={e => setModelImage(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Product Image URLs (Comma Separated)</label>
                <input 
                  type="text" 
                  value={productImages}
                  onChange={e => setProductImages(e.target.value)}
                  placeholder="https://img1.jpg, https://img2.jpg"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Available Lengths</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {LENGTHS.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSelection(item, optLengths, setOptLengths)}
                      style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid #ddd', background: optLengths.includes(item) ? 'var(--color-primary)' : '#fff', color: optLengths.includes(item) ? '#fff' : '#444', cursor: 'pointer' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Available Weights</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {WEIGHTS.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSelection(item, optWeights, setOptWeights)}
                      style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid #ddd', background: optWeights.includes(item) ? 'var(--color-primary)' : '#fff', color: optWeights.includes(item) ? '#fff' : '#444', cursor: 'pointer' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Available Styles</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {STYLES.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSelection(item, optStyles, setOptStyles)}
                      style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid #ddd', background: optStyles.includes(item) ? 'var(--color-primary)' : '#fff', color: optStyles.includes(item) ? '#fff' : '#444', cursor: 'pointer' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Colors for Product */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                      Available Colors for {product || 'Product'}
                    </label>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: optColors.length > 0 ? 'rgba(143, 35, 43, 0.1)' : '#f1f5f9',
                      color: optColors.length > 0 ? 'var(--color-primary)' : '#64748b'
                    }}>
                      {optColors.length === 0 ? `All ${allColors.length} Shades Active (Default)` : `${optColors.length} of ${allColors.length} Selected`}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#666', margin: '4px 0 0 0' }}>
                    Choose specific shades offered for this product. If none are selected, all {allColors.length} shades remain available on the product page by default.
                  </p>
                </div>

                {/* Bulk Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setOptColors(allColors.map(c => c.name))}
                    style={{
                      background: '#fff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    Select All {allColors.length} Shades
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptColors([])}
                    style={{
                      background: '#fff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    Deselect All (Reset to Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('colors')}
                    style={{
                      background: 'var(--color-primary-subtle, rgba(143, 35, 43, 0.08))',
                      border: '1.5px solid var(--color-primary)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>✏️</span> Rename / Edit Shade Names
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs & Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['All', ...CATEGORIES].map(cat => {
                    const catCount = cat === 'All' ? SPECTRUM_COLORS.length : SPECTRUM_COLORS.filter(c => c.category === cat).length;
                    const catSelectedCount = cat === 'All'
                      ? optColors.length
                      : SPECTRUM_COLORS.filter(c => c.category === cat && optColors.includes(c.name)).length;
                    const isActive = adminColorTab === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setAdminColorTab(cat)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          border: isActive ? '1px solid var(--color-primary)' : '1px solid #e2e8f0',
                          background: isActive ? 'var(--color-primary)' : '#fff',
                          color: isActive ? '#fff' : '#475569',
                          fontWeight: isActive ? 600 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{cat}</span>
                        <span style={{
                          fontSize: '0.72rem',
                          opacity: 0.85,
                          background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                          padding: '1px 6px',
                          borderRadius: '10px'
                        }}>
                          {optColors.length > 0 ? `${catSelectedCount}/${catCount}` : catCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {adminColorTab !== 'All' && (
                    <button
                      type="button"
                      onClick={() => {
                        const shadesInCat = SPECTRUM_COLORS.filter(c => c.category === adminColorTab).map(c => c.name);
                        const allAlreadyIn = shadesInCat.every(s => optColors.includes(s));
                        if (allAlreadyIn) {
                          setOptColors(optColors.filter(s => !shadesInCat.includes(s)));
                        } else {
                          const combined = Array.from(new Set([...optColors, ...shadesInCat]));
                          setOptColors(combined);
                        }
                      }}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {SPECTRUM_COLORS.filter(c => c.category === adminColorTab).every(s => optColors.includes(s.name))
                        ? `Deselect '${adminColorTab}'`
                        : `Select All in '${adminColorTab}'`}
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder="Search shade name..."
                    value={adminColorSearch}
                    onChange={e => setAdminColorSearch(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      width: '180px'
                    }}
                  />
                </div>
              </div>

              {/* Color Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px',
                maxHeight: '340px',
                overflowY: 'auto',
                padding: '12px',
                background: '#fafafa',
                border: '1px solid #e5e5e5',
                borderRadius: '10px'
              }}>
                {filteredAdminColors.map(c => {
                  const isSelected = optColors.includes(c.name);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleSelection(c.name, optColors, setOptColors)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isSelected ? 'rgba(143, 35, 43, 0.05)' : '#ffffff',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 6px rgba(143, 35, 43, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // parent onClick handles toggle
                        style={{ cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                      />
                      <img
                        src={c.image}
                        alt={c.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid #ddd'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.84rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'var(--color-primary)' : '#1e293b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.category}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleSaveMetadata}
                disabled={savingMetadata}
                className="btn-gold"
                style={{ padding: '10px 20px', fontSize: '0.9rem', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
              >
                {savingMetadata ? 'Saving...' : 'Save Options & Images'}
              </button>
            </div>
          </div>
        </div>
        
        {/* CARD 2: Bulk Pricing Matrix (with Weight Options) */}
        <div style={{ background: 'white', padding: 'clamp(18px, 4vw, 30px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', fontWeight: 600 }}>2. Bulk Assign Prices (Lengths, Weights, Styles, Colors)</h2>
          <p style={{ color: '#666', marginBottom: '22px', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Select combinations across the selected Lengths, Weights, Styles & Textures, and Colors configured for <strong>{product || 'this product'}</strong> to define exact prices or adjustments.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: '18px', marginBottom: '25px' }}>
            
            {/* Lengths Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Lengths ({selectedLengths.length}/{productLengths.length})</label>
                <button 
                  type="button"
                  onClick={() => setSelectedLengths(selectedLengths.length === productLengths.length ? [] : [...productLengths])} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  {selectedLengths.length === productLengths.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {productLengths.length === 0 ? (
                  <div style={{ padding: '15px 5px', fontSize: '0.84rem', color: '#888', textAlign: 'center' }}>No lengths configured</div>
                ) : (
                  productLengths.map(l => (
                    <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.9rem', fontWeight: selectedLengths.includes(l) ? 600 : 400 }}>
                      <input type="checkbox" checked={selectedLengths.includes(l)} onChange={() => toggleSelection(l, selectedLengths, setSelectedLengths)} />
                      {l}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Weights Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Weights ({selectedWeights.length}/{productWeights.length})</label>
                <button 
                  type="button"
                  onClick={() => setSelectedWeights(selectedWeights.length === productWeights.length ? [] : [...productWeights])} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  {selectedWeights.length === productWeights.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eed6d7', padding: '10px', borderRadius: '8px', background: '#fff9f9' }}>
                {productWeights.length === 0 ? (
                  <div style={{ padding: '15px 5px', fontSize: '0.84rem', color: '#888', textAlign: 'center' }}>No weights configured</div>
                ) : (
                  productWeights.map(w => (
                    <label key={w} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.9rem', fontWeight: selectedWeights.includes(w) ? 600 : 400 }}>
                      <input type="checkbox" checked={selectedWeights.includes(w)} onChange={() => toggleSelection(w, selectedWeights, setSelectedWeights)} />
                      {w}
                    </label>
                  ))
                )}
              </div>
            </div>
            
            {/* Styles Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Styles & Textures ({selectedStyles.length}/{productStyles.length})</label>
                <button 
                  type="button"
                  onClick={() => setSelectedStyles(selectedStyles.length === productStyles.length ? [] : productStyles.map(s => s.name))} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  {selectedStyles.length === productStyles.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '190px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {productStyles.length === 0 ? (
                  <div style={{ padding: '15px 5px', fontSize: '0.84rem', color: '#888', textAlign: 'center' }}>No styles configured</div>
                ) : (
                  productStyles.map(s => (
                    <label key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', cursor: 'pointer', fontSize: '0.88rem', fontWeight: selectedStyles.includes(s.name) ? 600 : 400 }}>
                      <input type="checkbox" checked={selectedStyles.includes(s.name)} onChange={() => toggleSelection(s.name, selectedStyles, setSelectedStyles)} />
                      <img src={s.image} alt={s.name} style={{ width: '26px', height: '26px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #ddd' }} />
                      <span style={{ fontWeight: selectedStyles.includes(s.name) ? 600 : 500 }}>{s.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#888', marginLeft: 'auto' }}>{s.pattern}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            
            {/* Colors Multi-Select (Product Specific Colors) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>
                  Selected Colors ({selectedPricingColors.length}/{productColors.length})
                </label>
                <button 
                  type="button"
                  onClick={() => setSelectedPricingColors(selectedPricingColors.length === productColors.length ? [] : productColors.map(c => c.name))} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                >
                  {selectedPricingColors.length === productColors.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Category Filter Pills (if product has multiple categories) */}
              {productColors.length > 5 && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {['All', ...Array.from(new Set(productColors.map(c => c.category)))].map(cat => {
                    const isActive = pricingColorFilter === cat;
                    const catCount = cat === 'All' ? productColors.length : productColors.filter(c => c.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPricingColorFilter(cat)}
                        style={{
                          background: isActive ? 'var(--color-primary)' : '#fff',
                          color: isActive ? '#fff' : '#64748b',
                          border: isActive ? '1px solid var(--color-primary)' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1px 8px',
                          fontSize: '0.72rem',
                          fontWeight: isActive ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {cat} ({catCount})
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ maxHeight: '190px', overflowY: 'auto', border: '1px solid #eee', padding: '8px 10px', borderRadius: '8px', background: '#fafafa' }}>
                {filteredPricingColors.map(col => (
                  <label 
                    key={col.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '5px 0', 
                      cursor: 'pointer', 
                      fontSize: '0.88rem',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedPricingColors.includes(col.name)} 
                      onChange={() => toggleSelection(col.name, selectedPricingColors, setSelectedPricingColors)}
                      style={{ cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                    />
                    <img 
                      src={col.image} 
                      alt={col.name} 
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd', flexShrink: 0 }} 
                    />
                    <span style={{ fontWeight: selectedPricingColors.includes(col.name) ? 600 : 400, color: '#1e293b' }}>
                      {col.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                      {col.category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', borderTop: '1px solid #eee', paddingTop: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', minWidth: 'min(100%, 200px)' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Action</label>
              <select value={actionType} onChange={e => setActionType(e.target.value as any)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fff' }}>
                <option value="exact">Set Exact Price ($ USD)</option>
                <option value="percentage">Apply % increase over base price</option>
                <option value="delete">Delete selected combinations</option>
              </select>
            </div>
            
            {actionType !== "delete" && (
              <div style={{ flex: '1 1 200px', minWidth: 'min(100%, 200px)' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{actionType === "exact" ? 'Price ($ USD)' : 'Percentage (%)'}</label>
                <input 
                  type="number" 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  placeholder={actionType === "exact" ? "e.g. 110" : "e.g. 15"}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
            )}

            <button 
              onClick={handleSave}
              disabled={savingPrices}
              className={actionType === "delete" ? "btn-dark" : "btn-gold"}
              style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', minHeight: '48px', flex: '1 1 180px', width: '100%', justifyContent: 'center' }}
            >
              {savingPrices ? 'Processing...' : actionType === "delete" ? 'Delete Selection' : 'Apply Update'}
            </button>
          </div>
        </div>

        {/* CARD 3: Current Defined Prices Table */}
        <div style={{ background: 'white', padding: 'clamp(18px, 4vw, 30px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>3. Current Defined Prices</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.88rem', color: '#666' }}>
                  Showing {processedPrices.length} {searchQuery.trim() ? `matching (${Object.keys(prices).length} total)` : 'active combinations'}
                </span>
                {searchQuery.trim() && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--color-primary, #8F232B)',
                    background: 'rgba(143, 35, 43, 0.08)',
                    padding: '1px 7px',
                    borderRadius: '10px'
                  }}>
                    Fuzzy Search
                  </span>
                )}
                {downloadSuccessMsg && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#166534',
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    {downloadSuccessMsg}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <input 
                  type="text" 
                  placeholder="Fuzzy search (e.g. 'tape 18 blonde', 'ktip', 'straight')..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '10px 32px 10px 14px', 
                    borderRadius: '8px', 
                    border: '1px solid #ddd', 
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxShadow: searchQuery.trim() ? '0 0 0 2px rgba(143, 35, 43, 0.12)' : 'none'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#eee',
                      border: 'none',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '10px',
                      color: '#666',
                      padding: 0
                    }}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Download Price List Split Button & Dropdown */}
              <div style={{ position: 'relative' }} ref={downloadMenuRef}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'stretch',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(197, 148, 58, 0.45)',
                  overflow: 'hidden'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedRows.length > 0) {
                        downloadPricesAsCsv('selected');
                      } else if (searchQuery.trim()) {
                        downloadPricesAsCsv('filtered');
                      } else {
                        downloadPricesAsCsv('all');
                      }
                    }}
                    disabled={Object.keys(prices).length === 0}
                    style={{
                      background: 'linear-gradient(135deg, #1f1c19 0%, #12100f 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 14px',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: Object.keys(prices).length === 0 ? 'not-allowed' : 'pointer',
                      opacity: Object.keys(prices).length === 0 ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                    title={
                      selectedRows.length > 0
                        ? `Download ${selectedRows.length} selected prices as CSV`
                        : searchQuery.trim()
                        ? `Download ${processedPrices.length} filtered prices as CSV`
                        : `Download all ${Object.keys(prices).length} prices as CSV`
                    }
                  >
                    <span style={{ fontSize: '0.95rem' }}>📥</span>
                    <span>
                      {selectedRows.length > 0
                        ? `Download Selected (${selectedRows.length})`
                        : 'Download Price List'}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(197, 148, 58, 0.25)',
                      color: '#DFB76C',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontWeight: 700
                    }}>
                      CSV
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDownloadMenu(prev => !prev)}
                    disabled={Object.keys(prices).length === 0}
                    style={{
                      background: 'linear-gradient(135deg, #2b2723 0%, #1a1715 100%)',
                      color: '#DFB76C',
                      border: 'none',
                      borderLeft: '1px solid rgba(197, 148, 58, 0.3)',
                      padding: '10px 10px',
                      cursor: Object.keys(prices).length === 0 ? 'not-allowed' : 'pointer',
                      opacity: Object.keys(prices).length === 0 ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem'
                    }}
                    title="Export options (All, Filtered, Selected, JSON)"
                  >
                    ▼
                  </button>
                </div>

                {/* Dropdown Menu */}
                {showDownloadMenu && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '310px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    zIndex: 100,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{
                      padding: '6px 10px 6px 10px',
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#64748b'
                    }}>
                      Download & Export Options
                    </div>

                    {/* Option 1: All Prices CSV */}
                    <button
                      type="button"
                      onClick={() => {
                        downloadPricesAsCsv('all');
                        setShowDownloadMenu(false);
                      }}
                      style={{
                        padding: '10px 12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                          📊 Full Price List (CSV)
                        </span>
                        <span style={{ fontSize: '0.72rem', background: '#e2e8f0', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                          {Object.keys(prices).length}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        All combinations for Excel, Google Sheets, & Numbers
                      </span>
                    </button>

                    {/* Option 2: Active Product Only */}
                    {product && (
                      <button
                        type="button"
                        onClick={() => {
                          downloadPricesAsCsv('product');
                          setShowDownloadMenu(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0f172a' }}>
                            🏷️ "{product}" Only (CSV)
                          </span>
                          <span style={{ fontSize: '0.72rem', background: '#e2e8f0', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                            {processedPrices.filter(p => p.product === product).length}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          Filtered to active selected product
                        </span>
                      </button>
                    )}

                    {/* Option 3: Filtered CSV */}
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          downloadPricesAsCsv('filtered');
                          setShowDownloadMenu(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          background: 'rgba(143, 35, 43, 0.04)',
                          border: '1px solid rgba(143, 35, 43, 0.2)',
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(143, 35, 43, 0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(143, 35, 43, 0.04)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--color-primary)' }}>
                            🔍 Search Matches (CSV)
                          </span>
                          <span style={{ fontSize: '0.72rem', background: 'var(--color-primary)', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                            {processedPrices.length}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          Filtered by &ldquo;{searchQuery}&rdquo;
                        </span>
                      </button>
                    )}

                    {/* Option 4: Selected Rows CSV */}
                    {selectedRows.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          downloadPricesAsCsv('selected');
                          setShowDownloadMenu(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          background: 'rgba(22, 101, 52, 0.05)',
                          border: '1px solid rgba(22, 101, 52, 0.2)',
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(22, 101, 52, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(22, 101, 52, 0.05)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#166534' }}>
                            ☑️ Selected Rows (CSV)
                          </span>
                          <span style={{ fontSize: '0.72rem', background: '#166534', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                            {selectedRows.length}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          Only currently checked items
                        </span>
                      </button>
                    )}

                    <div style={{ height: '1px', background: '#f1f5f9', margin: '3px 0' }} />

                    {/* Option 5: JSON backup */}
                    <button
                      type="button"
                      onClick={() => {
                        downloadPricesAsJson();
                        setShowDownloadMenu(false);
                      }}
                      style={{
                        padding: '9px 12px',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#334155' }}>
                        🗄️ Database Backup (JSON)
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                        .json
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {selectedRows.length > 0 && (
                <button 
                  onClick={handleDeleteSelected}
                  style={{ background: '#555', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Delete Selected ({selectedRows.length})
                </button>
              )}
              {Object.keys(prices).length > 0 && (
                <button 
                  onClick={handleClearAll}
                  style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Clear All Prices
                </button>
              )}
            </div>
          </div>
          
          {Object.keys(prices).length === 0 ? (
            <p style={{ color: '#666' }}>No prices have been defined yet. Define a price combination above.</p>
          ) : processedPrices.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', background: '#fafafa', borderRadius: '12px', border: '1px dashed #ddd', margin: '15px 0' }}>
              <p style={{ color: '#333', margin: '0 0 6px 0', fontWeight: 600, fontSize: '1rem' }}>
                No price combinations matched &ldquo;{searchQuery}&rdquo;
              </p>
              <p style={{ color: '#777', fontSize: '0.88rem', margin: '0 0 14px 0' }}>
                Fuzzy search checks product names, lengths (e.g. 18&quot;), styles, weights, and colors. Try a broader term.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: '#fff', border: '1px solid #ccc', padding: '6px 16px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px', width: '40px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.length === processedPrices.length && processedPrices.length > 0} 
                        onChange={toggleAllRows}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('product')}>
                      Product {getSortIcon('product')}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('length')}>
                      Length {getSortIcon('length')}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('weight')}>
                      Weight {getSortIcon('weight')}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('style')}>
                      Style {getSortIcon('style')}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('category')}>
                      Color / Category {getSortIcon('category')}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('unit')}>
                      Unit {getSortIcon('unit')}
                    </th>
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('price')}>
                      Price (USD) {getSortIcon('price')}
                    </th>
                    <th style={{ padding: '12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {processedPrices.map((item) => {
                    const isSelected = selectedRows.includes(item.key);
                    return (
                      <tr key={item.key} style={{ borderBottom: '1px solid #eee', background: isSelected ? 'rgba(228, 82, 88, 0.05)' : 'transparent' }}>
                        <td style={{ padding: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleRowSelection(item.key)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </td>
                        <td style={{ padding: '12px', fontWeight: 500 }}>{item.product}</td>
                        <td style={{ padding: '12px' }}>{item.length}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: 'rgba(228, 82, 88, 0.08)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
                            {item.weight}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{item.style}</td>
                        <td style={{ padding: '12px' }}>{item.category}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: '#f0f0f0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#555' }}>
                            {item.unit}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>${Math.round(item.price)}/{item.unit}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleDelete(item.key)} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        )}

        {/* COLOR & SHADE NAMES MANAGER TAB */}
        {activeAdminTab === 'colors' && (
          <div>
            {colorSavedMsg && (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 10px rgba(22, 101, 52, 0.08)' }}>
                <span>✓</span> {colorSavedMsg}
              </div>
            )}

            {/* Header & Overview Card */}
            <div style={{ background: 'white', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.45rem', marginBottom: '6px', fontWeight: 700, color: '#111' }}>
                    🎨 Color & Shade Names Manager
                  </h2>
                  <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem', margin: 0, maxWidth: '780px' }}>
                    Customize, rename, or assign specific salon codes to all 39 hair extension shades. Renamed shades automatically update your storefront, pricing combinations, and wholesale quotation summaries.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleSaveAllColors}
                    disabled={savingColors}
                    className="btn-gold"
                    style={{ padding: '10px 20px', fontSize: '0.9rem', border: 'none', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>💾</span> {savingColors ? 'Saving...' : 'Save All Custom Shade Names'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAllColors}
                    disabled={savingColors}
                    style={{ padding: '10px 18px', fontSize: '0.88rem', border: '1px solid #ef4444', color: '#ef4444', background: '#fff', cursor: 'pointer', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Reset All to Defaults
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>Total Shades</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{allColors.length}</div>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: Object.keys(customColorNames).length > 0 ? 'rgba(197, 148, 58, 0.08)' : '#f8fafc', border: Object.keys(customColorNames).length > 0 ? '1px solid rgba(197, 148, 58, 0.3)' : '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: Object.keys(customColorNames).length > 0 ? '#8c6b23' : '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>Customized Shades</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: Object.keys(customColorNames).length > 0 ? '#8c6b23' : '#0f172a', marginTop: '2px' }}>
                    {Object.keys(customColorNames).length}
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>Factory Defaults</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{allColors.length - Object.keys(customColorNames).length}</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div style={{ background: 'white', padding: '18px 24px', borderRadius: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', marginBottom: '20px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['All', ...CATEGORIES].map(cat => {
                  const isActive = colorManagerTab === cat;
                  const catCount = cat === 'All' ? allColors.length : allColors.filter(c => c.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setColorManagerTab(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        border: isActive ? '1px solid var(--color-primary)' : '1px solid #e2e8f0',
                        background: isActive ? 'var(--color-primary)' : '#fff',
                        color: isActive ? '#fff' : '#475569',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{cat}</span>
                      <span style={{ fontSize: '0.74rem', background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9', padding: '1px 6px', borderRadius: '10px' }}>
                        {catCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ width: '100%', maxWidth: '320px' }}>
                <input
                  type="text"
                  placeholder="Search by shade name, default name, ID..."
                  value={colorManagerSearch}
                  onChange={e => setColorManagerSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Shades Table Card */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid #eee', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748b' }}>
                      <th style={{ padding: '14px 20px', width: '90px' }}>Swatch</th>
                      <th style={{ padding: '14px 20px' }}>Original Default Name & ID</th>
                      <th style={{ padding: '14px 20px' }}>Category</th>
                      <th style={{ padding: '14px 20px', width: '320px' }}>Custom Display Name</th>
                      <th style={{ padding: '14px 20px', textAlign: 'center', width: '110px' }}>Status</th>
                      <th style={{ padding: '14px 20px', textAlign: 'right', width: '160px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredColorManagerColors.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#888' }}>
                          No shades match your search query & category filter.
                        </td>
                      </tr>
                    ) : (
                      filteredColorManagerColors.map((colorItem) => {
                        const defaultObj = SPECTRUM_COLORS.find(d => d.id === colorItem.id);
                        const defaultName = defaultObj?.name || colorItem.name;
                        const currentInputVal = editingColorNames[colorItem.id] !== undefined ? editingColorNames[colorItem.id] : (customColorNames[colorItem.id] || defaultName);
                        const isCustomized = Boolean(customColorNames[colorItem.id] && customColorNames[colorItem.id] !== defaultName);
                        const isPendingUnsaved = (editingColorNames[colorItem.id] !== undefined) && (editingColorNames[colorItem.id] !== (customColorNames[colorItem.id] || defaultName));

                        return (
                          <tr key={colorItem.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                            {/* Swatch */}
                            <td style={{ padding: '12px 20px' }}>
                              <div style={{ position: 'relative', width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: isCustomized ? '2px solid var(--color-primary)' : '1px solid #ddd', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                                <img
                                  src={colorItem.image}
                                  alt={colorItem.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            </td>

                            {/* Original Name & ID */}
                            <td style={{ padding: '12px 20px' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>
                                {defaultName}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                                #{colorItem.id}
                              </div>
                            </td>

                            {/* Category */}
                            <td style={{ padding: '12px 20px' }}>
                              <span style={{ fontSize: '0.78rem', background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                                {colorItem.category}
                              </span>
                            </td>

                            {/* Custom Display Name Input */}
                            <td style={{ padding: '12px 20px' }}>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type="text"
                                  value={currentInputVal}
                                  onChange={e => handleColorNameChange(colorItem.id, e.target.value)}
                                  placeholder={`Default: ${defaultName}`}
                                  style={{
                                    width: '100%',
                                    padding: '9px 14px',
                                    borderRadius: '8px',
                                    border: isPendingUnsaved ? '1.5px solid var(--color-primary)' : (isCustomized ? '1.5px solid #d97706' : '1px solid #cbd5e1'),
                                    background: isPendingUnsaved ? '#fffdf7' : '#ffffff',
                                    fontSize: '0.92rem',
                                    fontWeight: isCustomized || isPendingUnsaved ? 600 : 400
                                  }}
                                />
                                {isPendingUnsaved && (
                                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                                    Unsaved
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                              {isCustomized ? (
                                <span style={{ fontSize: '0.76rem', background: 'rgba(217, 119, 6, 0.12)', color: '#b45309', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                                  Customized
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.76rem', background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                                  Default
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleSaveSingleColor(colorItem.id)}
                                  disabled={savingColors}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    background: 'var(--color-primary)',
                                    color: '#ffffff',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Save
                                </button>
                                {isCustomized && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetSingleColor(colorItem.id)}
                                    disabled={savingColors}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      border: '1px solid #cbd5e1',
                                      background: '#fff',
                                      color: '#64748b',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TESTIMONIALS MANAGEMENT TAB */}
        {activeAdminTab === 'testimonials' && (
          <div>
            {testimonialSuccessMsg && (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '12px 20px', borderRadius: '12px', marginBottom: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✓</span> {testimonialSuccessMsg}
              </div>
            )}

            {/* Testimonials Form Card */}
            <div style={{ background: 'white', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    {editingTestimonialId ? 'Edit Testimonial' : 'Add New Salon Testimonial'}
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Add authentic reviews from master stylists, salon owners, and celebrity clients</span>
                </div>
                {editingTestimonialId && (
                  <button 
                    onClick={handleCancelEditTestimonial}
                    type="button"
                    style={{ background: '#f0f0f0', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', color: '#444' }}
                  >
                    ✕ Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleTestimonialSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px', marginBottom: '18px' }}>
                  
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>Client / Stylist Name *</label>
                    <input 
                      type="text" 
                      required
                      value={testimonialForm.name} 
                      onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>Role / Title</label>
                    <input 
                      type="text" 
                      value={testimonialForm.role} 
                      onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                      placeholder="e.g. Master Stylist & Salon Director"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                    />
                  </div>

                  {/* Salon Name */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>Salon / Studio Name</label>
                    <input 
                      type="text" 
                      value={testimonialForm.salon} 
                      onChange={e => setTestimonialForm({ ...testimonialForm, salon: e.target.value })}
                      placeholder="e.g. Mane Allure Studio"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>Location (City, Country)</label>
                    <input 
                      type="text" 
                      value={testimonialForm.location} 
                      onChange={e => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                      placeholder="e.g. Mayfair, London, UK"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>Rating (Stars)</label>
                    <select 
                      value={testimonialForm.rating} 
                      onChange={e => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', background: '#fff' }}
                    >
                      <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                      <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                      <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                    </select>
                  </div>

                  {/* Product Used */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>Hair Extension Product</label>
                    <input 
                      type="text" 
                      value={testimonialForm.product} 
                      onChange={e => setTestimonialForm({ ...testimonialForm, product: e.target.value })}
                      placeholder="e.g. Tape Extensions (Frost)"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                    />
                  </div>

                  {/* Avatar URL */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Avatar Photo URL</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ fontSize: '0.76rem', color: '#777' }}>Quick presets:</span>
                        {[
                          { label: 'Blonde Stylist', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
                          { label: 'French Stylist', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
                          { label: 'Male Director', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
                          { label: 'Studio Artist', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
                        ].map(p => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setTestimonialForm({ ...testimonialForm, image: p.url })}
                            style={{ background: '#f3f4f6', border: '1px solid #ddd', borderRadius: '12px', padding: '2px 8px', fontSize: '0.72rem', cursor: 'pointer' }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {testimonialForm.image && (
                        <img 
                          src={testimonialForm.image} 
                          alt="preview" 
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd', flexShrink: 0 }} 
                        />
                      )}
                      <input 
                        type="url" 
                        value={testimonialForm.image} 
                        onChange={e => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  {/* Content Quote */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: '6px' }}>Testimonial Quote / Review Text *</label>
                    <textarea 
                      rows={4}
                      required
                      value={testimonialForm.content} 
                      onChange={e => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                      placeholder="Write the salon owner or stylist review here..."
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', lineHeight: 1.6 }}
                    />
                  </div>

                  {/* Verified Checkbox */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                      <input 
                        type="checkbox" 
                        checked={testimonialForm.verified} 
                        onChange={e => setTestimonialForm({ ...testimonialForm, verified: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      Mark as Verified Salon Partner (shows green ✓ badge)
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button 
                    type="submit" 
                    disabled={savingTestimonials}
                    className="btn-gold"
                    style={{ padding: '12px 28px', fontSize: '0.95rem', border: 'none', cursor: 'pointer', borderRadius: '10px' }}
                  >
                    {savingTestimonials 
                      ? 'Saving...' 
                      : (editingTestimonialId ? 'Update Testimonial' : '+ Add Testimonial to Home Page')}
                  </button>
                  {editingTestimonialId && (
                    <button 
                      type="button" 
                      onClick={handleCancelEditTestimonial}
                      style={{ padding: '12px 20px', borderRadius: '10px', background: '#f3f4f6', border: '1px solid #ddd', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Testimonials List */}
            <div style={{ background: 'white', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                  Active Home Page Testimonials ({testimonials.length})
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>Changes save automatically and appear on the home page</span>
              </div>

              {testimonials.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  No testimonials found. Add your first salon testimonial above!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
                  {testimonials.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        background: '#fafafa',
                        border: editingTestimonialId === item.id ? '2px solid var(--color-primary)' : '1px solid #e8e8e8',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative'
                      }}
                    >
                      <div>
                        {/* Card Top: Stars & Status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ color: '#f59e0b', fontSize: '1.05rem' }}>
                            {[...Array(item.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                          </div>
                          {item.verified && (
                            <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                              ✓ Verified Salon
                            </span>
                          )}
                        </div>

                        {item.product && (
                          <span style={{ display: 'inline-block', fontSize: '0.75rem', background: '#fff', border: '1px solid #e0e0e0', padding: '2px 8px', borderRadius: '6px', color: '#555', marginBottom: '10px', fontWeight: 600 }}>
                            {item.product}
                          </span>
                        )}

                        <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.6, marginBottom: '16px' }}>
                          “{item.content}”
                        </p>
                      </div>

                      {/* Card Bottom: Author & Action Buttons */}
                      <div style={{ paddingTop: '12px', borderTop: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                            alt={item.name} 
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} 
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#111' }}>{item.name}</strong>
                            <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--color-primary)' }}>{item.role} {item.salon ? `• ${item.salon}` : ''}</span>
                            <span style={{ display: 'block', fontSize: '0.72rem', color: '#888' }}>📍 {item.location}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            type="button"
                            onClick={() => handleStartEditTestimonial(item)}
                            style={{ flex: 1, padding: '7px', background: '#ffffff', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: '#333' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteTestimonial(item.id)}
                            style={{ padding: '7px 12px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeAdminTab === 'enquiries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Summary Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Inquiries Logged</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>{enquiries.length}</div>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Volume Requested</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                  {enquiries.reduce((acc, e) => acc + (e.totalItems || 0), 0)} packs
                </div>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated Pipeline Value</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                  ${enquiries.reduce((acc, e) => acc + (e.estimatedTotal || 0), 0).toLocaleString()} USD
                </div>
              </div>
            </div>

            {/* Inquiries List */}
            <div style={{ background: '#fff', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                    Global Wholesale Inquiries ({enquiries.length})
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    Multi-product orders submitted from product pages via WhatsApp
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    fetch('/api/enquiries')
                      .then(res => res.json())
                      .then(data => setEnquiries(data))
                      .catch(err => console.error(err));
                  }}
                  style={{ padding: '8px 16px', background: '#f3f4f6', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  🔄 Refresh List
                </button>
              </div>

              {enquiries.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  No global enquiries recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      style={{
                        background: '#fafafa',
                        border: '1px solid #e5e5e5',
                        borderRadius: '14px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      {/* Top Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '1.05rem', color: '#111', display: 'block' }}>
                            {enq.salonName || 'Salon Partner'}
                          </strong>
                          <span style={{ fontSize: '0.82rem', color: '#666' }}>
                            Contact: {enq.clientName} • 📍 {enq.location}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#999', display: 'block', marginTop: '2px' }}>
                            📅 {new Date(enq.date).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '12px', fontSize: '0.76rem', fontWeight: 700 }}>
                            {enq.status || 'Received'}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this enquiry record?')) return;
                              const updated = enquiries.filter(e => e.id !== enq.id);
                              setEnquiries(updated);
                              try {
                                await fetch('/api/enquiries', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(updated)
                                });
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer', fontWeight: 600 }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {/* Items Grid */}
                      <div style={{ background: '#ffffff', borderRadius: '10px', padding: '12px 16px', border: '1px solid #ebebeb' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#333', marginBottom: '8px' }}>
                          Enquired Items ({enq.totalItems} total {enq.items?.[0]?.unit || 'pack'}s):
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                          {enq.items?.map((it: any, iIdx: number) => (
                            <div key={iIdx} style={{ background: '#f8f8f8', padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee' }}>
                              <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--color-primary)' }}>
                                {it.title}
                              </strong>
                              <span style={{ fontSize: '0.78rem', color: '#555' }}>
                                {it.quantity}x • {it.length} • {it.weight}
                              </span>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: '#777' }}>
                                Style: {it.style} | Color: {it.color}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes & Estimated Value */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '8px' }}>
                        {enq.notes ? (
                          <div style={{ fontSize: '0.82rem', color: '#666', fontStyle: 'italic', flex: 1 }}>
                            Note: "{enq.notes}"
                          </div>
                        ) : <div />}
                        {enq.estimatedTotal > 0 && (
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1a1a1a' }}>
                            Est. Value: ${enq.estimatedTotal.toLocaleString()} USD
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
