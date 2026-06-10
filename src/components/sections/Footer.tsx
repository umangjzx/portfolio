import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { PROFILE } from '../../data/profile';

const QUICK_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-white/60 backdrop-blur-md">
      {/* Subtle gradient accent at top */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #6366F1, #8B5CF6, #06B6D4, transparent)' }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 md:px-12 lg:px-24">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Left — branding */}
          <div className="text-center sm:text-left">
            <h3 className="font-display text-lg font-semibold text-ink">
              <span className="text-gradient">{PROFILE.firstName}</span>{' '}
              {PROFILE.lastName}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-ink-soft">
              {PROFILE.tagline}
            </p>
          </div>

          {/* Center — quick links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-ink-soft transition-colors hover:text-indigo"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — socials + back to top */}
          <div className="flex items-center gap-3">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-all hover:scale-110 hover:border-indigo hover:text-indigo"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-all hover:scale-110 hover:border-indigo hover:text-indigo"
            >
              <LinkedinIcon size={16} />
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-all hover:scale-110 hover:border-indigo hover:text-indigo"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row"
        >
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            © {year} {PROFILE.name}. Built with
            <Heart size={12} className="text-rose-400" fill="currentColor" />
            using React, Three.js & Framer Motion.
          </p>
          <p className="text-xs text-ink-muted">
            Coimbatore, India
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
