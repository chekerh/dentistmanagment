import { useState } from 'react';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { mockInventory } from '../data/mockData';
import type { InventoryItem, InventoryCategory } from '../types';
import { useLang } from '../context/LanguageContext';

const CATEGORIES: InventoryCategory[] = ['consumables', 'equipment', 'medications', 'instruments', 'protective', 'other'];

function getCategoryColor(cat: InventoryCategory) {
  const map: Record<InventoryCategory, string> = {
    consumables: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    equipment: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
    medications: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    instruments: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    protective: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
    other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };
  return map[cat];
}

function getStockStatus(item: InventoryItem) {
  if (item.quantity === 0) return { label: 'Out of Stock', variant: 'red' as const };
  if (item.quantity <= item.reorderThreshold) return { label: 'Low Stock', variant: 'red' as const };
  if (item.quantity <= item.reorderThreshold * 2) return { label: 'Watch', variant: 'yellow' as const };
  return { label: 'In Stock', variant: 'green' as const };
}

export default function InventoryPage() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | InventoryCategory>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'ok'>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', category: 'consumables' as InventoryCategory,
    sku: '', quantity: 0, unit: 'unit', reorderThreshold: 5,
    unitCost: 0, supplier: '', expirationDate: '', location: '', description: '',
  });

  const filtered = mockInventory.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || i.category === catFilter;
    const stockStatus = getStockStatus(i);
    const matchStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && stockStatus.variant === 'red') ||
      (stockFilter === 'ok' && stockStatus.variant !== 'red');
    return matchSearch && matchCat && matchStock;
  });

  const lowStockItems = mockInventory.filter(i => i.quantity <= i.reorderThreshold);
  const expiringItems = mockInventory.filter(i => i.expirationDate && new Date(i.expirationDate) < new Date('2026-07-01'));
  const totalValue = mockInventory.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.inventory.addedDemo);
    setShowAddModal(false);
  };

  return (
    <Layout>
      <Topbar
        title="Inventory & Stock"
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Item
          </button>
        }
      />

      <div className="p-4 md:p-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t.inventory.statTotalItems, value: mockInventory.length, icon: 'inventory_2', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
            { label: 'Low Stock', value: lowStockItems.length, icon: 'warning', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
            { label: t.inventory.statExpiring, value: expiringItems.length, icon: 'schedule', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400' },
            { label: t.inventory.statTotalValue, value: `$${totalValue.toFixed(0)}`, icon: 'payments', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              type="text"
              placeholder="Search by name, SKU, or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'low', 'ok'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStockFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  stockFilter === f ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                }`}
              >
                {f === 'all' ? 'All' : f === 'low' ? '⚠ Low Stock' : '✓ In Stock'}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                catFilter === cat ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  {['Item', 'Category', 'SKU', 'Quantity', t.inventory.fieldReorderThreshold, 'Unit Cost', 'Supplier', 'Expiry', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-12 text-slate-400">{t.inventory.noFound}</td></tr>
                ) : filtered.map((item) => {
                  const stock = getStockStatus(item);
                  const pct = Math.min((item.quantity / (item.reorderThreshold * 3)) * 100, 100);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.location}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">{item.sku}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${item.quantity <= item.reorderThreshold ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                          <div
                            className={`h-full rounded-full ${stock.variant === 'red' ? 'bg-red-500' : stock.variant === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.reorderThreshold} {item.unit}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">${item.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.supplier}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.expirationDate ?? '—'}</td>
                      <td className="px-4 py-3"><Badge variant={stock.variant}>{stock.label}</Badge></td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                          className="p-1.5 rounded text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={t.inventory.detailTitle}>
        {selectedItem && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedItem.name}</h4>
                <p className="text-sm text-slate-500 mt-1 font-mono">{selectedItem.sku}</p>
              </div>
              <Badge variant={getStockStatus(selectedItem).variant}>{getStockStatus(selectedItem).label}</Badge>
            </div>
            {selectedItem.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400">{selectedItem.description}</p>
            )}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              {[
                { label: 'Category', value: selectedItem.category },
                { label: 'Quantity', value: `${selectedItem.quantity} ${selectedItem.unit}` },
                { label: 'Reorder Threshold', value: `${selectedItem.reorderThreshold} ${selectedItem.unit}` },
                { label: 'Unit Cost', value: `$${selectedItem.unitCost.toFixed(2)}` },
                { label: 'Total Value', value: `$${(selectedItem.quantity * selectedItem.unitCost).toFixed(2)}` },
                { label: 'Supplier', value: selectedItem.supplier },
                { label: t.inventory.detailLastRestocked, value: selectedItem.lastRestocked },
                { label: t.inventory.detailExpiry, value: selectedItem.expirationDate ?? 'N/A' },
                { label: 'Location', value: selectedItem.location },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            {selectedItem.quantity <= selectedItem.reorderThreshold && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-[20px]">warning</span>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {t.inventory.lowStockWarning}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { alert(t.inventory.reorderDemo); setSelectedItem(null); }}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Reorder Stock
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Item Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t.inventory.addTitle} size="lg">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Item Name', key: 'name', required: true },
              { label: 'SKU', key: 'sku', required: true },
              { label: 'Unit', key: 'unit' },
              { label: 'Supplier', key: 'supplier' },
              { label: 'Location', key: 'location' },
              { label: 'Expiration Date', key: 'expirationDate', type: 'date' },
            ].map(({ label, key, required, type = 'text' }) => (
              <label key={key} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}{required ? ' *' : ''}</span>
                <input
                  type={type}
                  value={(newItem as any)[key]}
                  onChange={(e) => setNewItem(p => ({ ...p, [key]: e.target.value }))}
                  required={required}
                  className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white"
                />
              </label>
            ))}
            {[
              { label: 'Quantity', key: 'quantity', type: 'number' },
              { label: 'Reorder Threshold', key: 'reorderThreshold', type: 'number' },
              { label: 'Unit Cost ($)', key: 'unitCost', type: 'number' },
            ].map(({ label, key, type }) => (
              <label key={key} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <input
                  type={type}
                  value={(newItem as any)[key]}
                  onChange={(e) => setNewItem(p => ({ ...p, [key]: Number(e.target.value) }))}
                  min={0}
                  step="0.01"
                  className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white"
                />
              </label>
            ))}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category *</span>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(p => ({ ...p, category: e.target.value as InventoryCategory }))}
                className="h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.inventory.fieldDescription}</span>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem(p => ({ ...p, description: e.target.value }))}
              rows={2}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
              Add Item
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
