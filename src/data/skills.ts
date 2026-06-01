import type { SkillPlanet, SkillCluster } from '../types';

/**
 * Skill clusters form the meaningful structure of the ecosystem.
 * Each cluster has a brand color and a one-line definition.
 */
export const SKILL_CLUSTERS: SkillCluster[] = [
  { id: 'ai-ml', label: 'AI & Machine Learning', color: '#6366F1', description: 'Models that learn, predict, and reason.' },
  { id: 'data-science', label: 'Data Science', color: '#8B5CF6', description: 'Turning raw data into signal.' },
  { id: 'backend', label: 'Backend & APIs', color: '#06B6D4', description: 'Reliable services that move data.' },
  { id: 'frontend', label: 'Frontend', color: '#EC4899', description: 'Interfaces people actually enjoy.' },
  { id: 'cloud-devops', label: 'Cloud & DevOps', color: '#10B981', description: 'Ship it, scale it, keep it up.' },
  { id: 'analytics', label: 'Analytics & BI', color: '#F59E0B', description: 'Decisions backed by evidence.' },
];

export const SKILLS: SkillPlanet[] = [
  // ── AI & ML ──
  { id: 'ml', name: 'Machine Learning', proficiency: 90, orbitRadius: 17, orbitSpeed: 8, color: '#6366F1', cluster: 'ai-ml', years: 3, tools: ['Scikit-learn', 'XGBoost', 'PyTorch'], projects: ['stock-prediction', 'loan-risk', 'civicpulse', 'solar-irradiance'] },
  { id: 'tensorflow', name: 'TensorFlow / Keras', proficiency: 85, orbitRadius: 8, orbitSpeed: 10, color: '#FF6F00', cluster: 'ai-ml', years: 2, tools: ['Keras', 'TF Serving'], projects: ['pews'] },
  { id: 'xgboost', name: 'XGBoost', proficiency: 86, orbitRadius: 10, orbitSpeed: 11, color: '#1E88E5', cluster: 'ai-ml', years: 2, tools: ['LightGBM', 'CatBoost'], projects: ['stock-prediction', 'loan-risk', 'solar-irradiance'] },
  { id: 'nlp', name: 'NLP & LLMs', proficiency: 82, orbitRadius: 16, orbitSpeed: 12, color: '#8B5CF6', cluster: 'ai-ml', years: 2, tools: ['LangGraph', 'HuggingFace', 'spaCy', 'NLTK'], projects: ['medrelay'] },
  { id: 'scikit-learn', name: 'Scikit-learn', proficiency: 88, orbitRadius: 9, orbitSpeed: 13, color: '#F89939', cluster: 'ai-ml', years: 3, tools: ['Pandas', 'NumPy'], projects: ['disease-prediction', 'loan-risk'] },

  // ── Data Science ──
  { id: 'python', name: 'Python', proficiency: 92, orbitRadius: 3, orbitSpeed: 12, color: '#3776AB', cluster: 'data-science', years: 4, tools: ['Pandas', 'NumPy', 'Matplotlib'], projects: ['medrelay', 'civicpulse', 'stock-prediction', 'cognisync', 'pews', 'dsa-visualizer'] },
  { id: 'r', name: 'R', proficiency: 75, orbitRadius: 4, orbitSpeed: 18, color: '#276DC3', cluster: 'data-science', years: 2, tools: ['tidyverse', 'ggplot2'], projects: [] },
  { id: 'sql', name: 'SQL', proficiency: 85, orbitRadius: 5, orbitSpeed: 14, color: '#336791', cluster: 'data-science', years: 3, tools: ['PostgreSQL', 'SQLite'], projects: ['civicpulse', 'telecom-churn'] },

  // ── Backend ──
  { id: 'flask', name: 'Flask / FastAPI', proficiency: 84, orbitRadius: 11, orbitSpeed: 17, color: '#0EA5E9', cluster: 'backend', years: 3, tools: ['FastAPI', 'WebSocket', 'JWT'], projects: ['medrelay', 'cognisync', 'pews', 'disease-prediction'] },
  { id: 'postgresql', name: 'PostgreSQL', proficiency: 78, orbitRadius: 13, orbitSpeed: 20, color: '#336791', cluster: 'backend', years: 2, tools: ['SQLite', 'SQLAlchemy'], projects: ['civicpulse'] },

  // ── Frontend ──
  { id: 'react', name: 'React.js', proficiency: 80, orbitRadius: 6, orbitSpeed: 15, color: '#61DAFB', cluster: 'frontend', years: 2, tools: ['TypeScript', 'Vite', 'Tailwind'], projects: ['medrelay'] },
  { id: 'javascript', name: 'JavaScript / TS', proficiency: 82, orbitRadius: 7, orbitSpeed: 16, color: '#F7DF1E', cluster: 'frontend', years: 3, tools: ['TypeScript', 'Node'], projects: ['disease-prediction', 'pews'] },

  // ── Cloud & DevOps ──
  { id: 'docker', name: 'Docker', proficiency: 72, orbitRadius: 14, orbitSpeed: 15, color: '#2496ED', cluster: 'cloud-devops', years: 2, tools: ['Compose'], projects: [] },
  { id: 'gcp', name: 'Google Cloud', proficiency: 72, orbitRadius: 15, orbitSpeed: 14, color: '#4285F4', cluster: 'cloud-devops', years: 1, tools: ['Cloud Run', 'BigQuery'], projects: [] },

  // ── Analytics & BI ──
  { id: 'powerbi', name: 'Power BI', proficiency: 80, orbitRadius: 12, orbitSpeed: 19, color: '#F2C811', cluster: 'analytics', years: 2, tools: ['DAX', 'Power Query'], projects: ['telecom-churn', 'hr-analytics'] },
];
