"use client";

import { useState, useEffect, useMemo } from "react";

const PRODUCTS = ["Tape Extensions", "K Tips", "Genius Wefts", "Butterfly Wefts", "ClipOn Extensions"];
const LENGTHS = ['16 Inches', '18 Inches', '20 Inches', '22 Inches', '24 Inches', '26 Inches', '28 Inches', '30 Inches'];
const STYLES = ['Natural Straight', 'Natural Wave', 'Body Wave', 'Deep Wave', 'Kinky Curls', 'Afro Curls'];
const COLORS = ['#1 Jet Black', '#1b Off Black', '#2 Darkest Brown', '#4 Medium Brown', '#8 Light Ash Brown', '#22 Light Blonde', '#613 Bleach Blonde'];

type SortKey = 'product' | 'length' | 'style' | 'color' | 'price' | 'unit';
type SortDirection = 'asc' | 'desc';

export default function AdminPage() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [units, setUnits] = useState<Record<string, string>>({});
  
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [selectedUnit, setSelectedUnit] = useState<string>("pack");
  const [selectedLengths, setSelectedLengths] = useState<string[]>([LENGTHS[0]]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([STYLES[0]]);
  const [selectedColors, setSelectedColors] = useState<string[]>([COLORS[0]]);
  
  const [actionType, setActionType] = useState<"exact" | "percentage" | "delete">("exact");
  const [inputValue, setInputValue] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // For the select-and-delete feature in the table
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Search and Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: SortDirection } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/prices').then(res => res.json()).catch(() => ({})),
      fetch('/api/units').then(res => res.json()).catch(() => ({}))
    ]).then(([priceData, unitData]) => {
      setPrices(priceData || {});
      const loadedUnits = unitData || {};
      setUnits(loadedUnits);
      setSelectedUnit(loadedUnits[PRODUCTS[0]] || "pack");
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleProductChange = (newProduct: string) => {
    setProduct(newProduct);
    setSelectedUnit(units[newProduct] || "pack");
  };

  const handleSaveUnit = async (prodName: string, unitVal: string) => {
    const cleaned = unitVal.trim() || 'unit';
    const updatedUnits = { ...units, [prodName]: cleaned };
    try {
      const res = await fetch('/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUnits)
      });
      if (res.ok) {
        setUnits(updatedUnits);
        alert(`Unit for "${prodName}" saved as "${cleaned}"!`);
      } else {
        alert("Failed to save unit.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving unit.");
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
    if (selectedLengths.length === 0 || selectedStyles.length === 0 || selectedColors.length === 0) {
      alert("Please select at least one length, one style, and one color.");
      return;
    }
    
    if (actionType === "delete") {
      if (!confirm("Are you sure you want to delete the prices for all selected combinations?")) return;
    }
    
    setSaving(true);
    const updatedPrices = { ...prices };
    const numValue = Number(inputValue);
    
    let updatedCount = 0;
    
    // Generate all selected combinations
    for (const len of selectedLengths) {
      for (const st of selectedStyles) {
        // Find a base price for this Product + Length + Style by checking ANY color
        let basePrice: number | undefined = undefined;
        for (const anyColor of COLORS) {
          const checkKey = `${product}|${len}|${st}|${anyColor}`;
          if (updatedPrices[checkKey] !== undefined) {
            basePrice = updatedPrices[checkKey];
            break; // Stop at the first found price for this length/style
          }
        }

        for (const col of selectedColors) {
          const key = `${product}|${len}|${st}|${col}`;
          
          if (actionType === "exact") {
            updatedPrices[key] = numValue;
            updatedCount++;
          } else if (actionType === "percentage") {
            // Apply percentage increase to the base price found for this length/style
            if (basePrice !== undefined) {
              const increaseAmount = basePrice * (numValue / 100);
              updatedPrices[key] = Math.round((basePrice + increaseAmount) * 100) / 100; // Round to 2 decimals
              updatedCount++;
            }
          } else if (actionType === "delete") {
            if (updatedPrices[key] !== undefined) {
              delete updatedPrices[key];
              updatedCount++;
            }
          }
        }
      }
    }
    
    if (actionType === "percentage" && updatedCount === 0) {
      alert("No base price found. To apply a percentage, you must first define an exact price for at least one other color for the selected lengths and styles.");
      setSaving(false);
      return;
    }

    if (actionType === "delete" && updatedCount === 0) {
      alert("No prices were found to delete for the selected combinations.");
      setSaving(false);
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
        // Clear any selected rows that might have been deleted
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
    setSaving(false);
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
      const [prodName, length, style, color] = key.split('|');
      const unit = units[prodName] || 'unit';
      return { key, product: prodName, length, style, color, price, unit };
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.product.toLowerCase().includes(q) ||
        item.length.toLowerCase().includes(q) ||
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
          // Extract numbers for numeric length sorting
          const numA = parseInt(a.length) || 0;
          const numB = parseInt(b.length) || 0;
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
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 'clamp(20px, 4vw, 40px)', color: 'var(--color-primary)', fontWeight: 600 }}>Pricing & Product Admin Panel</h1>
        
        <div style={{ background: 'white', padding: 'clamp(18px, 4vw, 30px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '14px', fontWeight: 600 }}>Bulk Assign Prices & Manage Units</h2>
          <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6, fontSize: '0.95rem' }}>Select a product and configure its selling unit (e.g. pack, bundle, weft, unit). Choose multiple lengths, styles, and colors to assign exact prices or percentage increases.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Product (Select One)</label>
              <select 
                value={product} 
                onChange={e => handleProductChange(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
              >
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Product Unit of Sale</label>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Active: <strong style={{ color: 'var(--color-primary)' }}>{units[product] || 'unit'}</strong></span>
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
                  type="button"
                  className="btn-gold"
                  style={{ padding: '10px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                >
                  Save Unit
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
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '20px', marginBottom: '25px' }}>
            
            {/* Lengths Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Lengths</label>
                <button onClick={() => setSelectedLengths(selectedLengths.length === LENGTHS.length ? [] : LENGTHS)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  {selectedLengths.length === LENGTHS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {LENGTHS.map(l => (
                  <label key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedLengths.includes(l)} onChange={() => toggleSelection(l, selectedLengths, setSelectedLengths)} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Styles Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Styles / Textures</label>
                <button onClick={() => setSelectedStyles(selectedStyles.length === STYLES.length ? [] : STYLES)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  {selectedStyles.length === STYLES.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {STYLES.map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedStyles.includes(s)} onChange={() => toggleSelection(s, selectedStyles, setSelectedStyles)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Colors Multi-Select */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: 600 }}>Colors</label>
                <button onClick={() => setSelectedColors(selectedColors.length === COLORS.length ? [] : COLORS)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  {selectedColors.length === COLORS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {COLORS.map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer' }}>
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
              <select value={actionType} onChange={e => setActionType(e.target.value as any)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}>
                <option value="exact">Set Exact Price ($)</option>
                <option value="percentage">Apply % increase over base price</option>
                <option value="delete">Delete these combinations</option>
              </select>
            </div>
            
            {actionType !== "delete" && (
              <div style={{ flex: '1 1 200px', minWidth: 'min(100%, 200px)' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{actionType === "exact" ? 'Price ($)' : 'Percentage (%)'}</label>
                <input 
                  type="number" 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  placeholder={actionType === "exact" ? "e.g. 150" : "e.g. 15"}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
            )}

            <button 
              onClick={handleSave}
              disabled={saving}
              className={actionType === "delete" ? "btn-dark" : "btn-gold"}
              style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', minHeight: '48px', flex: '1 1 180px', width: '100%', justifyContent: 'center' }}
            >
              {saving ? 'Processing...' : actionType === "delete" ? 'Delete Selection' : 'Apply Update'}
            </button>
          </div>
        </div>

        <div style={{ background: 'white', padding: 'clamp(18px, 4vw, 30px)', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>Current Defined Prices</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', width: '100%', maxWidth: '600px', justifyContent: 'flex-start' }}>
              <input 
                type="text" 
                placeholder="Search products, lengths, colors..." 
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
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
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
                        <td style={{ padding: '12px' }}>{item.product}</td>
                        <td style={{ padding: '12px' }}>{item.length}</td>
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
