import { SiteSettings, ThemeSettings, BackgroundMusicSettings, BackgroundMusicTrack } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SETTINGS_STORAGE_KEY = 'VELAMETRIC_SITE_SETTINGS';
const THEME_STORAGE_KEY = 'VELAMETRIC_THEME_SETTINGS';

let localMusicSettings: BackgroundMusicSettings = {
  enabled: true,
  source_type: 'url',
  audio_url: 'https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3',
  track_title: 'Corporate Ambient Space Soundscape',
  artist_name: 'Velametric Sound Studio',
  default_volume: 20, // 20% conservative default volume
  loop: true,
  autoplay: true,
  start_delay: 0,
  fade_in_enabled: true,
  fade_in_duration: 2, // 2 seconds fade in
  fade_out_enabled: true,
  fade_out_duration: 0.5, // 500ms fade out
  remember_user_preference: true
};

let localMusicTracks: BackgroundMusicTrack[] = [
  {
    id: 'track-1',
    title: 'Corporate Ambient Space Soundscape',
    artist: 'Velametric Sound Studio',
    file_url: 'https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3',
    source_type: 'url',
    duration: '2:45',
    default_volume: 20,
    loop: true,
    autoplay: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'track-2',
    title: 'Tech House Ambient Chill',
    artist: 'Mixkit Studio',
    file_url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
    source_type: 'url',
    duration: '3:10',
    default_volume: 20,
    loop: true,
    autoplay: true,
    active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let localSiteSettings: SiteSettings = {
  company_name: 'Velametric Global',
  description: 'Everything to build your website, run your CRM, manage financial loan advisory, and produce high-impact video reels.',
  contact_email: 'hello@velametric.com',
  contact_phone: '+1 (800) 555-VELA',
  contact_whatsapp: '+1 (800) 555-8352',
  contact_address: 'Dehradun Headquarters & Joshiyara, Uttarkashi Regional Office',
  google_maps_url: 'https://maps.google.com',
  social_links: {
    instagram: 'https://www.instagram.com/destiny_in_productions/?hl=en',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com'
  },
  analytics_ids: {
    google_analytics: 'G-VELAMETRIC2026'
  },
  background_music: localMusicSettings
};

let localThemeSettings: ThemeSettings = {
  colors: {
    primary: '#09090b',
    secondary: '#18181b',
    accent: '#f59e0b',
    background: '#09090b',
    surface: '#18181b',
    text: '#f4f4f5',
    muted: '#a1a1aa',
    border: '#27272a'
  },
  typography: {
    headingFont: 'Outfit, sans-serif',
    bodyFont: 'Inter, sans-serif',
    fontSizeBase: '16px',
    fontWeightHeading: '800'
  },
  buttons: {
    radius: '9999px',
    padding: '14px 28px',
    style: 'solid',
    hoverEffect: 'scale'
  },
  cards: {
    radius: '24px',
    shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #27272a',
    hoverAnimation: 'lift'
  },
  layout: {
    maxWidth: '1360px',
    sectionSpacing: '96px',
    containerWidth: '1280px'
  }
};

export const settingsService = {
  async getSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('website_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const social = typeof data.social_links === 'object' && data.social_links !== null ? data.social_links : {};
          return {
            company_name: data.site_name || 'Velametric Global',
            logo_url: data.logo_url || undefined,
            favicon_url: data.favicon_url || undefined,
            description: data.tagline || localSiteSettings.description,
            contact_email: data.contact_email || localSiteSettings.contact_email,
            contact_phone: data.contact_phone || localSiteSettings.contact_phone,
            contact_whatsapp: localSiteSettings.contact_whatsapp,
            contact_address: data.address || localSiteSettings.contact_address,
            google_maps_url: localSiteSettings.google_maps_url,
            social_links: {
              ...localSiteSettings.social_links,
              ...social
            },
            analytics_ids: localSiteSettings.analytics_ids,
            header_scripts: localSiteSettings.header_scripts,
            footer_scripts: localSiteSettings.footer_scripts,
            background_music: localMusicSettings
          };
        }
      } catch (e) {
        console.warn('Supabase website_settings query failed, falling back:', e);
      }
    }

    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return JSON.parse(JSON.stringify(localSiteSettings));
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    localSiteSettings = { ...localSiteSettings, ...settings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(localSiteSettings));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('website_settings').upsert({
          site_name: localSiteSettings.company_name,
          tagline: localSiteSettings.description,
          contact_email: localSiteSettings.contact_email,
          contact_phone: localSiteSettings.contact_phone,
          address: localSiteSettings.contact_address,
          social_links: localSiteSettings.social_links
        });
      } catch (err) {
        console.warn('Supabase website_settings upsert error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_settings_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return JSON.parse(JSON.stringify(localSiteSettings));
  },

  async getThemeSettings(): Promise<ThemeSettings> {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return JSON.parse(JSON.stringify(localThemeSettings));
  },

  async updateThemeSettings(theme: ThemeSettings): Promise<ThemeSettings> {
    localThemeSettings = JSON.parse(JSON.stringify(theme));
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(localThemeSettings));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_settings_updated'));
      window.dispatchEvent(new Event('storage'));
    }
    return JSON.parse(JSON.stringify(localThemeSettings));
  },

  async getMusicSettings(): Promise<BackgroundMusicSettings> {
    return JSON.parse(JSON.stringify(localMusicSettings));
  },

  async updateMusicSettings(music: Partial<BackgroundMusicSettings>): Promise<BackgroundMusicSettings> {
    localMusicSettings = { ...localMusicSettings, ...music };
    localSiteSettings.background_music = localMusicSettings;
    return JSON.parse(JSON.stringify(localMusicSettings));
  },

  async getMusicTracks(): Promise<BackgroundMusicTrack[]> {
    return JSON.parse(JSON.stringify(localMusicTracks));
  },

  async saveMusicTrack(trackData: Partial<BackgroundMusicTrack>): Promise<BackgroundMusicTrack> {
    if (trackData.active) {
      localMusicTracks.forEach(t => (t.active = false));
    }

    const newTrack: BackgroundMusicTrack = {
      id: trackData.id || `track-${Date.now()}`,
      title: trackData.title || 'Untitled Track',
      artist: trackData.artist || 'Unknown Artist',
      file_url: trackData.file_url || '',
      source_type: trackData.source_type || 'url',
      duration: trackData.duration || '2:30',
      default_volume: trackData.default_volume || 20,
      loop: trackData.loop ?? true,
      autoplay: trackData.autoplay ?? true,
      active: trackData.active ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const existingIdx = localMusicTracks.findIndex(t => t.id === newTrack.id);
    if (existingIdx !== -1) {
      localMusicTracks[existingIdx] = newTrack;
    } else {
      localMusicTracks.push(newTrack);
    }

    if (newTrack.active) {
      localMusicSettings.audio_url = newTrack.file_url;
      localMusicSettings.track_title = newTrack.title;
      localMusicSettings.artist_name = newTrack.artist;
      localSiteSettings.background_music = localMusicSettings;
    }

    return JSON.parse(JSON.stringify(newTrack));
  },

  async deleteMusicTrack(trackId: string): Promise<void> {
    localMusicTracks = localMusicTracks.filter(t => t.id !== trackId);
  }
};
