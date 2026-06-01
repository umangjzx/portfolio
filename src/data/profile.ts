/** Single source of truth for personal / contact info and narrative copy. */

export const PROFILE = {
  name: 'Umang Jaiswal',
  firstName: 'Umang',
  lastName: 'Jaiswal',
  roles: ['AI Engineer', 'Data Scientist', 'Full-Stack Builder'],
  tagline: 'I turn messy data into intelligent products.',
  oneLiner:
    'AI/ML engineer and builder shipping clinical AI, fintech models, and civic platforms — from the model to the interface.',
  location: 'Coimbatore, India',
  availability: 'Available for new opportunities',
  email: 'umang2468jaiswal@gmail.com',
  phone: '+918098468572',
  github: 'https://github.com/umangjzx',
  githubUser: 'umangjzx',
  linkedin: 'https://www.linkedin.com/in/umang-jaiswal-n',
  calendly: 'https://calendly.com/umang2468jaiswal',
  resumeUrl: 'https://drive.google.com/uc?export=download&id=1UWWzbf0Jszy7K_RiiadRthrOlgEvh7vR',
  photoUrl: '/profile.jpg',
} as const;

/** Narrative blocks for the About section storytelling. */
export const STORY = {
  journey: {
    title: 'The Journey',
    body: 'I started in statistics and computing, then kept following the same thread: take something messy and real — clinical handoffs, market data, civic complaints — and turn it into a product that makes a decision easier. Eleven projects, four hackathon podiums, and two papers later, that thread has only gotten stronger.',
  },
  strengths: {
    title: 'Strengths',
    body: 'I work the full stack of intelligence: data engineering, modelling, and the interface people actually touch. I am comfortable orchestrating LLM agents, blending ensembles for forecasting, and shipping the React dashboard on top.',
  },
  philosophy: {
    title: 'Philosophy',
    body: 'A model is only as good as the decision it changes. I optimize for the metric that matters to a human — a faster handoff, a quantified $139K of churn, a routed complaint — not for leaderboard accuracy.',
  },
  impact: {
    title: 'Impact',
    body: 'Real-time SBAR reports for clinicians, 75–85% complaint classification for a city, a $139K revenue-at-risk insight for a business. I build things that ship and get used.',
  },
} as const;
