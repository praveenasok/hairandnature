"use client";

import { useState, useEffect, useMemo } from "react";

const PRODUCTS = [
  "Tape Extensions",
  "K Tips",
  "Genius Wefts",
  "Butterfly Wefts",
  "ClipOn Extensions",
  "Premium DIY Hair Bun",
  "Caramel Brown Highlights",
  "Sleek Flatclip Ponytail",
  "Elegant Clutch Bun",
  "Volume Boost Cover Patch"
];
const LENGTHS = ['16 Inches', '18 Inches', '20 Inches', '22 Inches', '24 Inches', '26 Inches', '28 Inches', '30 Inches'];
const WEIGHTS = ['50 Grams', '100 Grams', '150 Grams', '200 Grams'];
const STYLES = ['Natural Straight', 'Natural Wave', 'Body Wave', 'Deep Wave', 'Kinky Curls', 'Afro Curls'];
const COLORS = ['#1 Jet Black', '#1b Off Black', '#2 Darkest Brown', '#4 Medium Brown', '#8 Light Ash Brown', '#22 Light Blonde', '#613 Bleach Blonde'];

type SortKey = 'product' | 'length' | 'weight' | 'style' | 'color' | 'price' | 'unit';
type SortDirection = 'asc' | 'desc';

export default function AdminPage() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [units, setUnits] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [selectedUnit, setSelectedUnit] = useState<string>("pack");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  
  const [selectedLengths, setSelectedLengths] = useState<string[]>([LENGTHS[0]]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([WEIGHTS[1]]); // default 100g
  const [selectedStyles, setSelectedStyles] = useState<string[]>([STYLES[0]]);
  const [selectedColors, setSelectedColors] = useState<string[]>([COLORS[0]]);
  
  const [actionType, setActionType] = useState<"exact" | "percentage" | "delete">("exact");
  const [inputValue, setInputValue] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [savingPrices, setSavingPrices] = useState(false);
  const [savingUnit, setSavingUnit] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);
  
  // Feedback badges
  const [unitSavedMsg, setUnitSavedMsg] = useState("");
  const [descSavedMsg, setDescSavedMsg] = useState("");

  // For the select-and-delete feature in the table
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Search and Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: SortDirection } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/prices').then(res => res.json()).catch(() => ({})),
      fetch('/api/units').then(res => res.json()).catch(() => ({})),
      fetch('/api/descriptions').then(res => res.json()).catch(() => ({}))
    ]).then(([priceData, unitData, descData]) => {
      setPrices(priceData || {});
      const loadedUnits = unitData || {};
      setUnits(loadedUnits);
      setSelectedUnit(loadedUnits[PRODUCTS[0]] || "pack");
      
      const loadedDescs = descData || {};
      setDescriptions(loadedDescs);
      setSelectedDescription(loadedDescs[PRODUCTS[0]] || "");
      
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleProductChange = (newProduct: string) => {
    setProduct(newProduct);
    setSelectedUnit(units[newProduct] || "pack");
    setSelectedDescription(descriptions[newProduct] || "");
    setUnitSavedMsg("");
    setDescSavedMsg("");
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
    if (selectedLengths.length === 0 || selectedWeights.length === 0 || selectedStyles.length === 0 || selectedColors.length === 0) {
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
          for (const anyColor of COLORS) {
            const checkKeyWithWeight = `${product}|${len}|${st}|${anyColor}|${wt}`;
            const checkKeyLegacy = `${product}|${len}|${st}|${anyColor}`;
            if (updatedPrices[checkKeyWithWeight] !== undefined) {
              basePrice = updatedPrices[checkKeyWithWeight];
              break;
            } else if (updatedPrices[checkKeyLegacy] !== undefined) {
              basePrice = updatedPrices[checkKeyLegacy];
              break;
            }
          }

          for (const col of selectedColors) {
            const key = `${product}|${len}|${st}|${col}|${wt}`;
            
            if (actionType === "exact") {
              updatedPrices[key] = numValue;
              updatedCount++;
            } else if (actionType === "percentage") {
              if (basePrice !== undefined) {
                const increaseAmount = basePrice * (numValue / 100);
                updatedPrices[key] = Math.round((basePrice + increaseAmount) * 100) / 100;
                updatedCount++;
              }
            } else if (actionType === "delete") {
              if (updatedPrices[key] !== undefined) {
                delete updatedPrices[key];
                updatedCount++;
              }
              // Also clean up any legacy 4-part key matching this combination if weight is standard 100g
              const legacyKey = `${product}|${len}|${st}|${col}`;
              if (wt === '100 Grams' && updatedPrices[legacyKey] !== undefined) {
                delete updatedPrices[legacyKey];
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

  // Process data for rendering (searching and sorting)
  const processedPrices = useMemo(() => {
    let result = Object.entries(prices).map(([key, price]) => {
      const parts = key.split('|');
      const prodName = parts[0];
      const length = parts[1] || '';
      const style = parts[2] || '';
      const color = parts[3] || '';
      const weight = parts[4] || '100 Grams';
      const unit = units[prodName] || 'unit';
      return { key, product: prodName, length, weight, style, color, price, unit };
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.product.toLowerCase().includes(q) ||
        item.length.toLowerCase().includes(q) ||
        item.weight.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.color.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q)
      );
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

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ paddingTop: 'clamp(90px, 12vh, 120px)', paddingBottom: 'clamp(40px, 8vh, 80px)', minHeight: '100vh', background: '#f9f9f9' }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 'clamp(20px, 4vw, 30px)', color: 'var(--color-primary)', fontWeight: 600 }}>Pricing & Product Admin Panel</h1>
        
        {/* CARD 1: Product Information, Unit of Sale & Description */}
        <div style={{ background: 'white', padding: 'clamp(18px, 4vw, 30px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', fontWeight: 600 }}>1. Product Information & Description</h2>
          <p style={{ color: '#666', marginBottom: '22px', lineHeight: 1.6, fontSize: '0.95rem' }}>Select a product to edit its front-end description and selling unit (e.g. pack, bundle, weft, piece, unit).</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Active Product</label>
              <select 
                value={product} 
                onChange={e => handleProductChange(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: '#fff' }}
              >
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
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
        </div>
        
        {/* CARD 2: Bulk Pricing Matrix (with Weight Options) */}
        <div style={{ background: 'white', padding: 'clamp(18px, 4vw, 30px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', fontWeight: 600 }}>2. Bulk Assign Prices (Lengths, Weights, Styles, Colors)</h2>
          <p style={{ color: '#666', marginBottom: '22px', lineHeight: 1.6, fontSize: '0.95rem' }}>Select combinations across Lengths, <strong>Weights</strong>, Styles, and Colors to define exact prices or percentage adjustments.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: '18px', marginBottom: '25px' }}>
            
            {/* Lengths Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Lengths ({selectedLengths.length})</label>
                <button onClick={() => setSelectedLengths(selectedLengths.length === LENGTHS.length ? [] : LENGTHS)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}>
                  {selectedLengths.length === LENGTHS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {LENGTHS.map(l => (
                  <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedLengths.includes(l)} onChange={() => toggleSelection(l, selectedLengths, setSelectedLengths)} />
                    {l}
                  </label>
                ))}
              </div>
            </div>

            {/* Weights Multi-Select (NEW) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Weights ({selectedWeights.length})</label>
                <button onClick={() => setSelectedWeights(selectedWeights.length === WEIGHTS.length ? [] : WEIGHTS)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}>
                  {selectedWeights.length === WEIGHTS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eed6d7', padding: '10px', borderRadius: '8px', background: '#fff9f9' }}>
                {WEIGHTS.map(w => (
                  <label key={w} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.9rem', fontWeight: selectedWeights.includes(w) ? 600 : 400 }}>
                    <input type="checkbox" checked={selectedWeights.includes(w)} onChange={() => toggleSelection(w, selectedWeights, setSelectedWeights)} />
                    {w}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Styles Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Styles ({selectedStyles.length})</label>
                <button onClick={() => setSelectedStyles(selectedStyles.length === STYLES.length ? [] : STYLES)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}>
                  {selectedStyles.length === STYLES.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {STYLES.map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedStyles.includes(s)} onChange={() => toggleSelection(s, selectedStyles, setSelectedStyles)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Colors Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Colors ({selectedColors.length})</label>
                <button onClick={() => setSelectedColors(selectedColors.length === COLORS.length ? [] : COLORS)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.82rem' }}>
                  {selectedColors.length === COLORS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {COLORS.map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={selectedColors.includes(c)} onChange={() => toggleSelection(c, selectedColors, setSelectedColors)} />
                    {c}
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
              <span style={{ fontSize: '0.88rem', color: '#666' }}>Showing {processedPrices.length} active combinations</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', width: '100%', maxWidth: '600px', justifyContent: 'flex-start' }}>
              <input 
                type="text" 
                placeholder="Search products, lengths, weights, colors..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', flex: '1 1 200px', minWidth: 'min(100%, 200px)', fontSize: '0.95rem' }}
              />
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
            <p style={{ color: '#666' }}>No prices match your search query.</p>
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
                    <th style={{ padding: '12px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('color')}>
                      Color {getSortIcon('color')}
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
                        <td style={{ padding: '12px' }}>{item.color}</td>
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
      </div>
    </div>
  );
}
