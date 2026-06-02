import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Copy, Check, Calendar, Download, Mail, Phone } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import SectionHeading from '../ui/SectionHeading';

export default function ContactPortal() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15, once: true });
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(PROFILE.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-12 md:py-24 lg:px-24">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-[700px]">
        <SectionHeading
          eyebrow="Contact"
          align="center"
          title={
            <>
              Let's build something <span className="text-gradient">intelligent</span>
            </>
          }
          description="Open to roles, collaborations, and research. Pick whichever channel suits you."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-line bg-white/85 p-5 backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(15,23,42,0.06)' }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-ink">{PROFILE.availability}</span>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
              <MapPin size={16} className="text-indigo" /> {PROFILE.location}
            </p>

            {/* email copy */}
            <button
              onClick={copyEmail}
              className="group mt-3 flex w-full items-center justify-between rounded-xl border border-line bg-slate-50/70 px-4 py-3 text-left transition-all hover:border-indigo/40"
            >
              <span className="flex items-center gap-2 text-sm text-ink-soft">
                <Mail size={16} className="text-violet" /> {PROFILE.email}
              </span>
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-ink-muted group-hover:text-indigo" />}
            </button>

            <a
              href={`tel:${PROFILE.phone}`}
              className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-slate-50/70 px-4 py-3 text-sm text-ink-soft transition-all hover:border-indigo/40"
            >
              <Phone size={16} className="text-cyan" /> {PROFILE.phone}
            </a>

            {/* quick actions */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a
                href={PROFILE.resumeUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                <Download size={16} /> Résumé
              </a>
              <a
                href={PROFILE.calendly}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition-all hover:border-indigo hover:text-indigo"
              >
                <Calendar size={16} /> Schedule
              </a>
            </div>

            {/* socials */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-all hover:scale-110 hover:border-indigo hover:text-indigo"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-all hover:scale-110 hover:border-indigo hover:text-indigo"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
