import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings, NavigationItem, BackgroundMusicSettings, BackgroundMusicTrack } from '../../types/database.types';
import { settingsService } from '../../services/settingsService';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { Settings, Save, CheckCircle2, Music, Play, Pause, Volume2, Plus, Trash2, Sliders, Coins, UserCheck, ArrowRight } from 'lucide-react';

export const SiteSettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [music, setMusic] = useState<BackgroundMusicSettings | null>(null);
  const [tracks, setTracks] = useState<BackgroundMusicTrack[]>([]);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'currency' | 'music'>('general');

  // Admin Audio Preview Player State
  const [adminPreviewPlaying, setAdminPreviewPlaying] = useState(false);
  const adminAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    settingsService.getSiteSettings().then(s => {
      setSettings(s);
      setMusic(s.background_music || null);
    });
    settingsService.getMusicTracks().then(setTracks);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    if (music) {
      settings.background_music = music;
      await settingsService.updateMusicSettings(music);
    }
    await settingsService.updateSiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggleAdminPreview = () => {
    if (!adminAudioRef.current) return;
    if (adminPreviewPlaying) {
      adminAudioRef.current.pause();
      setAdminPreviewPlaying(false);
    } else {
      adminAudioRef.current.volume = (music?.default_volume || 20) / 100;
      adminAudioRef.current.play();
      setAdminPreviewPlaying(true);
    }
  };

  const handleActivateTrack = async (tr: BackgroundMusicTrack) => {
    const updatedTrack = await settingsService.saveMusicTrack({ ...tr, active: true });
    const updatedTracks = await settingsService.getMusicTracks();
    setTracks(updatedTracks);
    if (music) {
      const newMusic: BackgroundMusicSettings = {
        ...music,
        audio_url: updatedTrack.file_url,
        track_title: updatedTrack.title,
        artist_name: updatedTrack.artist
      };
      setMusic(newMusic);
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900 border border-zinc-800 p-6 rounded-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Website Settings & Software Configuration</h2>
          <p className="text-zinc-400 text-xs mt-1">Configure company identity, global currency (Rupee, Dollar, Euro, Pound, Dirham), contact info, and background music.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-zinc-200 transition-all shadow-xl"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'general' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          General & Metadata
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'currency' ? 'bg-amber-500 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
        >
          <Coins className="w-3.5 h-3.5" /> Software Currency Settings
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'music' ? 'bg-amber-400 text-black font-extrabold' : 'text-zinc-400 hover:text-white'}`}
        >
          <Music className="w-3.5 h-3.5" /> Background Music Studio
        </button>
        <Link
          to="/admin/delegation"
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-zinc-300 hover:text-white bg-zinc-950 border border-zinc-800 hover:border-zinc-700 ml-auto"
        >
          <UserCheck className="w-3.5 h-3.5 text-brand-400" />
          <span>Task & Lead Assignment Console</span>
          <ArrowRight className="w-3 h-3 text-zinc-500" />
        </Link>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === 'general' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Company Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.contact_whatsapp}
                onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold text-xs mb-1">Physical Address</label>
            <input
              type="text"
              value={settings.contact_address}
              onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white"
            />
          </div>
        </div>
      )}

      {/* TAB 2: CURRENCY SETTINGS */}
      {activeTab === 'currency' && (
        <CurrencySelector compact={false} />
      )}

      {/* TAB 3: BACKGROUND MUSIC STUDIO */}
      {activeTab === 'music' && music && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-400" /> Background Audio Engine
                </h3>
                <p className="text-zinc-400 text-xs mt-1">Configure subtle background music player across all public website pages.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={music.enabled}
                  onChange={(e) => setMusic({ ...music, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                <span className="ml-3 text-xs font-bold text-white">{music.enabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Active Track Title</label>
                <input
                  type="text"
                  value={music.track_title}
                  onChange={(e) => setMusic({ ...music, track_title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Artist Name</label>
                <input
                  type="text"
                  value={music.artist_name || ''}
                  onChange={(e) => setMusic({ ...music, artist_name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <label className="text-zinc-300 font-semibold">Default Volume ({music.default_volume}%)</label>
                <Volume2 className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={music.default_volume}
                onChange={(e) => setMusic({ ...music, default_volume: parseInt(e.target.value) })}
                className="w-full h-2 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export const NavigationAdmin: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200">
      <h2 className="text-xl font-bold text-white">Header & Navigation Management</h2>
      <p className="text-xs text-slate-400 mt-1">Configure main menu links, dropdown structures, and footer navigation.</p>
    </div>
  );
};
