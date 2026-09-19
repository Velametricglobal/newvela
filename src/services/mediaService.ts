import { MediaAsset } from '../types/database.types';

let localMediaAssets: MediaAsset[] = [
  {
    id: 'med-1',
    file_name: 'hero_geometric_core.glb',
    file_url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    storage_path: '3d-models/hero_geometric_core.glb',
    mime_type: 'model/gltf-binary',
    file_size: 4850000,
    folder_name: '3D Models',
    caption: 'Hero 3D Abstract Geometric Scene',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'med-2',
    file_name: 'web_app_architecture.jpg',
    file_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'portfolio/web_app_architecture.jpg',
    mime_type: 'image/jpeg',
    file_size: 1420000,
    dimensions: '1920x1080',
    folder_name: 'Portfolio',
    alt_text: 'Web Application Development Dashboard',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'med-3',
    file_name: 'fintech_analytics.jpg',
    file_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'portfolio/fintech_analytics.jpg',
    mime_type: 'image/jpeg',
    file_size: 1850000,
    dimensions: '1920x1080',
    folder_name: 'Portfolio',
    alt_text: 'Apex FinTech Wealth Management Dashboard',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: 'med-4',
    file_name: 'luxury_villa_3d.jpg',
    file_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'portfolio/luxury_villa_3d.jpg',
    mime_type: 'image/jpeg',
    file_size: 2100000,
    dimensions: '1920x1080',
    folder_name: 'Portfolio',
    alt_text: 'Aura Luxury Real Estate Rendering',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const mediaService = {
  async getAssets(): Promise<MediaAsset[]> {
    return [...localMediaAssets];
  },

  async addAsset(asset: Partial<MediaAsset>): Promise<MediaAsset> {
    const newAsset: MediaAsset = {
      id: `med-${Date.now()}`,
      file_name: asset.file_name || 'uploaded_file.png',
      file_url: asset.file_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      storage_path: asset.storage_path || `uploads/${asset.file_name}`,
      mime_type: asset.mime_type || 'image/jpeg',
      file_size: asset.file_size || 1024000,
      folder_name: asset.folder_name || 'Images',
      alt_text: asset.alt_text || 'Uploaded Media',
      created_at: new Date().toISOString()
    };
    localMediaAssets.unshift(newAsset);
    return JSON.parse(JSON.stringify(newAsset));
  },

  async deleteAsset(id: string): Promise<boolean> {
    localMediaAssets = localMediaAssets.filter(m => m.id !== id);
    return true;
  }
};
