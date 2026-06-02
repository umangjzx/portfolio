import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Star, BookOpen, Activity, Users, MessageSquare, ThumbsUp,
  ArrowUpRight, Briefcase, GraduationCap, MapPin, Sparkles,
  TrendingUp, Hash,
} from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';
import {
  fetchGitHubUser, fetchGitHubRepos, calculateLanguageStats,
  type GitHubUser, type GitHubRepo,
} from '../../services/githubAPI';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { LINKEDIN_PROFILE } from '../../data/linkedin';
import SectionHeading from '../ui/SectionHeading';
import { usePortfolioStore } from '../../store/portfolioStore';
import { checkIsMobile } from '../../hooks/useIsMobile';

const GITHUB_USERNAME = 'umangjzx';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────
   GitHub Column (compact version)
───────────────────────────────────────────── */
function GitHubColumn() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = checkIsMobile();

  useEffect(() => {
    async function load() {
      try {
        const [userData, repoData] = await Promise.all([
          fetchGitHubUser(GITHUB_USERNAME),
          fetchGitHubRepos(GITHUB_USERNAME),
        ]);
        if (!userData) {
          setError(true);
        } else {
          setUser(userData);
          setRepos(repoData);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-indigo-500 animate-spin" />
        <p className="mt-3 text-xs text-ink-muted font-mono">Connecting to GitHub...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-2xl border border-line bg-white/80 p-8 text-center backdrop-blur-xl">
        <GithubIcon size={36} className="mx-auto text-gray-300 mb-3" />
        <p className="text-ink-soft text-sm mb-4">Unable to load GitHub data</p>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #333, #555)' }}
        >
          <GithubIcon size={14} /> Visit Profile
        </a>
      </div>
    );
  }

  const topRepos = repos.slice(0, 4);
  const langStats = calculateLanguageStats(repos);
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Profile card */}
      <div
        className="rounded-2xl border border-line p-5 sm:rounded-3xl sm:p-6"
        style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-4 mb-5">
          <img src={user.avatar_url} alt={user.name} className="h-14 w-14 rounded-2xl border border-gray-200" />
          <div>
            <h3 className="text-lg font-bold text-ink">{user.name}</h3>
            <a href={user.html_url} target="_blank" rel="noreferrer" className="text-sm font-mono text-indigo-500 hover:underline">
              @{user.login}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([
            ['Repos', user.public_repos],
            ['Stars', totalStars],
            ['Followers', user.followers],
            ['Following', user.following],
          ] as const).map(([label, val]) => (
            <div key={label} className="rounded-xl border border-gray-100 bg-gray-50/80 p-3 text-center">
              <p className="text-[10px] text-gray-400 font-medium">{label}</p>
              <p className="text-xl font-black text-ink">{val}</p>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {Object.entries(langStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang]) => (
              <span key={lang} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                {lang}
              </span>
            ))}
        </div>
      </div>

      {/* Contribution calendar (desktop only) */}
      {!isMobile && (
        <div
          className="rounded-2xl border border-line p-5 overflow-hidden sm:rounded-3xl sm:p-6"
          style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-indigo-500" />
            <h4 className="text-sm font-bold text-ink">Contributions</h4>
          </div>
          <div className="min-w-[500px] pointer-events-none overflow-x-auto">
            <GitHubCalendar
              username={GITHUB_USERNAME}
              colorScheme="light"
              theme={{ light: ['#eef2ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1'] }}
            />
          </div>
        </div>
      )}

      {/* Top repos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {topRepos.map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}
            className="group rounded-2xl border border-line p-4 transition-all hover:border-indigo-200 hover:shadow-md"
            style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <BookOpen size={15} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <div className="flex items-center gap-1 text-xs text-yellow-600">
                <Star size={12} fill="currentColor" /> {repo.stargazers_count}
              </div>
            </div>
            <h4 className="text-sm font-bold text-ink group-hover:text-indigo-600 transition-colors line-clamp-1">{repo.name}</h4>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">{repo.description || 'No description'}</p>
            {repo.language && (
              <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 bg-gray-100 rounded-md text-gray-600 border border-gray-200">
                {repo.language}
              </span>
            )}
          </motion.a>
        ))}
      </div>

      {/* CTA */}
      <a
        href={user.html_url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
        style={{ background: 'linear-gradient(135deg, #24292e, #4a5568)' }}
      >
        <GithubIcon size={16} /> View Full GitHub
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LinkedIn Column (compact version)
───────────────────────────────────────────── */
function LinkedInColumn() {
  const p = LINKEDIN_PROFILE;

  return (
    <div className="flex flex-col gap-5">
      {/* Profile card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-line sm:rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}
      >
        {/* Banner */}
        <div className="h-16 sm:h-20" style={{ background: `linear-gradient(135deg, ${p.bannerGradient[0]}, ${p.bannerGradient[1]})` }}>
          <div className="h-full w-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        </div>

        <div className="relative px-5 sm:px-6">
          <div className="-mt-8 mb-3 sm:-mt-10">
            <div className="h-16 w-16 overflow-hidden rounded-xl border-[3px] border-white shadow-md sm:h-20 sm:w-20 sm:rounded-2xl">
              <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>

          <h3 className="font-display text-lg font-bold text-ink sm:text-xl">{p.name}</h3>
          <p className="mt-0.5 text-xs leading-snug text-ink-soft sm:text-sm">{p.headline}</p>

          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs text-ink-soft sm:text-sm">
              <Briefcase size={13} className="text-[#0077B5]" />
              <span>{p.currentRole} @ <strong className="text-ink">{p.currentCompany}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-soft sm:text-sm">
              <GraduationCap size={13} className="text-[#0077B5]" />
              <span>{p.education}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-soft sm:text-sm">
              <MapPin size={13} className="text-[#0077B5]" />
              <span>{p.location}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Connections', value: p.connections, icon: Users },
              { label: 'Followers', value: p.followers, icon: TrendingUp },
              { label: 'Posts', value: String(p.posts), icon: MessageSquare },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-line bg-slate-50/70 p-2.5 text-center">
                <Icon size={12} className="mx-auto mb-0.5 text-[#0077B5]" />
                <p className="text-base font-bold text-ink">{value}</p>
                <p className="text-[9px] text-ink-muted">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-4 pb-5">
            <a
              href={p.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0077B5, #00A0DC)' }}
            >
              <LinkedinIcon size={14} /> Connect
            </a>
          </div>
        </div>
      </div>

      {/* Recent posts */}
      <div
        className="rounded-2xl border border-line p-5 backdrop-blur-xl sm:rounded-3xl sm:p-6"
        style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0077B5] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0077B5]" />
            </div>
            <h4 className="text-sm font-bold text-ink">Recent Posts</h4>
          </div>
          <a href={p.profileUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#0077B5] hover:underline flex items-center gap-0.5">
            All <ArrowUpRight size={11} />
          </a>
        </div>

        <div className="space-y-3">
          {p.recentPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-xl border border-line p-3.5 transition-all hover:border-[#0077B5]/30 hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] text-ink-muted">{post.date}</span>
                <div className="flex gap-1">
                  {post.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="flex items-center gap-0.5 text-[9px] font-semibold text-[#0077B5]">
                      <Hash size={8} />{tag}
                    </span>
                  ))}
                </div>
              </div>
              <h5 className="text-sm font-semibold text-ink group-hover:text-[#0077B5] transition-colors">{post.title}</h5>
              <p className="mt-1 text-xs text-ink-soft line-clamp-2">{post.snippet}</p>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-ink-muted">
                <span className="flex items-center gap-1"><ThumbsUp size={10} />{post.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare size={10} />{post.comments}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div
        className="rounded-2xl border border-line p-5 backdrop-blur-xl sm:rounded-3xl sm:p-6"
        style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-[#0077B5]" />
          <h4 className="text-sm font-bold text-ink">Highlights</h4>
        </div>
        <ul className="space-y-2">
          {p.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-ink-soft leading-relaxed sm:text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0077B5]" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Combined 2-Column Social Hub
───────────────────────────────────────────── */
export default function SocialHub() {
  const addXP = usePortfolioStore((s) => s.addXP);
  const unlockAchievement = usePortfolioStore((s) => s.unlockAchievement);
  const [hasGrantedXP, setHasGrantedXP] = useState(false);

  const handleInteraction = useCallback(() => {
    if (!hasGrantedXP) {
      addXP(50);
      unlockAchievement('🏆 GitHub Detective');
      setHasGrantedXP(true);
    }
  }, [hasGrantedXP, addXP, unlockAchievement]);

  return (
    <section
      id="github"
      className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-12 md:py-24 lg:px-24"
      onMouseEnter={handleInteraction}
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)' }} />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(0,119,181,0.1), transparent 70%)' }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Online Presence"
          title={
            <>
              GitHub & <span className="text-gradient">LinkedIn</span>
            </>
          }
          description="Live data from my open-source work and professional network — two sides of the same builder."
        />

        {/* 2-column grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 lg:grid-cols-2 lg:gap-8">
          {/* GitHub column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col"
          >
            <div className="mb-4 flex items-center gap-2">
              <GithubIcon size={20} className="text-ink" />
              <h3 className="font-display text-xl font-bold text-ink">GitHub</h3>
              <span className="ml-auto rounded-full border border-line bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                Open Source
              </span>
            </div>
            <div className="flex-1">
              <GitHubColumn />
            </div>
          </motion.div>

          {/* LinkedIn column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col"
          >
            <div className="mb-4 flex items-center gap-2">
              <LinkedinIcon size={20} className="text-[#0077B5]" />
              <h3 className="font-display text-xl font-bold text-ink">LinkedIn</h3>
              <span className="ml-auto rounded-full border border-line bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                Professional
              </span>
            </div>
            <div className="flex-1">
              <LinkedInColumn />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
