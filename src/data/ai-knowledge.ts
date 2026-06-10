import type { AITopic } from '../types';

export interface AIKnowledgeEntry {
  topic: AITopic;
  keywords: string[];
  responses: string[];
}

export const AI_KNOWLEDGE: AIKnowledgeEntry[] = [
  {
    topic: 'skills',
    keywords: ['skills', 'technologies', 'tech stack', 'programming', 'languages', 'tools', 'expertise', 'proficient'],
    responses: [
      'Umang is proficient in Python, R, SQL, JavaScript, React.js, Flask, TensorFlow, Scikit-learn, XGBoost, Power BI, PostgreSQL, Docker, and Google Cloud. His strongest areas are Python (92%), Machine Learning (90%), and Scikit-learn (88%).',
      'His tech stack spans data science, ML/AI, and full-stack development. He works with Python for ML pipelines, React for frontend, Flask/FastAPI for APIs, and leverages GCP and Docker for deployment. He also excels in NLP with NLTK and spaCy.',
      'Umang specializes in Machine Learning & AI (TensorFlow, Keras, XGBoost, LightGBM, LSTM, SHAP), NLP (NLTK, spaCy, TF-IDF, Word2Vec), Data Visualization (Power BI, Matplotlib, Seaborn, Plotly), and full-stack web development with React and Flask.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['projects', 'work', 'built', 'created', 'developed', 'portfolio', 'applications', 'apps', 'all projects'],
    responses: [
      'Umang has built 11+ major projects: MedRelay (AI clinical handoff), CivicPulse (smart complaint management), Equity Valuation Engine (stock forecasting), Solar Irradiance Predictor, COGNISYNC (music therapy for neurorehab), PEWS (procrastination detection), DSA Visualizer, Disease Prediction System, Telecom Churn Dashboard, Loan Risk Analysis, and HR Analytics Dashboard. Ask me about any specific one!',
      'His projects span healthcare AI, fintech, civic tech, neurorehabilitation, energy, edtech, and business intelligence. Each demonstrates real-world problem solving with ML and full-stack development. Want details on a specific project?',
      'Notable highlights: MedRelay uses a 14-agent LangGraph pipeline, CivicPulse achieves 75-85% ML classification, the Equity Valuation Engine blends 4 models over 500+ trading days, and the Telecom Churn dashboard quantified $139K revenue at risk. Ask about any project for more details!',
    ],
  },
  {
    topic: 'projects',
    keywords: ['medrelay', 'clinical', 'handoff', 'sbar', 'nurse', 'healthcare ai', 'medical'],
    responses: [
      'MedRelay is an AI-powered clinical handoff system that converts spoken nurse-to-nurse handoffs into structured SBAR reports. It uses a 14-agent LangGraph + HuggingFace pipeline with FastAPI backend, JWT auth, WebSocket streaming, and a React + SQLite real-time dashboard. It cuts handoff documentation time and produces consistent, auditable records for every shift change.',
      'MedRelay solves the problem of verbal, inconsistent clinical handoffs — a leading source of medical error. The system transcribes voice, extracts clinical entities, scores patient risk, and emits a standardized SBAR report. Built with Python, FastAPI, React, LangGraph, HuggingFace, SQLite, and WebSocket. The key insight: orchestrating many small agents beats one monolithic prompt for reliability.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['civicpulse', 'civic', 'complaint', 'municipal', 'community', 'government'],
    responses: [
      'CivicPulse is a smart community complaint management platform with role-based access, real-time tracking, ML classification (75-85% accuracy), and an admin analytics suite. Built with Python, PostgreSQL, Machine Learning, and Bootstrap. It auto-classifies and priority-tags incoming complaints, routing urgent issues to the right desk faster.',
      'CivicPulse solves the problem of slow, opaque municipal complaint handling. Citizens can track status in real time, and administrators get data to prioritize what matters. The ML classifier handles category + priority tagging. Key lesson: a simple priority model delivers most of the operational value, and status transparency is what citizens actually want.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['stock', 'equity', 'valuation', 'forecast', 'trading', 'fintech', 'market'],
    responses: [
      'The Equity Valuation Engine is a non-linear stock forecasting system blending XGBoost, Random Forest, SVR, and LSTM models over 500+ trading days. It engineers 15+ technical indicators (RSI, MACD, Bollinger Bands) and uses weighted ensemble blending for robust predictions. Built with Python, XGBoost, LSTM, yFinance, and Scikit-learn.',
      'This FinTech project tackles the problem that linear models miss regime-shifting equity behavior. The solution: 15+ engineered features fed into 4 different model architectures with blending. Key insight: feature engineering moved the needle more than model choice, and ensembles trade a little interpretability for a lot of stability.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['solar', 'irradiance', 'energy', 'renewable', 'prediction', 'weather'],
    responses: [
      'The Solar Irradiance Predictor is an end-to-end Streamlit app predicting solar irradiance (W/m²) using LightGBM, XGBoost, CatBoost, and Random Forest. It features automated cleaning, time-series-aware train/test splitting, and a dashboard with confidence scoring. Built for grid operators who need accurate forecasts to balance renewable supply.',
      'This energy ML project delivers real-time irradiance predictions with confidence intervals. The pipeline cleans noisy sensor data, engineers time-series features, and compares 4 models. Key lesson: time-aware splits are non-negotiable for honest time-series metrics. Tech: Python, Streamlit, LightGBM, XGBoost, CatBoost.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['cognisync', 'music', 'therapy', 'neuro', 'rehabilitation', 'stroke', 'parkinson'],
    responses: [
      'COGNISYNC is a GenAI-driven neurorehabilitation platform for stroke & Parkinson\'s patients using a custom adaptive beat-generation engine. It generates personalized rhythmic patterns, tracks progress over time, and gives clinicians real-time monitoring. Built with Python, Flask, SQLite, and GenAI. It turns rhythmic therapy into a measurable, personalized program.',
      'COGNISYNC solves the problem that rhythmic auditory stimulation therapy is generic and hard to measure. The platform adapts beats to each patient, tracks per-session progress, and provides secure data storage. Key insight: personalization plus measurement is what makes a therapy tool credible.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['pews', 'procrastination', 'distraction', 'focus', 'productivity', 'chrome', 'extension'],
    responses: [
      'PEWS (Procrastination Early-Warning System) is a real-time system that predicts user distraction from browsing behavior using a lightweight PyTorch LSTM. A Chrome extension captures tab switches, scroll, mouse movement, and idle time. A local FastAPI server runs inference on-device for privacy. It nudges users before they lose focus.',
      'PEWS detects distraction in real time while keeping all behavioral data local. It captures 4 signal streams (tabs, scroll, mouse, idle) and feeds them to an LSTM sequence model. Key insight: on-device inference earns trust for anything that watches behavior. Tech: Python, PyTorch, FastAPI, Chrome Extension, SQLite.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['dsa', 'visualizer', 'algorithm', 'data structure', 'sorting', 'graph', 'bfs', 'dfs'],
    responses: [
      'The DSA Visualizer is an interactive Streamlit app that visualizes arrays, trees, sorting algorithms, and graph algorithms (BFS, DFS, Dijkstra) in real time. Built with Python, Streamlit, NetworkX, and Plotly. It animates each step of classic algorithms, making them tangible through live animation.',
      'This EdTech project solves the problem that algorithms are hard to internalize from static textbook diagrams. It supports 8+ data structures and graph algorithms with step-by-step Plotly animations. Key lesson: animation is the fastest path to algorithmic intuition.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['disease', 'prediction', 'symptom', 'diagnosis', 'health'],
    responses: [
      'The Disease Prediction System is an AI tool that predicts probable diseases from reported symptoms. It uses a pre-trained Scikit-learn model served through a Flask API with a responsive Tailwind CSS frontend. It provides fast, scalable symptom-to-disease predictions with a clean UX.',
      'This HealthTech project helps people make sense of symptoms before seeing a doctor. A scikit-learn .pkl model serves instant predictions through Flask. Key lesson: loading a pre-trained model keeps inference instant and cheap. Tech: Python, Flask, Scikit-learn, Tailwind CSS, JavaScript.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['telecom', 'churn', 'power bi', 'dashboard', 'customer', 'revenue'],
    responses: [
      'The Telecom Churn Analysis is an interactive Power BI dashboard that identified a 27% churn rate and $139K+ revenue at risk across 7,043 customers. It uses DAX measures, segment analysis by tenure/contract/payment method, and dynamic KPI cards with slicers to pinpoint high-risk segments.',
      'This analytics project solved the problem of knowing customers were leaving but not who, why, or how much it cost. The dashboard quantified $139K revenue loss and surfaced actionable segments. Key lesson: a single quantified number ($139K) changes the conversation with stakeholders. Tech: Power BI, DAX.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['loan', 'risk', 'default', 'lending', 'credit', 'smote'],
    responses: [
      'The Loan Risk Analysis is an end-to-end ML pipeline predicting loan default risk using Logistic Regression, Random Forest, and XGBoost. It handles class imbalance with SMOTE, uses RandomizedSearchCV for tuning, and outputs a Low/Medium/High risk-scoring framework with ROC curves and feature importance diagnostics.',
      'This FinTech project produces interpretable risk tiers for loan applicants. It tackles heavily imbalanced approval data with SMOTE and provides diagnostic transparency. Key lesson: handling class imbalance correctly mattered more than squeezing model accuracy. Tech: Python, XGBoost, Scikit-learn, SMOTE.',
    ],
  },
  {
    topic: 'projects',
    keywords: ['hr', 'analytics', 'candidate', 'job change', 'recruiter', 'hiring'],
    responses: [
      'The HR Analytics Dashboard is an interactive Power BI dashboard analyzing and predicting candidate job-change behavior. It features DAX-driven KPIs (Total Candidates, Job Switchers, Switch %, Average Training Hours), multi-page synchronized dashboards, and cross-filtering slicers.',
      'This analytics project gives recruiters a live, filterable view of job-change likelihood across the candidate pool. Key lesson: synchronized slicers turn a static report into an exploratory tool. Tech: Power BI, DAX, HR Analytics.',
    ],
  },
  {
    topic: 'contact',
    keywords: ['contact', 'reach', 'email', 'connect', 'hire', 'message', 'talk', 'available'],
    responses: [
      'You can reach Umang at umang2468jaiswal@gmail.com or call at 8098468572. You can also use the Contact Portal on this site to send a message directly.',
      'Connect with Umang on LinkedIn (Umang Jaiswal N) or GitHub (umangjzx). He is based in Coimbatore and open to collaboration and opportunities.',
      'Umang is open to collaboration, internships, and opportunities. Use the contact form below, email him at umang2468jaiswal@gmail.com, or connect via LinkedIn and GitHub. He typically responds within 24 hours.',
    ],
  },
  {
    topic: 'experience',
    keywords: ['experience', 'background', 'career', 'education', 'intern', 'hackathon', 'leadership', 'journey', 'publication', 'award'],
    responses: [
      'Umang is pursuing an Integrated M.Sc. in Decision and Computing Sciences at CIT (CGPA: 8.01). He completed a Data Analytics internship at Codtech IT Solutions (May–Jun 2025) and has won multiple hackathon awards including the Data Science Hackathon at IIT Madras.',
      'His journey includes winning the Data Science Hackathon at Techgyan-IIT Madras (Apr 2025), being a finalist at Hackdemia Bangalore, and Second Runner-Up at both Hack24 and Astronova 2K26. He has 2 publications including a Scopus-indexed paper.',
      'Umang serves as Rotary Foundation Chair at Rotaract Club of Coimbatore SmartCity and was a Campus Ambassador for Corizo Edutech. His areas of interest include AI, MLOps, FinTech, Data Storytelling, Open Source, and RAG Systems.',
    ],
  },
  {
    topic: 'experience',
    keywords: ['about', 'who', 'umang', 'tell me', 'introduce', 'yourself', 'bio'],
    responses: [
      'Umang Jaiswal is an AI/ML engineer and full-stack builder based in Coimbatore, India. He turns messy data into intelligent products — from clinical AI and fintech models to civic platforms. He has shipped 11+ products, won 4 hackathon podiums, and published 2 papers. Currently pursuing an Integrated M.Sc. in Decision and Computing Sciences at CIT with a CGPA of 8.01.',
      'I\'m Umang\'s AI assistant! He\'s an AI & ML Engineer, Data Scientist, and Full-Stack Builder who works the full stack of intelligence: data engineering, modelling, and the interface people actually touch. He\'s comfortable orchestrating LLM agents, blending ensembles for forecasting, and shipping the React dashboard on top.',
    ],
  },
];
