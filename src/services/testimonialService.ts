import { Testimonial } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TESTIMONIALS_STORAGE_KEY = 'VELAMETRIC_TESTIMONIALS_STORE';

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-1',
    client_name: 'Vikram Malhotra',
    company_name: 'Apex Group',
    designation: 'Managing Director',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    service_name: 'Government Subsidy Loans Consultancy',
    type: 'TEXT',
    rating: 5,
    quote: 'Velametric guided our project finance DPR preparation and secured a 25% capital subsidy refund directly into our company bank account.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 1,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'testi-2',
    client_name: 'Ananya Sharma',
    company_name: 'Elevate Digital Labs',
    designation: 'Head of Marketing',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    service_name: 'Digital Marketing & Reels',
    type: 'VIDEO',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    rating: 5,
    quote: 'Our Instagram reel strategy produced over 2.4 million organic impressions and generated 400+ qualified leads in the first month.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 2,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'testi-3',
    client_name: 'Rajesh Nair',
    company_name: 'Horizon Logistics',
    designation: 'CEO',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    service_name: 'Website & App Development',
    type: 'TEXT',
    rating: 5,
    quote: 'The Next.js web application built by Velametric with real-time CRM pipeline sync transformed our entire sales operation.',
    is_featured: true,
    status: 'PUBLISHED',
    sort_order: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const testimonialService = {
  async getTestimonials(): Promise<Testimonial[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((t: any) => ({
            id: t.id,
            client_name: t.client_name,
            company_name: t.company || t.client_company || 'Client Organization',
            designation: t.client_role || t.client_designation || 'Executive',
            avatar_url: t.avatar_url || t.client_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            service_name: 'Strategic Advisory & Technology',
            type: t.video_url ? 'VIDEO' : 'TEXT',
            video_url: t.video_url || '',
            rating: Number(t.rating) || 5,
            quote: t.content || t.testimonial || '',
            is_featured: t.is_featured ?? true,
            status: t.is_published !== false ? 'PUBLISHED' : 'DRAFT',
            sort_order: t.sort_order || t.display_order || 1,
            created_at: t.created_at || new Date().toISOString()
          }));
        }
      } catch (e) {
        console.warn('Supabase testimonials query failed, falling back to local:', e);
      }
    }

    const saved = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [...INITIAL_TESTIMONIALS];
  },

  async getTestimonialById(id: string): Promise<Testimonial | null> {
    const list = await this.getTestimonials();
    const found = list.find(t => t.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async saveTestimonial(testimonialData: Partial<Testimonial>): Promise<Testimonial> {
    const list = await this.getTestimonials();
    let updated: Testimonial;

    if (testimonialData.id) {
      const idx = list.findIndex(t => t.id === testimonialData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...testimonialData } as Testimonial;
        updated = list[idx];
      } else {
        updated = testimonialData as Testimonial;
        list.push(updated);
      }
    } else {
      updated = {
        id: `testi-${Date.now()}`,
        client_name: testimonialData.client_name || 'Anonymous Client',
        company_name: testimonialData.company_name || 'Velametric Client',
        designation: testimonialData.designation || 'Business Executive',
        avatar_url: testimonialData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        service_name: testimonialData.service_name || 'Website Development',
        type: testimonialData.type || 'TEXT',
        video_url: testimonialData.video_url || '',
        rating: testimonialData.rating || 5,
        quote: testimonialData.quote || '',
        is_featured: testimonialData.is_featured ?? true,
        status: testimonialData.status || 'PUBLISHED',
        sort_order: list.length + 1,
        created_at: new Date().toISOString(),
        ...testimonialData
      } as Testimonial;
      list.unshift(updated);
    }

    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(list));

    if (isSupabaseConfigured()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updated.id);
        await supabase.from('testimonials').upsert({
          ...(isUuid ? { id: updated.id } : {}),
          client_name: updated.client_name,
          client_role: updated.designation,
          company: updated.company_name,
          content: updated.quote,
          rating: updated.rating,
          is_featured: updated.is_featured,
          is_published: updated.status === 'PUBLISHED',
          video_url: updated.video_url || null,
          avatar_url: updated.avatar_url || null
        });
      } catch (err) {
        console.warn('Supabase testimonial upsert error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_testimonials_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return JSON.parse(JSON.stringify(updated));
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    let list = await this.getTestimonials();
    list = list.filter(t => t.id !== id);
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(list));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase testimonial delete error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('velametric_testimonials_updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return true;
  }
};
