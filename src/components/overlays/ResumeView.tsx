import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { MILESTONES } from '../../data/milestones';
import { SKILLS, SKILL_CLUSTERS } from '../../data/skills';
import { PROJECTS } from '../../data/projects';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';

interface ResumeViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeView({ isOpen, onClose }: ResumeViewProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Sort milestones by order descending (most recent first)
  const sortedMilestones = [...MILESTONES]
    .filter((m) => m.type === 'work' || m.type === 'education')
    .sort((a, b) => b.order - a.order)
    .slice(0, 6);

  const awards = MILESTONES.filter((m) => m.type === 'award' || m.type === 'research');
  const featuredProjects = PROJECTS.filter((p) => p.featured).slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto p-2 sm:p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            className="relative my-4 w-full max-w-[850px] rounded-2xl bg-white shadow-2xl print:shadow-none print:rounded-none print:my-0 print:max-w-none"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Resume view"
          >
            {/* Toolbar — hidden in print */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-white/95 px-5 py-3 backdrop-blur-md print:hidden">
              <h2 className="text-sm font-semibold text-ink">Resume — {PROFILE.name}</h2>
              <div className="flex items-center gap-2">
                <a
                  href={PROFILE.resumeUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-indigo hover:text-indigo"
                >
                  <Download size={13} /> PDF
                </a>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-indigo hover:text-indigo"
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-gray-100 hover:text-ink"
                  aria-label="Close resume"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Resume content */}
            <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-14">
              {/* Header */}
              <header className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="font-display text-3xl font-bold text-ink">{PROFILE.name}</h1>
                <p className="mt-1 text-base font-medium text-indigo-600">
                  {PROFILE.roles.join(' · ')}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-indigo-500" /> {PROFILE.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-indigo-500" /> {PROFILE.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-indigo-500" /> {PROFILE.location}
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-sm">
                  <a href={PROFILE.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-ink-soft hover:text-indigo">
                    <GithubIcon size={13} /> GitHub
                  </a>
                  <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-ink-soft hover:text-indigo">
                    <LinkedinIcon size={13} /> LinkedIn
                  </a>
                </div>
              </header>

              {/* Summary */}
              <section className="mb-7">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">Summary</h2>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {PROFILE.oneLiner} Building end-to-end AI-powered products — from designing intelligent
                  backend pipelines to shipping polished React interfaces. 11+ products shipped, 4 hackathon
                  podiums, and 2 peer-reviewed publications.
                </p>
              </section>

              {/* Experience */}
              <section className="mb-7">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">Experience</h2>
                <div className="space-y-4">
                  {sortedMilestones.map((m) => (
                    <div key={m.id}>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-ink">{m.title}</h3>
                        <span className="flex-shrink-0 text-xs text-ink-muted">{m.date}</span>
                      </div>
                      {m.company && (
                        <p className="text-xs font-medium text-indigo-500">
                          {m.role ? `${m.role} · ` : ''}{m.company}
                        </p>
                      )}
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{m.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Key Projects */}
              <section className="mb-7">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">Key Projects</h2>
                <div className="space-y-3">
                  {featuredProjects.map((p) => (
                    <div key={p.id} className="flex items-start gap-2">
                      <ExternalLink size={12} className="mt-0.5 flex-shrink-0 text-indigo-400" />
                      <div>
                        <span className="text-sm font-semibold text-ink">{p.title}</span>
                        <span className="mx-1.5 text-xs text-ink-muted">—</span>
                        <span className="text-xs text-ink-soft">{p.tagline}</span>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {p.techStack.slice(0, 4).map((t) => (
                            <span key={t} className="text-[10px] text-ink-muted">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section className="mb-7">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">Technical Skills</h2>
                <div className="space-y-2">
                  {SKILL_CLUSTERS.map((cluster) => {
                    const clusterSkills = SKILLS.filter((s) => s.cluster === cluster.id);
                    if (clusterSkills.length === 0) return null;
                    return (
                      <div key={cluster.id} className="flex items-start gap-2">
                        <span className="flex-shrink-0 text-xs font-semibold text-ink w-32">{cluster.label}:</span>
                        <span className="text-xs text-ink-soft">
                          {clusterSkills.map((s) => s.name).join(', ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Awards & Publications */}
              <section className="mb-4">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">Awards & Publications</h2>
                <ul className="space-y-1.5">
                  {awards.map((a) => (
                    <li key={a.id} className="flex items-start gap-2 text-xs text-ink-soft">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                      <span>
                        <strong className="text-ink">{a.title}</strong> — {a.company}, {a.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResumeView;
