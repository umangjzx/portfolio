import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { MapPin, Copy, Check, Calendar, Download, Mail, Phone, Send } from 'lucide-react';
import { formValidator } from '../../services/formValidator';
import type { ContactFormData, ContactFormState } from '../../types';
import { computeContactMagneticPull as computeMagneticPull } from '../../utils/computations';
import { PROFILE } from '../../data/profile';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import SectionHeading from '../ui/SectionHeading';

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 1000;
const SUBMIT_TIMEOUT = 10000;

interface FieldProps {
  label: string;
  name: keyof ContactFormData;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  maxLength: number;
  error: string | null;
  onChange: (name: keyof ContactFormData, value: string) => void;
  disabled?: boolean;
}

function Field({ label, name, type = 'text', value, maxLength, error, onChange, disabled }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const base = `w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-all duration-200 placeholder:text-ink-muted ${
    error
      ? 'border-error/60 focus:ring-4 focus:ring-error/10'
      : focused
        ? 'border-indigo ring-4 ring-indigo/10'
        : 'border-line hover:border-ink-muted/50'
  }`;

  return (
    <div className="mb-5">
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          rows={4}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${base} resize-none`}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          id={name}
          type={type}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(name, e.target.value)}
          className={base}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-sm text-error"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitButton({ isSubmitting, disabled }: { isSubmitting: boolean; disabled: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const pull = computeMagneticPull(e.clientX, e.clientY, rect.left + rect.width / 2, rect.top + rect.height / 2);
      setOffset(pull);
    },
    [disabled]
  );

  return (
    <motion.button
      ref={ref}
      type="submit"
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className="group relative w-full overflow-hidden rounded-xl py-4 font-semibold text-white"
      style={{
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6 55%, #06B6D4)',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.1s ease-out',
        opacity: disabled && !isSubmitting ? 0.6 : 1,
        boxShadow: '0 12px 30px rgba(99,102,241,0.3)',
      }}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isSubmitting ? (
          <>
            <motion.span
              className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Sending...
          </>
        ) : (
          <>
            <Send size={17} /> Send Message
          </>
        )}
      </span>
    </motion.button>
  );
}

export default function ContactPortal() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15, once: true });
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>({
    data: { name: '', email: '', message: '' },
    errors: { name: null, email: null, message: null },
    isSubmitting: false,
    submitResult: 'idle',
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = useCallback((name: keyof ContactFormData, value: string) => {
    setFormState((p) => ({
      ...p,
      data: { ...p.data, [name]: value },
      errors: { ...p.errors, [name]: null },
      submitResult: p.submitResult === 'error' ? 'idle' : p.submitResult,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = formValidator.validate(formState.data);
      if (!result.isValid) {
        setFormState((p) => ({ ...p, errors: result.errors as ContactFormState['errors'] }));
        return;
      }
      setFormState((p) => ({ ...p, isSubmitting: true, submitResult: 'idle' }));
      try {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 1500);
          timeoutRef.current = setTimeout(() => {
            clearTimeout(timer);
            reject(new Error('timeout'));
          }, SUBMIT_TIMEOUT);
        });
        setFormState((p) => ({ ...p, isSubmitting: false, submitResult: 'success' }));
      } catch {
        setFormState((p) => ({ ...p, isSubmitting: false, submitResult: 'error' }));
      }
    },
    [formState.data]
  );

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(PROFILE.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden px-6 py-32 md:px-12 lg:px-24">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px]">
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

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left — animated contact card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <div
              className="relative overflow-hidden rounded-3xl border border-line bg-white/85 p-8 backdrop-blur-xl"
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

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="rounded-3xl border border-line bg-white/85 p-8 backdrop-blur-xl md:p-10"
            style={{ boxShadow: '0 12px 40px rgba(15,23,42,0.06)' }}
          >
            <AnimatePresence mode="wait">
              {formState.submitResult === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <Check size={34} />
                  </div>
                  <h3 className="font-display text-3xl font-semibold text-ink">Message sent</h3>
                  <p className="mt-2 text-ink-soft">Thanks for reaching out — I'll reply soon.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} noValidate initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Field label="Name" name="name" value={formState.data.name} maxLength={MAX_NAME} error={formState.errors.name} onChange={handleChange} disabled={formState.isSubmitting} />
                  <Field label="Email" name="email" type="email" value={formState.data.email} maxLength={MAX_EMAIL} error={formState.errors.email} onChange={handleChange} disabled={formState.isSubmitting} />
                  <Field label="Message" name="message" type="textarea" value={formState.data.message} maxLength={MAX_MESSAGE} error={formState.errors.message} onChange={handleChange} disabled={formState.isSubmitting} />

                  {formState.submitResult === 'error' && (
                    <div className="mb-5 rounded-xl border border-error/20 bg-error/5 p-4 text-center text-sm font-medium text-error">
                      Failed to send message. Please try again.
                    </div>
                  )}

                  <SubmitButton isSubmitting={formState.isSubmitting} disabled={formState.isSubmitting} />
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
