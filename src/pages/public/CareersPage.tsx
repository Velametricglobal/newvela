import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadService } from '../../services/leadService';
import { 
  Sparkles, Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, 
  Search, SlidersHorizontal, Users, Zap, Shield, Heart, Trophy, 
  Coffee, Laptop, BookOpen, Send, X, ExternalLink, 
  FileText, Check, AlertCircle, ChevronRight, MessageSquare,
  Home, GraduationCap
} from 'lucide-react';

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  fresher_friendly?: boolean;
  project_based?: boolean;
  featured?: boolean;
  short_description: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  perks: string[];
}

const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-react-frontend',
    title: 'Frontend & React Developer (Project-Based / WFH)',
    department: 'Engineering & Tech',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based (WFH)',
    experience: 'Freshers Welcome (0–2 Years)',
    fresher_friendly: true,
    project_based: true,
    featured: true,
    short_description: 'Build responsive client web applications, CRM dashboards, and animated landing pages on a per-project milestone basis from home.',
    overview: 'Work remotely on high-impact client web apps and SaaS interfaces. We offer flexible hours with milestone-based payouts. Freshers with personal GitHub projects, college capstones, or React portfolio projects are strongly encouraged to apply!',
    responsibilities: [
      'Develop modern, responsive web interfaces using React.js, Tailwind CSS, and TypeScript.',
      'Integrate frontend components with RESTful APIs, Supabase endpoints, and webhook triggers.',
      'Optimize web performance, mobile responsiveness, and Core Web Vitals across diverse viewports.',
      'Collaborate remotely via Slack and GitHub on structured project sprint deliverables.'
    ],
    requirements: [
      'Foundational understanding of JavaScript (ES6+), React.js, HTML5, and CSS3.',
      'Familiarity with Tailwind CSS, Git version control, and responsive web design principles.',
      'Freshers: Share your GitHub profile, college projects, or deployed web application links!',
      'Self-motivated, reliable internet connection, and good asynchronous communication.'
    ],
    skills: ['React.js', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'Git/GitHub', 'Responsive Design'],
    perks: ['100% Work from home', 'Milestone-based payouts', 'Direct senior tech mentorship', 'Fast portfolio building']
  },
  {
    id: 'job-uiux-designer',
    title: 'UI/UX & Web Designer (Project-Based / WFH)',
    department: 'Engineering & Tech',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based (WFH)',
    experience: 'Freshers Welcome (Portfolio-Based)',
    fresher_friendly: true,
    project_based: true,
    featured: true,
    short_description: 'Design luxury website mockups, mobile app wireframes, and conversion-focused design systems for brands globally.',
    overview: 'Take up freelance and project-based UI design tasks from home. Deliver Figma screens, component systems, and interactive prototypes. If you are a talented fresher or student with a keen eye for aesthetics, typography, and dark-mode designs, this is the perfect project role for you.',
    responsibilities: [
      'Create high-fidelity website and web application mockups in Figma.',
      'Design wireframes, user flow diagrams, and reusable component libraries.',
      'Collaborate with remote developers to ensure pixel-perfect CSS implementation.',
      'Iterate based on client feedback and conversion rate optimization (CRO) requirements.'
    ],
    requirements: [
      'Proficiency in Figma (auto-layout, components, styles, interactive prototyping).',
      'Strong aesthetic sense in typography, modern color theory, and responsive grid layouts.',
      'Freshers: Provide your Figma showcase, Behance, Dribbble, or personal design portfolio!',
      'Ability to meet project milestones independently from home.'
    ],
    skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Design Systems', 'Auto-Layout', 'Prototyping'],
    perks: ['Flexible project deadlines', '100% Remote work', 'Real brand portfolio credits', 'Paid software licenses']
  },
  {
    id: 'job-video-editor',
    title: 'Video Editor & Social Reel Creator (Project-Based / WFH)',
    department: 'Creative & Video',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based / Freelance (WFH)',
    experience: 'Freshers & Freelancers Welcome',
    fresher_friendly: true,
    project_based: true,
    featured: true,
    short_description: 'Edit cinematic vertical reels, YouTube shorts, and commercial video ads on a per-video or per-project payout model from home.',
    overview: 'We provide raw footage, script outlines, and audio references. You edit punchy, high-retention vertical reels and promotional brand films from your home setup. Freshers with great editing rhythm and creativity are welcome!',
    responsibilities: [
      'Edit engaging vertical reels (9:16) with kinetic typography, hooks, and sound design.',
      'Perform color grading, audio leveling, and dynamic transition animations.',
      'Export high-resolution video files optimized for Instagram, YouTube, and Meta Ads.'
    ],
    requirements: [
      'Hands-on experience with Premiere Pro, DaVinci Resolve, After Effects, or CapCut Pro.',
      'Understanding of social media pacing, retention hooks, and sound effects timing.',
      'Freshers: Share a Google Drive link or YouTube playlist of your best sample edits or reels!',
      'Home PC/Mac capable of rendering 1080p/4K video footage.'
    ],
    skills: ['Premiere Pro', 'DaVinci Resolve', 'Reels Editing', 'Sound Design', 'Color Grading', 'After Effects'],
    perks: ['Per-video milestone payouts', 'Continuous flow of projects', 'Work anytime from home', 'Creative freedom']
  },
  {
    id: 'job-content-copywriter',
    title: 'Content Creator & Creative Copywriter (Project-Based / WFH)',
    department: 'Growth & Marketing',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based (WFH)',
    experience: 'Freshers Welcome (Sample-Based)',
    fresher_friendly: true,
    project_based: true,
    featured: false,
    short_description: 'Draft punchy landing page headlines, B2B email sequences, and social media captions on flexible project assignments.',
    overview: 'Craft persuasive marketing copy and website content from home. Perfect for college students, literature/marketing graduates, and passionate storytellers who want to gain real commercial portfolio experience.',
    responsibilities: [
      'Write compelling website copy, service descriptions, and ad headlines.',
      'Research industry topics across tech, real estate, finance, and e-commerce.',
      'Draft case study summaries and email newsletters for enterprise campaigns.'
    ],
    requirements: [
      'Fluent written English with a conversational, high-converting tone.',
      'Ability to understand client briefs and turn features into clear benefits.',
      'Freshers: Submit 2–3 writing samples, published articles, or sample landing page copy!',
      'Punctual delivery on agreed project deadlines.'
    ],
    skills: ['Copywriting', 'Content Writing', 'SEO Basics', 'Social Media Copy', 'Storytelling'],
    perks: ['Flexible part-time hours', '100% Remote', 'Byline & portfolio credentials', 'Per-deliverable payouts']
  },
  {
    id: 'job-digital-marketing-trainee',
    title: 'Digital Marketing & Lead Gen Trainee (WFH)',
    department: 'Growth & Marketing',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based / Flexible (WFH)',
    experience: 'Freshers Welcome (0–1 Year)',
    fresher_friendly: true,
    project_based: true,
    featured: false,
    short_description: 'Assist in paid ad campaign setup, keyword research, Meta/Google ad tracking, and client lead qualification remotely.',
    overview: 'Learn the real science of paid performance marketing and lead generation. You will work closely with our growth leads to monitor campaign budgets, analyze ROAS, and test creative hooks.',
    responsibilities: [
      'Assist in configuring Meta Ads Manager and Google Search ad campaigns.',
      'Conduct competitor ad research and identify trending creative hooks.',
      'Generate weekly performance spreadsheets and client lead analytics summaries.'
    ],
    requirements: [
      'Curiosity for digital marketing, analytics, and social media trends.',
      'Basic familiarity with Meta Ads Manager, Google Analytics, or Google Sheets/Excel.',
      'Freshers from BBA, B.Com, Mass Comm, or self-learners with digital marketing certifications welcome!'
    ],
    skills: ['Meta Ads', 'Google Ads', 'Lead Generation', 'Market Research', 'Google Sheets'],
    perks: ['Hands-on performance marketing training', '100% Remote work', 'Milestone performance bonuses', 'Certificate of completion']
  },
  {
    id: 'job-saas-specialist',
    title: 'SaaS Implementation & Client Support Associate (WFH)',
    department: 'SaaS & Product',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based / Remote',
    experience: 'Freshers Welcome (0–2 Years)',
    fresher_friendly: true,
    project_based: true,
    featured: false,
    short_description: 'Assist in client onboarding, portal setups, data migration, and live walkthroughs for our Education ERP and Real Estate CRM.',
    overview: 'Be the friendly remote guide for schools, institutes, and property dealers using our SaaS platforms. You will handle CSV data uploads, configure settings, and provide online chat/video support from home.',
    responsibilities: [
      'Assist new clients with account setup, student/property data import, and staff logins.',
      'Conduct online Google Meet / Zoom walkthroughs explaining key product modules.',
      'Answer customer support queries on WhatsApp and coordinate bug fixes with developers.'
    ],
    requirements: [
      'Great verbal and written communication skills in English and Hindi.',
      'Comfortable using web software, Google Sheets, and video conferencing tools.',
      'Freshers with good interpersonal skills and patience to explain software are welcome!'
    ],
    skills: ['SaaS Support', 'Client Onboarding', 'Data Entry & CSV', 'Customer Success', 'Communication'],
    perks: ['100% Work from home', 'Structured product training', 'Flexible project contracts', 'Performance incentives']
  },
  {
    id: 'job-financial-analyst',
    title: 'Financial Research Analyst (Project-Based / WFH)',
    department: 'Finance & Advisory',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based / Contract (WFH)',
    experience: 'Freshers Welcome (Commerce / Finance)',
    fresher_friendly: true,
    project_based: true,
    featured: false,
    short_description: 'Prepare Detailed Project Reports (DPR), financial projections, and documentation for MSME government subsidy loans remotely.',
    overview: 'Work on financial models and bank proposals for business loans and subsidy schemes from home. Ideal for commerce and finance graduates seeking real banking advisory exposure.',
    responsibilities: [
      'Assist in compiling project cost sheets, CMA data, and cash flow projections.',
      'Review government subsidy guidelines (PMEGP, MSME schemes) and verify applicant documentation.',
      'Draft standardized project reports for bank submission.'
    ],
    requirements: [
      'Educational background in Commerce, B.Com, M.Com, MBA (Finance), or CA-Inter.',
      'Strong command over Microsoft Excel (formulas, projections, financial modeling basics).',
      'Freshers with sharp numerical aptitude and analytical mindset are encouraged to apply!'
    ],
    skills: ['Financial Modeling', 'MS Excel', 'DPR Preparation', 'CMA Data', 'MSME Subsidies'],
    perks: ['Per-DPR project payouts', 'Flexible remote schedule', 'Real-world corporate finance experience', 'Direct advisor mentorship']
  },
  {
    id: 'job-fullstack-sr',
    title: 'Senior Full-Stack Architect (Milestone / Project-Based WFH)',
    department: 'Engineering & Tech',
    location: '100% Remote / Work From Home (WFH)',
    type: 'Project-Based / Milestone Contract',
    experience: '1–5 Years (Skilled Freshers with Full-Stack Projects Welcome)',
    fresher_friendly: true,
    project_based: true,
    featured: true,
    short_description: 'Architect and scale complex Next.js, Node.js, and PostgreSQL features on clear milestone scopes from home.',
    overview: 'For experienced developers or exceptionally skilled full-stack freshers. Take full ownership of complex backend schemas, authentication pipelines, and interactive dashboards on well-defined project milestones.',
    responsibilities: [
      'Architect robust full-stack modules using React, Next.js, Node.js, and PostgreSQL/Supabase.',
      'Implement secure RESTful APIs, third-party webhook integrations, and cloud storage handlers.',
      'Ensure high performance, clean code architecture, and comprehensive documentation.'
    ],
    requirements: [
      'Proficiency in TypeScript, Node.js, React, and relational databases (PostgreSQL).',
      'Demonstrated portfolio of shipped full-stack applications or impressive GitHub repositories.',
      'Freshers with solid full-stack project proofs (e.g. MERN/PERN/Supabase stacks) are welcome!'
    ],
    skills: ['Next.js', 'React.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Supabase', 'REST APIs'],
    perks: ['100% Work from home', 'Milestone sprint payouts', 'High autonomy', 'Direct founder collaboration']
  }
];

export const CareersPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All Roles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJob, setActiveJob] = useState<JobOpening | null>(null);

  // Application Form State
  const [applicantForm, setApplicantForm] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    experience: 'Fresher / Student (0 Years Experience)',
    work_mode: 'Project-Based / Freelance (100% WFH)',
    notice_period: 'Immediate / Ready for Projects',
    message: '',
    resume_link: ''
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Filter categories and smart tags
  const departments = [
    'All Roles', 
    '🌱 Freshers Welcome', 
    '⚡ Project-Based (WFH)', 
    'Engineering & Tech', 
    'Creative & Video', 
    'Growth & Marketing', 
    'SaaS & Product', 
    'Finance & Advisory'
  ];

  const getFilterCount = (filterName: string) => {
    if (filterName === 'All' || filterName === 'All Roles') return JOB_OPENINGS.length;
    if (filterName === '🌱 Freshers Welcome') return JOB_OPENINGS.filter(j => j.fresher_friendly).length;
    if (filterName === '⚡ Project-Based (WFH)') return JOB_OPENINGS.filter(j => j.project_based).length;
    return JOB_OPENINGS.filter(j => j.department === filterName).length;
  };

  // Filter jobs based on department/tag and search
  const filteredJobs = JOB_OPENINGS.filter((job) => {
    let matchesDept = true;
    if (selectedDept === 'All' || selectedDept === 'All Roles') {
      matchesDept = true;
    } else if (selectedDept === '🌱 Freshers Welcome') {
      matchesDept = !!job.fresher_friendly;
    } else if (selectedDept === '⚡ Project-Based (WFH)') {
      matchesDept = !!job.project_based;
    } else {
      matchesDept = job.department === selectedDept;
    }

    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(query) || 
      job.short_description.toLowerCase().includes(query) || 
      job.skills.some(s => s.toLowerCase().includes(query)) ||
      job.location.toLowerCase().includes(query) ||
      (job.fresher_friendly && 'fresher'.includes(query)) ||
      (job.project_based && 'project'.includes(query));

    return matchesDept && matchesSearch;
  });

  const handleApplyClick = (job: JobOpening) => {
    setActiveJob(job);
    setSubmitStatus('idle');
    setErrorMessage('');
    setApplicantForm({
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      portfolio: '',
      experience: 'Fresher / Student (0 Years Experience)',
      work_mode: 'Project-Based / Freelance (100% WFH)',
      notice_period: 'Immediate / Ready for Projects',
      message: '',
      resume_link: ''
    });
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantForm.name || !applicantForm.email || !applicantForm.phone) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      // Create lead in CRM with career application tag and detailed notes
      await leadService.createLead({
        first_name: applicantForm.name.split(' ')[0] || applicantForm.name,
        last_name: applicantForm.name.split(' ').slice(1).join(' ') || '',
        email: applicantForm.email,
        phone: applicantForm.phone,
        whatsapp: applicantForm.phone,
        company_name: `Applicant: ${activeJob ? activeJob.title : 'Open Application'}`,
        service_interest: 'Careers & Talent Acquisition',
        package_name: activeJob ? activeJob.title : 'General Application',
        budget_range: 'N/A',
        notes: `[CAREER APPLICATION]
Role: ${activeJob ? activeJob.title : 'General Open Application'}
Department: ${activeJob ? activeJob.department : 'General'}
Total Experience: ${applicantForm.experience}
Notice Period: ${applicantForm.notice_period}
Work Preference: ${applicantForm.work_mode}
LinkedIn: ${applicantForm.linkedin || 'None'}
Portfolio / GitHub: ${applicantForm.portfolio || 'None'}
Resume Link / Google Drive: ${applicantForm.resume_link || 'None'}

Applicant Note:
${applicantForm.message || 'No additional note provided.'}`,
        message: `Career Application for ${activeJob ? activeJob.title : 'General Application'} from ${applicantForm.name}. Experience: ${applicantForm.experience}. Notice: ${applicantForm.notice_period}.`,
        tags: ['Career Application', activeJob ? activeJob.department : 'General', 'Talent']
      });

      setSubmitStatus('success');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setSubmitStatus('error');
      setErrorMessage('Could not submit your application. Please check your details and try again.');
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans selection:bg-white selection:text-black min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative pt-20 pb-24 border-b border-zinc-800/80 overflow-hidden bg-grid-pattern">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-zinc-900/90 text-amber-400 border border-zinc-800 backdrop-blur shadow-xl">
            <Home className="w-3.5 h-3.5 text-emerald-400" /> 100% WORK FROM HOME • PROJECT-BASED CONTRACTS • FRESHERS WELCOME TO APPLY
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white font-display uppercase leading-tight max-w-5xl mx-auto">
            PROJECT-BASED REMOTE WORK & WFH OPPORTUNITIES
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Collaborate on live enterprise platforms, video campaigns, and cloud SaaS products from the comfort of your home. We offer flexible project milestones, asynchronous schedules, and actively welcome ambitious freshers, college students, and remote specialists.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">100% WFH</div>
              <div className="text-xs text-zinc-400 font-mono mt-1 uppercase">Work Anywhere in India</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">Project-Based</div>
              <div className="text-xs text-zinc-400 font-mono mt-1 uppercase">Milestone Payouts</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-display">Freshers</div>
              <div className="text-xs text-zinc-400 font-mono mt-1 uppercase">Students & Beginners Welcome</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-display">Flexible</div>
              <div className="text-xs text-zinc-400 font-mono mt-1 uppercase">Your Own Hours</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a
              href="#openings"
              className="px-8 py-4 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
            >
              Browse Remote Projects & Roles <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#culture"
              className="px-8 py-4 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all"
            >
              How Our Remote Model Works
            </a>
          </div>
        </div>
      </section>

      {/* 2. CULTURE & VALUES PILLARS */}
      <section id="culture" className="py-24 border-b border-zinc-800/80 bg-zinc-950/60 relative">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block font-mono">
              The Velametric DNA
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              HOW WE THINK & WORK
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              A modern remote-first culture that respects your time, values tangible proof-of-work, and accelerates beginners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-400/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Freshers & Beginners Welcomed</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We value proof-of-work over pedigree. If you built a cool React demo, designed a Figma template, or edited a great reel, you have a place here regardless of formal years.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-cyan-400/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">100% Remote & WFH Freedom</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No daily commute or relocation needed. Work from your home, study desk, or anywhere across India with asynchronous communication and clear project targets.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-400/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Project-Based Milestone Model</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Take on projects matching your bandwidth. Transparent sprint scopes, agreed milestone goals, and swift payouts upon project delivery.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-purple-400/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-400/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Live Portfolio & Mentorship</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Freshers receive direct guidance from our senior tech leads and creative directors. Build an impressive portfolio of real enterprise client work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PERKS & BENEFITS */}
      <section className="py-24 border-b border-zinc-800/80 bg-zinc-950">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block font-mono">
              Designed For Remote Flexibility
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              PERKS & ADVANTAGES
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Everything you need to produce your best work from home, supported by clear project contracts, flexible hours, and mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 text-emerald-400 shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">100% Work From Home (WFH)</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Work from anywhere in India without relocation or daily travel. Save commuting time and manage your personal lifestyle smoothly.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 text-amber-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Milestone-Based Payouts</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Get paid promptly as soon as your project or deliverable milestones are accepted. Transparent contract terms with zero payment delays.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 text-cyan-400 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Fresher Training & Mentorship</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Step-by-step guidance, code reviews, design feedback, and friendly mentorship from experienced leads to jumpstart your career.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 text-indigo-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Flexible Working Hours</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Set your own schedule. Ideal for college students balancing coursework, part-time freelancers, and full-time remote specialists.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 text-rose-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Real Shipped Portfolio Credits</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Work on live customer-facing portals, video reels, and cloud platforms that give you verifiable proof-of-work on your CV.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10 text-amber-400 shrink-0">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Premium Software & Tools</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Access to project tooling, Figma design libraries, GitHub repositories, AI writing assistants, and cloud deployment sandboxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPEN POSITIONS DIRECTORY */}
      <section id="openings" className="py-24 border-b border-zinc-800/80 bg-zinc-950/70">
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block font-mono">
                Current Opportunities
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight mt-1">
                OPEN POSITIONS
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Discover your next breakthrough role across engineering, production, growth, and advisory.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by title, skill, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Department & Tag Filter Tabs (Horizontal Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              const count = getFilterCount(dept);

              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-500/20'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>{dept}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Job Listings Grid */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-black/50 group flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20 font-mono">
                      {job.department}
                    </span>
                    {job.project_based && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Project-Based (WFH)
                      </span>
                    )}
                    {job.fresher_friendly && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" /> Freshers Welcome
                      </span>
                    )}
                    <span className="text-xs text-emerald-400/90 flex items-center gap-1 font-mono font-medium">
                      <Home className="w-3.5 h-3.5" /> {job.location}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white font-display group-hover:text-amber-400 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    {job.short_description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-xs text-zinc-300 font-mono flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Experience: <span className="text-white font-bold">{job.experience}</span>
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" /> {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-lg bg-zinc-950 text-zinc-400 border border-zinc-800/80 text-[10px] font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-800">
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                  >
                    View Role & Apply <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="py-16 text-center rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 space-y-4">
                <Briefcase className="w-12 h-12 text-zinc-600 mx-auto" />
                <h4 className="text-lg font-bold text-white font-display">No positions match your filter</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Try clearing your search or switching categories. You can also submit an open application below!
                </p>
                <button
                  onClick={() => { setSelectedDept('All Roles'); setSearchQuery(''); }}
                  className="px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Spontaneous / Open Application Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SPONTANEOUS TALENT PITCH (FRESHERS & FREELANCERS)
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white font-display">
                Are you a fresher, student, or freelance creator?
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                We are always excited to make room for passionate self-taught developers, creative designers, and video editors who want to build real projects from home. Tell us what you can deliver at Velametric!
              </p>
            </div>

            <button
              onClick={() => handleApplyClick({
                id: 'job-open-application',
                title: 'Open Remote / Fresher Application',
                department: 'General Talent',
                location: '100% Remote / Work From Home (WFH)',
                type: 'Project-Based / Freelance (WFH)',
                experience: 'Freshers & Experienced Both Welcome',
                fresher_friendly: true,
                project_based: true,
                short_description: 'Pitch your unique skillset, personal projects, or showreel and collaborate on remote client projects from home.',
                overview: 'We believe exceptional talent shouldn’t wait for a formal job posting. Tell us what you excel at and what kind of projects you want to build with us.',
                responsibilities: ['Shape your own impact on live client deliverables and SaaS product modules from home.'],
                requirements: ['High agency, reliable internet, curiosity, and demonstrable proof-of-work (GitHub/Figma/Drive/Showreel).'],
                skills: ['Your Unique Skillset'],
                perks: ['100% Work from home', 'Milestone-based payouts', 'Direct founder mentorship', 'Flexible hours']
              })}
              className="shrink-0 px-8 py-4 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/10"
            >
              Submit Fresher / WFH Application →
            </button>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE APPLICATION & JOB DETAIL MODAL */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {activeJob.department}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {activeJob.location} • {activeJob.type}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                  {activeJob.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveJob(null)}
                className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {submitStatus === 'success' ? (
                <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white font-display">
                    Application Successfully Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Thank you, <strong className="text-white">{applicantForm.name}</strong>. Our talent acquisition and engineering leads have received your submission for <strong className="text-amber-400">{activeJob.title}</strong>.
                  </p>
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 text-left space-y-1 font-mono">
                    <div>• Candidate Email: {applicantForm.email}</div>
                    <div>• Contact Number: {applicantForm.phone}</div>
                    <div>• Status: Under Primary Review (24–48hr SLA)</div>
                  </div>
                  <button
                    onClick={() => setActiveJob(null)}
                    className="px-8 py-3 rounded-full text-xs font-extrabold uppercase bg-white text-black hover:bg-zinc-200 transition-all mt-4"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Role Details Overview */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                        About The Role
                      </h4>
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {activeJob.overview}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-400" /> Key Responsibilities:
                        </h4>
                        <ul className="space-y-2 text-xs text-zinc-400">
                          {activeJob.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-cyan-400" /> Key Requirements:
                        </h4>
                        <ul className="space-y-2 text-xs text-zinc-400">
                          {activeJob.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-400" /> Location: <strong className="text-white">{activeJob.location}</strong>
                      </span>
                      <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-cyan-400" /> Experience: <strong className="text-white">{activeJob.experience}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Application Form Header */}
                  <div className="border-t border-zinc-800 pt-8 space-y-6">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                        FAST-TRACK APPLICATION • 100% REMOTE / WFH
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                        Apply For {activeJob.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Fill in your details below. We evaluate applicants on practical proof-of-work, creativity, and enthusiasm.
                      </p>
                    </div>

                    {/* Freshers Welcome Callout Banner */}
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="text-white block text-sm font-display">🌱 Freshers & College Students Welcome!</strong>
                        <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                          No corporate company experience is required. Share your personal projects, GitHub repos, college assignments, Figma files, or video showreel. We evaluate talent, eagerness to learn, and actual proof-of-work.
                        </p>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleApplicationSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Full Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={applicantForm.name}
                            onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Email Address <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="rahul@domain.com"
                            value={applicantForm.email}
                            onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Phone / WhatsApp Number <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={applicantForm.phone}
                            onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Experience Level <span className="text-rose-400">*</span>
                          </label>
                          <select
                            value={applicantForm.experience}
                            onChange={(e) => setApplicantForm({ ...applicantForm, experience: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                          >
                            <option value="Fresher / Student (0 Years Experience)">🌱 Fresher / College Student (0 Years)</option>
                            <option value="Entry-Level / Junior (0–1 Year)">Junior / Entry-Level (0–1 Year)</option>
                            <option value="Intermediate (1–3 Years)">Intermediate (1–3 Years)</option>
                            <option value="Senior / Freelance Pro (3+ Years)">Senior / Freelance Pro (3+ Years)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            LinkedIn Profile URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={applicantForm.linkedin}
                            onChange={(e) => setApplicantForm({ ...applicantForm, linkedin: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Portfolio / GitHub / Showreel Link <span className="text-emerald-400 text-[10px] font-normal">(College & personal projects welcome)</span>
                          </label>
                          <input
                            type="url"
                            placeholder="https://github.com/... or Behance / YouTube / Drive"
                            value={applicantForm.portfolio}
                            onChange={(e) => setApplicantForm({ ...applicantForm, portfolio: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Availability / Notice Period
                          </label>
                          <select
                            value={applicantForm.notice_period}
                            onChange={(e) => setApplicantForm({ ...applicantForm, notice_period: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                          >
                            <option value="Immediate / Ready for Projects">Immediate / Ready for Projects</option>
                            <option value="Within 7–15 Days">Within 7–15 Days</option>
                            <option value="Flexible (Part-Time / Evenings & Weekends)">Flexible (Part-Time / Evenings & Weekends)</option>
                            <option value="1 Month Notice">1 Month Notice</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Work & Engagement Preference
                          </label>
                          <select
                            value={applicantForm.work_mode}
                            onChange={(e) => setApplicantForm({ ...applicantForm, work_mode: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                          >
                            <option value="Project-Based / Freelance (100% WFH)">🏠 Project-Based / Freelance (100% WFH)</option>
                            <option value="Part-Time Flexible Hours (WFH)">⏰ Part-Time Flexible Hours (WFH)</option>
                            <option value="Full-Time Remote (WFH)">💼 Full-Time Remote (WFH)</option>
                            <option value="Paid Internship (Freshers & College)">🎓 Paid Internship (Freshers & College)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Resume Link (Google Drive / Dropbox / Cloud URL)
                        </label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/... (Make sure view permission is enabled)"
                          value={applicantForm.resume_link}
                          onChange={(e) => setApplicantForm({ ...applicantForm, resume_link: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Brief Note / Why Velametric?
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tell us about a notable project you built or why you'd be a great addition to our team..."
                          value={applicantForm.message}
                          onChange={(e) => setApplicantForm({ ...applicantForm, message: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="pt-4 flex items-center justify-between gap-4">
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Directly dispatched to Velametric Talent Leadership.
                        </span>

                        <button
                          type="submit"
                          disabled={submitStatus === 'submitting'}
                          className="px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition-all transform hover:scale-105 shadow-xl shadow-amber-500/10 flex items-center gap-2 disabled:opacity-50"
                        >
                          {submitStatus === 'submitting' ? (
                            <>Processing Application...</>
                          ) : (
                            <>Submit Application <Send className="w-3.5 h-3.5" /></>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
