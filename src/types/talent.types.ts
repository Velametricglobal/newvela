// ============================================================================
// VELAMETRIC — TALENT PORTFOLIO MANAGEMENT SYSTEM
// Type Definitions
// ============================================================================

export type TalentCategory =
  | 'actor' | 'model' | 'musician' | 'singer' | 'dancer'
  | 'creator' | 'influencer' | 'photographer' | 'designer' | 'artist'
  | 'speaker' | 'writer' | 'athlete' | 'entrepreneur' | 'comedian'
  | 'host' | 'other';

export type TalentStatus = 'pending' | 'active' | 'featured' | 'suspended' | 'rejected';
export type TalentGender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'professional' | 'expert';
export type MediaType = 'image' | 'video' | 'reel' | 'document';
export type InquiryStatus = 'new' | 'read' | 'replied' | 'closed';

export interface TalentSocialLinks {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
  imdb?: string;
  behance?: string;
  dribbble?: string;
}

export interface TalentMeasurements {
  height?: string;
  weight?: string;
  chest?: string;
  waist?: string;
  hips?: string;
  shoeSize?: string;
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
}

export interface TalentSkill {
  id: string;
  name: string;
  proficiency: number;
}

export interface TalentExperience {
  id: string;
  role: string;
  company: string;
  type: string;
  year: string;
  description: string;
  mediaUrl?: string;
}

export interface TalentMedia {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  featured: boolean;
  views?: number;
  likes?: number;
  uploadedAt: string;
  tags?: string[];
}

export interface TalentPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  deliverables: string[];
  duration: string;
  revisions: number;
  popular: boolean;
}

export interface TalentAchievement {
  id: string;
  title: string;
  issuer: string;
  year: string;
  icon?: string;
}

export interface TalentProfile {
  id: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  status: TalentStatus;
  isFeatured: boolean;
  isVerified: boolean;
  profileCompletion: number;
  views: number;
  likes: number;
  inquiries: number;

  firstName: string;
  lastName: string;
  displayName: string;
  stageName?: string;
  handle: string;
  avatar: string;
  coverImage: string;
  tagline: string;
  bio: string;

  category: TalentCategory;
  subCategories: string[];
  title: string;
  experienceLevel: ExperienceLevel;
  yearsOfExperience: number;
  nationality: string;
  location: string;
  languages: string[];

  gender: TalentGender;
  dateOfBirth?: string;
  measurements?: TalentMeasurements;

  hourlyRate?: string;
  dayRate?: string;
  currency: string;
  isAvailable: boolean;
  availabilityNote?: string;

  skills: TalentSkill[];
  experience: TalentExperience[];
  media: TalentMedia[];
  packages: TalentPackage[];
  achievements: TalentAchievement[];
  socialLinks: TalentSocialLinks;

  followerCount?: string;
  engagementRate?: string;
  totalReach?: string;

  // Portfolio Design & Template Settings
  portfolioTheme?: TalentPortfolioTheme;

  adminNotes?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export type PortfolioTemplateId =
  | 'editorial-vogue'
  | 'cinema-noir'
  | 'creative-pop'
  | 'executive-spotlight'
  | 'artisan-gallery'
  | 'athletic-performance'
  | 'minimal-modern'
  | 'acoustic-stage';

export interface TalentPortfolioTheme {
  templateId: PortfolioTemplateId;
  accentColor: 'amber' | 'gold' | 'emerald' | 'rose' | 'cyan' | 'purple' | 'slate' | 'blue' | 'indigo' | 'orange';
  fontStyle: 'serif' | 'sans' | 'mono' | 'display';
  heroLayout: 'widescreen' | 'magazine-split' | 'minimal-center' | 'fullscreen-video';
  galleryLayout: 'grid' | 'masonry' | 'featured';
  showMeasurements: boolean;
  showShowreelFirst: boolean;
  customHeading?: string;
}

export type TemplateDesignStyle =
  | 'Minimal'
  | 'Modern'
  | 'Creative'
  | 'Luxury'
  | 'Cinematic'
  | 'Professional'
  | 'Bold'
  | 'Elegant'
  | 'Editorial';

export type TemplatePortfolioType =
  | 'Profile-focused'
  | 'Portfolio-focused'
  | 'Gallery-focused'
  | 'Resume/CV-focused'
  | 'Video-focused'
  | 'Social-media-focused'
  | 'Personal-brand-focused';

export type TemplatePrimaryGroup = 'entertainment' | 'creative' | 'professional' | 'digital-tech' | 'other';

export interface PortfolioTemplateDefinition {
  id: PortfolioTemplateId;
  name: string;
  tagline: string;
  description: string;
  categoryFit: string;
  primaryGroup: TemplatePrimaryGroup;
  bestFor: string[];
  professions: string[];
  designStyle: TemplateDesignStyle;
  portfolioType: TemplatePortfolioType;
  colorStyle: string;
  layoutType: string;
  previewGradient: string;
  accentColor: 'amber' | 'gold' | 'emerald' | 'rose' | 'cyan' | 'purple' | 'slate' | 'blue' | 'indigo' | 'orange';
  fontStyle: 'serif' | 'sans' | 'mono' | 'display';
  heroLayout: 'widescreen' | 'magazine-split' | 'minimal-center' | 'fullscreen-video';
  galleryLayout: 'grid' | 'masonry' | 'featured';
  previewImage: string;
  badge: string;
  tier: 'free' | 'pro';
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  features: string[];
  demoData: {
    headline: string;
    specialties: string[];
    stat1: { label: string; value: string };
    stat2: { label: string; value: string };
    sampleBio: string;
  };
}

export const TALENT_PORTFOLIO_TEMPLATES: PortfolioTemplateDefinition[] = [
  {
    id: 'editorial-vogue',
    name: 'Editorial Vogue',
    tagline: 'Haute Couture & Luxury Editorial Magazine Style',
    description: 'A prestigious, luxury magazine-style portfolio layout designed specifically for fashion models, runway talent, beauty icons, and couture stylists.',
    categoryFit: 'Models, High Fashion, Actresses, Stylists & Beauty Creators',
    primaryGroup: 'entertainment',
    bestFor: ['Model', 'Actor', 'Designer', 'Influencer'],
    professions: ['Fashion Model', 'Editorial Model', 'Runway Model', 'Beauty Ambassador', 'Stylist'],
    designStyle: 'Editorial',
    portfolioType: 'Profile-focused',
    colorStyle: 'Gold Luxury',
    layoutType: 'Magazine Split',
    previewGradient: 'from-amber-900/40 via-zinc-900 to-black',
    accentColor: 'gold',
    fontStyle: 'serif',
    heroLayout: 'magazine-split',
    galleryLayout: 'masonry',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop',
    badge: 'LUXURY EDITORIAL',
    tier: 'pro',
    isFeatured: true,
    rating: 4.95,
    reviewsCount: 342,
    features: [
      'Magazine Cover Dual-Split Hero Layout',
      'Physical Measurements & Specs Matrix',
      'High-Fashion Masonry Photo Wall',
      'Sophisticated Vogue Serif Typography'
    ],
    demoData: {
      headline: 'International High Fashion & Runway Model',
      specialties: ['Haute Couture', 'Paris & Milan Runway', 'Editorial Cover Stories', 'Beauty Campaigns'],
      stat1: { label: 'Magazine Covers', value: '24+' },
      stat2: { label: 'Runway Shows', value: '80+' },
      sampleBio: 'International fashion model represented across Dubai, Paris, and Milan. Regularly featured in Vogue, Harper’s Bazaar, and Elle with extensive high-fashion campaign experience.'
    }
  },
  {
    id: 'cinema-noir',
    name: 'Cinematic Noir & 4K Reel',
    tagline: 'Widescreen Theatre Showreel & Dramatic Film Focus',
    description: 'Built for actors, screenwriters, filmmakers, stunt coordinators, and theatre performers who need their video showreel to take center stage.',
    categoryFit: 'Actors, Screen Talent, Directors, Stunt Artists & Hosts',
    primaryGroup: 'entertainment',
    bestFor: ['Actor', 'Creator', 'Host', 'Musician', 'Comedian'],
    professions: ['Film Actor', 'TV Drama Lead', 'Theatre Artist', 'Voiceover Actor', 'Stunt Performer'],
    designStyle: 'Cinematic',
    portfolioType: 'Video-focused',
    colorStyle: 'Obsidian Red',
    layoutType: 'Widescreen 21:9',
    previewGradient: 'from-red-950/40 via-zinc-950 to-black',
    accentColor: 'amber',
    fontStyle: 'display',
    heroLayout: 'widescreen',
    galleryLayout: 'grid',
    previewImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=400&fit=crop',
    badge: 'THEATRE / 4K REEL',
    tier: 'free',
    isFeatured: true,
    rating: 4.92,
    reviewsCount: 289,
    features: [
      '21:9 Ultra-Widescreen Theatrical Showreel Player',
      'IMDb & Production Film Credits Timeline',
      'Obsidian Red Stage Light Contrast',
      'Audition & Character Reel Video Wall'
    ],
    demoData: {
      headline: 'Dramatic & Feature Film Screen Actor',
      specialties: ['Feature Films', 'Streaming Series', 'Method Acting', 'Commercials'],
      stat1: { label: 'Feature Films', value: '12' },
      stat2: { label: 'Festival Awards', value: '5' },
      sampleBio: 'Award-nominated screen actor with diverse experience across psychological thrillers, period dramas, and commercial productions. Known for intense character immersion.'
    }
  },
  {
    id: 'creative-pop',
    name: 'Creative Pop & Cyber Neon',
    tagline: 'High-Voltage Gradient Glow for Viral Creators & Performers',
    description: 'Vibrant, high-energy layout tailored for social media influencers, digital creators, viral dancers, and modern performers with huge reach.',
    categoryFit: 'Content Creators, Influencers, Dancers, Musicians & Streamers',
    primaryGroup: 'creative',
    bestFor: ['Creator', 'Influencer', 'Dancer', 'Singer', 'Musician'],
    professions: ['Digital Creator', 'TikTok Influencer', 'YouTube Creator', 'Viral Dancer', 'Streamer'],
    designStyle: 'Creative',
    portfolioType: 'Social-media-focused',
    colorStyle: 'Cyber Neon',
    layoutType: 'Bento Matrix',
    previewGradient: 'from-purple-950/50 via-pink-950/30 to-black',
    accentColor: 'purple',
    fontStyle: 'sans',
    heroLayout: 'fullscreen-video',
    galleryLayout: 'masonry',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    badge: 'VIRAL & DYNAMIC',
    tier: 'free',
    isFeatured: true,
    rating: 4.88,
    reviewsCount: 512,
    features: [
      'Floating Social Metric Badges (Reach & Views)',
      'Multi-Platform Short Reels Video Feed',
      'Neon Cyber Gradient Ambient Accents',
      'Interactive Brand Collab Rate Packages'
    ],
    demoData: {
      headline: 'Digital Storyteller & Viral Creator — 5M+ Community',
      specialties: ['Short-Form Reels', 'Brand Activations', 'Tech & Lifestyle', 'Global Travel'],
      stat1: { label: 'Total Reach', value: '8.5M+' },
      stat2: { label: 'Video Views', value: '500M+' },
      sampleBio: 'Digital storyteller creating viral visual experiences. Collaborated with Fortune 500 brands on high-converting social campaigns and documentary reels.'
    }
  },
  {
    id: 'artisan-gallery',
    name: 'Artisan Studio & Visual Wall',
    tagline: 'Minimalist Museum-Grade Exhibition for Visual Artists',
    description: 'A clean, distraction-free visual exhibition space made for professional photographers, creative directors, illustrators, and fine artists.',
    categoryFit: 'Photographers, Painters, Illustrators, Designers & Fine Artists',
    primaryGroup: 'creative',
    bestFor: ['Photographer', 'Designer', 'Artist', 'Writer'],
    professions: ['Fashion Photographer', 'Creative Director', 'Visual Artist', 'Graphic Designer', 'Illustrator'],
    designStyle: 'Minimal',
    portfolioType: 'Gallery-focused',
    colorStyle: 'Emerald Minimal',
    layoutType: 'Museum Masonry',
    previewGradient: 'from-emerald-950/30 via-zinc-900 to-black',
    accentColor: 'emerald',
    fontStyle: 'mono',
    heroLayout: 'minimal-center',
    galleryLayout: 'masonry',
    previewImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop',
    badge: 'VISUAL EXHIBITION',
    tier: 'free',
    isFeatured: false,
    rating: 4.96,
    reviewsCount: 198,
    features: [
      'Museum-Grade Visual Masonry Lightbox',
      'Gear Specifications & Exhibition History',
      'High-Resolution Zoom Inspection Mode',
      'Curated Project Stories & Client Briefs'
    ],
    demoData: {
      headline: 'Commercial & Fine Art Visual Photographer',
      specialties: ['Editorial Portraits', 'Architectural Stills', 'Lookbook Shoots', 'Fine Art Exhibitions'],
      stat1: { label: 'Published Series', value: '45' },
      stat2: { label: 'Gallery Exhibits', value: '18' },
      sampleBio: 'Visual artist specializing in high-contrast architectural and fashion photography. Works exhibited in London, Berlin, and Tokyo galleries.'
    }
  },
  {
    id: 'executive-spotlight',
    name: 'Executive Keynote & Author',
    tagline: 'Authoritative Poise for Speakers, Founders & Thought Leaders',
    description: 'Commanding corporate layout designed for keynote speakers, business consultants, authors, executive coaches, and corporate trainers.',
    categoryFit: 'Keynote Speakers, Entrepreneurs, Authors, Coaches & Hosts',
    primaryGroup: 'professional',
    bestFor: ['Speaker', 'Entrepreneur', 'Writer', 'Host'],
    professions: ['Keynote Speaker', 'Executive Coach', 'Corporate Trainer', 'Author & Columnist', 'Founder'],
    designStyle: 'Professional',
    portfolioType: 'Resume/CV-focused',
    colorStyle: 'Executive Blue',
    layoutType: 'Clean Minimal',
    previewGradient: 'from-blue-950/40 via-slate-900 to-black',
    accentColor: 'cyan',
    fontStyle: 'sans',
    heroLayout: 'minimal-center',
    galleryLayout: 'grid',
    previewImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop',
    badge: 'GLOBAL KEYNOTE',
    tier: 'pro',
    isFeatured: true,
    rating: 4.91,
    reviewsCount: 175,
    features: [
      'Keynote Topics & Booking Honorarium Grid',
      'Press Mentions, TV & Forbes Features Row',
      'Executive Career Summary & Advisory Credentials',
      'Direct Corporate Speaking Inquiry System'
    ],
    demoData: {
      headline: 'Global Keynote Speaker & Bestselling Author on AI Strategy',
      specialties: ['Future of AI', 'Executive Leadership', 'Digital Transformation', 'Boardroom Advisory'],
      stat1: { label: 'Keynotes Delivered', value: '150+' },
      stat2: { label: 'Global Audience', value: '250K+' },
      sampleBio: 'Renowned keynote speaker and advisor to global leadership teams. Author of two bestselling books on leadership in the artificial intelligence era.'
    }
  },
  {
    id: 'athletic-performance',
    name: 'Athletic Pro & Kinetic Power',
    tagline: 'High-Contrast Kinetic Power for Athletes & Fitness Stars',
    description: 'High-octane energetic showcase featuring athletic statistics, championship accolades, fitness training reels, and brand sponsorship packages.',
    categoryFit: 'Athletes, Fitness Creators, Trainers, Martial Artists & Stunts',
    primaryGroup: 'entertainment',
    bestFor: ['Athlete', 'Dancer', 'Creator'],
    professions: ['Professional Athlete', 'Fitness Creator', 'Olympic Contender', 'Personal Trainer', 'Martial Artist'],
    designStyle: 'Bold',
    portfolioType: 'Personal-brand-focused',
    colorStyle: 'Monochrome',
    layoutType: 'Widescreen 21:9',
    previewGradient: 'from-lime-950/40 via-zinc-950 to-black',
    accentColor: 'emerald',
    fontStyle: 'display',
    heroLayout: 'widescreen',
    galleryLayout: 'grid',
    previewImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=400&fit=crop',
    badge: 'PRO ATHLETIC',
    tier: 'free',
    isFeatured: false,
    rating: 4.87,
    reviewsCount: 142,
    features: [
      'Championship Accolades & Trophy Matrix',
      'Physical Stats & Kinetic Performance Metrics',
      'Brand Sponsorship Partnership Packages',
      'High-Speed Training Video Clip Grid'
    ],
    demoData: {
      headline: 'Championship Athlete & Elite High-Performance Coach',
      specialties: ['Endurance Training', 'Sponsorship Campaigns', 'Athletic Masterclasses', 'Speed & Agility'],
      stat1: { label: 'National Medals', value: '8' },
      stat2: { label: 'Athletes Coached', value: '1,200+' },
      sampleBio: 'Decorated national athlete and certified high-performance coach. Featured in global sportswear campaigns and fitness expos.'
    }
  },
  {
    id: 'minimal-modern',
    name: 'Minimalist Monospace',
    tagline: 'Clean Modern Typography for Developers, Writers & Tech Minds',
    description: 'A crisp, hyper-legible minimalist design prioritizing case studies, technical proficiencies, writings, and intellectual contributions.',
    categoryFit: 'Developers, UI/UX Designers, Tech Creators, Writers & Consultants',
    primaryGroup: 'digital-tech',
    bestFor: ['Writer', 'Designer', 'Entrepreneur', 'Creator'],
    professions: ['UI/UX Architect', 'Fullstack Engineer', 'Tech Columnist', 'Product Designer', 'AI Researcher'],
    designStyle: 'Minimal',
    portfolioType: 'Resume/CV-focused',
    colorStyle: 'Monochrome',
    layoutType: 'Clean Minimal',
    previewGradient: 'from-zinc-900 via-zinc-950 to-black',
    accentColor: 'slate',
    fontStyle: 'mono',
    heroLayout: 'minimal-center',
    galleryLayout: 'grid',
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop',
    badge: 'TECH & MINIMAL',
    tier: 'free',
    isFeatured: false,
    rating: 4.93,
    reviewsCount: 215,
    features: [
      'Monospace Modern Typographic Hierarchy',
      'Interactive Project Case Studies & Stack Badges',
      'Publication & Medium Article Feed',
      'Transparent Consulting Hourly & Sprint Rates'
    ],
    demoData: {
      headline: 'Product Designer & Design Systems Architect',
      specialties: ['Design Systems', 'Fintech UX', 'Design Engineering', 'User Research'],
      stat1: { label: 'Products Shipped', value: '30+' },
      stat2: { label: 'Design Awards', value: '7' },
      sampleBio: 'Product designer focusing on accessible, high-scale digital interfaces and design systems. Former design lead for Silicon Valley startups.'
    }
  },
  {
    id: 'acoustic-stage',
    name: 'Acoustic Stage & Soundwaves',
    tagline: 'Concert Lighting & Audio Tracklist for Musicians & Singers',
    description: 'Dynamic concert-inspired portfolio with audio playlist embeds, upcoming tour dates, album releases, and direct booking for live stage events.',
    categoryFit: 'Musicians, Singers, DJs, Producers & Band Members',
    primaryGroup: 'entertainment',
    bestFor: ['Musician', 'Singer', 'Dancer', 'Host'],
    professions: ['Vocalist & Songwriter', 'Music Producer', 'Concert Pianist', 'DJ & Electronic Artist', 'Session Guitarist'],
    designStyle: 'Creative',
    portfolioType: 'Video-focused',
    colorStyle: 'Obsidian Red',
    layoutType: 'Concert Stage',
    previewGradient: 'from-indigo-950/50 via-purple-950/30 to-black',
    accentColor: 'indigo',
    fontStyle: 'display',
    heroLayout: 'fullscreen-video',
    galleryLayout: 'grid',
    previewImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop',
    badge: 'AUDIO & CONCERT',
    tier: 'pro',
    isFeatured: true,
    rating: 4.94,
    reviewsCount: 310,
    features: [
      'Live Stage Audio Player & Discography Wall',
      'Tour Dates & Gig Availability Calendar',
      'Spotify & Apple Music Streaming Badges',
      'Live Performance Technical Rider Checklist'
    ],
    demoData: {
      headline: 'International Recording Vocalist & Producer',
      specialties: ['Live Concerts', 'Original Score', 'Acoustic Sets', 'Studio Vocals'],
      stat1: { label: 'Spotify Streams', value: '15M+' },
      stat2: { label: 'Concerts Performed', value: '120+' },
      sampleBio: 'Chart-topping recording artist and composer with a blend of soul, contemporary acoustics, and electronic ambient textures. Touring internationally.'
    }
  }
];

export interface TalentInquiry {
  id: string;
  talentId: string;
  talentName: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  repliedAt?: string;
}

export interface TalentFilter {
  category?: TalentCategory | 'all';
  location?: string;
  gender?: TalentGender | 'all';
  experienceLevel?: ExperienceLevel | 'all';
  isAvailable?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: 'newest' | 'popular' | 'views' | 'featured';
}

export const TALENT_CATEGORIES: { value: TalentCategory; label: string; icon: string; color: string }[] = [
  { value: 'model', label: 'Model', icon: '👗', color: 'from-pink-500 to-rose-600' },
  { value: 'actor', label: 'Actor', icon: '🎭', color: 'from-purple-500 to-indigo-600' },
  { value: 'musician', label: 'Musician', icon: '🎵', color: 'from-blue-500 to-cyan-600' },
  { value: 'singer', label: 'Singer', icon: '🎤', color: 'from-amber-500 to-orange-600' },
  { value: 'dancer', label: 'Dancer', icon: '💃', color: 'from-fuchsia-500 to-pink-600' },
  { value: 'influencer', label: 'Influencer', icon: '📱', color: 'from-emerald-500 to-teal-600' },
  { value: 'creator', label: 'Creator', icon: '🎬', color: 'from-red-500 to-rose-600' },
  { value: 'photographer', label: 'Photographer', icon: '📸', color: 'from-slate-500 to-zinc-600' },
  { value: 'designer', label: 'Designer', icon: '🎨', color: 'from-violet-500 to-purple-600' },
  { value: 'artist', label: 'Artist', icon: '🖌️', color: 'from-orange-500 to-amber-600' },
  { value: 'speaker', label: 'Speaker', icon: '🎙️', color: 'from-sky-500 to-blue-600' },
  { value: 'writer', label: 'Writer', icon: '✍️', color: 'from-lime-500 to-green-600' },
  { value: 'athlete', label: 'Athlete', icon: '🏆', color: 'from-yellow-500 to-amber-600' },
  { value: 'entrepreneur', label: 'Entrepreneur', icon: '🚀', color: 'from-indigo-500 to-blue-600' },
  { value: 'comedian', label: 'Comedian', icon: '😄', color: 'from-yellow-400 to-orange-500' },
  { value: 'host', label: 'Host / MC', icon: '🎟️', color: 'from-teal-500 to-cyan-600' },
  { value: 'other', label: 'Other', icon: '⭐', color: 'from-gray-500 to-zinc-600' },
];

export const CATEGORY_LABEL_MAP: Record<TalentCategory, string> = {
  actor: 'Actor', model: 'Model', musician: 'Musician', singer: 'Singer',
  dancer: 'Dancer', creator: 'Creator', influencer: 'Influencer',
  photographer: 'Photographer', designer: 'Designer', artist: 'Artist',
  speaker: 'Speaker', writer: 'Writer', athlete: 'Athlete',
  entrepreneur: 'Entrepreneur', comedian: 'Comedian', host: 'Host / MC', other: 'Other',
};

