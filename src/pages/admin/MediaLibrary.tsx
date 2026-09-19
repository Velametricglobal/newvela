import React, { useEffect, useState } from 'react';
import { MediaAsset } from '../../types/database.types';
import { mediaService } from '../../services/mediaService';
import { Image as ImageIcon, Upload, Copy, Trash2, Search, Check } from 'lucide-react';

export const MediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const data = await mediaService.getAssets();
    setAssets(data);
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateUpload = async () => {
    await mediaService.addAsset({
      file_name: `uploaded_asset_${Date.now()}.png`,
      file_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      mime_type: 'image/png',
      folder_name: 'Uploads'
    });
    fetchAssets();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Media Library & Supabase Storage</h2>
          <p className="text-slate-400 text-xs mt-1">Manage 3D models (.glb), high-res images, corporate PDFs, and videos.</p>
        </div>
        <button
          onClick={handleSimulateUpload}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" /> Upload Asset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group p-3 space-y-3">
            <div className="h-36 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center relative">
              {asset.mime_type && asset.mime_type.includes('image') ? (
                <img src={asset.file_url || asset.url || ''} alt={asset.file_name || asset.filename || 'asset'} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-brand-400" />
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-white truncate">{asset.file_name || asset.filename || 'Asset'}</div>
              <div className="text-[10px] text-slate-400">{asset.folder_name || 'General'} • {((asset.file_size || asset.size_bytes || 0) / 1024).toFixed(0)} KB</div>
            </div>
            <button
              onClick={() => handleCopyUrl(asset.id, asset.file_url || asset.url || '')}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1"
            >
              {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === asset.id ? 'Copied URL' : 'Copy Storage URL'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
