import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { leadService } from '../../services/leadService';
import { useSiteSettings } from '../../services/settingsService';
import { 
  Calendar as CalendarIcon, Clock, Video, Phone, Building2, 
  ChevronLeft, ChevronRight, CheckCircle2, Shield, Sparkles, 
  User, Mail, ArrowRight, MessageCircle, Download, ExternalLink, 
  AlertCircle, Check, MapPin
} from 'lucide-react';

interface TimeSlot {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

const TOPICS = [
  { id: 'web-app', label: 'Website & Web Application Development', icon: '💻', desc: 'Custom Next.js, React & full-stack platforms' },
  { id: 'saas-crm', label: 'SaaS Product & Custom CRM Systems', icon: '⚡', desc: 'Enterprise architecture, multi-tenant databases & portals' },
  { id: 'growth-mktg', label: 'Digital Growth & Performance Marketing', icon: '📈', desc: 'Meta/Google Ads, SEO & conversion optimization' },
  { id: 'video-reels', label: 'Video Production & Commercial Reels', icon: '🎬', desc: 'Destiny, Dapflix & Ekraahee production units' },
  { id: 'subsidy-loans', label: 'Govt. Subsidy Schemes & Loan Advisory', icon: '🏦', desc: 'DPR preparation & subsidy claims (Up to 25% refund)' },
  { id: 'branding-ui', label: 'Brand Identity & High-End UI/UX Design', icon: '🎨', desc: 'Luxury visual systems, Figma prototypes & design sprints' },
];

const MEETING_MODES = [
  { id: 'google-meet', label: 'Google Meet (Video Call)', icon: Video, desc: 'Instant calendar invite with HD video link' },
  { id: 'phone-call', label: 'Phone / WhatsApp Call', icon: Phone, desc: 'Direct audio call to your mobile number' },
  { id: 'studio-visit', label: 'In-Person Studio Visit', icon: Building2, desc: 'Dehradun / Uttarkashi / Delhi NCR Studio Hub' },
];

export const ConsultationBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const siteSettings = useSiteSettings();
  const initialTopic = searchParams.get('topic') || searchParams.get('service') || 'web-app';

  // Navigation & Scroll
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  // Initialize selected date to tomorrow
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM');
  const [selectedMode, setSelectedMode] = useState<string>('google-meet');
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedLeadCode, setConfirmedLeadCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Generate Days for Current Month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // Days in previous month
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; isPast: boolean; isSelected: boolean }[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isPast: true,
        isSelected: false
      });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      const isPast = d.setHours(0,0,0,0) < new Date(today).setHours(0,0,0,0);
      const isSelected = selectedDate.toDateString() === d.toDateString();

      days.push({
        date: d,
        isCurrentMonth: true,
        isPast,
        isSelected
      });
    }

    // Next month filler days (to make complete weeks)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isPast: false,
        isSelected: false
      });
    }

    return days;
  }, [currentMonth, selectedDate, today]);

  // Available Time Slots for Selected Date
  const timeSlots: TimeSlot[] = useMemo(() => {
    return [
      { time: '10:00 AM', period: 'morning', available: true },
      { time: '11:00 AM', period: 'morning', available: true },
      { time: '11:45 AM', period: 'morning', available: true },
      { time: '02:00 PM', period: 'afternoon', available: true },
      { time: '03:15 PM', period: 'afternoon', available: true },
      { time: '04:30 PM', period: 'afternoon', available: true },
      { time: '05:45 PM', period: 'evening', available: true },
      { time: '07:00 PM', period: 'evening', available: true },
    ];
  }, []);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    // Don't go to past months
    if (prev.getMonth() < today.getMonth() && prev.getFullYear() <= today.getFullYear()) return;
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your name, email address, and contact number.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const topicObj = TOPICS.find(t => t.id === selectedTopic);
      const modeObj = MEETING_MODES.find(m => m.id === selectedMode);

      const bookingDetails = `
📅 FREE CONSULTATION CALL BOOKED VIA CALENDAR
• Date: ${formattedDate}
• Time Slot: ${selectedSlot} (IST / 30 Minutes)
• Meeting Channel: ${modeObj?.label || selectedMode}
• Topic / Focus: ${topicObj?.label || selectedTopic}
• Company / Brand: ${formData.company || 'N/A'}
• Client Notes: ${formData.message || 'None provided'}
      `.trim();

      const names = formData.name.trim().split(' ');
      const firstName = names[0] || 'Client';
      const lastName = names.slice(1).join(' ');

      const res = await leadService.createLead({
        first_name: firstName,
        last_name: lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.phone.trim(),
        company_name: formData.company.trim(),
        service_interest: `Consultation Call - ${topicObj?.label || 'General Advisory'}`,
        message: bookingDetails,
        notes: `Confirmed Call: ${formattedDate} at ${selectedSlot} (${modeObj?.label})`,
        source_name: 'Calendar Call Booking',
        status: 'QUALIFIED',
        priority: 'HIGH',
        tags: ['Consultation Booking', 'Calendar Call', 'High Intent']
      });

      setConfirmedLeadCode(res.enqId || 'CALL-CONFIRMED');
      setBookingConfirmed(true);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMessage('We encountered an issue securing your slot. Please try again or reach us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Calendar Link Generator
  const generateGoogleCalendarUrl = () => {
    const topicObj = TOPICS.find(t => t.id === selectedTopic);
    const title = encodeURIComponent(`Velametric Free Strategy Consultation: ${topicObj?.label || 'Project Discovery'}`);
    const details = encodeURIComponent(
      `30-Minute Free Strategy Consultation with Velametric Senior Advisory.\nMeeting Mode: ${selectedMode}\nClient: ${formData.name}\nReference: ${confirmedLeadCode}\nWebsite: https://velametric.com`
    );
    const location = encodeURIComponent(selectedMode === 'studio-visit' ? 'Velametric Studio Hub, Dehradun' : 'Google Meet (Link in Confirmation Email)');
    
    // Parse start date and time
    const start = new Date(selectedDate);
    const [timeStr, modifier] = selectedSlot.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    start.setHours(hours, minutes, 0, 0);

    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${formatGCalDate(start)}/${formatGCalDate(end)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // .ICS File Generator
  const downloadIcsFile = () => {
    const topicObj = TOPICS.find(t => t.id === selectedTopic);
    const start = new Date(selectedDate);
    const [timeStr, modifier] = selectedSlot.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const formatIcsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Velametric Inc//Free Consultation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Velametric Consultation - ${topicObj?.label || 'Strategy Session'}`,
      `DESCRIPTION:30-Minute Free Strategy Consultation with Velametric Advisors.\\nReference: ${confirmedLeadCode}`,
      `LOCATION:${selectedMode === 'studio-visit' ? 'Velametric Hub, Dehradun' : 'Google Meet Video Call'}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `velametric-consultation-${confirmedLeadCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans py-12 sm:py-20 selection:bg-amber-400 selection:text-black">
      
      {/* Background Ambience Glow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* HERO / INTRO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-mono font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> 100% Free Strategy Session • Zero Commitment
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase">
            Book A Free <span className="text-amber-400">Consultant Call</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Pick a date and time on the calendar below. Speak directly with our senior software architects, digital marketing strategists, video production leads, or government loan advisors.
          </p>

          {/* Value Badges */}
          <div className="pt-2 flex items-center justify-center flex-wrap gap-4 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> 30-Min Deep Dive
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> NDA & Privacy Protected
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
              <Check className="w-3.5 h-3.5 text-amber-400" /> Actionable Project Blueprint
            </span>
          </div>
        </div>

        {/* BOOKING CONFIRMED SUCCESS STATE */}
        {bookingConfirmed ? (
          <div className="max-w-2xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                BOOKING RESERVATION SECURED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                Your Free Consultation Is Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Thank you, <strong className="text-white">{formData.name}</strong>. A calendar invitation and direct meeting access link have been dispatched to <strong className="text-amber-400">{formData.email}</strong>.
              </p>
            </div>

            {/* Meeting Summary Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                <span className="text-zinc-500">BOOKING REFERENCE</span>
                <span className="text-amber-400 font-bold">{confirmedLeadCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">SCHEDULED DATE</span>
                <span className="text-white font-bold">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">SESSION TIME</span>
                <span className="text-white font-bold">{selectedSlot} IST (30 Minutes)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">MEETING CHANNEL</span>
                <span className="text-amber-400 font-bold">
                  {MEETING_MODES.find(m => m.id === selectedMode)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80">
                <span className="text-zinc-500">PRIMARY TOPIC</span>
                <span className="text-white font-bold truncate max-w-[200px]">
                  {TOPICS.find(t => t.id === selectedTopic)?.label}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-white text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-lg"
                >
                  <CalendarIcon className="w-4 h-4 text-black" /> Add to Google Calendar
                </a>
                <button
                  onClick={downloadIcsFile}
                  className="py-3 px-4 rounded-xl bg-zinc-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all border border-zinc-700"
                >
                  <Download className="w-4 h-4 text-amber-400" /> Download iCal / Outlook
                </button>
              </div>

              <a
                href={`https://wa.me/${(siteSettings?.contact_whatsapp || siteSettings?.contact_phone || '+918679766348').replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi ${siteSettings?.company_name || 'Velametric Team'}, I just scheduled a free consultation call on ${selectedDate.toDateString()} at ${selectedSlot} (Ref: ${confirmedLeadCode}). Looking forward to our session!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500/25 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" /> Confirm Directly On WhatsApp ({siteSettings?.contact_whatsapp || siteSettings?.contact_phone || '+91-8679766348'})
              </a>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setBookingConfirmed(false);
                  setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                }}
                className="text-xs text-zinc-500 hover:text-white underline font-mono transition-colors"
              >
                Schedule Another Call or Change Requirements
              </button>
            </div>
          </div>
        ) : (
          
          /* MAIN TWO-COLUMN BOOKING ENGINE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INTERACTIVE CALENDAR & TIME SLOTS */}
            <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
              
              {/* Step 1 Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-xs font-mono">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">
                      Select Date & Time Slot
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Standard session length is 30 minutes. All times in IST (GMT +5:30).
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 uppercase font-bold">
                  Live Slots Open
                </span>
              </div>

              {/* CALENDAR NAVIGATION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white font-mono uppercase tracking-wider">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* WEEKDAY HEADERS */}
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider py-1">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* DAYS GRID */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {calendarDays.map((dayObj, index) => {
                    const dayNum = dayObj.date.getDate();
                    const isSunday = dayObj.date.getDay() === 0;

                    if (!dayObj.isCurrentMonth) {
                      return (
                        <div
                          key={index}
                          className="h-10 sm:h-12 rounded-xl flex items-center justify-center text-xs text-zinc-700 cursor-not-allowed select-none"
                        >
                          {dayNum}
                        </div>
                      );
                    }

                    if (dayObj.isPast) {
                      return (
                        <div
                          key={index}
                          className="h-10 sm:h-12 rounded-xl flex items-center justify-center text-xs text-zinc-600 line-through opacity-40 cursor-not-allowed select-none bg-zinc-950/40"
                        >
                          {dayNum}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateSelect(dayObj.date)}
                        className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all relative group ${
                          dayObj.isSelected
                            ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-300 scale-105'
                            : 'bg-zinc-950/90 text-zinc-200 hover:bg-zinc-800 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {!dayObj.isSelected && !isSunday && (
                          <span className="w-1 h-1 rounded-full bg-amber-400/60 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TIME SLOTS SELECTION */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Available Slots for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">30 Mins Duration</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-500/10 scale-105'
                            : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MEETING MODE SELECTOR */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <label className="block text-xs font-mono font-bold text-zinc-400 uppercase">
                  Select Meeting Channel:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {MEETING_MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    const isSelected = selectedMode === mode.id;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400/40 text-white ring-1 ring-amber-400/30'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <ModeIcon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                          <span className="text-xs font-bold text-white line-clamp-1">{mode.label}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 line-clamp-1">{mode.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONSULTATION TOPIC & CONTACT DETAILS FORM */}
            <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Step 2 Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-xs font-mono">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">
                    Your Information & Focus
                  </h2>
                  <p className="text-xs text-zinc-400">
                    We pair you with our designated domain consultant.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* TOPIC SELECTOR */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Primary Consultation Topic <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    {TOPICS.map((top) => (
                      <option key={top.id} value={top.id}>
                        {top.icon} {top.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {TOPICS.find(t => t.id === selectedTopic)?.desc}
                  </p>
                </div>

                {/* NAME & EMAIL */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Business Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Your Google Meet video invite and reminder will arrive here.
                  </p>
                </div>

                {/* PHONE & COMPANY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      WhatsApp / Phone <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Ventures"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* SPECIFICATIONS & NOTES */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Brief Overview / What would you like to discuss?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your current bottleneck, project timeline, or specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                {/* APPOINTMENT SUMMARY CHIP */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/90 text-xs space-y-1 font-mono">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">Selected Appointment:</div>
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedSlot} IST
                    </span>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition-all transform hover:scale-[1.02] shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Securing Your Free Slot...</>
                  ) : (
                    <>Confirm Free Consultation Call →</>
                  )}
                </button>

                <div className="text-center text-[11px] text-zinc-500 font-mono">
                  100% Free • No Credit Card Required • Instant Google Meet Link
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SOCIAL PROOF / CONSULTATION TIMELINE STRIP */}
        <div className="mt-16 pt-12 border-t border-zinc-800/80">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">STEP 1</span>
              <h4 className="text-sm font-bold text-white font-display">Instant Confirmation</h4>
              <p className="text-xs text-zinc-400">
                You immediately receive a calendar invite with a private video meeting link.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">STEP 2</span>
              <h4 className="text-sm font-bold text-white font-display">Pre-Call Preparation</h4>
              <p className="text-xs text-zinc-400">
                Our consultant reviews your website, competitors, and domain specifications beforehand.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">STEP 3</span>
              <h4 className="text-sm font-bold text-white font-display">30-Min Strategy Call</h4>
              <p className="text-xs text-zinc-400">
                Direct tactical roadmap, technical architecture advice, and honest scope estimates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">STEP 4</span>
              <h4 className="text-sm font-bold text-white font-display">Written Blueprint</h4>
              <p className="text-xs text-zinc-400">
                Receive an executive summary and milestone proposal with zero follow-up pressure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
