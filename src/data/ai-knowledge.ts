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
    keywords: ['projects', 'work', 'built', 'created', 'developed', 'portfolio', 'applications', 'apps'],
    responses: [
      'Umang has built 11+ major projects including MedRelay (AI clinical handoff platform), CivicPulse (smart complaint management), Non-Linear Equity Valuation, Solar Irradiance Prediction, COGNISYNC (music therapy for neurorehabilitation), PEWS (procrastination detection), DSA Visualizer, Disease Prediction System, and Power BI dashboards for Telecom Churn and HR Analytics.',
      'His projects span healthcare AI, fintech, civic tech, neurorehabilitation, data visualization, and business intelligence. Each demonstrates his ability to solve real-world problems with machine learning and full-stack development.',
      'Notable projects include MedRelay with a 14-agent AI pipeline using LangGraph + HuggingFace, CivicPulse achieving 75-85% ML classification accuracy, and a stock forecasting system with XGBoost, Random Forest, SVR, and LSTM ensemble models.',
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
    keywords: ['experience', 'background', 'career', 'education', 'intern', 'hackathon', 'leadership', 'journey', 'publication'],
    responses: [
      'Umang is pursuing an Integrated M.Sc. in Decision and Computing Sciences at CIT (CGPA: 8.01). He completed a Data Analytics internship at Codtech IT Solutions (May–Jun 2025) and has won multiple hackathon awards including the Data Science Hackathon at IIT Madras.',
      'His journey includes winning the Data Science Hackathon at Techgyan-IIT Madras (Apr 2025), being a finalist at Hackdemia Bangalore, and Second Runner-Up at both Hack24 and Astronova 2K26. He has 2 publications including a Scopus-indexed paper.',
      'Umang serves as Rotary Foundation Chair at Rotaract Club of Coimbatore SmartCity and was a Campus Ambassador for Corizo Edutech. His areas of interest include AI, MLOps, FinTech, Data Storytelling, Open Source, and RAG Systems.',
    ],
  },
];
