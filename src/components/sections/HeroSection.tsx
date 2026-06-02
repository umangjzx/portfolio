import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Download, ArrowDown, Calendar, FolderGit2, Sparkles } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { PROFILE } from '../../data/profile';
import { checkIsMobile } from '../../hooks/useIsMobile';

export interface HeroSectionProps {
  isVisible?: boolean;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const isMobileStatic = checkIsMobile();

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: isMobileStatic ? 0.06 : 0.1, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroSection({ isVisible = true }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = checkIsMobile();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacityText = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Mouse parallax for depth layers — disabled on mobile
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (reducedMotion.current || isMobile) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setParallax({ x, y });
  }, [isMobile]);

  if (!isVisible) return null;

  return (
    <section
      ref={containerRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent py-20 md:py-0"
    >
      {/* ── Depth layer: aurora blobs (mouse parallax) — hidden on mobile for perf ── */}
      {!isMobile && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          animate={{ x: parallax.x * -28, y: parallax.y * -28 }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        >
          <div
            className="absolute -left-20 top-24 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)', animation: 'aurora 16s ease-in-out infinite' }}
          />
          <div
            className="absolute -right-16 bottom-16 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)', animation: 'aurora 20s ease-in-out infinite reverse' }}
          />
          <div
            className="absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)', animation: 'aurora 18s ease-in-out infinite' }}
          />
        </motion.div>
      )}

      {/* ── Depth layer: fine grid — hidden on mobile ── */}
      {!isMobile && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.5]"
          animate={{ x: parallax.x * -10, y: parallax.y * -10 }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 45%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 45%, black 30%, transparent 75%)',
          }}
        />
      )}

      {/* ── Floating accent dots (depth) — hidden on mobile ── */}
      {!isMobile && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          animate={{ x: parallax.x * 20, y: parallax.y * 20 }}
          transition={{ type: 'spring', stiffness: 40, damping: 20 }}
        >
          {[
            { l: '18%', t: '28%', c: '#6366F1', s: 8 },
            { l: '82%', t: '22%', c: '#06B6D4', s: 10 },
            { l: '74%', t: '70%', c: '#8B5CF6', s: 7 },
            { l: '24%', t: '74%', c: '#EC4899', s: 9 },
            { l: '50%', t: '14%', c: '#6366F1', s: 6 },
          ].map((d, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ left: d.l, top: d.t, width: d.s, height: d.s, background: d.c, boxShadow: `0 0 14px ${d.c}` }}
              animate={{ y: [0, -16, 0], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          ))}
        </motion.div>
      )}

      {/* ── Mobile: lightweight static decorative elements ── */}
      {isMobile && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {/* Subtle gradient accent at top */}
          <div
            className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[40vh] rounded-full opacity-[0.12]"
            style={{ background: 'radial-gradient(ellipse, #6366f1, transparent 70%)' }}
          />
          {/* Bottom accent */}
          <div
            className="absolute -bottom-[5%] -right-[10%] w-[50vw] h-[50vw] rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 65%)' }}
          />
          {/* Fine grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)',
            }}
          />
        </div>
      )}

      {/* soft vignette to focus the center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(250,250,250,0.55) 100%)' }}
      />

      {/* ── Content ── */}
      <motion.div
        className="container relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 md:px-12 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16"
        variants={container}
        initial="hidden"
        animate="show"
        style={isMobile ? {} : { y: yText, opacity: opacityText }}
      >
        {/* Right column — profile photo (shown first on mobile for visual hierarchy) */}
        <motion.div
          variants={item}
          className="mb-8 flex justify-center lg:hidden"
        >
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-[3px] border-white shadow-[0_12px_40px_rgba(99,102,241,0.15)] ring-1 ring-indigo-100/50">
              <img
                src={PROFILE.photoUrl}
                alt={PROFILE.name}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                width={160}
                height={160}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-20 -z-10" />
            <div className="absolute -top-1 -left-1 w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 -z-10" />
          </div>
        </motion.div>

        {/* Left column — text content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* availability */}
          <motion.div
            variants={item}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-5 py-2.5 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium tracking-wide text-ink-soft">{PROFILE.availability}</span>
          </motion.div>

          {/* WHO — name */}
          <motion.h1
            variants={item}
            className="font-display text-[15vw] font-semibold leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-[6.5rem]"
          >
            <span className="text-gradient">{PROFILE.firstName}</span>{' '}
            <span className="text-ink">{PROFILE.lastName}</span>
          </motion.h1>

          {/* WHAT — tagline (the hook) */}
          <motion.p
            variants={item}
            className="mt-6 max-w-xl font-display text-xl font-medium leading-tight text-ink sm:text-2xl md:text-3xl"
          >
            I turn <span className="text-gradient">messy data</span> into intelligent products.
          </motion.p>

          {/* roles */}
          <motion.div variants={item} className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2">
            {PROFILE.roles.map((role, i) => (
              <span key={role} className="flex items-center gap-3 text-base font-light text-ink-soft md:text-lg">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-ink-muted" />}
                {role}
              </span>
            ))}
          </motion.div>

          {/* WHY — proof line */}
          <motion.p variants={item} className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
            <Sparkles size={15} className="text-violet" />
            11 products shipped · 4 hackathon podiums · 2 published papers
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <MagneticButton href={PROFILE.resumeUrl} external download variant="primary" ariaLabel="Download résumé">
              <Download size={17} /> Download Résumé
            </MagneticButton>
            <MagneticButton onClick={() => scrollToId('projects')} variant="secondary" ariaLabel="View projects">
              <FolderGit2 size={17} /> View Projects
            </MagneticButton>
            <MagneticButton href={PROFILE.calendly} external variant="secondary" ariaLabel="Schedule a meeting">
              <Calendar size={17} /> Schedule a Meeting
            </MagneticButton>
          </motion.div>

          {/* social */}
          <motion.div variants={item} className="mt-7 flex items-center gap-3">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-ink-soft backdrop-blur-md transition-all hover:scale-110 hover:border-indigo hover:text-indigo"
            >
              <GithubIcon size={19} />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-ink-soft backdrop-blur-md transition-all hover:scale-110 hover:border-indigo hover:text-indigo"
            >
              <LinkedinIcon size={19} />
            </a>
          </motion.div>
        </div>

        {/* Right column — large profile photo (desktop only, mobile shown above) */}
        <motion.div
          variants={item}
          className="hidden lg:flex justify-center"
        >
          <div className="relative">
            <div className="w-72 h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] rounded-[2rem] overflow-hidden border-[3px] border-white shadow-[0_20px_60px_rgba(99,102,241,0.18)] ring-1 ring-indigo-100/50">
              <img
                src={PROFILE.photoUrl}
                alt={PROFILE.name}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                width={352}
                height={352}
              />
            </div>
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-indigo-400/15 via-violet-400/10 to-cyan-400/15 -z-10 blur-xl" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-20 -z-10" />
            <div className="absolute -top-2 -left-2 w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 -z-10" />
          </div>
        </motion.div>
      </motion.div>

      {/* scroll cue — hidden on mobile to save space */}
      <motion.button
        onClick={() => scrollToId('about')}
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 z-10 hidden md:flex -translate-x-1/2 flex-col items-center gap-2 text-ink-muted transition-colors hover:text-indigo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={16} />
        </motion.span>
      </motion.button>
    </section>
  );
}
