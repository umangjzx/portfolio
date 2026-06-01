import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';
import { Star, BookOpen, Activity } from 'lucide-react';
import { fetchGitHubUser, fetchGitHubRepos, calculateLanguageStats, type GitHubUser, type GitHubRepo } from '../../services/githubAPI';
import { GithubIcon } from '../ui/BrandIcons';
import { usePortfolioStore } from '../../store/portfolioStore';

const GITHUB_USERNAME = 'umangjzx';

export function GitHubCenter() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const addXP = usePortfolioStore(s => s.addXP);
  const unlockAchievement = usePortfolioStore(s => s.unlockAchievement);
  const [hasGrantedXP, setHasGrantedXP] = useState(false);

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

  const handleHover = () => {
    if (!hasGrantedXP) {
      addXP(50);
      unlockAchievement('🏆 GitHub Detective');
      setHasGrantedXP(true);
    }
  };

  if (loading) {
    return (
      <section className="py-32 bg-transparent flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
          <p className="text-gray-400 font-mono text-sm">Connecting to GitHub API...</p>
        </div>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section id="github" className="py-32 px-6 md:px-12 lg:px-24 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-xs font-semibold text-gray-500 tracking-widest uppercase mb-6">
              <GithubIcon size={12} /> Open Source
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
              GitHub Command Center
            </h2>
          </div>
          <div className="rounded-3xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(0,0,0,0.07)' }}>
            <GithubIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Unable to load GitHub data</p>
            <p className="text-gray-400 text-sm mb-6">The GitHub API may be rate-limited or the username needs updating.</p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #333, #555)' }}
            >
              <GithubIcon size={16} /> Visit GitHub Profile
            </a>
          </div>
        </div>
      </section>
    );
  }

  const topRepos = repos.slice(0, 6);
  const langStats = calculateLanguageStats(repos);
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);

  return (
    <section
      id="github"
      className="py-32 px-6 md:px-12 lg:px-24 bg-transparent relative overflow-hidden"
      onMouseEnter={handleHover}
    >
      {/* Soft background accent */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(66,133,244,0.08) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-xs font-semibold text-gray-500 tracking-widest uppercase mb-6">
            <GithubIcon size={12} /> Open Source
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
            GitHub Command Center
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl font-light">
            Live telemetry from my open-source ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-1 rounded-3xl p-8 flex flex-col relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
            }}
          >
            {user && (
              <>
                <div className="flex items-center gap-5 mb-8">
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl border border-gray-200 shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-mono text-blue-500 hover:text-blue-700 hover:underline"
                    >
                      @{user.login}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    ['Repositories', user.public_repos],
                    ['Stars', totalStars],
                    ['Followers', user.followers],
                    ['Following', user.following],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="rounded-2xl p-4 border border-gray-100 bg-gray-50/80 hover:bg-white hover:shadow-sm transition-all cursor-default"
                    >
                      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
                      <p className="text-2xl font-black text-gray-900">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">
                    Top Languages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(langStats)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([lang]) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-default"
                        >
                          {lang}
                        </span>
                      ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Contribution Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-8 overflow-x-auto"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Activity size={18} className="text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900">Contribution Activity</h3>
              </div>
              <div className="min-w-[700px] pointer-events-none">
                <GitHubCalendar
                  username={GITHUB_USERNAME}
                  colorScheme="light"
                  theme={{
                    light: ['#eef2ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1'],
                  }}
                />
              </div>
            </motion.div>

            {/* Repo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topRepos.map((repo, i) => (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-2xl p-6 flex flex-col group transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.88)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  }}
                  whileHover={{ boxShadow: '0 12px 40px rgba(66,133,244,0.12)', y: -2, border: '1px solid rgba(66,133,244,0.2)' } as any}
                >
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Star size={14} fill="currentColor" /> {repo.stargazers_count}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {repo.name}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
                    {repo.description || 'No description available.'}
                  </p>
                  {repo.language && (
                    <span className="text-xs font-mono px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600 self-start border border-gray-200">
                      {repo.language}
                    </span>
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GitHubCenter;
