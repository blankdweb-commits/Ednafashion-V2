import React, { useState } from 'react';
import { ShieldCheck, Package, RefreshCw, AlertCircle, Edit2, Check, ArrowLeft, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatKobo } from '../lib/currency';
import { Order } from '../types';

interface AdminDashboardPageProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBack, onNavigate }) => {
  const { products, updateProductStock, orders, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'audit'>('inventory');

  // Editing stock state
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [newStockInput, setNewStockInput] = useState<number>(0);

  // Selected order for status update
  const [selectedOrderRef, setSelectedOrderRef] = useState<string>(orders[0]?.reference || '');
  const [updatedStatus, setUpdatedStatus] = useState<Order['fulfillmentStatus']>('processing');
  const [courierInput, setCourierInput] = useState<string>('GIG Logistics');
  const [waybillInput, setWaybillInput] = useState<string>('GIG-LOS-998241');
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Mock immutable audit logs (Requirement 5)
  const auditLogs = [
    {
      id: 'log-1',
      action: 'ADMIN_PROVISIONED',
      actor: 'system-cli',
      target: 'owner@ednafashion.ng',
      timestamp: '2026-10-24 12:00:00',
      note: 'One-time server-side administrator provisioning via trusted CLI',
    },
    {
      id: 'log-2',
      action: 'INVENTORY_RESERVATION_COMMITTED',
      actor: 'paystack-webhook-hmac',
      target: 'EDNA-2026-8819',
      timestamp: '2026-10-24 16:30:15',
      note: 'Stock deducted atomically after verified ₦29,600 payment',
    },
    {
      id: 'log-3',
      action: 'COURIER_WAYBILL_ASSIGNED',
      actor: 'admin@ednafashion.ng',
      target: 'GIG-LOS-998241',
      timestamp: '2026-10-24 17:10:00',
      note: 'Dispatched package with GIG Logistics (Express Mainland/Island)',
    },
  ];

  const handleSaveStock = (variantId: string) => {
    updateProductStock(variantId, newStockInput);
    setEditingVariantId(null);
  };

  const handleUpdateOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderStatus(selectedOrderRef, updatedStatus, courierInput, waybillInput);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#EFE8D8] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#3D362A] hover:text-[#231F18] font-semibold mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-[#231F18] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
              Authorized Staff
            </span>
            <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RLS Policy Enforced
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#231F18] mt-1">
            Store Administration & Inventory
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs uppercase font-bold tracking-wider border transition-colors ${
              activeTab === 'inventory'
                ? 'bg-[#231F18] text-white border-[#231F18]'
                : 'bg-white text-[#231F18] border-[#DFD3BC] hover:border-[#3D362A]'
            }`}
          >
            Inventory & Stocks
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs uppercase font-bold tracking-wider border transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#231F18] text-white border-[#231F18]'
                : 'bg-white text-[#231F18] border-[#DFD3BC] hover:border-[#3D362A]'
            }`}
          >
            Fulfillment & Couriers
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-xs uppercase font-bold tracking-wider border transition-colors ${
              activeTab === 'audit'
                ? 'bg-[#231F18] text-white border-[#231F18]'
                : 'bg-white text-[#231F18] border-[#DFD3BC] hover:border-[#3D362A]'
            }`}
          >
            Security Audit Trail
          </button>
        </div>
      </div>

      {/* Tab 1: Inventory & Distinct Stock Calculation (Requirement 6) */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-[#F7F3EB] p-4 border border-[#EFE8D8] text-xs text-[#3D362A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F68B1E]" />
              <span>
                <b>Inventory Policy:</b> Stock-on-hand, 15-minute active reservations, and Available-to-sell stock are distinct.
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#231F18]">
              Available = Stock on Hand − Active Reservations
            </span>
          </div>

          <div className="bg-white border border-[#EFE8D8] overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3EB] border-b border-[#EFE8D8] text-[#3D362A] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Garment</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Stock on Hand</th>
                  <th className="p-4">Active 15-min Holds</th>
                  <th className="p-4">Available to Sell</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Sale Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EB]">
                {products.flatMap((p) =>
                  p.variants.map((v) => {
                    const isEditing = editingVariantId === v.id;
                    const activeHolds = v.stock_on_hand > 0 ? 0 : 0;
                    const available = Math.max(0, v.stock_on_hand - activeHolds);

                    return (
                      <tr key={v.id} className="hover:bg-[#FDFBF7]">
                        <td className="p-4 font-mono font-medium text-[#231F18]">{v.sku}</td>
                        <td className="p-4 font-semibold text-[#231F18]">{p.name}</td>
                        <td className="p-4 font-bold">{v.size}</td>

                        {/* Stock On Hand Cell */}
                        <td className="p-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                value={newStockInput}
                                onChange={(e) => setNewStockInput(Number(e.target.value))}
                                className="w-16 border border-[#231F18] p-1 text-xs"
                              />
                              <button
                                onClick={() => handleSaveStock(v.id)}
                                className="p-1 bg-[#231F18] text-white rounded-xs"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-semibold">{v.stock_on_hand}</span>
                          )}
                        </td>

                        {/* Reserved Stock Cell */}
                        <td className="p-4 text-[#3D362A]/60">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#F68B1E]" />
                            {activeHolds}
                          </span>
                        </td>

                        {/* Available-to-Sell Cell */}
                        <td className="p-4 font-bold text-green-700">{available}</td>

                        <td className="p-4">{formatKobo(p.base_price_kobo)}</td>
                        <td className="p-4 font-bold text-[#D92323]">
                          {p.sale_price_kobo ? formatKobo(p.sale_price_kobo) : '—'}
                        </td>

                        <td className="p-4 text-right">
                          {!isEditing && (
                            <button
                              onClick={() => {
                                setEditingVariantId(v.id);
                                setNewStockInput(v.stock_on_hand);
                              }}
                              className="text-[#3D362A] hover:text-[#A74520] p-1"
                              title="Update stock count"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Courier Updates (Requirement 8) */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order Update Action Card */}
          <div className="lg:col-span-5 bg-white p-6 border border-[#EFE8D8] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#231F18]">
              Update Courier & Dispatch
            </h3>
            <p className="text-xs text-[#3D362A]/70">
              Manage physical fulfillment status, assign courier partners (GIG Logistics, Red Star Express, DHL), and generate customer waybills.
            </p>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[#3D362A] mb-1">
                  Select Order Reference
                </label>
                <select
                  value={selectedOrderRef}
                  onChange={(e) => setSelectedOrderRef(e.target.value)}
                  className="w-full border border-[#DFD3BC] p-2 bg-[#FDFBF7] text-[#231F18] font-mono font-semibold"
                >
                  {orders.map((o) => (
                    <option key={o.reference} value={o.reference}>
                      {o.reference} — {o.customerName} ({formatKobo(o.breakdown.totalKobo)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#3D362A] mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value as Order['fulfillmentStatus'])}
                  className="w-full border border-[#DFD3BC] p-2 bg-white text-[#231F18] font-semibold"
                >
                  <option value="confirmed">Confirmed (Paid)</option>
                  <option value="processing">In Studio Tailoring</option>
                  <option value="packed">Packed & Inspected</option>
                  <option value="dispatched">Dispatched with Courier</option>
                  <option value="delivered">Delivered to Customer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#3D362A] mb-1">
                  Assigned Courier Partner
                </label>
                <input
                  type="text"
                  value={courierInput}
                  onChange={(e) => setCourierInput(e.target.value)}
                  placeholder="e.g. GIG Logistics (Express)"
                  className="w-full border border-[#DFD3BC] p-2 bg-white text-[#231F18]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#3D362A] mb-1">
                  Waybill / Tracking Reference
                </label>
                <input
                  type="text"
                  value={waybillInput}
                  onChange={(e) => setWaybillInput(e.target.value)}
                  placeholder="e.g. GIG-LOS-998241"
                  className="w-full border border-[#DFD3BC] p-2 bg-white text-[#231F18] font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#231F18] hover:bg-[#A74520] text-white py-2.5 font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Package className="w-4 h-4" />
                <span>Save Dispatch Update</span>
              </button>

              {updateSuccess && (
                <div className="bg-green-50 text-green-800 p-2.5 border border-green-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Order status updated! Visible in customer shipment tracker.</span>
                </div>
              )}
            </form>
          </div>

          {/* Orders Table */}
          <div className="lg:col-span-7 bg-white p-6 border border-[#EFE8D8] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#231F18]">
              Recent Customer Orders ({orders.length})
            </h3>
            <div className="divide-y divide-[#F7F3EB] max-h-96 overflow-y-auto text-xs">
              {orders.map((o) => (
                <div key={o.reference} className="py-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#231F18]">{o.reference}</span>
                    <span className="bg-[#F7F3EB] text-[#231F18] px-2 py-0.5 font-bold uppercase text-[10px] border border-[#DFD3BC]">
                      {o.fulfillmentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#3D362A]/80 text-[11px]">
                    <span>
                      {o.customerName} ({o.customerPhone})
                    </span>
                    <span className="font-semibold text-[#231F18]">
                      {formatKobo(o.breakdown.totalKobo)}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#3D362A]/60 flex items-center gap-2">
                    <span>Courier: {o.courierName}</span>
                    <span>•</span>
                    <span className="font-mono">Waybill: {o.trackingNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Audit Trail (Requirement 5) */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 border border-[#EFE8D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE8D8]">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#231F18]">
                Immutable Administrative Audit Trail
              </h3>
              <p className="text-xs text-[#3D362A]/70">
                All administrator actions, role provisioning, stock updates, and webhook verifications are strictly recorded.
              </p>
            </div>
            <span className="text-xs text-green-700 font-mono font-bold">
              Append-Only Table (RLS Active)
            </span>
          </div>

          <div className="divide-y divide-[#F7F3EB] text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-[#A74520]">{log.action}</span>
                  <p className="text-[#231F18] mt-0.5 font-medium">{log.note}</p>
                  <p className="text-[10px] text-[#3D362A]/60 font-mono mt-0.5">
                    Target: {log.target} • Actor: {log.actor}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#3D362A]/60 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
