import { useState, useEffect } from 'react';
import { Edit2, Check, X, RotateCcw } from 'lucide-react';
import { CreditPricingItem, DEFAULT_CREDIT_PRICING } from '../types/creditPricing';
import { creditPricing } from '../lib/creditPricing';

const STORAGE_KEY = 'lyzr_custom_credit_pricing';

export function loadCustomPricing(): CreditPricingItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load custom pricing:', error);
  }
  return DEFAULT_CREDIT_PRICING;
}

export function saveCustomPricing(pricing: CreditPricingItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pricing));
  window.dispatchEvent(new Event('storage'));
}

export default function CreditPricingTable() {
  const [pricing, setPricing] = useState<CreditPricingItem[]>(loadCustomPricing());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const currencySymbol = creditPricing.getCurrencySymbol();

  useEffect(() => {
    const handleStorageChange = () => {
      setPricing(loadCustomPricing());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const startEdit = (item: CreditPricingItem) => {
    setEditingKey(item.key);
    setEditValue(item.price.toString());
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const saveEdit = (key: string) => {
    const newPrice = parseFloat(editValue);
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    const updated = pricing.map(item =>
      item.key === key ? { ...item, price: newPrice } : item
    );

    setPricing(updated);
    saveCustomPricing(updated);
    setEditingKey(null);
    setEditValue('');
  };

  const resetToDefaults = () => {
    setPricing(DEFAULT_CREDIT_PRICING);
    saveCustomPricing(DEFAULT_CREDIT_PRICING);
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b-2 border-gray-300 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-black">Credit Summary Table</h3>
          <p className="text-sm text-gray-600 mt-1">Customize pricing for different operations and services</p>
        </div>
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Price (C)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pricing.map((item, index) => (
              <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingKey === item.key ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm font-bold"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(item.key);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button
                        onClick={() => saveEdit(item.key)}
                        className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-black">{item.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">
                        ≈ {currencySymbol}{(item.price * creditPricing.getRate()).toFixed(3)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingKey !== item.key && item.editable !== false && (
                    <button
                      onClick={() => startEdit(item)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-xs font-medium"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border-t-2 border-blue-200 px-6 py-4">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Prices are shown in Credits (C). The approximate {creditPricing.getCurrency()} equivalent
          is calculated using your current conversion rate of {currencySymbol}{creditPricing.getRate().toFixed(4)}/credit.
          Changes are saved automatically and apply to all future calculations.
        </p>
      </div>
    </div>
  );
}
