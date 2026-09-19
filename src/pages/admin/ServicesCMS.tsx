import React, { useEffect, useState } from 'react';
import { Service, ServicePackage, PriceAuditRecord, PriceDisplayType, GstConfigType } from '../../types/database.types';
import { serviceService } from '../../services/serviceService';
import { useCurrency } from '../../context/CurrencyContext';
import { Laptop, Plus, Edit3, Trash2, CheckCircle2, History, Tag, Layers, DollarSign, ShieldCheck, Sparkles, X, Save, AlertCircle } from 'lucide-react';

export const ServicesCMS: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [services, setServices] = useState<Service[]>([]);
  const [auditLogs, setAuditLogs] = useState<PriceAuditRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'AUDIT'>('SERVICES');
  
  // Service & Package Editor Modal State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activePkgTab, setActivePkgTab] = useState<number>(0);

  useEffect(() => {
    fetchServices();
    fetchAuditLogs();
  }, []);

  const fetchServices = async () => {
    const data = await serviceService.getServices();
    setServices(data);
  };

  const fetchAuditLogs = async () => {
    const logs = await serviceService.getPriceAuditLogs();
    setAuditLogs(logs);
  };

  const handleSaveService = async () => {
    if (!editingService?.name) return;
    await serviceService.saveService(editingService, 'Super Admin');
    setEditingService(null);
    fetchServices();
    fetchAuditLogs();
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service and all its packages?')) {
      await serviceService.deleteService(id);
      fetchServices();
      fetchAuditLogs();
    }
  };

  const handleAddNewService = () => {
    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      category_name: 'Website & App Development',
      name: 'New Custom Offering',
      slug: `custom-offering-${Date.now()}`,
      short_description: 'Customized business solution with 3-tier package system.',
      full_description: 'Comprehensive service overview and technical inclusions.',
      icon: 'Laptop',
      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      is_featured: true,
      status: 'PUBLISHED',
      sort_order: services.length + 1,
      packages: [
        {
          id: `pkg-st-${Date.now()}`,
          service_id: `srv-${Date.now()}`,
          tier: 'STARTUP',
          name: 'Startup Package',
          price: 19999,
          price_display_type: 'STARTING_FROM',
          currency: 'INR',
          target_audience: 'Best for: Startups & Small Businesses',
          inclusions: ['Essential Scope Inclusions'],
          exclusions: ['Third-party costs extra'],
          gst_setting: 'EXCLUSIVE',
          cta_text: 'Get Started',
          status: 'PUBLISHED',
          sort_order: 1
        },
        {
          id: `pkg-ent-${Date.now()}`,
          service_id: `srv-${Date.now()}`,
          tier: 'ENTERPRISE',
          name: 'Enterprise Package',
          price: 49999,
          price_display_type: 'STARTING_FROM',
          currency: 'INR',
          target_audience: 'Best for: Growing Companies',
          badge: 'Most Popular',
          inclusions: ['Advanced Scope Inclusions'],
          exclusions: ['Third-party costs extra'],
          gst_setting: 'EXCLUSIVE',
          cta_text: 'Get Started',
          status: 'PUBLISHED',
          sort_order: 2
        },
        {
          id: `pkg-org-${Date.now()}`,
          service_id: `srv-${Date.now()}`,
          tier: 'ORGANIZATION',
          name: 'Organization Package',
          price: 0,
          price_display_type: 'CUSTOM_QUOTE',
          currency: 'INR',
          target_audience: 'Designed for: Large Organizations',
          inclusions: ['Enterprise Architecture & SLA'],
          exclusions: ['Quotation based on requirements'],
          gst_setting: 'AS_PER_LAW',
          cta_text: 'Request a Quotation',
          status: 'PUBLISHED',
          sort_order: 3
        }
      ]
    };
    setEditingService(newSrv);
  };

  return (
    <div className="space-y-6">
      {/* CMS Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] uppercase tracking-wider font-bold">
            <Layers className="w-3.5 h-3.5" /> OUR PRODUCTS & SERVICES — PACKAGE MANAGEMENT
          </div>
          <h2 className="text-xl font-bold text-white mt-1 font-display">Products, Services & Package CMS</h2>
          <p className="text-slate-400 text-xs mt-1">Manage Startup, Enterprise, and Organization pricing, inclusions, exclusions, and GST display.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('SERVICES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${activeTab === 'SERVICES' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${activeTab === 'AUDIT' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              <History className="w-3.5 h-3.5" /> Price Audit History
            </button>
          </div>

          {activeTab === 'SERVICES' && (
            <button
              onClick={handleAddNewService}
              className="flex-1 md:flex-none justify-center px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          )}
        </div>
      </div>

      {activeTab === 'SERVICES' ? (
        /* Services & Packages Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono">
                    {srv.category_name || 'Service'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingService(JSON.parse(JSON.stringify(srv)))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-black text-slate-300 transition-all"
                      title="Edit Service & Packages"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 transition-all"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-3 font-display">{srv.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{srv.short_description}</p>

                {/* Package Tiers Summary Badges */}
                {srv.packages && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Active Packages:</div>
                    <div className="space-y-1.5">
                      {srv.packages.map((pkg) => (
                        <div key={pkg.id} className="flex justify-between items-center text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                          <span className="text-slate-300 font-semibold">{pkg.name} ({pkg.tier})</span>
                          <span className="font-bold text-amber-400 font-mono">
                            {pkg.price_display_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : formatAmount(pkg.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3 flex justify-between items-center font-mono">
                <span>Slug: /{srv.slug}</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {srv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Price Audit History Logs */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-display">Price & Package Modification Audit Log</h3>
          <p className="text-xs text-slate-400">Chronological history of price changes, package tier updates, and pricing modifications.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Service Name</th>
                  <th className="p-3">Package Name</th>
                  <th className="p-3">Previous Price</th>
                  <th className="p-3">New Price</th>
                  <th className="p-3">Changed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 font-mono">
                    <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-bold text-white">{log.service_name}</td>
                    <td className="p-3 text-amber-400">{log.package_name}</td>
                    <td className="p-3 text-rose-400 line-through">{log.old_price_display}</td>
                    <td className="p-3 text-emerald-400 font-bold">{log.new_price_display}</td>
                    <td className="p-3 text-slate-300">{log.changed_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Service & Package Tier Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">SERVICE & PACKAGE BUILDER</span>
                <h3 className="text-xl font-bold text-white font-display">Edit Service & Package Tiers</h3>
              </div>
              <button onClick={() => setEditingService(null)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Service Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Service Title *</label>
                  <input
                    type="text"
                    value={editingService.name || ''}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={editingService.category_name || ''}
                    onChange={(e) => setEditingService({ ...editingService, category_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingService.short_description || ''}
                  onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Important Service Disclaimer</label>
                <input
                  type="text"
                  placeholder="e.g. Financial services are subject to eligibility and lender policies."
                  value={editingService.disclaimer || ''}
                  onChange={(e) => setEditingService({ ...editingService, disclaimer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Package Tiers Manager Tabs */}
            {editingService.packages && editingService.packages.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs font-bold text-amber-400 uppercase font-mono">Package Tiers Editor:</div>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar max-w-full">
                    {editingService.packages.map((pkg, idx) => (
                      <button
                        key={pkg.id}
                        onClick={() => setActivePkgTab(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap ${activePkgTab === idx ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
                      >
                        {pkg.tier} ({pkg.name})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Package Editor Form */}
                {editingService.packages[activePkgTab] && (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Package Name</label>
                        <input
                          type="text"
                          value={editingService.packages[activePkgTab].name}
                          onChange={(e) => {
                            const pkgs = [...editingService.packages!];
                            pkgs[activePkgTab].name = e.target.value;
                            setEditingService({ ...editingService, packages: pkgs });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Package Price (₹ INR)</label>
                        <input
                          type="number"
                          value={editingService.packages[activePkgTab].price}
                          onChange={(e) => {
                            const pkgs = [...editingService.packages!];
                            pkgs[activePkgTab].price = parseFloat(e.target.value) || 0;
                            setEditingService({ ...editingService, packages: pkgs });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Price Display Model</label>
                        <select
                          value={editingService.packages[activePkgTab].price_display_type}
                          onChange={(e) => {
                            const pkgs = [...editingService.packages!];
                            pkgs[activePkgTab].price_display_type = e.target.value as PriceDisplayType;
                            setEditingService({ ...editingService, packages: pkgs });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                        >
                          <option value="STARTING_FROM">Starting From</option>
                          <option value="FIXED">Fixed Price</option>
                          <option value="PER_MONTH">Per Month</option>
                          <option value="PER_PROJECT">Per Project</option>
                          <option value="PER_CASE">Per Case</option>
                          <option value="CUSTOM_QUOTE">Custom Quote (Contact Us)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Target Audience Subtitle</label>
                        <input
                          type="text"
                          value={editingService.packages[activePkgTab].target_audience}
                          onChange={(e) => {
                            const pkgs = [...editingService.packages!];
                            pkgs[activePkgTab].target_audience = e.target.value;
                            setEditingService({ ...editingService, packages: pkgs });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Badge Highlight (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Most Popular, Best Value"
                          value={editingService.packages[activePkgTab].badge || ''}
                          onChange={(e) => {
                            const pkgs = [...editingService.packages!];
                            pkgs[activePkgTab].badge = e.target.value;
                            setEditingService({ ...editingService, packages: pkgs });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    {/* Inclusions & Exclusions Textareas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-emerald-400 mb-1 font-semibold">Inclusions (One per line)</label>
                        <textarea
                          rows={4}
                          value={editingService.packages[activePkgTab].inclusions.join('\n')}
                          onChange={(e) => {
                            const pkgs = [...editingService.packages!];
                            pkgs[activePkgTab].inclusions = e.target.value.split('\n').filter(Boolean);
                            setEditingService({ ...editingService, packages: pkgs });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] leading-relaxed resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-rose-400 mb-1 font-semibold">Exclusions (One per line)</label>
                        <textarea
                          rows={4}
                          value={editingService.packages[activePkgTab].exclusions?.join('\n') || ''}
                          onChange={(e) => {
                            const pkgs = [...editingService.packages!];
                            pkgs[activePkgTab].exclusions = e.target.value.split('\n').filter(Boolean);
                            setEditingService({ ...editingService, packages: pkgs });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] leading-relaxed resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setEditingService(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-xl"
              >
                <Save className="w-4 h-4" /> Save Service & Publish Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
