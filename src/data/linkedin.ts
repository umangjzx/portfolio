/**
 * LinkedIn profile data — manually maintained single source of truth.
 *
 * LinkedIn doesn't offer a free public API for profile data.
 * Update these values periodically to keep the section fresh.
 * Last updated: June 2026
 */

export interface LinkedInPost {
  id: string;
  title: string;
  snippet: string;
  date: string;
  likes: number;
  comments: number;
  url: string;
  tags?: string[];
}

export interface LinkedInProfile {
  name: string;
  headline: string;
  profileUrl: string;
  photoUrl: string;
  bannerGradient: [string, string];
  connections: string;
  followers: string;
  posts: number;
  currentRole: string;
  currentCompany: string;
  education: string;
  location: string;
  skills: string[];
  highlights: string[];
  recentPosts: LinkedInPost[];
}

export const LINKEDIN_PROFILE: LinkedInProfile = {
  name: 'Umang Jaiswal',
  headline: 'Full Stack AI Engineer Intern @ ProfitStory.ai | AI/ML · Data Science · Full-Stack Builder',
  profileUrl: 'https://www.linkedin.com/in/umang-jaiswal-n',
  photoUrl: '/profile.jpg',
  bannerGradient: ['#0077B5', '#00A0DC'],
  connections: '500+',
  followers: '500+',
  posts: 15,
  currentRole: 'Full Stack AI Engineer Intern',
  currentCompany: 'ProfitStory.ai',
  education: 'Coimbatore Institute of Technology',
  location: 'Coimbatore, India',
  skills: [
    'Machine Learning',
    'Python',
    'React',
    'TypeScript',
    'LLM/AI Agents',
    'Data Science',
    'FastAPI',
    'Full-Stack Development',
  ],
  highlights: [
    '🏆 Winner — Data Science Hackathon (IIT Madras)',
    '📝 2 Published Research Papers (Scopus + IJRMSET)',
    '🚀 Built MedRelay — 14-agent AI clinical platform',
    '💼 Currently shipping AI features at ProfitStory.ai',
  ],
  recentPosts: [
    {
      id: 'post-1',
      title: 'Shipping AI at ProfitStory.ai',
      snippet: 'Excited to share that I\'ve joined ProfitStory.ai as a Full Stack AI Engineer Intern! Building end-to-end AI-powered features...',
      date: 'Jun 2026',
      likes: 42,
      comments: 8,
      url: 'https://www.linkedin.com/in/umang-jaiswal-n',
      tags: ['AI', 'Internship', 'FullStack'],
    },
    {
      id: 'post-2',
      title: 'MedRelay — AI Clinical Handoff System',
      snippet: 'Just open-sourced MedRelay 🏥 — a 14-agent LangGraph pipeline that turns voice handoffs into auditable SBAR reports in real time...',
      date: 'Mar 2026',
      likes: 67,
      comments: 12,
      url: 'https://www.linkedin.com/in/umang-jaiswal-n',
      tags: ['AI', 'Healthcare', 'OpenSource'],
    },
    {
      id: 'post-3',
      title: 'Scopus-Indexed Publication on AI & Management',
      snippet: 'Thrilled to share my Scopus-indexed paper on AI & the Managerial Mindset is now published! Research meets practice...',
      date: 'Jan 2026',
      likes: 53,
      comments: 7,
      url: 'https://www.linkedin.com/in/umang-jaiswal-n',
      tags: ['Research', 'Scopus', 'AI'],
    },
  ],
};
