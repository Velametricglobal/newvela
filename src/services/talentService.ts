// ============================================================================
// VELAMETRIC — TALENT SERVICE (localStorage-based)
// ============================================================================
import type {
  TalentProfile, TalentInquiry, TalentFilter, TalentCategory,
  TalentStatus
} from '../types/talent.types';

const TALENT_KEY = 'velametric_talents';
const INQUIRY_KEY = 'velametric_talent_inquiries';
const TALENT_SESSION_KEY = 'velametric_talent_session';

// ── Seed Data ──────────────────────────────────────────────────────────────

const SEED_TALENTS: TalentProfile[] = [
  {
    id: 't1', email: 'sofia@example.com', createdAt: '2024-01-15', updatedAt: '2024-06-10',
    status: 'featured', isFeatured: true, isVerified: true, profileCompletion: 97,
    views: 12450, likes: 3200, inquiries: 48,
    firstName: 'Sofia', lastName: 'Reyes', displayName: 'Sofia Reyes',
    stageName: 'SOFIA R', handle: 'sofia_reyes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=500&fit=crop',
    tagline: 'Haute Couture & Editorial Model — Redefining Elegance',
    bio: 'International fashion model with 8 years of runway experience. Featured in Vogue, Harper\'s Bazaar, and Elle. Specializing in editorial, haute couture, and luxury brand campaigns.',
    category: 'model', subCategories: ['editorial', 'runway', 'commercial'],
    title: 'International Fashion Model', experienceLevel: 'expert', yearsOfExperience: 8,
    nationality: 'Spanish', location: 'Dubai, UAE', languages: ['English', 'Spanish', 'French'],
    gender: 'female', dateOfBirth: '1997-03-21',
    measurements: { height: '5\'11"', weight: '58kg', chest: '34"', waist: '24"', hips: '35"', shoeSize: 'EU 39', eyeColor: 'Hazel', hairColor: 'Dark Brown', skinTone: 'Medium' },
    hourlyRate: '15,000', dayRate: '75,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Runway Walking', proficiency: 98 },
      { id: 's2', name: 'Editorial Posing', proficiency: 95 },
      { id: 's3', name: 'Commercial Acting', proficiency: 80 },
      { id: 's4', name: 'Brand Collaboration', proficiency: 90 },
    ],
    experience: [
      { id: 'e1', role: 'Lead Model', company: 'Louis Vuitton', type: 'Runway Show', year: '2024', description: 'Paris Fashion Week SS24' },
      { id: 'e2', role: 'Cover Model', company: 'Vogue Arabia', type: 'Editorial', year: '2023', description: 'Annual beauty issue cover shoot' },
      { id: 'e3', role: 'Brand Ambassador', company: 'Dior Beauty', type: 'Campaign', year: '2023', description: 'Middle East fragrance campaign' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop', title: 'Editorial SS24', category: 'editorial', featured: true, views: 5200, likes: 890, uploadedAt: '2024-05-01' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop', title: 'Luxury Campaign', category: 'commercial', featured: true, views: 3800, likes: 720, uploadedAt: '2024-04-15' },
      { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1529139574466-a303027614a8?w=800&h=1000&fit=crop', title: 'Runway Paris', category: 'runway', featured: false, views: 2100, likes: 450, uploadedAt: '2024-03-10' },
      { id: 'm4', type: 'image', url: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&h=600&fit=crop', title: 'Beach Editorial', category: 'editorial', featured: false, views: 1800, likes: 340, uploadedAt: '2024-02-20' },
    ],
    packages: [
      { id: 'p1', name: 'Editorial Session', description: 'Full day editorial shoot', price: '75000', currency: 'INR', deliverables: ['8hr shoot', '20 edited images', '2 outfit changes', 'Usage rights 1yr'], duration: '1 Day', revisions: 2, popular: false },
      { id: 'p2', name: 'Brand Campaign', description: 'Complete brand campaign package', price: '150000', currency: 'INR', deliverables: ['2-day shoot', '50 edited images', 'Video content', 'Social media rights', 'Unlimited revisions'], duration: '2 Days', revisions: 0, popular: true },
    ],
    achievements: [
      { id: 'a1', title: 'Model of the Year', issuer: 'Dubai Fashion Week', year: '2023', icon: '🏆' },
      { id: 'a2', title: 'Top 50 Models', issuer: 'Vogue Arabia', year: '2024', icon: '⭐' },
    ],
    socialLinks: { instagram: 'sofia_reyes', youtube: 'SofiaReyesOfficial', website: 'https://sofiareyes.com' },
    followerCount: '2.1M', engagementRate: '5.8%', totalReach: '8.5M',
    portfolioTheme: {
      templateId: 'editorial-vogue',
      accentColor: 'gold',
      fontStyle: 'serif',
      heroLayout: 'magazine-split',
      galleryLayout: 'masonry',
      showMeasurements: true,
      showShowreelFirst: false,
      customHeading: 'Editorial Portfolio & Haute Couture Works'
    },
  },
  {
    id: 't2', email: 'marcus@example.com', createdAt: '2024-02-20', updatedAt: '2024-06-01',
    status: 'featured', isFeatured: true, isVerified: true, profileCompletion: 92,
    views: 8920, likes: 2100, inquiries: 31,
    firstName: 'Marcus', lastName: 'Chen', displayName: 'Marcus Chen',
    stageName: 'MarcusC', handle: 'marcus_creates',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&h=500&fit=crop',
    tagline: 'Viral Content Creator & Digital Storyteller — 5M+ Followers',
    bio: 'Award-winning content creator and digital storyteller. My reels have amassed over 500M views globally. I specialise in lifestyle, travel, and tech content with cinematic quality.',
    category: 'creator', subCategories: ['lifestyle', 'travel', 'tech'],
    title: 'Content Creator & Filmmaker', experienceLevel: 'expert', yearsOfExperience: 6,
    nationality: 'Chinese-British', location: 'London, UK', languages: ['English', 'Mandarin'],
    gender: 'male', dateOfBirth: '1996-07-14',
    hourlyRate: '20,000', dayRate: '1,00,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Short-Form Video', proficiency: 97 },
      { id: 's2', name: 'Storytelling', proficiency: 93 },
      { id: 's3', name: 'Brand Integration', proficiency: 88 },
      { id: 's4', name: 'Photography', proficiency: 85 },
    ],
    experience: [
      { id: 'e1', role: 'Brand Ambassador', company: 'Apple', type: 'Campaign', year: '2024', description: 'iPhone 15 Pro launch campaign' },
      { id: 'e2', role: 'Content Creator', company: 'Emirates Airlines', type: 'Travel Series', year: '2023', description: '12-episode travel documentary series' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop', title: 'Travel Content', category: 'travel', featured: true, views: 4500, likes: 920, uploadedAt: '2024-05-15' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', title: 'Tech Review', category: 'tech', featured: true, views: 3200, likes: 680, uploadedAt: '2024-04-20' },
      { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop', title: 'Lifestyle Shoot', category: 'lifestyle', featured: false, views: 2800, likes: 540, uploadedAt: '2024-03-25' },
    ],
    packages: [
      { id: 'p1', name: 'Instagram Reel', description: 'One branded reel with story', price: '50000', currency: 'INR', deliverables: ['60s Reel', '3 Stories', 'Caption & hashtags', '30-day rights'], duration: '3 Days', revisions: 2, popular: false },
      { id: 'p2', name: 'Full Campaign', description: 'Multi-platform brand campaign', price: '250000', currency: 'INR', deliverables: ['3 Reels', '10 Stories', '2 YouTube videos', 'Blog post', 'Full rights'], duration: '2 Weeks', revisions: 0, popular: true },
    ],
    achievements: [
      { id: 'a1', title: 'Creator of the Year', issuer: 'Social Media Awards UK', year: '2023', icon: '🏆' },
      { id: 'a2', title: '500M Views Milestone', issuer: 'TikTok', year: '2024', icon: '🎬' },
    ],
    socialLinks: { instagram: 'marcus_creates', youtube: 'MarcusChenOfficial', tiktok: 'marcus_creates' },
    followerCount: '5.2M', engagementRate: '7.2%', totalReach: '15M',
    portfolioTheme: {
      templateId: 'creative-pop',
      accentColor: 'purple',
      fontStyle: 'sans',
      heroLayout: 'fullscreen-video',
      galleryLayout: 'masonry',
      showMeasurements: false,
      showShowreelFirst: true,
      customHeading: 'Viral Content, Cinema Reels & Brand Collaborations'
    },
  },
  {
    id: 't3', email: 'priya@example.com', createdAt: '2024-03-10', updatedAt: '2024-06-05',
    status: 'active', isFeatured: false, isVerified: true, profileCompletion: 85,
    views: 5640, likes: 1340, inquiries: 19,
    firstName: 'Priya', lastName: 'Sharma', displayName: 'Priya Sharma',
    handle: 'priya_dances',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&h=500&fit=crop',
    tagline: 'Classical & Contemporary Dance Artist — Bridging Traditions',
    bio: 'Award-winning dancer trained in Bharatanatyam, Contemporary, and Bollywood styles. Performed at 50+ international festivals and collaborated with major film productions.',
    category: 'dancer', subCategories: ['classical', 'contemporary', 'bollywood'],
    title: 'Professional Dance Artist & Choreographer', experienceLevel: 'professional', yearsOfExperience: 10,
    nationality: 'Indian', location: 'Mumbai, India', languages: ['English', 'Hindi', 'Tamil'],
    gender: 'female',
    hourlyRate: '10,000', dayRate: '45,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Bharatanatyam', proficiency: 97 },
      { id: 's2', name: 'Contemporary Dance', proficiency: 88 },
      { id: 's3', name: 'Choreography', proficiency: 90 },
      { id: 's4', name: 'Film Performance', proficiency: 82 },
    ],
    experience: [
      { id: 'e1', role: 'Lead Dancer', company: 'Bollywood Film XYZ', type: 'Film', year: '2024', description: 'Lead dance role in blockbuster film' },
      { id: 'e2', role: 'Choreographer', company: 'IIFA Awards', type: 'Event', year: '2023', description: 'Main stage choreography' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=1000&fit=crop', title: 'Classical Performance', category: 'classical', featured: true, views: 3200, likes: 780, uploadedAt: '2024-05-10' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1000&fit=crop', title: 'Contemporary Show', category: 'contemporary', featured: true, views: 2100, likes: 420, uploadedAt: '2024-04-01' },
    ],
    packages: [
      { id: 'p1', name: 'Performance', description: 'Live performance up to 45 mins', price: '45000', currency: 'INR', deliverables: ['Solo performance', '45 min duration', 'Costume included', 'Music arrangement'], duration: '1 Day', revisions: 0, popular: true },
    ],
    achievements: [
      { id: 'a1', title: 'Best Classical Dancer', issuer: 'National Dance Awards India', year: '2022', icon: '🏆' },
    ],
    socialLinks: { instagram: 'priya_dances', youtube: 'PriyaSharmaArt' },
    followerCount: '380K', engagementRate: '6.1%', totalReach: '1.2M',
    portfolioTheme: {
      templateId: 'cinema-noir',
      accentColor: 'amber',
      fontStyle: 'display',
      heroLayout: 'widescreen',
      galleryLayout: 'grid',
      showMeasurements: false,
      showShowreelFirst: true,
      customHeading: 'Stage Performances, Choreography & Film Works'
    },
  },
  {
    id: 't4', email: 'alex@example.com', createdAt: '2024-01-05', updatedAt: '2024-05-20',
    status: 'featured', isFeatured: true, isVerified: true, profileCompletion: 94,
    views: 9800, likes: 2750, inquiries: 42,
    firstName: 'Alex', lastName: 'Rivera', displayName: 'Alex Rivera',
    handle: 'alex_sports',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop',
    tagline: 'Professional Athlete & Fitness Influencer — Pushing Human Limits',
    bio: 'Professional CrossFit athlete and fitness influencer. 3x National Champion, fitness coach, and brand ambassador for top sports brands. Inspiring millions to pursue peak performance.',
    category: 'athlete', subCategories: ['crossfit', 'fitness', 'coaching'],
    title: 'Professional Athlete & Fitness Coach', experienceLevel: 'expert', yearsOfExperience: 12,
    nationality: 'American', location: 'Los Angeles, USA', languages: ['English', 'Spanish'],
    gender: 'male', measurements: { height: '6\'1"', weight: '88kg' },
    hourlyRate: '12,000', dayRate: '60,000', currency: 'INR', isAvailable: false, availabilityNote: 'Available from August 2024',
    skills: [
      { id: 's1', name: 'CrossFit', proficiency: 99 },
      { id: 's2', name: 'Personal Training', proficiency: 92 },
      { id: 's3', name: 'Fitness Modeling', proficiency: 87 },
      { id: 's4', name: 'Brand Endorsement', proficiency: 85 },
    ],
    experience: [
      { id: 'e1', role: 'Brand Ambassador', company: 'Nike', type: 'Endorsement', year: '2024', description: 'Global training campaign' },
      { id: 'e2', role: 'Athlete', company: 'CrossFit Games', type: 'Competition', year: '2023', description: '2nd place finish at CrossFit Games' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop', title: 'Training Shot', category: 'fitness', featured: true, views: 5600, likes: 1200, uploadedAt: '2024-05-20' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop', title: 'Competition Day', category: 'sports', featured: true, views: 4200, likes: 950, uploadedAt: '2024-04-10' },
    ],
    packages: [
      { id: 'p1', name: 'Sponsored Post', description: 'Instagram post + story', price: '75000', currency: 'INR', deliverables: ['1 Feed post', '3 Stories', 'Caption', '60-day rights'], duration: '5 Days', revisions: 1, popular: true },
    ],
    achievements: [
      { id: 'a1', title: '3x National CrossFit Champion', issuer: 'CrossFit Inc.', year: '2022', icon: '🏆' },
      { id: 'a2', title: 'Fitness Influencer of the Year', issuer: 'Men\'s Health Awards', year: '2023', icon: '💪' },
    ],
    socialLinks: { instagram: 'alex_sports', youtube: 'AlexRiveraFitness', tiktok: 'alex_athlete' },
    followerCount: '3.8M', engagementRate: '8.5%', totalReach: '12M',
    portfolioTheme: {
      templateId: 'athletic-performance',
      accentColor: 'emerald',
      fontStyle: 'display',
      heroLayout: 'widescreen',
      galleryLayout: 'grid',
      showMeasurements: true,
      showShowreelFirst: false,
      customHeading: 'High Performance & Championship Records'
    },
  },
  {
    id: 't5', email: 'aisha@example.com', createdAt: '2024-02-01', updatedAt: '2024-06-08',
    status: 'active', isFeatured: false, isVerified: true, profileCompletion: 88,
    views: 4230, likes: 980, inquiries: 14,
    firstName: 'Aisha', lastName: 'Al-Rashid', displayName: 'Aisha Al-Rashid',
    stageName: 'AISHA', handle: 'aisha_speaks',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=500&fit=crop',
    tagline: 'Keynote Speaker & Leadership Coach — Inspiring Transformation',
    bio: 'International keynote speaker and certified leadership coach. TEDx speaker with 3M+ views. Empowering leaders and organizations to achieve transformational growth.',
    category: 'speaker', subCategories: ['leadership', 'entrepreneurship', 'motivation'],
    title: 'International Keynote Speaker', experienceLevel: 'expert', yearsOfExperience: 9,
    nationality: 'Emirati', location: 'Abu Dhabi, UAE', languages: ['English', 'Arabic'],
    gender: 'female',
    hourlyRate: '50,000', dayRate: '2,00,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Public Speaking', proficiency: 99 },
      { id: 's2', name: 'Leadership Coaching', proficiency: 95 },
      { id: 's3', name: 'Workshop Facilitation', proficiency: 92 },
      { id: 's4', name: 'TEDx Talks', proficiency: 90 },
    ],
    experience: [
      { id: 'e1', role: 'Keynote Speaker', company: 'World Economic Forum', type: 'Conference', year: '2024', description: 'Davos 2024 - Leadership in the AI Era' },
      { id: 'e2', role: 'TEDx Speaker', company: 'TEDxDubai', type: 'Talk', year: '2023', description: '"Leading with Empathy" - 3M+ views' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop', title: 'Keynote at WEF', category: 'speaking', featured: true, views: 2800, likes: 620, uploadedAt: '2024-05-05' },
    ],
    packages: [
      { id: 'p1', name: 'Keynote Address', description: 'Full keynote presentation up to 60 mins', price: '200000', currency: 'INR', deliverables: ['60-min keynote', 'Q&A session', 'Custom content', 'Pre-event call'], duration: '1 Day', revisions: 0, popular: true },
    ],
    achievements: [
      { id: 'a1', title: 'TEDx Speaker', issuer: 'TED', year: '2023', icon: '🎙️' },
      { id: 'a2', title: 'Top 30 under 30', issuer: 'Forbes Middle East', year: '2022', icon: '⭐' },
    ],
    socialLinks: { instagram: 'aisha_speaks', linkedin: 'aishaAlRashid', website: 'https://aishaspeaks.com' },
    followerCount: '890K', engagementRate: '4.2%', totalReach: '3.5M',
    portfolioTheme: {
      templateId: 'executive-spotlight',
      accentColor: 'cyan',
      fontStyle: 'sans',
      heroLayout: 'minimal-center',
      galleryLayout: 'grid',
      showMeasurements: false,
      showShowreelFirst: false,
      customHeading: 'Keynote Addresses, Board Advisory & Publications'
    },
  },
  {
    id: 't6', email: 'liam@example.com', createdAt: '2024-03-15', updatedAt: '2024-06-02',
    status: 'active', isFeatured: false, isVerified: false, profileCompletion: 72,
    views: 2890, likes: 620, inquiries: 8,
    firstName: 'Liam', lastName: 'O\'Connor', displayName: 'Liam O\'Connor',
    handle: 'liam_shoots',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=1200&h=500&fit=crop',
    tagline: 'Fashion & Portrait Photographer — Capturing Soul Through Lens',
    bio: 'Dublin-based fashion and portrait photographer. My work has been published in 20+ international magazines. Specializing in high-fashion, beauty, and conceptual photography.',
    category: 'photographer', subCategories: ['fashion', 'portrait', 'beauty'],
    title: 'Fashion & Portrait Photographer', experienceLevel: 'professional', yearsOfExperience: 7,
    nationality: 'Irish', location: 'Dublin, Ireland', languages: ['English'],
    gender: 'male',
    hourlyRate: '12,000', dayRate: '50,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Fashion Photography', proficiency: 94 },
      { id: 's2', name: 'Portrait Photography', proficiency: 91 },
      { id: 's3', name: 'Photo Retouching', proficiency: 88 },
      { id: 's4', name: 'Studio Lighting', proficiency: 92 },
    ],
    experience: [
      { id: 'e1', role: 'Photographer', company: 'Elle Ireland', type: 'Editorial', year: '2024', description: 'Summer fashion spread' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=800&h=1000&fit=crop', title: 'Fashion Portrait', category: 'fashion', featured: true, views: 1800, likes: 420, uploadedAt: '2024-05-25' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop', title: 'Beauty Editorial', category: 'beauty', featured: false, views: 1200, likes: 290, uploadedAt: '2024-04-18' },
    ],
    packages: [
      { id: 'p1', name: 'Portrait Session', description: 'Half-day portrait session', price: '30000', currency: 'INR', deliverables: ['4hr session', '20 edited photos', 'Online gallery', 'Print rights'], duration: '4 Hours', revisions: 2, popular: true },
    ],
    achievements: [
      { id: 'a1', title: 'Best Fashion Photography', issuer: 'Irish Photography Awards', year: '2023', icon: '📸' },
    ],
    socialLinks: { instagram: 'liam_shoots', website: 'https://liamphotography.ie' },
    followerCount: '145K', engagementRate: '5.5%', totalReach: '450K',
    portfolioTheme: {
      templateId: 'artisan-gallery',
      accentColor: 'emerald',
      fontStyle: 'mono',
      heroLayout: 'minimal-center',
      galleryLayout: 'masonry',
      showMeasurements: false,
      showShowreelFirst: false,
      customHeading: 'Visual Gallery & Editorial Archives'
    },
  },
  {
    id: 't7', email: 'aria@example.com', createdAt: '2024-02-14', updatedAt: '2024-06-15',
    status: 'featured', isFeatured: true, isVerified: true, profileCompletion: 99,
    views: 18450, likes: 4890, inquiries: 64,
    firstName: 'Aria', lastName: 'Varma', displayName: 'Aria Varma',
    stageName: 'ARIA V.', handle: 'aria_varma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Vogue Cover Model & International Runway Lead — Milan • Paris • Mumbai',
    bio: 'International haute couture & high-fashion model represented across Milan, Paris, and Mumbai. Specialized in architectural posing, luxury jewellery TVCs, avant-garde runway struts, and global fashion week openers.',
    category: 'model', subCategories: ['runway', 'editorial', 'high-fashion', 'commercial'],
    title: 'Haute Couture & International Runway Model', experienceLevel: 'expert', yearsOfExperience: 6,
    nationality: 'Indian', location: 'Mumbai & Milan', languages: ['English', 'Hindi', 'Italian'],
    gender: 'female', dateOfBirth: '1998-09-12',
    measurements: {
      height: "5'11\" / 180 cm",
      weight: '54 kg',
      chest: '33" / 84 cm',
      waist: '24" / 61 cm',
      hips: '35" / 89 cm',
      shoeSize: '8.5 US / 39 EU',
      eyeColor: 'Deep Hazel',
      hairColor: 'Obsidian Black',
      skinTone: 'Warm Olive'
    },
    hourlyRate: '18,000', dayRate: '95,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Haute Couture Runway Walk', proficiency: 99 },
      { id: 's2', name: 'Architectural Editorial Posing', proficiency: 97 },
      { id: 's3', name: 'High-Jewellery Commercial', proficiency: 94 },
      { id: 's4', name: 'Milan Fashion Week Lead', proficiency: 95 },
    ],
    experience: [
      { id: 'e1', role: 'Grand Finale Showstopper', company: 'Lakmé Fashion Week', type: 'Runway', year: '2024', description: 'Headline opener & showstopper for couture designer capsule' },
      { id: 'e2', role: 'Autumn Haute Couture Cover', company: 'Vogue Magazine', type: 'Editorial', year: '2024', description: 'Full 14-page spread shot on location in Milan' },
      { id: 'e3', role: 'Imperial Solitaires TVC Lead', company: 'Tanishq High Jewellery', type: 'Commercial', year: '2024', description: 'Global cinema and television campaign' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', title: 'Editorial Silhouette & Architectural Shadow', category: 'editorial', featured: true, views: 9800, likes: 2100, uploadedAt: '2024-05-15' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', title: 'Monochrome Comp-Card Beauty Portrait', category: 'comp-card', featured: true, views: 8200, likes: 1650, uploadedAt: '2024-05-01' },
      { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', title: 'Parisian Autumn Trench & Street Runway', category: 'runway', featured: true, views: 6400, likes: 1200, uploadedAt: '2024-04-20' },
      { id: 'm4', type: 'image', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80', title: 'High-Jewellery Solitaire Showcase', category: 'commercial', featured: false, views: 5100, likes: 980, uploadedAt: '2024-03-30' },
      { id: 'm5', type: 'image', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80', title: 'Full Length Natural Casting Slate', category: 'polaroid', featured: false, views: 4200, likes: 810, uploadedAt: '2024-03-10' },
    ],
    packages: [
      { id: 'p1', name: 'Runway & Fashion Week Appearance', description: 'Show opener/closer runway presentation + fitting', price: '95000', currency: 'INR', deliverables: ['Full day fitting attendance', 'Runway walks', 'Press call & photo call', '3 Social collabs'], duration: '1 Day', revisions: 0, popular: true },
      { id: 'p2', name: 'Editorial Print Campaign', description: 'Full-day studio or location haute couture shoot', price: '180000', currency: 'INR', deliverables: ['8-hour shoot', 'Full global print rights (1 yr)', 'Comp card highlights', 'BTS reel'], duration: '1 Day', revisions: 2, popular: false },
    ],
    achievements: [
      { id: 'a1', title: 'Top 10 Global Runway Breakthrough', issuer: 'Fashion Model Directory', year: '2024', icon: '🏆' },
      { id: 'a2', title: 'Vogue India 3x Cover Star', issuer: 'Condé Nast', year: '2024', icon: '✨' },
    ],
    socialLinks: { instagram: 'aria.varma', website: 'https://ariavarma.com' },
    followerCount: '620K', engagementRate: '6.4%', totalReach: '2.8M',
    portfolioTheme: {
      templateId: 'editorial-vogue',
      accentColor: 'gold',
      fontStyle: 'serif',
      heroLayout: 'magazine-split',
      galleryLayout: 'masonry',
      showMeasurements: true,
      showShowreelFirst: false,
      customHeading: 'Haute Couture Runway & International Editorial'
    },
  },
  {
    id: 't8', email: 'elena@example.com', createdAt: '2024-02-18', updatedAt: '2024-06-18',
    status: 'featured', isFeatured: true, isVerified: true, profileCompletion: 98,
    views: 14200, likes: 3650, inquiries: 41,
    firstName: 'Elena', lastName: 'Rostova', displayName: 'Elena Rostova',
    stageName: 'ELENA R.', handle: 'elena_rostova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Parisian Haute Couture & Fine Art Editorial — Chanel & Dior Collections',
    bio: 'Represented in Paris, Milan, and New York. Known for striking classical facial symmetry, dramatic sculptural movement, and extensive luxury bridal and haute couture print editorials.',
    category: 'model', subCategories: ['haute-couture', 'editorial', 'fine-art', 'bridal'],
    title: 'Parisian Haute Couture & Fine Art Model', experienceLevel: 'expert', yearsOfExperience: 7,
    nationality: 'French', location: 'Paris, France', languages: ['English', 'French', 'Russian'],
    gender: 'female', dateOfBirth: '1997-11-04',
    measurements: {
      height: "5'10.5\" / 179 cm",
      weight: '53 kg',
      chest: '34\" / 86 cm',
      waist: '24\" / 61 cm',
      hips: '35\" / 89 cm',
      shoeSize: '8 US / 38.5 EU',
      eyeColor: 'Ice Blue',
      hairColor: 'Platinum Ash',
      skinTone: 'Fair Porcelain'
    },
    hourlyRate: '16,000', dayRate: '85,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'High-Fashion Editorial Posing', proficiency: 98 },
      { id: 's2', name: 'Haute Couture Catwalk', proficiency: 96 },
      { id: 's3', name: 'Fine Art & Sculptural Movement', proficiency: 95 },
      { id: 's4', name: 'Luxury Fragrance TVC', proficiency: 92 },
    ],
    experience: [
      { id: 'e1', role: 'Runway Lead', company: 'Paris Haute Couture Week', type: 'Runway', year: '2024', description: 'Exclusively walked for 4 couture houses' },
      { id: 'e2', role: 'Cover Story', company: 'Numéro Paris', type: 'Editorial', year: '2024', description: 'Fine art cover and center spread' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', title: 'Porcelain Light Beauty Slate', category: 'comp-card', featured: true, views: 7600, likes: 1800, uploadedAt: '2024-05-18' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80', title: 'Grand Palais Runway Opening', category: 'runway', featured: true, views: 6200, likes: 1400, uploadedAt: '2024-04-22' },
      { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80', title: 'Autumn Parisian Trench Lookbook', category: 'editorial', featured: false, views: 4900, likes: 950, uploadedAt: '2024-03-15' },
    ],
    packages: [
      { id: 'p1', name: 'Paris Runway Appearance', description: 'Full day runway presentation and fittings', price: '85000', currency: 'INR', deliverables: ['Fittings attendance', 'Runway walks', 'Press call'], duration: '1 Day', revisions: 0, popular: true },
      { id: 'p2', name: 'Editorial Lookbook Shoot', description: 'Editorial catalog or magazine campaign', price: '160000', currency: 'INR', deliverables: ['8hr shoot', '25 retouched selections', 'Full digital rights'], duration: '1 Day', revisions: 2, popular: false },
    ],
    achievements: [
      { id: 'a1', title: 'Paris Fashion Week Best Debut', issuer: 'Federation de la Haute Couture', year: '2023', icon: '👑' },
    ],
    socialLinks: { instagram: 'elena_rostova', website: 'https://elenarostova.fr' },
    followerCount: '480K', engagementRate: '5.9%', totalReach: '1.9M',
    portfolioTheme: {
      templateId: 'editorial-vogue',
      accentColor: 'rose',
      fontStyle: 'serif',
      heroLayout: 'magazine-split',
      galleryLayout: 'masonry',
      showMeasurements: true,
      showShowreelFirst: false,
      customHeading: 'Paris Haute Couture, Runway & Fine Art Portfolio'
    },
  },
  {
    id: 't9', email: 'kaius@example.com', createdAt: '2024-02-25', updatedAt: '2024-06-20',
    status: 'featured', isFeatured: true, isVerified: true, profileCompletion: 96,
    views: 11200, likes: 2940, inquiries: 37,
    firstName: 'Kaius', lastName: 'Thorne', displayName: 'Kaius Thorne',
    stageName: 'KAIUS', handle: 'kaius_thorne',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    tagline: 'High-Fashion Male Runway & Avant-Garde Tailoring — New York • London',
    bio: 'International male model known for strong chiseled bone structure, architectural tailoring, athletic versatility, and luxury timepiece and menswear campaigns worldwide.',
    category: 'model', subCategories: ['menswear', 'runway', 'editorial', 'commercial'],
    title: 'High-Fashion Runway & Luxury Menswear Model', experienceLevel: 'expert', yearsOfExperience: 5,
    nationality: 'British-American', location: 'New York & London', languages: ['English', 'German'],
    gender: 'male', dateOfBirth: '1998-04-16',
    measurements: {
      height: "6'2\" / 188 cm",
      weight: '78 kg',
      chest: '38\" / 96 cm',
      waist: '30\" / 76 cm',
      hips: '38\" / 96 cm',
      shoeSize: '11 US / 44 EU',
      eyeColor: 'Emerald Green',
      hairColor: 'Dark Ash Brown',
      skinTone: 'Tan'
    },
    hourlyRate: '15,000', dayRate: '75,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Menswear Tailoring Posing', proficiency: 97 },
      { id: 's2', name: 'International Men Runway', proficiency: 96 },
      { id: 's3', name: 'Luxury Watch & Suit TVC', proficiency: 93 },
      { id: 's4', name: 'Fitness & Movement Slate', proficiency: 90 },
    ],
    experience: [
      { id: 'e1', role: 'Runway Opener', company: 'London Fashion Week Men', type: 'Runway', year: '2024', description: 'Opened SS25 Savile Row Tailoring Showcase' },
      { id: 'e2', role: 'Brand Face', company: 'Swiss Chronograph Co.', type: 'Commercial', year: '2024', description: 'Global print and digital timepiece campaign' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80', title: 'Studio Monochromatic Headshot', category: 'comp-card', featured: true, views: 5900, likes: 1300, uploadedAt: '2024-05-20' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', title: 'Architectural Menswear Suiting', category: 'editorial', featured: true, views: 4800, likes: 1100, uploadedAt: '2024-04-12' },
    ],
    packages: [
      { id: 'p1', name: 'Menswear Campaign Shoot', description: 'Full day studio/location lookbook & TVC', price: '75000', currency: 'INR', deliverables: ['8hr shoot', '30 retouched selects', 'Commercial usage rights (1 yr)'], duration: '1 Day', revisions: 2, popular: true },
    ],
    achievements: [
      { id: 'a1', title: 'GQ Men of the Year Nominee', issuer: 'GQ Magazine', year: '2024', icon: '⭐' },
    ],
    socialLinks: { instagram: 'kaius_thorne', website: 'https://kaiusthorne.com' },
    followerCount: '340K', engagementRate: '6.8%', totalReach: '1.4M',
    portfolioTheme: {
      templateId: 'cinema-noir',
      accentColor: 'amber',
      fontStyle: 'display',
      heroLayout: 'widescreen',
      galleryLayout: 'grid',
      showMeasurements: true,
      showShowreelFirst: false,
      customHeading: 'Menswear, Runway & Luxury Campaign Showcase'
    },
  },
  {
    id: 't10', email: 'maya@example.com', createdAt: '2024-03-01', updatedAt: '2024-06-22',
    status: 'featured', isFeatured: true, isVerified: true, profileCompletion: 97,
    views: 13800, likes: 3410, inquiries: 49,
    firstName: 'Maya', lastName: 'Lin', displayName: 'Maya Lin',
    stageName: 'MAYA LIN', handle: 'maya_lin_model',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Commercial Beauty, Luxury Skincare & High-Jewelry Ambassador',
    bio: 'Recognized face across Tokyo, Seoul, and Singapore. Specializing in macro skincare campaigns, clean beauty catalogs, and luxury high-jewelry endorsements with major international brands.',
    category: 'model', subCategories: ['beauty', 'commercial', 'skincare', 'jewelry'],
    title: 'Luxury Beauty & Commercial Skincare Model', experienceLevel: 'expert', yearsOfExperience: 6,
    nationality: 'Japanese-Singaporean', location: 'Tokyo & Singapore', languages: ['English', 'Japanese', 'Mandarin'],
    gender: 'female', dateOfBirth: '1999-01-28',
    measurements: {
      height: "5'9\" / 175 cm",
      weight: '51 kg',
      chest: '32\" / 81 cm',
      waist: '23.5\" / 60 cm',
      hips: '34\" / 86 cm',
      shoeSize: '7 US / 37.5 EU',
      eyeColor: 'Dark Obsidian',
      hairColor: 'Glossy Black',
      skinTone: 'Luminous Fair'
    },
    hourlyRate: '18,000', dayRate: '90,000', currency: 'INR', isAvailable: true,
    skills: [
      { id: 's1', name: 'Macro Beauty & Skincare Posing', proficiency: 99 },
      { id: 's2', name: 'Fine Jewelry Campaign Modeling', proficiency: 96 },
      { id: 's3', name: 'Commercial TVC Acting', proficiency: 92 },
      { id: 's4', name: 'Clean Catalog Lighting Response', proficiency: 95 },
    ],
    experience: [
      { id: 'e1', role: 'Global Campaign Ambassador', company: 'Shiseido Ginza Tokyo', type: 'Commercial', year: '2024', description: 'Radiance Serum worldwide campaign lead' },
      { id: 'e2', role: 'Jewelry Catalog Lead', company: 'Mikimoto Pearls', type: 'Campaign', year: '2024', description: 'Imperial Pearl collection lookbook' },
    ],
    media: [
      { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80', title: 'Luminous Dewy Skincare Macro', category: 'beauty', featured: true, views: 7800, likes: 1950, uploadedAt: '2024-05-25' },
      { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80', title: 'Studio Natural Light Comp-Card', category: 'comp-card', featured: true, views: 6400, likes: 1420, uploadedAt: '2024-05-10' },
    ],
    packages: [
      { id: 'p1', name: 'Commercial Beauty TVC & Print', description: 'Full day shoot with full commercial usage', price: '90000', currency: 'INR', deliverables: ['8hr shoot', '35 retouched selects', 'Global digital & print rights (1 yr)'], duration: '1 Day', revisions: 2, popular: true },
    ],
    achievements: [
      { id: 'a1', title: 'Asia Beauty Model of the Year', issuer: 'Tokyo Fashion Guild', year: '2023', icon: '🏆' },
    ],
    socialLinks: { instagram: 'maya_lin_model', website: 'https://mayalin.tokyo' },
    followerCount: '510K', engagementRate: '7.1%', totalReach: '2.4M',
    portfolioTheme: {
      templateId: 'editorial-vogue',
      accentColor: 'gold',
      fontStyle: 'serif',
      heroLayout: 'magazine-split',
      galleryLayout: 'masonry',
      showMeasurements: true,
      showShowreelFirst: false,
      customHeading: 'Commercial Beauty, Luminous Skincare & High Jewelry'
    },
  },
];

// ── Utility ────────────────────────────────────────────────────────────────

function sanitizeTalent(t: TalentProfile): TalentProfile {
  const defaultThemeId =
    t.category === 'model' ? 'editorial-vogue' :
    t.category === 'actor' || t.category === 'dancer' ? 'cinema-noir' :
    t.category === 'creator' || t.category === 'influencer' ? 'creative-pop' :
    t.category === 'speaker' || t.category === 'entrepreneur' ? 'executive-spotlight' :
    t.category === 'athlete' ? 'athletic-performance' :
    'artisan-gallery';

  return {
    ...t,
    currency: t.currency === 'USD' ? 'INR' : (t.currency || 'INR'),
    password: t.password || (t.category === 'model' ? 'model123' : 'talent123'),
    skills: Array.isArray(t.skills) ? t.skills : [],
    media: Array.isArray(t.media) ? t.media : [],
    experience: Array.isArray(t.experience) ? t.experience : [],
    packages: Array.isArray(t.packages) ? t.packages.map(p => ({
      ...p,
      currency: p.currency === 'USD' ? 'INR' : (p.currency || 'INR'),
      deliverables: Array.isArray(p.deliverables) ? p.deliverables : []
    })) : [],
    achievements: Array.isArray(t.achievements) ? t.achievements : [],
    languages: Array.isArray(t.languages) && t.languages.length > 0 ? t.languages : ['English'],
    subCategories: Array.isArray(t.subCategories) ? t.subCategories : [],
    socialLinks: t.socialLinks && typeof t.socialLinks === 'object' ? t.socialLinks : {},
    views: typeof t.views === 'number' ? t.views : 0,
    likes: typeof t.likes === 'number' ? t.likes : 0,
    inquiries: typeof t.inquiries === 'number' ? t.inquiries : 0,
    portfolioTheme: t.portfolioTheme || {
      templateId: defaultThemeId,
      accentColor: 'gold',
      fontStyle: 'serif',
      heroLayout: 'magazine-split',
      galleryLayout: 'masonry',
      showMeasurements: !!t.measurements,
      showShowreelFirst: t.category === 'actor' || t.category === 'dancer' || t.category === 'creator',
    }
  };
}

function loadTalents(): TalentProfile[] {
  const raw = localStorage.getItem(TALENT_KEY);
  if (raw) {
    try {
      const parsed: TalentProfile[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Automatically merge missing seed profiles so new model additions are instantly available
        const existingIds = new Set(parsed.map(p => p.id));
        const missingSeeds = SEED_TALENTS.filter(s => !existingIds.has(s.id));
        const combined = [...parsed, ...missingSeeds].map(sanitizeTalent);
        if (missingSeeds.length > 0) {
          localStorage.setItem(TALENT_KEY, JSON.stringify(combined));
        }
        return combined;
      }
    } catch { /* fall through */ }
  }
  // Seed data on first load or empty store
  const sanitizedSeed = SEED_TALENTS.map(sanitizeTalent);
  localStorage.setItem(TALENT_KEY, JSON.stringify(sanitizedSeed));
  return sanitizedSeed;
}

function saveTalents(talents: TalentProfile[]) {
  localStorage.setItem(TALENT_KEY, JSON.stringify(talents.map(sanitizeTalent)));
}

function loadInquiries(): TalentInquiry[] {
  const raw = localStorage.getItem(INQUIRY_KEY);
  if (raw) { try { return JSON.parse(raw); } catch { return []; } }
  return [];
}

function saveInquiries(inquiries: TalentInquiry[]) {
  localStorage.setItem(INQUIRY_KEY, JSON.stringify(inquiries));
}

function calcCompletion(profile: Partial<TalentProfile>): number {
  let score = 0;
  if (profile.avatar) score += 10;
  if (profile.coverImage) score += 5;
  if (profile.bio && profile.bio.length > 50) score += 10;
  if (profile.tagline) score += 5;
  if (profile.location) score += 5;
  if (profile.skills && profile.skills.length > 0) score += 10;
  if (profile.media && profile.media.length >= 3) score += 15;
  if (profile.experience && profile.experience.length > 0) score += 10;
  if (profile.packages && profile.packages.length > 0) score += 10;
  if (profile.socialLinks && Object.values(profile.socialLinks).some(v => v)) score += 10;
  if (profile.hourlyRate || profile.dayRate) score += 5;
  if (profile.languages && profile.languages.length > 0) score += 5;
  return Math.min(score, 100);
}

// ── Public API ─────────────────────────────────────────────────────────────

export const talentService = {
  // ── Talent CRUD ──────────────────────────────────────────────────────────
  getAll(): TalentProfile[] {
    return loadTalents();
  },

  getPublic(filter?: TalentFilter): TalentProfile[] {
    let talents = loadTalents().filter(t => t.status === 'active' || t.status === 'featured');

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      talents = talents.filter(t =>
        t.displayName.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (filter?.category && filter.category !== 'all') {
      talents = talents.filter(t => t.category === filter.category);
    }
    if (filter?.isAvailable) {
      talents = talents.filter(t => t.isAvailable);
    }
    if (filter?.isFeatured) {
      talents = talents.filter(t => t.isFeatured);
    }

    // Sort
    switch (filter?.sortBy) {
      case 'popular': talents.sort((a, b) => b.likes - a.likes); break;
      case 'views': talents.sort((a, b) => b.views - a.views); break;
      case 'featured': talents.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); break;
      case 'newest': talents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: talents.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return talents;
  },

  getById(id: string): TalentProfile | null {
    if (!id) return null;
    const cleanId = decodeURIComponent(id).trim().toLowerCase();
    const talents = loadTalents();
    
    // Check in loaded talents (match ID, handle, sanitized slug, display name)
    let match = talents.find(t =>
      t.id.toLowerCase() === cleanId ||
      (t.handle && t.handle.toLowerCase() === cleanId) ||
      (t.handle && t.handle.toLowerCase().replace(/[@_\s-]/g, '') === cleanId.replace(/[@_\s-]/g, '')) ||
      (t.displayName && t.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId) ||
      (t.displayName && t.displayName.toLowerCase().replace(/\s+/g, '') === cleanId.replace(/[\s-_]+/g, '')) ||
      (t.stageName && t.stageName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId) ||
      (t.email && t.email.toLowerCase() === cleanId)
    );

    // Fallback: check in SEED_TALENTS directly
    if (!match) {
      match = SEED_TALENTS.find(t =>
        t.id.toLowerCase() === cleanId ||
        (t.handle && t.handle.toLowerCase() === cleanId) ||
        (t.handle && t.handle.toLowerCase().replace(/[@_\s-]/g, '') === cleanId.replace(/[@_\s-]/g, '')) ||
        (t.displayName && t.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId) ||
        (t.displayName && t.displayName.toLowerCase().replace(/\s+/g, '') === cleanId.replace(/[\s-_]+/g, ''))
      );
      if (match) {
        const sanitizedMatch = sanitizeTalent(match);
        saveTalents([...talents, sanitizedMatch]);
        return sanitizedMatch;
      }
    }

    return match ? sanitizeTalent(match) : null;
  },

  getByHandle(handle: string): TalentProfile | null {
    if (!handle) return null;
    const cleanHandle = decodeURIComponent(handle).trim().toLowerCase().replace(/^@/, '');
    const talents = loadTalents();
    const match = talents.find(t => 
      t.handle?.toLowerCase().replace(/^@/, '') === cleanHandle ||
      t.id.toLowerCase() === cleanHandle
    );
    return match ? sanitizeTalent(match) : null;
  },

  getByEmail(email: string): TalentProfile | null {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const match = loadTalents().find(t => t.email.toLowerCase() === cleanEmail);
    return match ? sanitizeTalent(match) : null;
  },

  create(data: Omit<TalentProfile, 'id' | 'createdAt' | 'updatedAt' | 'profileCompletion'>): TalentProfile {
    const talents = loadTalents();
    const now = new Date().toISOString().split('T')[0];
    const profile: TalentProfile = {
      ...data,
      id: `t_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      profileCompletion: calcCompletion(data),
    };
    saveTalents([...talents, profile]);
    return profile;
  },

  update(id: string, updates: Partial<TalentProfile>): TalentProfile | null {
    const talents = loadTalents();
    const idx = talents.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const updated = {
      ...talents[idx],
      ...updates,
      id,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    updated.profileCompletion = calcCompletion(updated);
    talents[idx] = updated;
    saveTalents(talents);
    return updated;
  },

  delete(id: string): boolean {
    const talents = loadTalents();
    const filtered = talents.filter(t => t.id !== id);
    if (filtered.length === talents.length) return false;
    saveTalents(filtered);
    return true;
  },

  updateStatus(id: string, status: TalentStatus, reason?: string): boolean {
    const talents = loadTalents();
    const idx = talents.findIndex(t => t.id === id);
    if (idx === -1) return false;
    talents[idx].status = status;
    talents[idx].updatedAt = new Date().toISOString().split('T')[0];
    if (reason) talents[idx].rejectionReason = reason;
    if (status === 'active' || status === 'featured') {
      talents[idx].approvedAt = new Date().toISOString().split('T')[0];
    }
    saveTalents(talents);
    return true;
  },

  toggleFeatured(id: string): boolean {
    const talents = loadTalents();
    const idx = talents.findIndex(t => t.id === id);
    if (idx === -1) return false;
    talents[idx].isFeatured = !talents[idx].isFeatured;
    if (talents[idx].isFeatured) talents[idx].status = 'featured';
    saveTalents(talents);
    return true;
  },

  toggleVerified(id: string): boolean {
    const talents = loadTalents();
    const idx = talents.findIndex(t => t.id === id);
    if (idx === -1) return false;
    talents[idx].isVerified = !talents[idx].isVerified;
    saveTalents(talents);
    return true;
  },

  incrementViews(id: string) {
    if (!id) return;
    const talents = loadTalents();
    const cleanId = decodeURIComponent(id).trim().toLowerCase();
    const idx = talents.findIndex(t => 
      t.id.toLowerCase() === cleanId || 
      (t.handle && t.handle.toLowerCase() === cleanId) ||
      (t.displayName && t.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId)
    );
    if (idx !== -1) { 
      talents[idx].views = (talents[idx].views || 0) + 1; 
      saveTalents(talents); 
    }
  },

  toggleLike(id: string): number {
    if (!id) return 0;
    const talents = loadTalents();
    const cleanId = decodeURIComponent(id).trim().toLowerCase();
    const idx = talents.findIndex(t => 
      t.id.toLowerCase() === cleanId || 
      (t.handle && t.handle.toLowerCase() === cleanId) ||
      (t.displayName && t.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId)
    );
    if (idx === -1) return 0;
    talents[idx].likes = (talents[idx].likes || 0) + 1;
    saveTalents(talents);
    return talents[idx].likes;
  },

  getAdminStats() {
    const all = loadTalents();
    return {
      total: all.length,
      active: all.filter(t => t.status === 'active').length,
      featured: all.filter(t => t.isFeatured).length,
      pending: all.filter(t => t.status === 'pending').length,
      suspended: all.filter(t => t.status === 'suspended').length,
      rejected: all.filter(t => t.status === 'rejected').length,
      totalViews: all.reduce((s, t) => s + t.views, 0),
      totalInquiries: all.reduce((s, t) => s + t.inquiries, 0),
    };
  },

  // ── Inquiries ─────────────────────────────────────────────────────────────
  getInquiries(talentId?: string): TalentInquiry[] {
    const all = loadInquiries();
    return talentId ? all.filter(i => i.talentId === talentId) : all;
  },

  createInquiry(data: Omit<TalentInquiry, 'id' | 'createdAt' | 'status'>): TalentInquiry {
    const inquiries = loadInquiries();
    const inquiry: TalentInquiry = {
      ...data,
      id: `inq_${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    saveInquiries([...inquiries, inquiry]);
    // Increment talent inquiry count
    const talents = loadTalents();
    const idx = talents.findIndex(t => t.id === data.talentId);
    if (idx !== -1) { talents[idx].inquiries++; saveTalents(talents); }
    return inquiry;
  },

  updateInquiryStatus(id: string, status: TalentInquiry['status']): boolean {
    const inquiries = loadInquiries();
    const idx = inquiries.findIndex(i => i.id === id);
    if (idx === -1) return false;
    inquiries[idx].status = status;
    if (status === 'replied') inquiries[idx].repliedAt = new Date().toISOString();
    saveInquiries(inquiries);
    return true;
  },

  login(identifier: string, password: string): TalentProfile | null {
    if (!identifier || !password) return null;
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();
    const talents = loadTalents();
    
    const talent = talents.find(t =>
      (t.email && t.email.toLowerCase() === cleanId) ||
      (t.handle && t.handle.toLowerCase() === cleanId) ||
      (t.id && t.id.toLowerCase() === cleanId)
    );

    if (!talent) return null;
    const validPassword = talent.password || (talent.category === 'model' ? 'model123' : 'talent123');
    if (validPassword !== cleanPass) return null;

    localStorage.setItem(TALENT_SESSION_KEY, talent.id);
    return talent;
  },

  logout() {
    localStorage.removeItem(TALENT_SESSION_KEY);
  },

  getCurrentTalent(): TalentProfile | null {
    const id = localStorage.getItem(TALENT_SESSION_KEY);
    if (!id) return null;
    return this.getById(id);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TALENT_SESSION_KEY);
  },

  register(data: {
    firstName: string; lastName: string; email: string; password: string;
    category: TalentProfile['category']; displayName: string; handle: string;
  }): TalentProfile {
    const profile = this.create({
      ...data,
      status: 'pending',
      isFeatured: false,
      isVerified: false,
      views: 0, likes: 0, inquiries: 0,
      displayName: data.displayName || `${data.firstName} ${data.lastName}`,
      handle: data.handle || data.email.split('@')[0],
      avatar: '', coverImage: '', tagline: '', bio: '',
      title: '', experienceLevel: 'beginner', yearsOfExperience: 0,
      nationality: '', location: '', languages: ['English'],
      gender: 'prefer-not-to-say', currency: 'INR',
      isAvailable: true, subCategories: [],
      skills: [], experience: [], media: [], packages: [],
      achievements: [], socialLinks: {},
    });
    localStorage.setItem(TALENT_SESSION_KEY, profile.id);
    return profile;
  },

  // ── Portfolio Theme & Design Templates ──────────────────────────────────
  updatePortfolioTheme(talentId: string, theme: TalentProfile['portfolioTheme']): TalentProfile | null {
    if (!talentId) return null;
    const cleanId = decodeURIComponent(talentId).trim().toLowerCase();
    const talents = loadTalents();
    const idx = talents.findIndex(t => 
      t.id.toLowerCase() === cleanId || 
      (t.handle && t.handle.toLowerCase() === cleanId)
    );
    if (idx === -1) return null;
    talents[idx].portfolioTheme = theme;
    talents[idx].updatedAt = new Date().toISOString();
    saveTalents(talents);
    return talents[idx];
  },

  resetToSeedData(): void {
    localStorage.setItem(TALENT_KEY, JSON.stringify(SEED_TALENTS));
  },
};

