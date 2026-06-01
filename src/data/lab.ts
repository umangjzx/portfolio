import type { LabExperiment } from '../types';

/**
 * The Innovation Lab — current experiments, research, and prototypes.
 * Status drives the live indicator color; progress drives the tracker bar.
 */
export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'medrelay-agents',
    title: 'MedRelay Multi-Agent Pipeline',
    category: 'Applied LLM',
    status: 'live',
    description:
      '14-agent LangGraph system converting voice clinical handoffs into structured SBAR reports with risk scoring.',
    progress: 88,
    tags: ['LangGraph', 'HuggingFace', 'FastAPI'],
    metric: { label: 'Agents', value: '14' },
    link: 'https://github.com/umangjzx',
  },
  {
    id: 'phishing-hybrid',
    title: 'Hybrid AI Threat Detection',
    category: 'Research',
    status: 'research',
    description:
      'Peer-reviewed hybrid approach for real-time phishing and threat analysis, published in IJRMSET 2025.',
    progress: 100,
    tags: ['Cybersecurity', 'Hybrid AI', 'NLP'],
    metric: { label: 'Status', value: 'Published' },
  },
  {
    id: 'managerial-mindset',
    title: 'AI & the Managerial Mindset',
    category: 'Research',
    status: 'shipped',
    description:
      'Scopus-indexed paper exploring how AI augments managerial decision-making and product thinking.',
    progress: 100,
    tags: ['AI Strategy', 'Scopus'],
    metric: { label: 'Index', value: 'Scopus' },
  },
  {
    id: 'equity-ensemble',
    title: 'Equity Valuation Ensemble',
    category: 'FinTech ML',
    status: 'in-progress',
    description:
      'Blending XGBoost, RF, SVR and LSTM over 500+ trading days with 15+ engineered indicators for robust forecasts.',
    progress: 72,
    tags: ['XGBoost', 'LSTM', 'Ensemble'],
    metric: { label: 'Features', value: '15+' },
  },
  {
    id: 'solar-forecast',
    title: 'Solar Irradiance Forecasting',
    category: 'ML / Energy',
    status: 'in-progress',
    description:
      'Time-series-aware ML app predicting solar irradiance (W/m²) with confidence scoring across 4 gradient-boosting models.',
    progress: 80,
    tags: ['LightGBM', 'CatBoost', 'Streamlit'],
    metric: { label: 'Models', value: '4' },
  },
  {
    id: 'pews-lstm',
    title: 'On-Device Focus Model (PEWS)',
    category: 'Applied ML',
    status: 'in-progress',
    description:
      'Lightweight PyTorch LSTM predicting distraction in real time from browsing signals — fully on-device for privacy.',
    progress: 65,
    tags: ['PyTorch', 'LSTM', 'Edge'],
    metric: { label: 'Inference', value: 'Local' },
  },
];
