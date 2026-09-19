import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Award, Users, Laptop, Megaphone, Video, Calendar, CreditCard, ArrowRight, ShieldCheck, Camera, Newspaper, Film, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans selection:bg-white selection:text-black">
      
      {/* 1. HERO BANNER */}
      <section className="relative pt-20 pb-24 border-b border-zinc-800/80 overflow-hidden bg-grid-pattern">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-zinc-800/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-zinc-900 text-amber-400 border border-zinc-800 mb-6 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" /> Established in 2015 • Proudly Rooted in Uttarakhand
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white font-display uppercase leading-tight max-w-4xl mx-auto mb-8">
            ABOUT VELAMETRIC GLOBAL
          </h1>

          <p className="text-lg sm:text-2xl text-zinc-300 max-w-4xl mx-auto font-normal leading-relaxed font-sans">
            Established in 2015, <strong className="text-white font-semibold">Velametric Global</strong> is a dynamic, multi-disciplinary agency dedicated to transforming ideas into impactful realities. Proudly rooted in Uttarakhand, we blend technical innovation with creative storytelling to deliver comprehensive solutions across the digital, marketing, production, and financial sectors. Our goal is to help businesses and individuals grow, connect, and thrive in an ever-evolving market.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link
              to="/request-quote"
              className="px-8 py-4 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all transform hover:scale-105 shadow-2xl"
            >
              Partner With Us
            </Link>
            <Link
              to="/portfolio"
              className="px-8 py-4 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all"
            >
              Explore Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO (5 CORE SERVICE PILLARS) */}
      <section className="py-24 border-b border-zinc-800/80 bg-zinc-950">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Multi-Disciplinary Expertise
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              WHAT WE DO
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              We offer a diverse portfolio of services tailored to meet the unique growth and creative needs of our clients globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Web & App Development */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Web & App Development</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  We build robust, scalable digital solutions, including custom Content Management Systems (CMS), designed to elevate your brand's online presence with sub-second performance.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono font-bold px-3 py-1 bg-zinc-950 text-amber-400 rounded-full border border-zinc-800">
                  Custom CMS • Web Apps • Mobile Apps
                </span>
              </div>
            </div>

            {/* 2. Digital Marketing & Consultancy */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Digital Marketing & Consultancy</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  We craft data-driven digital marketing campaigns and provide expert marketing consultancy — including SEO, social media management, paid ad performance, and lead acquisition strategy.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono font-bold px-3 py-1 bg-zinc-950 text-amber-400 rounded-full border border-zinc-800">
                  SEO • Social Media • Paid Ads • Strategy
                </span>
              </div>
            </div>

            {/* 3. Video Production */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Video className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Video Production</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  From concept to final cut, we create high-quality visual stories — commercial films, viral Instagram reels, music videos, and brand documentaries that capture your message.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono font-bold px-3 py-1 bg-zinc-950 text-rose-400 rounded-full border border-zinc-800">
                  Commercials • Viral Reels • Documentaries
                </span>
              </div>
            </div>

            {/* 4. Event Organization */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Event Organization</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  We provide end-to-end planning, stage management, multi-camera live broadcast, and event execution to deliver seamless and memorable brand experiences.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono font-bold px-3 py-1 bg-zinc-950 text-purple-400 rounded-full border border-zinc-800">
                  End-to-End Planning • Mega Events
                </span>
              </div>
            </div>

            {/* 5. Finance & Credit Solutions */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-xl md:col-span-2 lg:col-span-2">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Finance & Credit Solutions</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  We offer strategic financial guidance, government subsidy loans advisory (up to 25% capital subsidy claim), and credit facilities to help growing businesses navigate expansion securely.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-mono font-bold px-3 py-1 bg-zinc-950 text-emerald-400 rounded-full border border-zinc-800">
                  Government Subsidy Loans • Business Credit • DPR Advisory
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. MEET OUR LEADERSHIP */}
      <section className="py-24 border-b border-zinc-800/80 bg-zinc-900">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Visionaries & Innovators
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              MEET OUR LEADERSHIP
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Our agency is driven by passionate leaders with deep roots in Uttarakhand and a wealth of multi-industry experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Founder Card: Hem Purohit */}
            <div className="bg-zinc-950 border border-zinc-800 p-8 sm:p-10 rounded-3xl space-y-6 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black text-2xl flex items-center justify-center font-display shadow-lg shrink-0">
                    HP
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white font-display">Hem Purohit</h3>
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-0.5">Founder & Strategic Director</div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
                      <MapPin className="w-3 h-3 text-amber-400" /> Chamoli, Uttarakhand
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Born in the serene hills of Chamoli, Hem brings over a decade of diverse industry experience to the table. As a former journalist, skilled photographer, and seasoned marketing consultant, he drives Velametric Global’s vision with a unique blend of creative insight, media expertise, and strategic planning.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <Award className="w-3 h-3 text-amber-400" /> 10+ Yrs Industry Exp
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <Newspaper className="w-3 h-3 text-amber-400" /> Former Journalist
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <Camera className="w-3 h-3 text-amber-400" /> Professional Photographer
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <Megaphone className="w-3 h-3 text-amber-400" /> Marketing Consultant
                  </span>
                </div>
              </div>
            </div>

            {/* Co-Founder Card: Ayush Prakash */}
            <div className="bg-zinc-950 border border-zinc-800 p-8 sm:p-10 rounded-3xl space-y-6 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center font-display shadow-lg shrink-0">
                    AP
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white font-display">Ayush Prakash</h3>
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-widest mt-0.5">Co-Founder & Creative Director</div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
                      <Film className="w-3 h-3 text-rose-400" /> Owner, Destiny in Production
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  An accomplished creative professional and the owner of <strong className="text-white italic">Destiny in Production</strong>, Ayush brings extensive hands-on expertise in multimedia and production. His background ensures top-tier execution, visual storytelling, and technical innovation across all our creative projects.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <Film className="w-3 h-3 text-rose-400" /> Destiny in Production
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <Video className="w-3 h-3 text-rose-400" /> Multimedia Director
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800">
                    <Sparkles className="w-3 h-3 text-rose-400" /> Visual Cinema Innovation
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. WHERE TO FIND US */}
      <section className="py-24 border-b border-zinc-800/80 bg-zinc-950">
        <div className="max-w-[1280px] mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Global Reach • Local Roots
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              WHERE TO FIND US
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              While we serve clients globally, our operations are proudly headquartered in the beautiful state of Uttarakhand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Headquarters: Dehradun */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all flex items-start gap-5 shadow-xl">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">
                  Primary Headquarters
                </span>
                <h3 className="text-xl font-bold text-white font-display">Dehradun, Uttarakhand</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Our primary hub for software engineering, agency operations, digital marketing, and financial advisory consulting.
                </p>
              </div>
            </div>

            {/* Second Office: Joshiyara, Uttarkashi */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 hover:border-zinc-700 transition-all flex items-start gap-5 shadow-xl">
              <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 font-mono">
                  Regional Operations Office
                </span>
                <h3 className="text-xl font-bold text-white font-display">Joshiyara, Uttarkashi</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Our regional creative media center supporting regional production initiatives and community partnerships across Uttarakhand.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-24 bg-zinc-950 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
          <h2 className="text-4xl sm:text-6xl font-black text-white font-display uppercase tracking-tight leading-tight">
            READY TO TRANSFORM YOUR IDEAS WITH VELAMETRIC?
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Get in touch with our leadership and agency specialists today to build, scale, or produce your next project.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/request-quote"
              className="px-10 py-5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl"
            >
              Request A Quote
            </Link>
            <Link
              to="/contact"
              className="px-10 py-5 rounded-full bg-zinc-900 text-white font-extrabold text-xs uppercase tracking-widest border border-zinc-800 hover:bg-zinc-800 transition-all"
            >
              Contact Us Directly
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
