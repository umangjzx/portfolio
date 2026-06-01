import type { Command } from '../types';

export const COMMANDS: Command[] = [
  {
    id: 'view-projects',
    label: 'View Projects',
    action: () => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    },
    keywords: ['projects', 'work', 'portfolio', 'showcase'],
    icon: '🚀',
  },
  {
    id: 'download-resume',
    label: 'Download Resume',
    action: () => {
      window.open('/resume.pdf', '_blank');
    },
    keywords: ['resume', 'cv', 'download', 'pdf'],
    icon: '📄',
  },
  {
    id: 'contact',
    label: 'Contact',
    action: () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    },
    keywords: ['contact', 'email', 'message', 'reach'],
    icon: '✉️',
  },
  {
    id: 'github',
    label: 'GitHub – umangjzx',
    action: () => {
      window.open('https://github.com/umangjzx', '_blank');
    },
    keywords: ['github', 'code', 'repository', 'source'],
    icon: '💻',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn – Umang Jaiswal N',
    action: () => {
      window.open('https://www.linkedin.com/in/umang-jaiswal-n', '_blank');
    },
    keywords: ['linkedin', 'professional', 'network', 'connect'],
    icon: '🔗',
  },
  {
    id: 'about',
    label: 'About Me',
    action: () => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    },
    keywords: ['about', 'bio', 'info', 'who'],
    icon: '👤',
  },
  {
    id: 'skills',
    label: 'Skills & Technologies',
    action: () => {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    },
    keywords: ['skills', 'tech', 'technologies', 'stack'],
    icon: '⚡',
  },
  {
    id: 'experience',
    label: 'Experience & Timeline',
    action: () => {
      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
    },
    keywords: ['experience', 'timeline', 'journey', 'career'],
    icon: '📅',
  },
];
