import type { Testimonial } from '../types';

/**
 * Testimonials are written as case-study style feedback tied to real project
 * context rather than generic praise. Avatars fall back to initials + accent
 * when no photo is supplied.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'medrelay-clinician',
    quote:
      'On MedRelay, Umang took a vague "make handoffs better" brief and shipped a 14-agent pipeline that actually produced clean SBAR reports. He thinks like a clinician and builds like an engineer.',
    author: 'Dr. Priya Sharma',
    role: 'Clinical Advisor',
    company: 'MedRelay',
    context: 'MedRelay · AI clinical handoff platform',
    accent: '#6366F1',
  },
  {
    id: 'civicpulse-cofounder',
    quote:
      'CivicPulse routed urgent complaints to the right desk with 75–85% accuracy. Umang scoped the ML, the database and the admin analytics himself — and made the priority model genuinely useful, not just a demo.',
    author: 'Rahul Mehta',
    role: 'Co-founder',
    company: 'CivicPulse',
    context: 'CivicPulse · complaint analytics platform',
    accent: '#8B5CF6',
  },
  {
    id: 'analytics-lead',
    quote:
      'His telecom churn dashboard put a hard number on the problem — a 27% churn rate and $139K+ at risk. That single quantified insight changed how the team prioritized retention.',
    author: 'Ananya Gupta',
    role: 'Analytics Lead',
    company: 'Codtech IT Solutions',
    context: 'Power BI churn analysis · 7,043 customers',
    accent: '#06B6D4',
  },
  {
    id: 'hackathon-mentor',
    quote:
      'I have judged Umang twice. He turns a blank repo into a defensible, end-to-end ML solution inside 48 hours — and can explain every modelling decision. That is rare at this stage.',
    author: 'Vikram Singh',
    role: 'Hackathon Mentor & Judge',
    company: 'Techgyan · IIT Madras',
    context: 'Data Science Hackathon · 1st place',
    accent: '#EC4899',
  },
  {
    id: 'research-collab',
    quote:
      'We co-authored work on hybrid AI for real-time threat analysis. Umang is meticulous about methodology and writes research that holds up to peer review.',
    author: 'Sneha Patel',
    role: 'Research Collaborator',
    company: 'IJRMSET',
    context: 'Phishing detection · hybrid AI paper',
    accent: '#10B981',
  },
];
