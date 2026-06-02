/**
 * Core type definitions for the Futuristic Portfolio application.
 * All interfaces are derived from the design document.
 */

// ============================================================
// Data Models
// ============================================================

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  /** Short one-line tagline shown on the card. */
  tagline?: string;
  description: string;
  techStack: string[];
  thumbnailUrl: string;
  videoUrl?: string;
  githubUrl: string;
  liveUrl?: string;
  screenshots: string[];

  /** Case-study fields (optional so existing data stays valid). */
  category?: string;
  year?: string;
  featured?: boolean;
  problem?: string;
  solution?: string;
  architecture?: string[];
  impact?: string;
  metrics?: ProjectMetric[];
  lessons?: string[];
  /** Tailwind-ready gradient stops for the card accent. */
  accent?: [string, string];
}

export type SkillClusterId =
  | 'ai-ml'
  | 'data-science'
  | 'cloud-devops'
  | 'backend'
  | 'frontend'
  | 'analytics';

export interface SkillPlanet {
  id: string;
  name: string;
  proficiency: number; // 0-100
  orbitRadius: number;
  orbitSpeed: number; // 8-20 seconds per revolution
  color: string;

  /** Ecosystem fields (optional for backwards compatibility). */
  cluster?: SkillClusterId;
  tools?: string[];
  /** Project ids that use this skill. */
  projects?: string[];
  years?: number;
}

export interface SkillCluster {
  id: SkillClusterId;
  label: string;
  color: string;
  description: string;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  order: number;

  /** Rich career fields (optional for backwards compatibility). */
  company?: string;
  role?: string;
  type?: 'work' | 'education' | 'award' | 'research' | 'project' | 'leadership';
  impact?: string;
  skills?: string[];
  achievements?: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  context?: string;
  avatarUrl?: string;
  accent?: string;
}

export type LabStatus = 'live' | 'in-progress' | 'research' | 'shipped' | 'archived';

export interface LabExperiment {
  id: string;
  title: string;
  category: string;
  status: LabStatus;
  description: string;
  progress: number; // 0-100
  tags: string[];
  metric?: { label: string; value: string };
  link?: string;
}

export interface BuilderStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Command {
  id: string;
  label: string;
  action: () => void;
  keywords: string[];
  icon?: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0-1, decreasing
  maxLife: number;
}

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export type GPUTier = 'high' | 'mid' | 'low';

// ============================================================
// Contact Form
// ============================================================

export interface ContactFormData {
  name: string; // max 100 chars
  email: string; // max 254 chars
  message: string; // max 1000 chars
}

export interface ContactFormState {
  data: ContactFormData;
  errors: Record<keyof ContactFormData, string | null>;
  isSubmitting: boolean;
  submitResult: 'idle' | 'success' | 'error';
}

// ============================================================
// AI Assistant
// ============================================================

export type AITopic = 'skills' | 'projects' | 'contact' | 'experience';

export interface AIResponse {
  content: string;
  topic: AITopic | 'fallback';
}

// ============================================================
// Validation
// ============================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string | null>;
}

// ============================================================
// Statistics
// ============================================================

export interface StatConfig {
  id: string;
  label: string;
  targetValue: number;
  suffix?: string;
}
