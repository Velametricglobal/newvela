import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';

export const LightDotCursor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isOverHeader, setIsOverHeader] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [hAlign, setHAlign] = useState<'center' | 'left' | 'right'>('center');

  // Reset popup text whenever user changes route
  useEffect(() => {
    setIsNearBottom(false);
  }, [location.pathname]);

  // Completely hide cursor following light in CRM panel, backend administration, talent studio, and all working panels
  const isBackendOrCrmPanel = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/crm') ||
    location.pathname === '/login' ||
    location.pathname.includes('/admin') ||
    location.pathname.startsWith('/talent-dashboard');

  useEffect(() => {
    if (isBackendOrCrmPanel) return;

    // Check if device supports fine pointer (mouse/trackpad), not touch-only
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let glowX = -100;
    let glowY = -100;
    let animationFrameId: number;

    const checkBottomPosition = (currentMouseX: number, currentMouseY: number) => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      
      // ONLY trigger when user has actually scrolled to the end of the webpage (within bottom 280px / footer)
      const isScrollAtEndOfWebsite = (windowHeight + scrollY) >= (docHeight - 280);

      // Horizontal edge safety check to avoid badge clipping offscreen
      if (currentMouseX < 160) {
        setHAlign('left');
      } else if (currentMouseX > window.innerWidth - 160) {
        setHAlign('right');
      } else {
        setHAlign('center');
      }

      // STRICT: Only show popup text when at the end of the website, nowhere else
      setIsNearBottom(isScrollAtEndOfWebsite && currentMouseY > 80);
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        // Detect if cursor is on printable document canvas / preview
        const inDocPreview = !!target.closest('#printable-document-container, .printable-document, #printable-document');
        if (inDocPreview) {
          setIsVisible(false);
          return;
        }

        // Detect if cursor is on the header
        const inHeader = !!target.closest('header');
        setIsOverHeader(inHeader);

        // Check if target is an interactive element
        const interactive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
        setIsHovered(!!interactive);
      }

      checkBottomPosition(mouseX, mouseY);
    };

    const onScroll = () => {
      checkBottomPosition(mouseX, mouseY);
    };

    const onPointerDown = () => setIsPressed(true);
    const onPointerUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    let scrollAnimationId: number | null = null;
    let animTargetY: number | null = null;

    const smoothGlideTo = (targetY: number, duration: number = 650) => {
      if (scrollAnimationId !== null) {
        cancelAnimationFrame(scrollAnimationId);
        scrollAnimationId = null;
      }

      const startY = window.scrollY || document.documentElement.scrollTop || 0;
      const distance = targetY - startY;
      if (Math.abs(distance) < 2) return;

      const startTime = performance.now();
      animTargetY = targetY;

      // Silky cubic ease-in-out (cinematic luxury glide, zero abrupt stops or stutters)
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        const nextY = Math.round(startY + distance * eased);
        window.scrollTo(0, nextY);

        if (progress < 1) {
          scrollAnimationId = requestAnimationFrame(step);
        } else {
          scrollAnimationId = null;
          animTargetY = null;
        }
      };

      scrollAnimationId = requestAnimationFrame(step);
    };

    const onUserWheel = () => {
      // If user uses wheel or touches screen, gracefully yield and stop automated glide
      if (scrollAnimationId !== null) {
        cancelAnimationFrame(scrollAnimationId);
        scrollAnimationId = null;
        animTargetY = null;
      }
    };

    const onDocumentClick = (e: MouseEvent) => {
      // 1. Only respond to primary left click
      if (e.button !== 0) return;

      // 2. If user is selecting text, do not hijack
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) return;

      // 3. Ignore only actual functional interactive controls
      const target = e.target as HTMLElement | null;
      if (target) {
        // Exclude links, buttons, form controls, and document preview sheets
        const isActionControl = target.closest(
          'a[href], button, input, textarea, select, option, label[for], [contenteditable="true"], audio, video, iframe, canvas, [role="button"]:not([data-scroll-click="true"]), [role="tab"], [role="switch"], .no-scroll-click, #printable-document-container, .printable-document, #printable-document'
        );
        if (isActionControl) return;

        // Exclude open dialogs/menus
        const isModalOrMenu = target.closest('[role="dialog"], [role="menu"], [role="listbox"]');
        if (isModalOrMenu) return;
      }

      // Visual cursor feedback: Downward pulse
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 550);

      // Execute buttery-smooth glide
      const currentScrollY = animTargetY !== null ? animTargetY : (window.scrollY || document.documentElement.scrollTop || 0);
      const scrollDistance = Math.round(window.innerHeight * 0.72);
      const maxScroll = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;

      let nextTarget = currentScrollY + scrollDistance;
      if (currentScrollY >= maxScroll - 30) {
        nextTarget = 0; // Return smoothly to top if at bottom
      } else {
        nextTarget = Math.min(nextTarget, maxScroll);
      }

      smoothGlideTo(nextTarget, 650);
    };

    const render = () => {
      // Lerp for smooth trailing effect
      // V emblem follows quickly (snappy precision)
      dotX += (mouseX - dotX) * 0.42;
      dotY += (mouseY - dotY) * 0.42;

      // Ambient radial glow follows with soft cinematic lag
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('click', onDocumentClick);
    window.addEventListener('wheel', onUserWheel, { passive: true });
    window.addEventListener('touchmove', onUserWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('click', onDocumentClick);
      window.removeEventListener('wheel', onUserWheel);
      window.removeEventListener('touchmove', onUserWheel);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (scrollAnimationId !== null) cancelAnimationFrame(scrollAnimationId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [navigate, isBackendOrCrmPanel]);

  if (isBackendOrCrmPanel) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-150 ${
        isVisible && !isOverHeader ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Ambient Radial Light Halo (Illuminates underlying dark interface) */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute top-0 left-0 w-80 h-80 rounded-full transition-transform duration-75 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 45%, rgba(245, 158, 11, 0) 70%)',
          filter: 'blur(8px)',
        }}
      />

      {/* 2. Focused Glowing "V" Shape Emblem in Middle of Light */}
      <div
        ref={dotRef}
        className={`pointer-events-none absolute top-0 left-0 will-change-transform transition-[width,height,transform,box-shadow,border-color,background-color] duration-150 ease-out flex items-center justify-center rounded-full ${
          isScrolling
            ? 'w-10 h-10 bg-amber-400/35 border-amber-300 scale-110 shadow-[0_0_30px_rgba(245,158,11,0.9)]'
            : isPressed
            ? 'w-7 h-7 bg-amber-400/30 border-amber-200 scale-90'
            : isHovered
            ? 'w-9 h-9 bg-amber-400/20 border-amber-400 scale-110'
            : 'w-7 h-7 bg-zinc-950/75 border-amber-400/60'
        } border backdrop-blur-sm`}
        style={{
          boxShadow: isScrolling
            ? '0 0 25px 6px rgba(245, 158, 11, 0.85), 0 0 50px 12px rgba(245, 158, 11, 0.45), inset 0 0 10px rgba(255, 255, 255, 0.5)'
            : isHovered
            ? '0 0 20px 4px rgba(245, 158, 11, 0.75), 0 0 40px 8px rgba(245, 158, 11, 0.35), inset 0 0 8px rgba(251, 191, 36, 0.3)'
            : '0 0 12px 2px rgba(245, 158, 11, 0.55), 0 0 24px 4px rgba(245, 158, 11, 0.25), inset 0 0 4px rgba(251, 191, 36, 0.15)',
        }}
      >
        {/* Floating Growth Micro-Popup when cursor and light are at bottom */}
        {isNearBottom && !isOverHeader && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (window.location.pathname === '/case-studies') {
                window.scrollTo({ top: Math.min(window.innerHeight * 0.8, 600), behavior: 'smooth' });
              } else {
                navigate('/case-studies');
              }
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            className={`pointer-events-auto cursor-pointer absolute bottom-full mb-3.5 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/95 border border-amber-400 text-amber-300 text-[11px] font-bold shadow-[0_0_25px_rgba(245,158,11,0.7),0_8px_20px_rgba(0,0,0,0.85)] backdrop-blur-md whitespace-nowrap group hover:bg-amber-400 hover:text-black hover:border-amber-300 transition-all duration-200 transform hover:scale-105 active:scale-95 animate-in fade-in zoom-in-95 ${
              hAlign === 'left' ? 'left-0' : hAlign === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
            }`}
          >
            {/* Luminous beacon indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>

            {/* Micro badge text */}
            <span className="tracking-wide select-none">
              Click here and see your growth with us
            </span>

            <TrendingUp className="w-3.5 h-3.5 text-amber-400 group-hover:text-black group-hover:scale-110 transition-transform" />

            {/* Tiny downward connecting arrow to cursor light */}
            <div
              className={`absolute top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-amber-400 group-hover:border-t-amber-400 transition-colors ${
                hAlign === 'left' ? 'left-4' : hAlign === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'
              }`}
            />
          </div>
        )}
        {/* Outward scroll propulsion pulse ring */}
        {isScrolling && (
          <div
            className="absolute -inset-2 rounded-full border-2 border-amber-300 animate-ping opacity-75 pointer-events-none"
            style={{ animationDuration: '450ms' }}
          />
        )}

        {/* Sleek Velametric Signature "V" Vector */}
        <div
          className={`transition-all duration-150 flex items-center justify-center ${
            isScrolling
              ? 'w-4.5 h-4.5 translate-y-1'
              : isPressed
              ? 'w-3 h-3'
              : isHovered
              ? 'w-4 h-4'
              : 'w-3.5 h-3.5'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft Ambient Neon Back-Glow on the V path */}
            <path
              d="M4.5 5.5L12 18.5L19.5 5.5"
              stroke={isScrolling || isHovered ? "rgba(255, 255, 255, 0.95)" : "rgba(245, 158, 11, 0.75)"}
              strokeWidth={isScrolling || isHovered ? "4" : "3.2"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="blur-[1.5px]"
            />
            {/* Crisp High-Definition Foreground V */}
            <path
              d="M4.5 5.5L12 18.5L19.5 5.5"
              stroke={isScrolling || isHovered ? "#FFFFFF" : "#FBBF24"}
              strokeWidth={isScrolling ? "3.6" : isHovered ? "3.2" : "2.6"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Micro Optical Core Luminous Spark */}
        <div
          className={`absolute rounded-full transition-all duration-150 ${
            isScrolling
              ? 'w-2 h-2 bg-white translate-y-2 shadow-[0_0_12px_#ffffff]'
              : isHovered
              ? 'w-1.5 h-1.5 bg-white translate-y-1 shadow-[0_0_8px_#ffffff]'
              : 'w-1 h-1 bg-amber-200 translate-y-0.5 shadow-[0_0_4px_#fbbf24]'
          }`}
        />
      </div>
    </div>
  );
};
