import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Video, Film, Instagram, Youtube, Sparkles, Award, Star,
  CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Eye, Heart,
  Share2, Download, Printer, Edit3, Plus, Trash2, X, Play, Pause,
  Volume2, VolumeX, ExternalLink, Sliders, Smartphone, Monitor,
  Layers, User, Phone, Mail, MapPin, Ruler, Flame, Activity,
  ShieldCheck, Copy, Check, MessageSquare, Briefcase, Zap, Info
} from 'lucide-react';

// ============================================================================
// DATA INTERFACES FOR MODEL & INFLUENCER WORK SHOWCASE
// ============================================================================

export type PortfolioTemplateId = 
  | 'editorial_model' 
  | 'viral_influencer' 
  | 'commercial_lifestyle' 
  | 'fitness_creator';

export interface PictureItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  caption?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  views?: string;
  format: '9:16' | '16:9';
  description?: string;
}

export interface PackageItem {
  id: string;
  title: string;
  price: string;
  deliverables: string[];
  popular?: boolean;
}

export interface CreatorProfileData {
  templateId: PortfolioTemplateId;
  name: string;
  stageName?: string;
  handle: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  experienceYears: string;
  agency?: string;
  verified: boolean;
  avatarUrl: string;
  coverBannerUrl: string;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  // Model Comp-Card Specs
  modelSpecs: {
    height: string;
    bustChest: string;
    waist: string;
    hips: string;
    shoeSize: string;
    eyeColor: string;
    hairColor: string;
    dressSize: string;
  };
  // Influencer Metrics
  influencerStats: {
    followersTotal: string;
    monthlyImpressions: string;
    avgReelViews: string;
    engagementRate: string;
    topDemographic: string;
    topLocations: string[];
  };
  // Brand Collaborations
  brandCollaborations: Array<{
    brandName: string;
    campaignTitle: string;
    year: string;
  }>;
  pictures: PictureItem[];
  videos: VideoItem[];
  packages: PackageItem[];
}

// ============================================================================
// 4 CURATED DEFAULT TEMPLATES WITH PRE-LOADED PRO DATA
// ============================================================================

export const TEMPLATE_PRESETS: Record<PortfolioTemplateId, CreatorProfileData> = {
  // 1. High-Fashion / Editorial Runway Model
  editorial_model: {
    templateId: 'editorial_model',
    name: 'Aria Varma',
    stageName: 'ARIA V.',
    handle: '@aria.varma',
    title: 'High-Fashion & International Runway Model',
    tagline: 'Vogue Featured • Lakmé Fashion Week • Milan & Paris Collections',
    bio: 'Professional haute couture & editorial model represented internationally. Specialized in high-contrast architectural posing, avant-garde runway walks, luxury jewellery campaigns, and cinematic editorial storytelling.',
    location: 'Mumbai & Milan',
    experienceYears: '6+ Years',
    agency: 'Velametric Elite Models Global',
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    contactEmail: 'bookings@ariavarma.com',
    contactPhone: '+91 98200 44123',
    instagramUrl: 'https://www.instagram.com',
    youtubeUrl: 'https://www.youtube.com',
    modelSpecs: {
      height: "5'11\" / 180 cm",
      bustChest: '33" / 84 cm',
      waist: '24" / 61 cm',
      hips: '35" / 89 cm',
      shoeSize: '8.5 US / 39 EU',
      eyeColor: 'Deep Hazel',
      hairColor: 'Natural Obsidian',
      dressSize: '2-4 US / 34-36 EU'
    },
    influencerStats: {
      followersTotal: '280K',
      monthlyImpressions: '1.8M',
      avgReelViews: '95K',
      engagementRate: '5.2%',
      topDemographic: '72% Women (18-34)',
      topLocations: ['Mumbai', 'Milan', 'Paris', 'Dubai']
    },
    brandCollaborations: [
      { brandName: 'VOGUE India', campaignTitle: 'Autumn Haute Couture Cover', year: '2025' },
      { brandName: 'Sabyasachi', campaignTitle: 'Heritage Bridal Cinema Showcase', year: '2024' },
      { brandName: 'Lakmé Fashion Week', campaignTitle: 'Showstopper Grand Finale', year: '2024' },
      { brandName: 'Tanishq Jewellery', campaignTitle: 'Imperial Diamonds TVC', year: '2024' }
    ],
    pictures: [
      {
        id: 'pic-m1',
        title: 'Editorial Silhouette & Architectural Shadow',
        category: 'Haute Editorial',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Shot on Phase One IQ4 150MP for European Fashion Journal.'
      },
      {
        id: 'pic-m2',
        title: 'Monochrome Comp-Card Beauty Portrait',
        category: 'Comp-Card Polaroid',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Natural lighting agency comp-card casting reference.'
      },
      {
        id: 'pic-m3',
        title: 'Parisian Autumn Trench & Street Runway',
        category: 'Runway & Street',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Candid backstage & Paris street movement.'
      },
      {
        id: 'pic-m4',
        title: 'High-Jewellery Solitaire Showcase',
        category: 'Luxury Commercial',
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Macro crop beauty look for international brand campaign.'
      },
      {
        id: 'pic-m5',
        title: 'Avant-Garde Studio Movement',
        category: 'Fine Art Editorial',
        imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'High-speed shutter dynamic silk fabric movement.'
      },
      {
        id: 'pic-m6',
        title: 'Full Body Casting Slate',
        category: 'Comp-Card Polaroid',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Standard agency full-length measurement verify photo.'
      }
    ],
    videos: [
      {
        id: 'vid-m1',
        title: 'Milan Fashion Week — Grand Runway Strut',
        category: 'Runway Reel',
        videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        duration: '0:45',
        views: '142K',
        format: '9:16',
        description: 'Lead opener strut for international luxury designer capsule collection.'
      },
      {
        id: 'vid-m2',
        title: 'Behind The Scenes: Vogue Cover Shoot',
        category: 'BTS & Studio Cinema',
        videoUrl: 'https://dapflix.com/wp-content/uploads/2025/02/33.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        duration: '01:10',
        views: '88K',
        format: '16:9',
        description: 'Cinematic lighting transitions and posing rhythm behind the camera.'
      }
    ],
    packages: [
      {
        id: 'pkg-m1',
        title: 'Runway & Fashion Show Appearance',
        price: '₹1,25,000 / Day',
        deliverables: [
          'Full day fitting & rehearsal attendance',
          'Show opener / closer runway walks',
          'Post-show press conference & photo call',
          '3 Tagged Instagram Story collabs'
        ],
        popular: true
      },
      {
        id: 'pkg-m2',
        title: 'Editorial / Commercial Print Shoot',
        price: '₹85,000 / Shoot',
        deliverables: [
          'Up to 8 hours studio/location shoot',
          'Full commercial digital usage rights (1 Year)',
          'High-res retouched comp-card highlights',
          'Behind-the-scenes collaborative reel'
        ]
      },
      {
        id: 'pkg-m3',
        title: 'Global Brand Ambassador Contract',
        price: 'Custom Quote',
        deliverables: [
          'Exclusive category exclusivity (6 - 12 Months)',
          '4 Commercial TVC / Digital Campaigns',
          'Quarterly runway & PR launch appearances',
          'Dedicated creative storytelling integration'
        ]
      }
    ]
  },

  // 2. Viral Social Creator & Reel Influencer
  viral_influencer: {
    templateId: 'viral_influencer',
    name: 'Kabir & Sanya',
    stageName: 'VELA TRAVELERS',
    handle: '@velatravelers',
    title: 'Cinematic Travel & Luxury Lifestyle Creators',
    tagline: '580K+ Creators • 4.2M Monthly Reach • 4K Drone & Kinetic Storytelling',
    bio: 'Pioneering short-form travel and luxury experiential storytelling across India and Southeast Asia. We transform brand narratives into viral, emotionally resonant 9:16 reels that drive massive bookings and organic conversions.',
    location: 'Dehradun & Goa',
    experienceYears: '5+ Years',
    agency: 'DAPFLIX Creator Collective',
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    contactEmail: 'collaborations@velatravelers.in',
    contactPhone: '+91 97600 88219',
    instagramUrl: 'https://www.instagram.com',
    youtubeUrl: 'https://www.youtube.com',
    modelSpecs: {
      height: "5'10\" & 5'7\"",
      bustChest: 'N/A',
      waist: 'N/A',
      hips: 'N/A',
      shoeSize: '10 US & 7 US',
      eyeColor: 'Dark Amber',
      hairColor: 'Natural Brown',
      dressSize: 'M / S'
    },
    influencerStats: {
      followersTotal: '580K',
      monthlyImpressions: '4.2M',
      avgReelViews: '310K',
      engagementRate: '7.8%',
      topDemographic: '56% Men, 44% Women (20-35)',
      topLocations: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Singapore']
    },
    brandCollaborations: [
      { brandName: 'Taj Hotels & Resorts', campaignTitle: 'Himalayan Luxury Escape Series', year: '2025' },
      { brandName: 'GoPro India', campaignTitle: 'Hero 13 Black 4K Adventure', year: '2024' },
      { brandName: 'Airbnb Global', campaignTitle: 'Unique Stays of Uttarakhand', year: '2024' },
      { brandName: 'Sony Alpha', campaignTitle: 'FX3 Cine Travel Creator Masterclass', year: '2024' }
    ],
    pictures: [
      {
        id: 'pic-v1',
        title: 'Sunset over Kedarkantha Himalayan Ridge',
        category: 'Travel & Drone',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'landscape',
        caption: 'Himalayan golden hour 4K still frame.'
      },
      {
        id: 'pic-v2',
        title: 'Boutique Forest Villa Infinity Pool',
        category: 'Luxury Hospitality',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Hospitality partnership lifestyle shot with 48K organic saves.'
      },
      {
        id: 'pic-v3',
        title: 'Himalayan Cafe Culture & Aesthetic Flatlay',
        category: 'Cafe & Lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'square',
        caption: 'Product placement and coffee lifestyle brand integration.'
      },
      {
        id: 'pic-v4',
        title: 'Adventure 4x4 Off-Roading Mountain Pass',
        category: 'Adventure Brand',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Automotive and outdoor gear campaign visual.'
      }
    ],
    videos: [
      {
        id: 'vid-v1',
        title: 'Ancient Mahasu Temple: 4K Drone & Heritage Reel',
        category: 'Viral Heritage Reel',
        videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        duration: '0:50',
        views: '840K',
        format: '9:16',
        description: 'Viral reel with 52,000 shares exploring secret temples of Jaunsar-Bawar.'
      },
      {
        id: 'vid-v2',
        title: 'Riverside Cafe on the Waves — UKI Showcase',
        category: 'Hospitality Reel',
        videoUrl: 'https://dapflix.com/wp-content/uploads/2025/02/DAPFLIX-FILMS-CAFE-ON-THE-WAVES-UKI.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        duration: '01:15',
        views: '412K',
        format: '9:16',
        description: 'Vibe-driven property walkthrough resulting in 300% booking query surge.'
      }
    ],
    packages: [
      {
        id: 'pkg-v1',
        title: '1 Dedicated Viral Reel + 3 Story Frames',
        price: '₹75,000 / Collab',
        deliverables: [
          'High-production 9:16 4K kinetic reel with sound sync',
          '3 Tagged Instagram stories with direct swipe-up links',
          '30-Day organic boosting rights (Spark ads compatible)',
          'High-res photography package included'
        ],
        popular: true
      },
      {
        id: 'pkg-v2',
        title: 'Full Property / Brand Experiential Campaign',
        price: '₹1,80,000 / 3-Day Shoot',
        deliverables: [
          '3 Cinematic 9:16 Reels + 1 4K Widescreen YouTube Film',
          'FPV Drone & Aerial 4K cinematography',
          'Permanent link-in-bio inclusion for 30 days',
          'Raw 4K B-roll footage handed over for brand ad accounts'
        ]
      }
    ]
  },

  // 3. Commercial Brand Ambassador & Lifestyle Model
  commercial_lifestyle: {
    templateId: 'commercial_lifestyle',
    name: 'Meera Kapoor',
    stageName: 'MEERA KAPOOR',
    handle: '@meerakapoor.official',
    title: 'Commercial Actress & Luxury Beauty Ambassador',
    tagline: 'TVCs • Nykaa & Sephora Brand Partner • 45+ Commercial Ad Films',
    bio: 'Recognized face in national broadcast commercials and premium FMCG campaigns. Known for authentic screen presence, versatile contemporary looks, and high credibility across skincare, sustainable fashion, and lifestyle technology.',
    location: 'Mumbai & Delhi',
    experienceYears: '7+ Years',
    agency: 'Velametric Talent Representation',
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
    contactEmail: 'management@meerakapoor.com',
    contactPhone: '+91 99300 11488',
    instagramUrl: 'https://www.instagram.com',
    youtubeUrl: 'https://www.youtube.com',
    modelSpecs: {
      height: "5'8\" / 173 cm",
      bustChest: '34" / 86 cm',
      waist: '26" / 66 cm',
      hips: '36" / 91 cm',
      shoeSize: '7.5 US / 38 EU',
      eyeColor: 'Warm Brown',
      hairColor: 'Chestnut Waves',
      dressSize: '6 US / 38 EU'
    },
    influencerStats: {
      followersTotal: '410K',
      monthlyImpressions: '2.6M',
      avgReelViews: '180K',
      engagementRate: '6.4%',
      topDemographic: '81% Women (22-40)',
      topLocations: ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata']
    },
    brandCollaborations: [
      { brandName: 'Nykaa Beauty', campaignTitle: 'Glow Serum National Digital TVC', year: '2025' },
      { brandName: 'Forest Essentials', campaignTitle: 'Ayurvedic Radiance Campaign', year: '2024' },
      { brandName: 'FabIndia', campaignTitle: 'Festive Handloom Collection Lead', year: '2024' },
      { brandName: 'Samsung India', campaignTitle: 'Galaxy Z Flip Lifestyle Launch', year: '2024' }
    ],
    pictures: [
      {
        id: 'pic-c1',
        title: 'Clean Beauty Dewy Skincare Campaign',
        category: 'Commercial Beauty',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Radiant macro beauty shot for premium Ayurvedic brand.'
      },
      {
        id: 'pic-c2',
        title: 'Festive Silk & Golden Hour Elegance',
        category: 'Ethnic Wear',
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Handcrafted zari lehenga commercial catalog lead.'
      },
      {
        id: 'pic-c3',
        title: 'Smart Tech Lifestyle & Urban Office',
        category: 'Corporate Lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Fintech and smartphone productivity campaign.'
      }
    ],
    videos: [
      {
        id: 'vid-c1',
        title: 'Mansi & Swapnil — Timeless Retro Love Story',
        category: 'Commercial Film',
        videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/AQN6qG8rwAJbhnu2yYkyKThtZcu00393c2jRDpiOpM3lwGtAM3n6jqxc8soOiE9xTMHhCPDToZo849qCOASX3UIj9_xb-K2TAxunY0s.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        duration: '01:15',
        views: '220K',
        format: '16:9',
        description: 'Golden hour vintage colorgraded cinematic commercial narrative.'
      }
    ],
    packages: [
      {
        id: 'pkg-c1',
        title: 'Digital Ad Commercial (TVC & OTT)',
        price: '₹1,50,000 / Day',
        deliverables: [
          'Full-day broadcast production shoot',
          'Digital & social rights for 1 Year across India',
          '1 Collaborative Instagram Reel posted on handle',
          'High-res publicity stills'
        ],
        popular: true
      }
    ]
  },

  // 4. Fitness, Sports & Glamour Influencer
  fitness_creator: {
    templateId: 'fitness_creator',
    name: 'Vikram Rajput',
    stageName: 'VIKRAM FIT',
    handle: '@vikram_fitpro',
    title: 'Calisthenics Athlete & High-Performance Fitness Coach',
    tagline: 'Under Armour Athlete • Men\'s Health Cover • 720K Fitness Community',
    bio: 'Elite functional fitness athlete, national calisthenics record holder, and men\'s wellness advocate. Dedicated to empowering thousands through no-nonsense training, nutrition science, and high-octane motivational cinematic reels.',
    location: 'Chandigarh & Delhi',
    experienceYears: '8+ Years',
    agency: 'Velametric Sports & Athletic Media',
    verified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    coverBannerUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    contactEmail: 'contact@vikramrajput.fit',
    contactPhone: '+91 98722 99410',
    instagramUrl: 'https://www.instagram.com',
    youtubeUrl: 'https://www.youtube.com',
    modelSpecs: {
      height: "6'2\" / 188 cm",
      bustChest: '44" / 112 cm',
      waist: '31" / 79 cm',
      hips: '38" / 96 cm',
      shoeSize: '11 US / 45 EU',
      eyeColor: 'Black',
      hairColor: 'Jet Black Tapered',
      dressSize: 'XL / 42 L'
    },
    influencerStats: {
      followersTotal: '720K',
      monthlyImpressions: '5.8M',
      avgReelViews: '480K',
      engagementRate: '8.9%',
      topDemographic: '69% Men, 31% Women (18-35)',
      topLocations: ['Chandigarh', 'Delhi NCR', 'Punjab', 'Canada']
    },
    brandCollaborations: [
      { brandName: 'Under Armour', campaignTitle: 'Unstoppable Functional Apparel Lead', year: '2025' },
      { brandName: 'Optimum Nutrition', campaignTitle: 'Gold Standard Athlete Ambassador', year: '2024' },
      { brandName: 'Garmin India', campaignTitle: 'Fenix 8 Smartwatch Performance Test', year: '2024' }
    ],
    pictures: [
      {
        id: 'pic-f1',
        title: 'Muscle-Up Explosive Bar Dynamic',
        category: 'Athletic Action',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'landscape',
        caption: 'High-speed capture athletic campaign for activewear.'
      },
      {
        id: 'pic-f2',
        title: 'Men\'s Health Physique Studio Slate',
        category: 'Physique Comp-Card',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Cover physique shoot with high-contrast rim lighting.'
      },
      {
        id: 'pic-f3',
        title: 'Heavy Kettlebell Strength Sequence',
        category: 'Training Routine',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80',
        aspectRatio: 'portrait',
        caption: 'Commercial functional fitness product demonstration.'
      }
    ],
    videos: [
      {
        id: 'vid-f1',
        title: '30-Day Calisthenics Transformation Reel',
        category: 'Viral Fitness Reel',
        videoUrl: 'https://dapflix.com/wp-content/uploads/2025/03/UTTARKASHI-x-DAPFLIX-2.mp4',
        posterUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        duration: '0:45',
        views: '1.2M',
        format: '9:16',
        description: 'Kinetic beat-synced workout routine with 94,000 saves.'
      }
    ],
    packages: [
      {
        id: 'pkg-f1',
        title: 'Dedicated Supplement / Activewear Reel',
        price: '₹95,000 / Reel',
        deliverables: [
          'High-energy workout integration reel with brand focus',
          '3 Tagged Instagram stories + link-in-bio for 14 days',
          'Usage rights for brand digital paid ads (60 Days)'
        ],
        popular: true
      }
    ]
  }
};

// ============================================================================
// MAIN COMPONENT: CREATOR PORTFOLIO SHOWCASE & BUILDER PAGE
// ============================================================================

export const CreatorPortfolioPage: React.FC = () => {
  // Active Profile State (Persisted in localStorage)
  const [profile, setProfile] = useState<CreatorProfileData>(() => {
    try {
      const saved = localStorage.getItem('velametric_creator_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return TEMPLATE_PRESETS.editorial_model;
  });

  // Builder vs Showcase View Modes
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);
  const [builderTab, setBuilderTab] = useState<'INFO' | 'SPECS' | 'MEDIA' | 'PACKAGES'>('INFO');
  
  // Interactive Lightbox State for Photos
  const [activePhotoModal, setActivePhotoModal] = useState<PictureItem | null>(null);

  // Interactive Video Player State
  const [activeVideoModal, setActiveVideoModal] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage automatically upon change
  useEffect(() => {
    try {
      localStorage.setItem('velametric_creator_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch Template
  const handleTemplateSwitch = (tmplId: PortfolioTemplateId) => {
    const preset = TEMPLATE_PRESETS[tmplId];
    setProfile(prev => ({
      ...preset,
      // Keep customized name, email, phone if user already edited
      name: prev.name !== TEMPLATE_PRESETS[prev.templateId].name ? prev.name : preset.name,
      contactEmail: prev.contactEmail !== TEMPLATE_PRESETS[prev.templateId].contactEmail ? prev.contactEmail : preset.contactEmail,
      contactPhone: prev.contactPhone !== TEMPLATE_PRESETS[prev.templateId].contactPhone ? prev.contactPhone : preset.contactPhone,
      templateId: tmplId
    }));
    showToast(`Switched to "${getTemplateLabel(tmplId)}" Template!`);
  };

  // Reset to default template preset
  const handleResetToPreset = () => {
    if (window.confirm('Reset this portfolio back to the original template demo data?')) {
      setProfile(TEMPLATE_PRESETS[profile.templateId]);
      showToast('Reset to demo preset data!');
    }
  };

  // Print Comp-Card
  const handlePrintCompCard = () => {
    window.print();
  };

  // Copy Share Link
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Portfolio link copied to clipboard! Ready to share with agencies & brands.');
  };

  // Media Handlers: Add Photo via Local Upload or URL
  const handleAddPhoto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('photoTitle') as HTMLInputElement).value;
    const category = (form.elements.namedItem('photoCategory') as HTMLInputElement).value;
    const imageUrl = (form.elements.namedItem('photoUrl') as HTMLInputElement).value;
    const aspectRatio = (form.elements.namedItem('photoAspect') as HTMLSelectElement).value as 'portrait' | 'landscape' | 'square';

    if (!imageUrl) return;

    const newPhoto: PictureItem = {
      id: 'pic-' + Date.now(),
      title: title || 'Portfolio Shoot',
      category: category || 'Editorial',
      imageUrl,
      aspectRatio: aspectRatio || 'portrait'
    };

    setProfile(prev => ({
      ...prev,
      pictures: [newPhoto, ...prev.pictures]
    }));

    form.reset();
    showToast('New photo added to portfolio!');
  };

  // File Upload Reader for Instant Local Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const newPhoto: PictureItem = {
        id: 'pic-' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: 'Uploaded Shoot',
        imageUrl: dataUrl,
        aspectRatio: 'portrait'
      };

      setProfile(prev => ({
        ...prev,
        pictures: [newPhoto, ...prev.pictures]
      }));

      showToast('Photo uploaded from your device successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Media Handlers: Add Video
  const handleAddVideo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('vidTitle') as HTMLInputElement).value;
    const category = (form.elements.namedItem('vidCategory') as HTMLInputElement).value;
    const videoUrl = (form.elements.namedItem('vidUrl') as HTMLInputElement).value;
    const posterUrl = (form.elements.namedItem('vidPoster') as HTMLInputElement).value;
    const format = (form.elements.namedItem('vidFormat') as HTMLSelectElement).value as '9:16' | '16:9';

    if (!videoUrl) return;

    const newVid: VideoItem = {
      id: 'vid-' + Date.now(),
      title: title || 'Featured Video Reel',
      category: category || 'Showcase Reel',
      videoUrl,
      posterUrl: posterUrl || profile.avatarUrl,
      duration: '0:45',
      views: '50K+',
      format: format || '9:16'
    };

    setProfile(prev => ({
      ...prev,
      videos: [newVid, ...prev.videos]
    }));

    form.reset();
    showToast('New video added to portfolio!');
  };

  const handleDeletePhoto = (id: string) => {
    setProfile(prev => ({
      ...prev,
      pictures: prev.pictures.filter(p => p.id !== id)
    }));
    showToast('Photo removed.');
  };

  const handleDeleteVideo = (id: string) => {
    setProfile(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v.id !== id)
    }));
    showToast('Video removed.');
  };

  function getTemplateLabel(id: PortfolioTemplateId): string {
    switch (id) {
      case 'editorial_model': return '1. Haute Editorial (High-Fashion Model)';
      case 'viral_influencer': return '2. Viral Reels (Social Creator & Influencer)';
      case 'commercial_lifestyle': return '3. Luxe Commercial (Brand Ambassador)';
      case 'fitness_creator': return '4. Power Athletic (Fitness & Sports)';
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400 selection:text-black">
      
      {/* ==================================================================== */}
      {/* 1. TOP CREATOR STUDIO CONTROL BAR (STICKY HEADER)                   */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-50 bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-xl print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Branding & Studio Mode */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link to="/portfolio" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-sm shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
                V
              </span>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase block">
                  TALENT & CREATOR PORTFOLIO STUDIO
                </span>
                <span className="text-sm font-black text-white group-hover:text-amber-400 transition-colors uppercase font-display">
                  Model & Influencer Showcase
                </span>
              </div>
            </Link>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Live 4K Portfolio Mode
            </div>
          </div>

          {/* Center: Template Selector Dropdown / Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto max-w-full">
            {(['editorial_model', 'viral_influencer', 'commercial_lifestyle', 'fitness_creator'] as PortfolioTemplateId[]).map((tmplId) => (
              <button
                key={tmplId}
                type="button"
                onClick={() => handleTemplateSwitch(tmplId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  profile.templateId === tmplId
                    ? 'bg-amber-400 text-black shadow-lg font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {tmplId === 'editorial_model' && <Sparkles className="w-3.5 h-3.5" />}
                {tmplId === 'viral_influencer' && <Instagram className="w-3.5 h-3.5" />}
                {tmplId === 'commercial_lifestyle' && <Camera className="w-3.5 h-3.5" />}
                {tmplId === 'fitness_creator' && <Flame className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {tmplId === 'editorial_model' && '1. High-Fashion'}
                  {tmplId === 'viral_influencer' && '2. Viral Reels'}
                  {tmplId === 'commercial_lifestyle' && '3. Commercial'}
                  {tmplId === 'fitness_creator' && '4. Fitness'}
                </span>
                <span className="sm:hidden">
                  {tmplId === 'editorial_model' && 'Editorial'}
                  {tmplId === 'viral_influencer' && 'Reels'}
                  {tmplId === 'commercial_lifestyle' && 'Luxe'}
                  {tmplId === 'fitness_creator' && 'Fitness'}
                </span>
              </button>
            ))}
          </div>

          {/* Right: Actions (Builder Toggle, Print Comp-Card, Share) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBuilderOpen(!isBuilderOpen)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
                isBuilderOpen
                  ? 'bg-white text-black font-black'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/40 hover:border-amber-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isBuilderOpen ? 'Close Editor' : 'Edit My Profile'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintCompCard}
              title="Print or Save Agency Comp-Card (PDF)"
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShareLink}
              title="Copy Profile Link"
              className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold transition-all shadow-md shadow-amber-400/20"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. TOAST NOTIFICATION                                                */}
      {/* ==================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-amber-400 text-black font-extrabold text-xs tracking-wider shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. INTERACTIVE BUILDER DRAWER / MODAL                               */}
      {/* ==================================================================== */}
      {isBuilderOpen && (
        <div className="bg-zinc-950 border-b border-amber-400/30 shadow-2xl p-4 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300 print:hidden relative z-40">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                  <Sliders className="w-3 h-3 text-amber-400" /> Interactive Profile Customizer
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-display">
                  Customize Work Profile & Media Showcase
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Changes save instantly in your browser and automatically update across all 4 templates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToPreset}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reset To Demo
                </button>
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Builder Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-900">
              {[
                { id: 'INFO', label: '1. Basic Info & Bio', icon: User },
                { id: 'SPECS', label: '2. Comp-Card Specs & Stats', icon: Ruler },
                { id: 'MEDIA', label: '3. Photos & Video Reels', icon: Film },
                { id: 'PACKAGES', label: '4. Rates & Collab Packages', icon: Award }
              ].map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBuilderTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                      builderTab === tab.id
                        ? 'bg-amber-400 text-black font-black shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Basic Info */}
            {builderTab === 'INFO' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Stage Name / Moniker</label>
                  <input
                    type="text"
                    value={profile.stageName || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, stageName: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Social Handle (@)</label>
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) => setProfile(prev => ({ ...prev, handle: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Professional Title</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Location / Base City</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Agency Representation</label>
                  <input
                    type="text"
                    value={profile.agency || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, agency: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Bio & Editorial Statement</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Avatar / Profile Picture URL</label>
                  <input
                    type="url"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Cover Banner Image URL</label>
                  <input
                    type="url"
                    value={profile.coverBannerUrl}
                    onChange={(e) => setProfile(prev => ({ ...prev, coverBannerUrl: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Booking Contact Email</label>
                  <input
                    type="email"
                    value={profile.contactEmail}
                    onChange={(e) => setProfile(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Comp-Card Specs & Influencer Metrics */}
            {builderTab === 'SPECS' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <Ruler className="w-3.5 h-3.5" /> Model Physical Comp-Card Specs (Runway & Editorial)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Height</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.height}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, height: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Bust / Chest</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.bustChest}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, bustChest: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Waist</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.waist}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, waist: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Hips</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.hips}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, hips: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Shoe Size</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.shoeSize}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, shoeSize: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Eye Color</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.eyeColor}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, eyeColor: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Hair Color</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.hairColor}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, hairColor: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Dress Size</label>
                      <input
                        type="text"
                        value={profile.modelSpecs.dressSize}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          modelSpecs: { ...prev.modelSpecs, dressSize: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Influencer & Social Metrics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Total Followers</label>
                      <input
                        type="text"
                        value={profile.influencerStats.followersTotal}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          influencerStats: { ...prev.influencerStats, followersTotal: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Monthly Impressions</label>
                      <input
                        type="text"
                        value={profile.influencerStats.monthlyImpressions}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          influencerStats: { ...prev.influencerStats, monthlyImpressions: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Avg Reel Views</label>
                      <input
                        type="text"
                        value={profile.influencerStats.avgReelViews}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          influencerStats: { ...prev.influencerStats, avgReelViews: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase font-mono">Engagement Rate</label>
                      <input
                        type="text"
                        value={profile.influencerStats.engagementRate}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          influencerStats: { ...prev.influencerStats, engagementRate: e.target.value }
                        }))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Photos & Video Reels Management */}
            {builderTab === 'MEDIA' && (
              <div className="space-y-8">
                
                {/* Add Photo Form & File Upload */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-400" /> Add Work Photos & Editorial Pictures
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Upload direct from your phone / computer or paste image links.
                      </p>
                    </div>

                    {/* Local File Upload Button */}
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition-all">
                      <Plus className="w-4 h-4" /> Upload Picture File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Add via URL Form */}
                  <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      name="photoTitle"
                      type="text"
                      placeholder="Shoot Title (e.g. Vogue Cover)"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      name="photoCategory"
                      type="text"
                      placeholder="Category (e.g. Runway, Editorial)"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      name="photoUrl"
                      type="url"
                      required
                      placeholder="Image URL (https://...)"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <div className="flex gap-2">
                      <select
                        name="photoAspect"
                        defaultValue="portrait"
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white flex-1"
                      >
                        <option value="portrait">Portrait (3:4 / 9:16)</option>
                        <option value="landscape">Landscape (16:9)</option>
                        <option value="square">Square (1:1)</option>
                      </select>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-white hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shrink-0 transition-colors"
                      >
                        Add Photo
                      </button>
                    </div>
                  </form>

                  {/* Existing Pictures List */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                    {profile.pictures.map((pic) => (
                      <div key={pic.id} className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[3/4]">
                        <img src={pic.imageUrl} alt={pic.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-amber-400 line-clamp-1">{pic.title}</span>
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(pic.id)}
                            className="w-7 h-7 rounded-lg bg-red-600/90 text-white flex items-center justify-center self-end hover:bg-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Video Form */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-amber-400" /> Add Work Videos & Commercial Reels
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Add 9:16 vertical viral reels or 16:9 widescreen runway & commercial films (MP4 video links).
                    </p>
                  </div>

                  <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <input
                      name="vidTitle"
                      type="text"
                      placeholder="Video Title (e.g. Milan Runway Walk)"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      name="vidCategory"
                      type="text"
                      placeholder="Category (e.g. Viral Reel, TVC)"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      name="vidUrl"
                      type="url"
                      required
                      placeholder="MP4 Video URL (https://...)"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <select
                      name="vidFormat"
                      defaultValue="9:16"
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="9:16">Vertical Reel (9:16)</option>
                      <option value="16:9">Widescreen Film (16:9)</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
                    >
                      Add Video Reel
                    </button>
                  </form>

                  {/* Existing Videos List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    {profile.videos.map((vid) => (
                      <div key={vid.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{vid.title}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {vid.category} • Format: {vid.format}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-600/80 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Packages & Rates */}
            {builderTab === 'PACKAGES' && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-400">
                  Configure casting rates, runway booking packages, and social media commercial collaboration tiers.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profile.packages.map((pkg, idx) => (
                    <div key={pkg.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Package {idx + 1}</span>
                        {pkg.popular && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                            Most Booked
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={pkg.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfile(prev => ({
                            ...prev,
                            packages: prev.packages.map(p => p.id === pkg.id ? { ...p, title: val } : p)
                          }));
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                      />
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfile(prev => ({
                            ...prev,
                            packages: prev.packages.map(p => p.id === pkg.id ? { ...p, price: val } : p)
                          }));
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-mono font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. ACTIVE PORTFOLIO TEMPLATE RENDERER                                */}
      {/* ==================================================================== */}
      <main className="w-full pb-24">
        {profile.templateId === 'editorial_model' && (
          <EditorialModelTemplate
            profile={profile}
            onOpenPhoto={(photo) => setActivePhotoModal(photo)}
            onOpenVideo={(video) => {
              setActiveVideoModal(video);
              setIsPlaying(true);
            }}
          />
        )}

        {profile.templateId === 'viral_influencer' && (
          <ViralInfluencerTemplate
            profile={profile}
            onOpenPhoto={(photo) => setActivePhotoModal(photo)}
            onOpenVideo={(video) => {
              setActiveVideoModal(video);
              setIsPlaying(true);
            }}
          />
        )}

        {profile.templateId === 'commercial_lifestyle' && (
          <CommercialLifestyleTemplate
            profile={profile}
            onOpenPhoto={(photo) => setActivePhotoModal(photo)}
            onOpenVideo={(video) => {
              setActiveVideoModal(video);
              setIsPlaying(true);
            }}
          />
        )}

        {profile.templateId === 'fitness_creator' && (
          <FitnessCreatorTemplate
            profile={profile}
            onOpenPhoto={(photo) => setActivePhotoModal(photo)}
            onOpenVideo={(video) => {
              setActiveVideoModal(video);
              setIsPlaying(true);
            }}
          />
        )}
      </main>

      {/* ==================================================================== */}
      {/* 5. INTERACTIVE LIGHTBOX PHOTO MODAL                                  */}
      {/* ==================================================================== */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setActivePhotoModal(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-zinc-900/90 text-white hover:bg-amber-400 hover:text-black transition-colors flex items-center justify-center z-50 shadow-2xl"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={activePhotoModal.imageUrl}
              alt={activePhotoModal.title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-zinc-800"
            />
            <div className="mt-4 text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                {activePhotoModal.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{activePhotoModal.title}</h3>
              {activePhotoModal.caption && (
                <p className="text-xs text-zinc-400 max-w-lg mx-auto">{activePhotoModal.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. INTERACTIVE 4K VIDEO PLAYER MODAL                                */}
      {/* ==================================================================== */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setActiveVideoModal(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-zinc-900/90 text-white hover:bg-amber-400 hover:text-black transition-colors flex items-center justify-center z-50 shadow-2xl"
          >
            <X className="w-6 h-6" />
          </button>

          <div className={`w-full flex flex-col items-center ${activeVideoModal.format === '9:16' ? 'max-w-md' : 'max-w-4xl'}`}>
            <div className="w-full relative overflow-hidden rounded-3xl bg-black border-2 border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.95)]">
              <video
                ref={videoPlayerRef}
                src={activeVideoModal.videoUrl}
                poster={activeVideoModal.posterUrl}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                className={`w-full object-cover ${activeVideoModal.format === '9:16' ? 'aspect-[9/16] max-h-[75vh]' : 'aspect-video'}`}
              />

              {/* Floating Bottom Controls */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between p-3 rounded-2xl bg-zinc-950/80 backdrop-blur border border-zinc-800 text-white">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (videoPlayerRef.current) {
                        if (isPlaying) videoPlayerRef.current.pause();
                        else videoPlayerRef.current.play();
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="p-2 rounded-xl bg-amber-400 text-black hover:bg-amber-300 font-bold transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                    {activeVideoModal.title}
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/30">
                  {activeVideoModal.category}
                </span>
              </div>
            </div>

            {activeVideoModal.description && (
              <p className="text-xs text-zinc-400 text-center mt-3 max-w-md">
                {activeVideoModal.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. BOTTOM CTA STRIP: VELAMETRIC TALENT BOOKING ENGINE               */}
      {/* ==================================================================== */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 px-4 sm:px-6 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" /> Velametric Talent Ecosystem
            </div>
            <h4 className="text-xl font-black text-white uppercase font-display">
              Ready to Book {profile.name} for Your Brand Shoot?
            </h4>
            <p className="text-xs text-zinc-400 max-w-xl">
              Commercial films, TVCs, high-fashion runway, experiential travel reels, and brand ambassadorship contracts.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.contactEmail}?subject=Brand Shoot Booking Request for ${encodeURIComponent(profile.name)}`}
              className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-400/25 transition-all hover:scale-105"
            >
              <Mail className="w-4 h-4" /> Send Casting Enquiry <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${profile.contactPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(profile.name)},%20I%20saw%20your%20Velametric%20Portfolio%20and%20want%20to%20discuss%20a%20commercial%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-amber-400" /> WhatsApp Direct
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

// ============================================================================
// TEMPLATE 1: HAUTE EDITORIAL (HIGH-FASHION & RUNWAY MODEL COMP-CARD)
// ============================================================================

interface TemplateProps {
  profile: CreatorProfileData;
  onOpenPhoto: (photo: PictureItem) => void;
  onOpenVideo: (video: VideoItem) => void;
}

const EditorialModelTemplate: React.FC<TemplateProps> = ({ profile, onOpenPhoto, onOpenVideo }) => {
  return (
    <div className="space-y-12">
      {/* 1. Haute Hero Banner with Comp-Card Split */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Model Name & Editorial Statement */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black uppercase tracking-widest">
                EDITORIAL COMP-CARD
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                {profile.agency || 'Independent Represented'}
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {profile.location}
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight font-display leading-[0.95]">
                {profile.name}
              </h1>
              <div className="text-sm sm:text-base font-mono font-bold text-amber-400 uppercase tracking-widest mt-2">
                {profile.title}
              </div>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              {profile.bio}
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`mailto:${profile.contactEmail}?subject=Casting%20Inquiry%20for%20${encodeURIComponent(profile.name)}`}
                className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
              >
                <Briefcase className="w-4 h-4" /> Book For Runway / Editorial
              </a>
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4 text-amber-400" /> {profile.handle}
              </a>
            </div>
          </div>

          {/* Right: Comp-Card Physical Specifications Slate */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    AGENCY CASTING SPECIFICATIONS
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">OFFICIAL SLATE</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Height</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.height}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Bust / Chest</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.bustChest}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Waist</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.waist}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Hips</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.hips}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Shoe</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.shoeSize}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Eyes</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.eyeColor}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Hair</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.hairColor}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-zinc-500 uppercase block text-[10px]">Dress Size</span>
                  <span className="text-white font-bold text-sm">{profile.modelSpecs.dressSize}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-zinc-400 flex items-center justify-between border-t border-zinc-800">
                <span>Verified Direct Representation</span>
                <span className="text-amber-400 font-bold">Updated {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Editorial Photoshoot Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
              PORTFOLIO ARCHIVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              Editorial & High-Fashion Polaroids
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {profile.pictures.length} Verified High-Resolution Frames (Click to Enlarge)
          </span>
        </div>

        {/* Dynamic Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.pictures.map((pic) => (
            <div
              key={pic.id}
              onClick={() => onOpenPhoto(pic)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-amber-400/80 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(251,191,36,0.15)] flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-zinc-900">
                <img
                  src={pic.imageUrl}
                  alt={pic.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                    {pic.category}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1 leading-snug">{pic.title}</h4>
                  {pic.caption && <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{pic.caption}</p>}
                </div>
              </div>

              <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors block truncate max-w-[200px]">
                    {pic.title}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">{pic.category}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900 group-hover:bg-amber-400 text-zinc-400 group-hover:text-black transition-all">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Runway & Motion Video Clips */}
      {profile.videos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
              RUNWAY & SCREEN MOTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              Commercial Films & Runway Walk Clips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onOpenVideo(vid)}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all p-4 space-y-4"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
                  <img
                    src={vid.posterUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white font-mono text-[10px] font-bold">
                    {vid.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{vid.category}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{vid.title}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                    Format: {vid.format}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Brand Collaborations Strip */}
      {profile.brandCollaborations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                PROVEN COMMERCIAL TRACK RECORD
              </span>
              <h3 className="text-2xl font-black text-white uppercase font-display">
                Past Brand Campaigns & Runway Credits
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {profile.brandCollaborations.map((collab, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-1">
                  <div className="text-sm font-black text-white uppercase">{collab.brandName}</div>
                  <div className="text-xs text-amber-400 font-light">{collab.campaignTitle}</div>
                  <div className="text-[10px] font-mono text-zinc-500">{collab.year}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// ============================================================================
// TEMPLATE 2: VIRAL CREATOR (SOCIAL MEDIA & REELS INFLUENCER)
// ============================================================================

const ViralInfluencerTemplate: React.FC<TemplateProps> = ({ profile, onOpenPhoto, onOpenVideo }) => {
  return (
    <div className="space-y-12">
      {/* 1. Kinetic Social Hero Banner */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Creator Profile & Social Stats */}
            <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-mono font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Verified Digital Creator Ecosystem
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 overflow-hidden shadow-2xl shrink-0 p-1 bg-black">
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-display tracking-tight">
                      {profile.name}
                    </h1>
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-black" title="Verified Creator">
                      ✓
                    </span>
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-400 tracking-wider">
                    {profile.handle} • {profile.location}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">{profile.title}</div>
                </div>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {profile.bio}
              </p>

              {/* Creator Analytics Quad */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-display">
                    {profile.influencerStats.followersTotal}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">Followers</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xl sm:text-2xl font-black text-white font-display">
                    {profile.influencerStats.monthlyImpressions}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">Monthly Reach</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-display">
                    {profile.influencerStats.avgReelViews}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">Avg Reel Views</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xl sm:text-2xl font-black text-white font-display">
                    {profile.influencerStats.engagementRate}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">Engagement</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
                >
                  <Instagram className="w-4 h-4" /> View Reels on Instagram ↗
                </a>
                <a
                  href={`mailto:${profile.contactEmail}?subject=Brand%20Collab%20Enquiry`}
                  className="px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" /> Request Brand Collab Rates
                </a>
              </div>
            </div>

            {/* Right: Featured 9:16 Interactive Vertical Reel Player Mockup */}
            <div className="shrink-0 w-full max-w-[340px] sm:max-w-[360px]">
              <div className="relative rounded-[40px] border-[6px] border-zinc-800 bg-black overflow-hidden shadow-2xl aspect-[9/16]">
                {profile.videos[0] ? (
                  <div
                    onClick={() => onOpenVideo(profile.videos[0])}
                    className="relative w-full h-full cursor-pointer group"
                  >
                    <img
                      src={profile.videos[0].posterUrl}
                      alt={profile.videos[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-black/80 backdrop-blur border border-zinc-800 text-white">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                        {profile.videos[0].category}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{profile.videos[0].title}</h4>
                      <span className="text-[10px] text-zinc-400">🔥 {profile.videos[0].views} Views</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                    No Reels Uploaded Yet
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Viral Reels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
              9:16 SHORT-FORM VIDEO VAULT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              Trending Social Reels & Creative Formats
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">Tap Any Reel to Play Full 4K</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {profile.videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onOpenVideo(vid)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all aspect-[9/16] relative flex flex-col justify-between p-3"
            >
              <img
                src={vid.posterUrl}
                alt={vid.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 group-hover:via-black/10 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-mono font-bold text-amber-400 border border-amber-400/30">
                  {vid.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-md">
                  {vid.duration}
                </span>
              </div>

              <div className="relative z-10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{vid.title}</h4>
                <div className="text-[10px] text-zinc-300 font-mono flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-amber-400" /> {vid.views} Views
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. High-Quality Lifestyle & Collaboration Stills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
            VISUAL FEED & PHOTO ASSETS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
            Aesthetic Stills & Product Endorsement Feed
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {profile.pictures.map((pic) => (
            <div
              key={pic.id}
              onClick={() => onOpenPhoto(pic)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all aspect-square relative"
            >
              <img
                src={pic.imageUrl}
                alt={pic.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">{pic.category}</span>
                <span className="text-xs font-bold leading-tight line-clamp-1">{pic.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Collab Packages Card Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              COMMERCIAL RATES & DELIVERABLES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              Brand Sponsorship & Collaboration Tiers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.packages.map((pkg) => (
              <div key={pkg.id} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 relative">
                {pkg.popular && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black uppercase">
                    Highest ROI
                  </span>
                )}
                <div>
                  <h4 className="text-lg font-black text-white uppercase">{pkg.title}</h4>
                  <div className="text-xl font-black text-amber-400 font-mono mt-1">{pkg.price}</div>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  {pkg.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`mailto:${profile.contactEmail}?subject=Booking%20Package:%20${encodeURIComponent(pkg.title)}`}
                  className="w-full py-3 rounded-full bg-white hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  Book This Package <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// TEMPLATE 3: LUXE COMMERCIAL (BRAND AMBASSADOR & COMMERCIAL MODEL)
// ============================================================================

const CommercialLifestyleTemplate: React.FC<TemplateProps> = ({ profile, onOpenPhoto, onOpenVideo }) => {
  return (
    <div className="space-y-12">
      {/* 1. Luxe Magazine Header */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-black font-mono text-[10px] font-black uppercase tracking-widest">
                COMMERCIAL TALENT DOSSIER
              </span>
              <span className="text-xs font-mono text-zinc-400 uppercase">
                {profile.experienceYears} In Broadcast Ad Films
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase font-display tracking-tight">
              {profile.name}
            </h1>

            <div className="text-base sm:text-lg text-amber-400 font-bold uppercase tracking-wider font-mono">
              {profile.tagline}
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`mailto:${profile.contactEmail}?subject=Commercial%20TVC%20Booking`}
                className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
              >
                <Briefcase className="w-4 h-4" /> Enquire for Commercial Shoot
              </a>
              <span className="text-xs text-zinc-400 font-mono">
                📍 Based in {profile.location} • Available Pan-India & Global
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl w-full max-w-sm aspect-[4/5] bg-zinc-900">
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-zinc-950/90 backdrop-blur border border-zinc-800 text-center">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  {profile.agency || 'Exclusive Representation'}
                </span>
                <div className="text-xs font-bold text-white mt-0.5">{profile.contactEmail}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Commercial TVC Reel Spotlight */}
      {profile.videos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
              NATIONAL AD REELS & COMMERCIAL TVCs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
              Broadcast TVC & Digital Campaign Reel
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onOpenVideo(vid)}
                className="cursor-pointer group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all p-4 space-y-3"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
                  <img src={vid.posterUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{vid.category}</span>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{vid.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Product & Brand Endorsement Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
            BRAND CAMPAIGN STILLS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
            Beauty, Jewellery & Lifestyle Stills
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.pictures.map((pic) => (
            <div
              key={pic.id}
              onClick={() => onOpenPhoto(pic)}
              className="cursor-pointer group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all aspect-[3/4] relative"
            >
              <img src={pic.imageUrl} alt={pic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{pic.category}</span>
                <h4 className="text-sm font-bold mt-1">{pic.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// TEMPLATE 4: FITNESS CREATOR (ATHLETIC & GLAMOUR INFLUENCER)
// ============================================================================

const FitnessCreatorTemplate: React.FC<TemplateProps> = ({ profile, onOpenPhoto, onOpenVideo }) => {
  return (
    <div className="space-y-12">
      {/* 1. High-Energy Athletic Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-black text-xs font-mono font-black uppercase tracking-widest shadow-lg shadow-amber-400/20">
              <Zap className="w-3.5 h-3.5" /> ATHLETIC & FITNESS INFLUENCER
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-display tracking-tight">
              {profile.name}
            </h1>

            <div className="text-sm sm:text-base font-mono font-bold text-amber-400 uppercase tracking-widest">
              {profile.tagline}
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              {profile.bio}
            </p>

            {/* Athletic Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-xs font-mono font-bold text-amber-400 block">{profile.modelSpecs.height}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Height</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-xs font-mono font-bold text-white block">{profile.modelSpecs.bustChest}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Chest</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-xs font-mono font-bold text-amber-400 block">{profile.modelSpecs.waist}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Waist</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-xs font-mono font-bold text-white block">{profile.influencerStats.followersTotal}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Community</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`mailto:${profile.contactEmail}?subject=Fitness%20Sponsorship%20Enquiry`}
                className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
              >
                <Flame className="w-4 h-4" /> Book For Sports Campaign
              </a>
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4 text-amber-400" /> Instagram Feed
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden border-4 border-zinc-800 shadow-2xl w-full max-w-md aspect-[3/4] bg-zinc-900">
              <img src={profile.coverBannerUrl} alt={profile.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">OFFICIAL ATHLETE</span>
                  <div className="text-lg font-black text-white uppercase">{profile.stageName || profile.name}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Training Routine & Transformation Reels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
            WORKOUTS & ATHLETIC REELS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
            High-Impact Training Videos & Action Reels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onOpenVideo(vid)}
              className="cursor-pointer group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all p-4 space-y-3"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
                <img src={vid.posterUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{vid.category}</span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">{vid.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Physique & Activewear Photo Stills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
            PHYSIQUE & ACTIVEWEAR GALLERY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
            Action Stills & Activewear Endorsements
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {profile.pictures.map((pic) => (
            <div
              key={pic.id}
              onClick={() => onOpenPhoto(pic)}
              className="cursor-pointer group rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-all aspect-[3/4] relative"
            >
              <img src={pic.imageUrl} alt={pic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{pic.category}</span>
                <h4 className="text-sm font-bold mt-1">{pic.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
