import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MessageSquare, ThumbsUp, ArrowUpRight, Briefcase,
  GraduationCap, MapPin, Sparkles, TrendingUp, Hash,
} from 'lucide-react';
import { LinkedinIcon } from '../ui/BrandIcons';
import { LINKEDIN_PROFILE } from '../../data/linkedin';
import type { LinkedInPost } from '../../data/linkedin';
import SectionHeading from '../ui/SectionHeading';
import TiltCard from '../ui/TiltCard';
import { usePortfolioStore } from '../../store/portfolioStore';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function PostCard({ post, index }: { post: LinkedInPost; index: number }) {
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
      className="group block"
    >
      <TiltCard spotlightColor="rgba(0,119,181,0.08)" className="h-full">
        <article
          className="flex h-full flex-col rounded-2xl border border-line bg-white/80 p-5 backdrop-blur-xl transition-all duration-300 group-hover:border-[#0077B5]/30 sm:rounded-3xl sm:p-7"
          style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
        >
          {/* Date & tags */}
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-ink-muted">{post.date}</span>
            <div className="flex gap-1.5">
              {post.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-0.5 rounded-md bg-[#0077B5]/8 px-2 py-0.5 text-[10px] font-semibold text-[#0077B5]"
                >
                  <Hash size={9} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <h4 className="font-display text-base font-semibold text-ink group-hover:text-[#0077B5] transition-colors sm:text-lg">
            {post.title}
          </h4>

          {/* Snippet */}
          <p className="mt-2 flex-grow text-sm leading-relaxed text-ink-soft line-clamp-3">
            {post.snippet}
          </p>

          {/* Engagement */}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                <ThumbsUp size={13} className="text-[#0077B5]" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                <MessageSquare size={13} className="text-[#0077B5]" />
                {post.comments}
              </span>
            </div>
            <ArrowUpRight
              size={16}
              className="text-ink-muted transition-all group-hover:text-[#0077B5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </article>
      </TiltCard>
    </motion.a>
  );
}

export default function LinkedInSection() {
  const addXP = usePortfolioStore((s) => s.addXP);
  const [hasGrantedXP, setHasGrantedXP] = useState(false);

  const handleInteraction = () => {
    if (!hasGrantedXP) {
      addXP(40);
      setHasGrantedXP(true);
    }
  };

  const p = LINKEDIN_PROFILE;

  return (
    <section
      id="linkedin"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-12 md:py-32 lg:px-24"
      onMouseEnter={handleInteraction}
    >
      {/* Background accent */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(0,119,181,0.15), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Professional Network"
          title={
            <>
              LinkedIn <span className="text-gradient">presence</span>
            </>
          }
          description="My professional journey, recent activity, and thought leadership — live from LinkedIn."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-[1fr_1.5fr] lg:gap-8">
          {/* Left — Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-line sm:rounded-3xl"
              style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.06)',
              }}
            >
              {/* Banner gradient */}
              <div
                className="h-20 sm:h-24"
                style={{ background: `linear-gradient(135deg, ${p.bannerGradient[0]}, ${p.bannerGradient[1]})` }}
              >
                <div
                  className="h-full w-full opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>

              {/* Avatar overlapping banner */}
              <div className="relative px-5 sm:px-7">
                <div className="-mt-10 mb-4 sm:-mt-12">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl border-[3px] border-white shadow-lg sm:h-24 sm:w-24">
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Name & headline */}
                <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">{p.name}</h3>
                <p className="mt-1 text-sm leading-snug text-ink-soft">{p.headline}</p>

                {/* Info badges */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <Briefcase size={14} className="text-[#0077B5]" />
                    <span>{p.currentRole} @ <strong className="text-ink">{p.currentCompany}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <GraduationCap size={14} className="text-[#0077B5]" />
                    <span>{p.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <MapPin size={14} className="text-[#0077B5]" />
                    <span>{p.location}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Connections', value: p.connections, icon: Users },
                    { label: 'Followers', value: p.followers, icon: TrendingUp },
                    { label: 'Posts', value: String(p.posts), icon: MessageSquare },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-line bg-slate-50/70 p-3 text-center transition-all hover:bg-white hover:shadow-sm"
                    >
                      <Icon size={14} className="mx-auto mb-1 text-[#0077B5]" />
                      <p className="text-lg font-bold text-ink">{value}</p>
                      <p className="text-[10px] text-ink-muted">{label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-5 pb-6 sm:pb-7">
                  <a
                    href={p.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #0077B5, #00A0DC)' }}
                  >
                    <LinkedinIcon size={16} />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Highlights card below profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="mt-4 rounded-2xl border border-line bg-white/80 p-5 backdrop-blur-xl sm:mt-6 sm:rounded-3xl sm:p-7"
              style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#0077B5]" />
                <h4 className="font-display text-base font-semibold text-ink">Highlights</h4>
              </div>
              <ul className="space-y-3">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0077B5]" />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right — Recent Posts + Skills */}
          <div className="flex flex-col gap-6">
            {/* Recent Activity header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0077B5] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0077B5]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">Recent Activity</h3>
              </div>
              <a
                href={p.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-[#0077B5] transition-colors hover:text-[#005f8d]"
              >
                View all <ArrowUpRight size={14} />
              </a>
            </motion.div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {p.recentPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {/* Skills/endorsements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="rounded-2xl border border-line bg-white/80 p-5 backdrop-blur-xl sm:rounded-3xl sm:p-7"
              style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-display text-base font-semibold text-ink">Top Skills</h4>
                <span className="text-xs text-ink-muted">{p.skills.length} endorsed</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-[#0077B5]/20 bg-[#0077B5]/5 px-3 py-1.5 text-sm font-medium text-[#005f8d] transition-all hover:border-[#0077B5]/40 hover:bg-[#0077B5]/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Quick connect banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="relative overflow-hidden rounded-2xl p-6 sm:rounded-3xl sm:p-8"
              style={{ background: 'linear-gradient(135deg, #0077B5, #00A0DC)' }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-display text-lg font-semibold text-white sm:text-xl">
                    Let's connect professionally
                  </h4>
                  <p className="mt-1 text-sm text-white/80">
                    I share insights on AI, ML, and building products that ship.
                  </p>
                </div>
                <a
                  href={p.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0077B5] transition-all hover:scale-105 hover:shadow-lg"
                >
                  <LinkedinIcon size={16} />
                  Follow
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
