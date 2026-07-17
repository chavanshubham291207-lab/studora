import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, FileText, Map, Award, BookOpen, 
  HelpCircle, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Search, X, Bookmark, BookmarkCheck, ExternalLink, Star, Zap,
  Filter, Grid, List, ChevronDown, Globe, Brain, Code, Presentation,
  Palette, Image, Video, Briefcase, GraduationCap, Activity, BarChart2,
  Megaphone, Database, Cpu, SlidersHorizontal
} from 'lucide-react';
import { API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

// ─── AI TOOLS HUB DATA ──────────────────────────────────────────────────────

const TOOL_CATEGORIES = [
  { id: 'all', label: 'All Tools', icon: Cpu },
  { id: 'chat', label: 'AI Chat & Research', icon: Brain },
  { id: 'coding', label: 'Coding & Dev', icon: Code },
  { id: 'presentation', label: 'Presentation & PPT', icon: Presentation },
  { id: 'design', label: 'Design & UI/UX', icon: Palette },
  { id: 'image', label: 'Image Generation', icon: Image },
  { id: 'video', label: 'Video Generation', icon: Video },
  { id: 'resume', label: 'Resume & Career', icon: Briefcase },
  { id: 'learning', label: 'Learning & Notes', icon: GraduationCap },
  { id: 'productivity', label: 'Productivity', icon: Activity },
  { id: 'datascience', label: 'Data Science', icon: BarChart2 },
  { id: 'marketing', label: 'Marketing & Content', icon: Megaphone },
  { id: 'database', label: 'Database & Backend', icon: Database },
];

const PRICING_OPTIONS = ['All', 'Free', 'Freemium', 'Paid'];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest First' },
];

const getLogo = (domain) => `https://logo.clearbit.com/${domain}`;

const ALL_TOOLS = [
  // ─── AI Chat & Research ──────────────────────────────────────────────────
  {
    id: 'chatgpt', category: 'chat', name: 'ChatGPT',
    description: 'The most popular AI chatbot by OpenAI. Capable of reasoning, coding, writing, math, and much more.',
    pricing: 'Freemium', website: 'https://chat.openai.com',
    logo: getLogo('openai.com'), featured: true, popularity: 100, newest: false,
    tags: ['GPT-4o', 'OpenAI', 'Chat'],
  },
  {
    id: 'claude', category: 'chat', name: 'Claude',
    description: 'Anthropic\'s AI assistant known for safety, nuanced writing, long context windows, and coding.',
    pricing: 'Freemium', website: 'https://claude.ai',
    logo: getLogo('claude.ai'), featured: true, popularity: 95, newest: false,
    tags: ['Anthropic', 'Long Context', 'Writing'],
  },
  {
    id: 'gemini', category: 'chat', name: 'Gemini',
    description: 'Google\'s flagship AI model with multimodal capabilities, deep Google integration, and real-time search.',
    pricing: 'Freemium', website: 'https://gemini.google.com',
    logo: getLogo('google.com'), featured: true, popularity: 93, newest: false,
    tags: ['Google', 'Multimodal', 'Search'],
  },
  {
    id: 'perplexity', category: 'chat', name: 'Perplexity AI',
    description: 'AI-powered research and search engine that provides cited answers to complex questions in real time.',
    pricing: 'Freemium', website: 'https://perplexity.ai',
    logo: getLogo('perplexity.ai'), featured: true, popularity: 88, newest: false,
    tags: ['Research', 'Search', 'Citations'],
  },
  {
    id: 'copilot-ms', category: 'chat', name: 'Microsoft Copilot',
    description: 'Microsoft\'s AI powered by GPT-4o, integrated into Windows, Edge, Office 365, and Teams.',
    pricing: 'Freemium', website: 'https://copilot.microsoft.com',
    logo: getLogo('microsoft.com'), featured: false, popularity: 85, newest: false,
    tags: ['Microsoft', 'Office', 'GPT-4o'],
  },
  {
    id: 'grok', category: 'chat', name: 'Grok',
    description: 'xAI\'s real-time AI assistant with access to X (Twitter) data and a witty, direct communication style.',
    pricing: 'Freemium', website: 'https://x.ai',
    logo: getLogo('x.ai'), featured: false, popularity: 78, newest: true,
    tags: ['xAI', 'Real-Time', 'X Twitter'],
  },

  // ─── Coding & Development ────────────────────────────────────────────────
  {
    id: 'github-copilot', category: 'coding', name: 'GitHub Copilot',
    description: 'AI pair programmer by GitHub & OpenAI. Autocompletes code, suggests functions, explains bugs in your IDE.',
    pricing: 'Paid', website: 'https://github.com/features/copilot',
    logo: getLogo('github.com'), featured: true, popularity: 97, newest: false,
    tags: ['GitHub', 'VS Code', 'Autocomplete'],
  },
  {
    id: 'cursor', category: 'coding', name: 'Cursor AI',
    description: 'AI-first code editor forked from VS Code. Understands your entire codebase for context-aware edits.',
    pricing: 'Freemium', website: 'https://cursor.com',
    logo: getLogo('cursor.com'), featured: true, popularity: 94, newest: true,
    tags: ['Editor', 'Codebase AI', 'GPT-4'],
  },
  {
    id: 'windsurf', category: 'coding', name: 'Windsurf',
    description: 'Codeium\'s agentic AI IDE that flows with you. Cascade feature edits across files with a single prompt.',
    pricing: 'Freemium', website: 'https://windsurf.com',
    logo: getLogo('windsurf.com'), featured: true, popularity: 90, newest: true,
    tags: ['Agentic', 'IDE', 'Cascade'],
  },
  {
    id: 'vscode', category: 'coding', name: 'VS Code',
    description: 'Microsoft\'s free, open-source code editor with massive extension ecosystem and built-in GitHub Copilot support.',
    pricing: 'Free', website: 'https://code.visualstudio.com',
    logo: getLogo('visualstudio.com'), featured: true, popularity: 99, newest: false,
    tags: ['Editor', 'Extensions', 'Free'],
  },
  {
    id: 'replit', category: 'coding', name: 'Replit',
    description: 'Browser-based IDE with Ghostwriter AI, instant deployment, and collaborative coding for 50+ languages.',
    pricing: 'Freemium', website: 'https://replit.com',
    logo: getLogo('replit.com'), featured: false, popularity: 85, newest: false,
    tags: ['Browser IDE', 'Deployment', 'Collab'],
  },
  {
    id: 'stackblitz', category: 'coding', name: 'StackBlitz',
    description: 'Instant, full-stack web development environment running entirely in the browser using WebContainers.',
    pricing: 'Freemium', website: 'https://stackblitz.com',
    logo: getLogo('stackblitz.com'), featured: false, popularity: 80, newest: false,
    tags: ['WebContainers', 'Browser', 'Node.js'],
  },
  {
    id: 'codeium', category: 'coding', name: 'Codeium',
    description: 'Free AI code completion and chat for 70+ languages. Works in VS Code, JetBrains, Vim, Neovim, and more.',
    pricing: 'Freemium', website: 'https://codeium.com',
    logo: getLogo('codeium.com'), featured: false, popularity: 82, newest: false,
    tags: ['Autocomplete', 'Free', 'Multi-IDE'],
  },
  {
    id: 'tabnine', category: 'coding', name: 'Tabnine',
    description: 'Privacy-first AI code completion tool with self-hosted options. Learns from your team\'s codebase.',
    pricing: 'Freemium', website: 'https://tabnine.com',
    logo: getLogo('tabnine.com'), featured: false, popularity: 75, newest: false,
    tags: ['Privacy', 'Self-Hosted', 'Team'],
  },
  {
    id: 'bolt', category: 'coding', name: 'Bolt.new',
    description: 'StackBlitz\'s AI-powered full-stack app builder. Type a prompt and get a deployable web app in seconds.',
    pricing: 'Freemium', website: 'https://bolt.new',
    logo: getLogo('bolt.new'), featured: true, popularity: 91, newest: true,
    tags: ['App Builder', 'No-Code', 'Deploy'],
  },
  {
    id: 'lovable', category: 'coding', name: 'Lovable',
    description: 'AI software engineer that builds full-stack React apps from natural language prompts with Supabase backend.',
    pricing: 'Freemium', website: 'https://lovable.dev',
    logo: getLogo('lovable.dev'), featured: true, popularity: 88, newest: true,
    tags: ['React', 'Supabase', 'Full-Stack'],
  },
  {
    id: 'firebase-studio', category: 'coding', name: 'Firebase Studio',
    description: 'Google\'s AI-powered development workspace for building and deploying full-stack apps with Firebase.',
    pricing: 'Free', website: 'https://firebase.studio',
    logo: getLogo('firebase.google.com'), featured: false, popularity: 77, newest: true,
    tags: ['Google', 'Firebase', 'Cloud'],
  },
  {
    id: 'vercel', category: 'coding', name: 'Vercel',
    description: 'Frontend cloud platform for deploying Next.js and web apps. Features AI-assisted workflows and v0 UI builder.',
    pricing: 'Freemium', website: 'https://vercel.com',
    logo: getLogo('vercel.com'), featured: false, popularity: 90, newest: false,
    tags: ['Deployment', 'Next.js', 'v0'],
  },
  {
    id: 'render', category: 'coding', name: 'Render',
    description: 'Cloud platform for deploying web services, databases, and cron jobs. Simpler Heroku alternative.',
    pricing: 'Freemium', website: 'https://render.com',
    logo: getLogo('render.com'), featured: false, popularity: 78, newest: false,
    tags: ['Deploy', 'Backend', 'Cloud'],
  },
  {
    id: 'netlify', category: 'coding', name: 'Netlify',
    description: 'Platform for automating modern web projects. Offers CI/CD, serverless functions, and edge deployments.',
    pricing: 'Freemium', website: 'https://netlify.com',
    logo: getLogo('netlify.com'), featured: false, popularity: 80, newest: false,
    tags: ['CI/CD', 'Serverless', 'JAMStack'],
  },

  // ─── Presentation & PPT ──────────────────────────────────────────────────
  {
    id: 'gamma', category: 'presentation', name: 'Gamma',
    description: 'AI-powered presentation, doc, and webpage creator. Generates beautiful slides from a text prompt in seconds.',
    pricing: 'Freemium', website: 'https://gamma.app',
    logo: getLogo('gamma.app'), featured: true, popularity: 88, newest: false,
    tags: ['Slides', 'Docs', 'AI'],
  },
  {
    id: 'tome', category: 'presentation', name: 'Tome',
    description: 'AI storytelling format for compelling narratives. Create visual stories and presentations with DALL·E.',
    pricing: 'Freemium', website: 'https://tome.app',
    logo: getLogo('tome.app'), featured: false, popularity: 75, newest: false,
    tags: ['Storytelling', 'DALL-E', 'Slides'],
  },
  {
    id: 'beautiful-ai', category: 'presentation', name: 'Beautiful.ai',
    description: 'Smart slide templates that auto-adjust layouts. Ideal for clean, professional business presentations.',
    pricing: 'Freemium', website: 'https://beautiful.ai',
    logo: getLogo('beautiful.ai'), featured: false, popularity: 73, newest: false,
    tags: ['Templates', 'Auto-Layout', 'Business'],
  },
  {
    id: 'canva-ppt', category: 'presentation', name: 'Canva',
    description: 'Design platform with AI-assisted presentation builder, Magic Design, and thousands of slide templates.',
    pricing: 'Freemium', website: 'https://canva.com/presentations',
    logo: getLogo('canva.com'), featured: true, popularity: 92, newest: false,
    tags: ['Design', 'Templates', 'Collaboration'],
  },
  {
    id: 'slidesai', category: 'presentation', name: 'SlidesAI',
    description: 'Google Slides AI add-on that auto-generates presentation slides from any text or topic with one click.',
    pricing: 'Freemium', website: 'https://slidesai.io',
    logo: getLogo('slidesai.io'), featured: false, popularity: 70, newest: false,
    tags: ['Google Slides', 'Add-on', 'Auto'],
  },
  {
    id: 'plus-ai', category: 'presentation', name: 'Plus AI',
    description: 'AI presentation add-in for Google Slides and PowerPoint. Rewrites, summarizes, and designs slides.',
    pricing: 'Freemium', website: 'https://plusai.com',
    logo: getLogo('plusai.com'), featured: false, popularity: 68, newest: false,
    tags: ['Google Slides', 'PowerPoint', 'Rewrite'],
  },
  {
    id: 'pitch', category: 'presentation', name: 'Pitch',
    description: 'Collaborative deck builder for teams. Offers AI slide generation, real-time collaboration, and analytics.',
    pricing: 'Freemium', website: 'https://pitch.com',
    logo: getLogo('pitch.com'), featured: false, popularity: 72, newest: false,
    tags: ['Collaboration', 'Teams', 'Analytics'],
  },
  {
    id: 'prezi', category: 'presentation', name: 'Prezi',
    description: 'Non-linear, zoomable presentation platform with AI design assistant for dynamic, engaging slides.',
    pricing: 'Freemium', website: 'https://prezi.com',
    logo: getLogo('prezi.com'), featured: false, popularity: 70, newest: false,
    tags: ['Zoomable', 'Dynamic', 'Non-Linear'],
  },

  // ─── Design & UI/UX ──────────────────────────────────────────────────────
  {
    id: 'figma', category: 'design', name: 'Figma',
    description: 'Industry-standard collaborative design tool with AI features, plugins, and prototyping capabilities.',
    pricing: 'Freemium', website: 'https://figma.com',
    logo: getLogo('figma.com'), featured: true, popularity: 97, newest: false,
    tags: ['UI Design', 'Prototyping', 'Collab'],
  },
  {
    id: 'adobe-express', category: 'design', name: 'Adobe Express',
    description: 'Quick content creation tool powered by Adobe Firefly AI. Create social media, flyers, and web graphics.',
    pricing: 'Freemium', website: 'https://express.adobe.com',
    logo: getLogo('adobe.com'), featured: false, popularity: 78, newest: false,
    tags: ['Adobe', 'Social Media', 'Firefly'],
  },
  {
    id: 'canva-design', category: 'design', name: 'Canva',
    description: 'All-in-one visual design platform with AI image generation, Magic Studio, and 1M+ templates.',
    pricing: 'Freemium', website: 'https://canva.com',
    logo: getLogo('canva.com'), featured: true, popularity: 95, newest: false,
    tags: ['Design', 'Templates', 'AI Studio'],
  },
  {
    id: 'framer', category: 'design', name: 'Framer',
    description: 'AI website builder that generates complete responsive websites from a text prompt. No code needed.',
    pricing: 'Freemium', website: 'https://framer.com',
    logo: getLogo('framer.com'), featured: true, popularity: 87, newest: true,
    tags: ['Website Builder', 'No-Code', 'Responsive'],
  },
  {
    id: 'uizard', category: 'design', name: 'Uizard',
    description: 'AI-powered UI design tool that converts wireframe sketches and prompts into interactive prototypes.',
    pricing: 'Freemium', website: 'https://uizard.io',
    logo: getLogo('uizard.io'), featured: false, popularity: 73, newest: false,
    tags: ['Wireframe', 'Prototype', 'Sketch to UI'],
  },
  {
    id: 'visily', category: 'design', name: 'Visily',
    description: 'AI wireframing and UI design tool. Convert screenshots, prompts, or templates into Figma-ready designs.',
    pricing: 'Freemium', website: 'https://visily.ai',
    logo: getLogo('visily.ai'), featured: false, popularity: 68, newest: true,
    tags: ['Wireframe', 'Screenshot to UI', 'Figma'],
  },
  {
    id: 'pixso', category: 'design', name: 'Pixso',
    description: 'Collaborative design and prototyping tool with AI features and Figma file import compatibility.',
    pricing: 'Freemium', website: 'https://pixso.net',
    logo: getLogo('pixso.net'), featured: false, popularity: 60, newest: false,
    tags: ['Figma Alternative', 'Prototype', 'Collab'],
  },

  // ─── Image Generation ────────────────────────────────────────────────────
  {
    id: 'midjourney', category: 'image', name: 'Midjourney',
    description: 'Leading AI image generator known for stunning artistic quality. Accessed via Discord or web.',
    pricing: 'Paid', website: 'https://midjourney.com',
    logo: getLogo('midjourney.com'), featured: true, popularity: 95, newest: false,
    tags: ['Art', 'Discord', 'High Quality'],
  },
  {
    id: 'dalle', category: 'image', name: 'DALL·E',
    description: 'OpenAI\'s image generation model integrated in ChatGPT Plus. Creates photorealistic images from text.',
    pricing: 'Freemium', website: 'https://openai.com/dall-e-3',
    logo: getLogo('openai.com'), featured: true, popularity: 90, newest: false,
    tags: ['OpenAI', 'Photorealistic', 'ChatGPT'],
  },
  {
    id: 'leonardo', category: 'image', name: 'Leonardo AI',
    description: 'Professional AI image generation platform with fine-tuned models for game assets, concept art, and more.',
    pricing: 'Freemium', website: 'https://leonardo.ai',
    logo: getLogo('leonardo.ai'), featured: true, popularity: 85, newest: false,
    tags: ['Game Art', 'Fine-Tune', 'Models'],
  },
  {
    id: 'ideogram', category: 'image', name: 'Ideogram',
    description: 'AI image generator excellent at rendering readable text within images — a unique differentiator.',
    pricing: 'Freemium', website: 'https://ideogram.ai',
    logo: getLogo('ideogram.ai'), featured: false, popularity: 78, newest: true,
    tags: ['Text in Images', 'Typography', 'Logos'],
  },
  {
    id: 'adobe-firefly', category: 'image', name: 'Adobe Firefly',
    description: 'Adobe\'s generative AI tools built into Creative Cloud. Commercially safe images trained on licensed content.',
    pricing: 'Freemium', website: 'https://firefly.adobe.com',
    logo: getLogo('adobe.com'), featured: false, popularity: 82, newest: false,
    tags: ['Adobe', 'Commercial Safe', 'Creative Cloud'],
  },
  {
    id: 'playground', category: 'image', name: 'Playground AI',
    description: 'Free AI image creator with real-time editing, inpainting, and up to 1500 free images per day.',
    pricing: 'Freemium', website: 'https://playground.com',
    logo: getLogo('playground.com'), featured: false, popularity: 72, newest: false,
    tags: ['Free', 'Inpainting', 'Real-Time'],
  },

  // ─── Video Generation & Editing ──────────────────────────────────────────
  {
    id: 'runway', category: 'video', name: 'Runway',
    description: 'Professional AI video generation and editing studio. Gen-3 Alpha creates cinematic video from text/images.',
    pricing: 'Freemium', website: 'https://runwayml.com',
    logo: getLogo('runwayml.com'), featured: true, popularity: 90, newest: false,
    tags: ['Video Gen', 'Gen-3', 'Cinematic'],
  },
  {
    id: 'pika', category: 'video', name: 'Pika',
    description: 'AI video generation platform that creates and edits short videos from text and image prompts.',
    pricing: 'Freemium', website: 'https://pika.art',
    logo: getLogo('pika.art'), featured: false, popularity: 82, newest: true,
    tags: ['Short Video', 'Text to Video', 'Image to Video'],
  },
  {
    id: 'veo', category: 'video', name: 'Veo',
    description: 'Google DeepMind\'s state-of-the-art video generation model capable of 4K, 60fps+ cinematic content.',
    pricing: 'Freemium', website: 'https://deepmind.google/technologies/veo',
    logo: getLogo('deepmind.google'), featured: true, popularity: 88, newest: true,
    tags: ['Google', '4K', 'DeepMind'],
  },
  {
    id: 'synthesia', category: 'video', name: 'Synthesia',
    description: 'Create professional AI avatar videos with custom scripts. Used for corporate training and e-learning.',
    pricing: 'Paid', website: 'https://synthesia.io',
    logo: getLogo('synthesia.io'), featured: false, popularity: 78, newest: false,
    tags: ['Avatar', 'Corporate', 'E-Learning'],
  },
  {
    id: 'capcut', category: 'video', name: 'CapCut',
    description: 'Free AI-powered video editor with auto-captions, background removal, AI effects, and trending templates.',
    pricing: 'Freemium', website: 'https://capcut.com',
    logo: getLogo('capcut.com'), featured: true, popularity: 93, newest: false,
    tags: ['Free', 'Editing', 'Auto-Captions'],
  },
  {
    id: 'invideo', category: 'video', name: 'InVideo AI',
    description: 'AI video creation platform. Type a topic and get a narrated, video-edited content ready to publish.',
    pricing: 'Freemium', website: 'https://invideo.io',
    logo: getLogo('invideo.io'), featured: false, popularity: 75, newest: false,
    tags: ['Auto-Edit', 'Narration', 'YouTube'],
  },
  {
    id: 'heygen', category: 'video', name: 'HeyGen',
    description: 'AI-powered video creation platform with realistic avatars, voice cloning, and instant video translation.',
    pricing: 'Freemium', website: 'https://heygen.com',
    logo: getLogo('heygen.com'), featured: false, popularity: 80, newest: true,
    tags: ['Avatars', 'Translation', 'Voice Clone'],
  },

  // ─── Resume & Career ─────────────────────────────────────────────────────
  {
    id: 'kickresume', category: 'resume', name: 'Kickresume',
    description: 'AI resume builder with 35+ ATS-friendly templates. Includes AI cover letter writer and resume review.',
    pricing: 'Freemium', website: 'https://kickresume.com',
    logo: getLogo('kickresume.com'), featured: true, popularity: 80, newest: false,
    tags: ['ATS', 'Cover Letter', 'Templates'],
  },
  {
    id: 'resume-io', category: 'resume', name: 'Resume.io',
    description: 'Easy-to-use resume maker with AI writing assistance, professional templates, and download options.',
    pricing: 'Freemium', website: 'https://resume.io',
    logo: getLogo('resume.io'), featured: false, popularity: 75, newest: false,
    tags: ['Resume Builder', 'AI Writing', 'Templates'],
  },
  {
    id: 'teal', category: 'resume', name: 'Teal',
    description: 'All-in-one job search platform with AI resume builder, job tracker, and resume scoring for ATS.',
    pricing: 'Freemium', website: 'https://tealhq.com',
    logo: getLogo('tealhq.com'), featured: false, popularity: 72, newest: false,
    tags: ['Job Tracker', 'ATS Score', 'AI'],
  },
  {
    id: 'enhancv', category: 'resume', name: 'Enhancv',
    description: 'Creative resume builder with AI content suggestions, visual sections, and ATS-optimization features.',
    pricing: 'Freemium', website: 'https://enhancv.com',
    logo: getLogo('enhancv.com'), featured: false, popularity: 70, newest: false,
    tags: ['Creative', 'ATS', 'Visual'],
  },
  {
    id: 'huntr', category: 'resume', name: 'Huntr',
    description: 'AI-powered job search tracker. Organizes applications, deadlines, contacts, and tasks in a kanban board.',
    pricing: 'Freemium', website: 'https://huntr.co',
    logo: getLogo('huntr.co'), featured: false, popularity: 68, newest: false,
    tags: ['Job Tracker', 'Kanban', 'Networking'],
  },

  // ─── Learning & Notes ────────────────────────────────────────────────────
  {
    id: 'notion-ai', category: 'learning', name: 'Notion AI',
    description: 'AI writing assistant built into Notion. Summarizes, edits, translates, and generates content in your notes.',
    pricing: 'Freemium', website: 'https://notion.so',
    logo: getLogo('notion.so'), featured: true, popularity: 90, newest: false,
    tags: ['Notes', 'AI Writing', 'Workspace'],
  },
  {
    id: 'notebooklm', category: 'learning', name: 'NotebookLM',
    description: 'Google\'s AI research notebook. Upload PDFs/docs and have AI-powered Q&A, summaries, and Audio Overviews.',
    pricing: 'Free', website: 'https://notebooklm.google.com',
    logo: getLogo('google.com'), featured: true, popularity: 88, newest: true,
    tags: ['Google', 'PDF Q&A', 'Audio Overview'],
  },
  {
    id: 'quizlet', category: 'learning', name: 'Quizlet',
    description: 'AI-powered flashcard and study tool. Q-Chat AI tutor and Magic Notes generate study sets from documents.',
    pricing: 'Freemium', website: 'https://quizlet.com',
    logo: getLogo('quizlet.com'), featured: false, popularity: 85, newest: false,
    tags: ['Flashcards', 'Study', 'Tutor'],
  },
  {
    id: 'khanmigo', category: 'learning', name: 'Khanmigo',
    description: 'Khan Academy\'s AI tutor powered by GPT-4. Guides students through problems with Socratic questioning.',
    pricing: 'Paid', website: 'https://khanacademy.org/khan-labs',
    logo: getLogo('khanacademy.org'), featured: false, popularity: 78, newest: false,
    tags: ['Tutoring', 'Socratic', 'Khan Academy'],
  },
  {
    id: 'elicit', category: 'learning', name: 'Elicit',
    description: 'AI research assistant that searches, summarizes, and synthesizes academic papers across multiple databases.',
    pricing: 'Freemium', website: 'https://elicit.com',
    logo: getLogo('elicit.com'), featured: false, popularity: 72, newest: false,
    tags: ['Research', 'Papers', 'Academic'],
  },
  {
    id: 'consensus', category: 'learning', name: 'Consensus',
    description: 'AI search engine for scientific research. Extracts findings from peer-reviewed papers to answer questions.',
    pricing: 'Freemium', website: 'https://consensus.app',
    logo: getLogo('consensus.app'), featured: false, popularity: 70, newest: false,
    tags: ['Science', 'Peer-Reviewed', 'Research'],
  },

  // ─── Productivity ────────────────────────────────────────────────────────
  {
    id: 'grammarly', category: 'productivity', name: 'Grammarly',
    description: 'AI writing assistant that checks grammar, style, tone, and clarity. Works across all major apps.',
    pricing: 'Freemium', website: 'https://grammarly.com',
    logo: getLogo('grammarly.com'), featured: true, popularity: 95, newest: false,
    tags: ['Writing', 'Grammar', 'Chrome'],
  },
  {
    id: 'otter-ai', category: 'productivity', name: 'Otter.ai',
    description: 'Real-time AI meeting transcription and notes. Integrates with Zoom, Teams, and Google Meet.',
    pricing: 'Freemium', website: 'https://otter.ai',
    logo: getLogo('otter.ai'), featured: false, popularity: 82, newest: false,
    tags: ['Transcription', 'Meetings', 'Notes'],
  },
  {
    id: 'elevenlabs', category: 'productivity', name: 'ElevenLabs',
    description: 'AI voice cloning and text-to-speech platform. Create hyper-realistic voiceovers in 30+ languages.',
    pricing: 'Freemium', website: 'https://elevenlabs.io',
    logo: getLogo('elevenlabs.io'), featured: true, popularity: 88, newest: true,
    tags: ['Voice Clone', 'TTS', 'Voiceover'],
  },
  {
    id: 'zapier', category: 'productivity', name: 'Zapier',
    description: 'No-code automation platform with 6000+ app integrations. Now with AI-powered Zap builders.',
    pricing: 'Freemium', website: 'https://zapier.com',
    logo: getLogo('zapier.com'), featured: false, popularity: 88, newest: false,
    tags: ['Automation', 'No-Code', 'Integrations'],
  },
  {
    id: 'make', category: 'productivity', name: 'Make',
    description: 'Visual automation platform (formerly Integromat). Build complex workflows with 1800+ app integrations.',
    pricing: 'Freemium', website: 'https://make.com',
    logo: getLogo('make.com'), featured: false, popularity: 80, newest: false,
    tags: ['Visual Workflow', 'Automation', 'Apps'],
  },
  {
    id: 'motion', category: 'productivity', name: 'Motion',
    description: 'AI-powered calendar and task manager that auto-schedules your day based on priorities and deadlines.',
    pricing: 'Paid', website: 'https://usemotion.com',
    logo: getLogo('usemotion.com'), featured: false, popularity: 75, newest: false,
    tags: ['AI Calendar', 'Task Manager', 'Auto-Schedule'],
  },
  {
    id: 'clickup-ai', category: 'productivity', name: 'ClickUp AI',
    description: 'Project management platform with built-in AI for writing, summarizing, automating tasks, and planning.',
    pricing: 'Freemium', website: 'https://clickup.com',
    logo: getLogo('clickup.com'), featured: false, popularity: 82, newest: false,
    tags: ['Project Management', 'AI Writing', 'Tasks'],
  },

  // ─── Data Science & Analytics ────────────────────────────────────────────
  {
    id: 'kaggle', category: 'datascience', name: 'Kaggle',
    description: 'Google\'s data science community platform with datasets, notebooks, competitions, and free GPU access.',
    pricing: 'Free', website: 'https://kaggle.com',
    logo: getLogo('kaggle.com'), featured: true, popularity: 92, newest: false,
    tags: ['Datasets', 'GPU', 'Competitions'],
  },
  {
    id: 'colab', category: 'datascience', name: 'Google Colab',
    description: 'Free Jupyter notebook environment in the cloud with GPUs and TPUs. Ideal for ML and data experiments.',
    pricing: 'Freemium', website: 'https://colab.research.google.com',
    logo: getLogo('google.com'), featured: true, popularity: 93, newest: false,
    tags: ['Jupyter', 'Free GPU', 'Python'],
  },
  {
    id: 'jupyter', category: 'datascience', name: 'Jupyter',
    description: 'Open-source interactive computing environment for Python, R, Julia. The foundation of data science.',
    pricing: 'Free', website: 'https://jupyter.org',
    logo: getLogo('jupyter.org'), featured: false, popularity: 88, newest: false,
    tags: ['Open Source', 'Notebooks', 'Python'],
  },
  {
    id: 'hex', category: 'datascience', name: 'Hex',
    description: 'Modern collaborative data workspace with AI Magic features that write SQL and Python from plain language.',
    pricing: 'Freemium', website: 'https://hex.tech',
    logo: getLogo('hex.tech'), featured: false, popularity: 70, newest: true,
    tags: ['Collaboration', 'SQL AI', 'Python'],
  },
  {
    id: 'deepnote', category: 'datascience', name: 'Deepnote',
    description: 'Data science notebook built for collaboration. Real-time multiplayer editing, version history, and AI.',
    pricing: 'Freemium', website: 'https://deepnote.com',
    logo: getLogo('deepnote.com'), featured: false, popularity: 68, newest: false,
    tags: ['Collaborative', 'Notebooks', 'ML'],
  },

  // ─── Marketing & Content ─────────────────────────────────────────────────
  {
    id: 'jasper', category: 'marketing', name: 'Jasper',
    description: 'Enterprise AI writing platform for marketing teams. Create SEO blogs, ads, email campaigns, and more.',
    pricing: 'Paid', website: 'https://jasper.ai',
    logo: getLogo('jasper.ai'), featured: false, popularity: 82, newest: false,
    tags: ['Copywriting', 'SEO', 'Enterprise'],
  },
  {
    id: 'copy-ai', category: 'marketing', name: 'Copy.ai',
    description: 'AI marketing copy platform with 90+ templates for ads, social posts, emails, product descriptions.',
    pricing: 'Freemium', website: 'https://copy.ai',
    logo: getLogo('copy.ai'), featured: false, popularity: 78, newest: false,
    tags: ['Copywriting', 'Marketing', 'Templates'],
  },
  {
    id: 'writesonic', category: 'marketing', name: 'Writesonic',
    description: 'AI writing tool with ChatSonic (web-aware), AI Article Writer, and Chatsonic brand voice features.',
    pricing: 'Freemium', website: 'https://writesonic.com',
    logo: getLogo('writesonic.com'), featured: false, popularity: 75, newest: false,
    tags: ['SEO Articles', 'Chatbot', 'Brand Voice'],
  },
  {
    id: 'buffer-ai', category: 'marketing', name: 'Buffer AI',
    description: 'Social media scheduling platform with AI Assistant for writing and repurposing content across platforms.',
    pricing: 'Freemium', website: 'https://buffer.com',
    logo: getLogo('buffer.com'), featured: false, popularity: 73, newest: false,
    tags: ['Social Media', 'Scheduling', 'AI Content'],
  },
  {
    id: 'hootsuite', category: 'marketing', name: 'Hootsuite',
    description: 'Social media management platform with OwlyWriter AI for content creation and AI-powered analytics.',
    pricing: 'Paid', website: 'https://hootsuite.com',
    logo: getLogo('hootsuite.com'), featured: false, popularity: 70, newest: false,
    tags: ['Social Media', 'Analytics', 'Scheduling'],
  },

  // ─── Database & Backend ──────────────────────────────────────────────────
  {
    id: 'supabase', category: 'database', name: 'Supabase',
    description: 'Open-source Firebase alternative with PostgreSQL, auth, storage, edge functions, and AI vector search.',
    pricing: 'Freemium', website: 'https://supabase.com',
    logo: getLogo('supabase.com'), featured: true, popularity: 92, newest: false,
    tags: ['PostgreSQL', 'Auth', 'Firebase Alt'],
  },
  {
    id: 'firebase-db', category: 'database', name: 'Firebase',
    description: 'Google\'s BaaS platform with Realtime Database, Firestore, Authentication, Hosting, and Functions.',
    pricing: 'Freemium', website: 'https://firebase.google.com',
    logo: getLogo('firebase.google.com'), featured: true, popularity: 90, newest: false,
    tags: ['Google', 'Realtime', 'BaaS'],
  },
  {
    id: 'mongodb-atlas', category: 'database', name: 'MongoDB Atlas',
    description: 'Fully managed cloud database with Vector Search, App Services, and Data API for modern AI apps.',
    pricing: 'Freemium', website: 'https://mongodb.com/atlas',
    logo: getLogo('mongodb.com'), featured: false, popularity: 85, newest: false,
    tags: ['NoSQL', 'Vector Search', 'Cloud'],
  },
  {
    id: 'planetscale', category: 'database', name: 'PlanetScale',
    description: 'MySQL-compatible serverless database platform with branching workflows for safe schema changes.',
    pricing: 'Freemium', website: 'https://planetscale.com',
    logo: getLogo('planetscale.com'), featured: false, popularity: 75, newest: false,
    tags: ['MySQL', 'Serverless', 'Branching'],
  },
  {
    id: 'neon', category: 'database', name: 'Neon',
    description: 'Serverless Postgres with autoscaling, branching, and seamless Vercel/AI framework integration.',
    pricing: 'Freemium', website: 'https://neon.tech',
    logo: getLogo('neon.tech'), featured: false, popularity: 78, newest: true,
    tags: ['Postgres', 'Serverless', 'Autoscale'],
  },
  {
    id: 'railway', category: 'database', name: 'Railway',
    description: 'Infrastructure platform for deploying apps and databases in one click. Easy Postgres, Redis, and more.',
    pricing: 'Freemium', website: 'https://railway.app',
    logo: getLogo('railway.app'), featured: false, popularity: 77, newest: true,
    tags: ['Deploy', 'Database', 'One Click'],
  },
];

// ─── PRICING BADGE COLORS ────────────────────────────────────────────────────
const PRICING_COLORS = {
  Free: { bg: 'bg-emerald-900/40 border-emerald-700/30 text-emerald-300', dot: 'bg-emerald-400' },
  Freemium: { bg: 'bg-violet-900/40 border-violet-700/30 text-violet-300', dot: 'bg-violet-400' },
  Paid: { bg: 'bg-amber-900/40 border-amber-700/30 text-amber-300', dot: 'bg-amber-400' },
};

// ─── AI TOOLS HUB COMPONENT ──────────────────────────────────────────────────
const AIToolsHub = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePricing, setActivePricing] = useState('All');
  const [activeSort, setActiveSort] = useState('popular');
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studora_tools_bookmarks') || '[]'); } catch { return []; }
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [logoErrors, setLogoErrors] = useState({});

  const handleBookmark = (id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem('studora_tools_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const handleLogoError = (id) => {
    setLogoErrors(prev => ({ ...prev, [id]: true }));
  };

  const filtered = useMemo(() => {
    let tools = ALL_TOOLS.filter(t => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory;
      const matchPrice = activePricing === 'All' || t.pricing === activePricing;
      const matchSearch = !search || (
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
      const matchBookmark = !showBookmarksOnly || bookmarks.includes(t.id);
      return matchCat && matchPrice && matchSearch && matchBookmark;
    });

    if (activeSort === 'popular') tools.sort((a, b) => b.popularity - a.popularity);
    else if (activeSort === 'name') tools.sort((a, b) => a.name.localeCompare(b.name));
    else if (activeSort === 'newest') tools.sort((a, b) => (b.newest ? 1 : 0) - (a.newest ? 1 : 0));

    return tools;
  }, [search, activeCategory, activePricing, activeSort, showBookmarksOnly, bookmarks]);

  const stats = useMemo(() => ({
    total: ALL_TOOLS.length,
    free: ALL_TOOLS.filter(t => t.pricing === 'Free').length,
    freemium: ALL_TOOLS.filter(t => t.pricing === 'Freemium').length,
    featured: ALL_TOOLS.filter(t => t.featured).length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-700/20 bg-gradient-to-br from-cyan-950/60 via-indigo-950/50 to-slate-950/80 p-6">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-cyan-600/20 border border-cyan-700/30 text-cyan-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Cpu className="w-3 h-3" /> AI Tools Hub
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-700/30 text-violet-300 text-[10px] font-bold uppercase tracking-widest">
                {stats.total}+ Tools
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-tight mb-2">
              Discover the Best AI Tools
            </h2>
            <p className="text-slate-400 text-sm max-w-lg">
              Curated collection of the most powerful AI tools across every category — from coding to design, research to productivity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { label: 'Total Tools', count: stats.total, color: 'text-cyan-400' },
              { label: 'Featured', count: stats.featured, color: 'text-amber-400' },
              { label: 'Free Tools', count: stats.free, color: 'text-emerald-400' },
              { label: 'Freemium', count: stats.freemium, color: 'text-violet-400' },
            ].map(stat => (
              <div key={stat.label} className="glass-panel rounded-xl p-3 text-center border border-white/5">
                <p className={`font-display font-extrabold text-xl ${stat.color}`}>{stat.count}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={`Search ${stats.total}+ AI tools by name, category, or feature...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-white/10 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)] transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Pricing Filter */}
          <select
            value={activePricing}
            onChange={e => setActivePricing(e.target.value)}
            className="px-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {PRICING_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {/* Sort */}
          <select
            value={activeSort}
            onChange={e => setActiveSort(e.target.value)}
            className="px-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {/* Bookmarks toggle */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showBookmarksOnly
                ? 'bg-amber-600/20 border-amber-700/30 text-amber-300'
                : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Saved</span>
            {bookmarks.length > 0 && (
              <span className="bg-amber-700/40 text-amber-300 px-1.5 rounded-full text-[9px] font-bold">{bookmarks.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
        {TOOL_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const count = cat.id === 'all' ? ALL_TOOLS.length : ALL_TOOLS.filter(t => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-600/20 border-cyan-700/30 text-cyan-300'
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
              <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full ${
                activeCategory === cat.id ? 'bg-cyan-700/40 text-cyan-300' : 'bg-white/5 text-slate-500'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="text-slate-300 font-semibold">{filtered.length}</span> tools
          {search && <> for <span className="text-cyan-400 font-semibold">"{search}"</span></>}
        </p>
        {(search || activeCategory !== 'all' || activePricing !== 'All' || showBookmarksOnly) && (
          <button
            onClick={() => { setSearch(''); setActiveCategory('all'); setActivePricing('All'); setShowBookmarksOnly(false); }}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Tools Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-300">No tools found</h3>
            <p className="text-sm text-slate-500 max-w-sm">Try adjusting your search term or filters.</p>
          </motion.div>
        ) : (
          <motion.div
            key={`${activeCategory}-${activePricing}-${activeSort}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((tool, i) => {
              const isBookmarked = bookmarks.includes(tool.id);
              const pricing = PRICING_COLORS[tool.pricing] || PRICING_COLORS.Freemium;
              const hasLogoError = logoErrors[tool.id];
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4) }}
                  className="group relative flex flex-col gap-3 p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/70 transition-all duration-200"
                >
                  {/* Featured Badge */}
                  {tool.featured && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-900/50 border border-amber-700/30 text-amber-300 text-[9px] font-bold uppercase tracking-widest">
                      <Star className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                      {hasLogoError ? (
                        <span className="text-lg font-bold text-slate-400">{tool.name[0]}</span>
                      ) : (
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-7 h-7 object-contain"
                          onError={() => handleLogoError(tool.id)}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                        {tool.name}
                      </h3>
                      {/* Pricing badge */}
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${pricing.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pricing.dot}`} />
                        {tool.pricing}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 flex-1">
                    {tool.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded-md bg-slate-800/60 border border-white/5 text-slate-400 text-[9px] font-semibold">
                        {tag}
                      </span>
                    ))}
                    {tool.newest && (
                      <span className="px-1.5 py-0.5 rounded-md bg-cyan-900/40 border border-cyan-700/30 text-cyan-400 text-[9px] font-bold">New</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> Open Tool
                    </a>
                    <button
                      onClick={() => handleBookmark(tool.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-600/20 border-amber-700/30 text-amber-300'
                          : 'bg-slate-900/60 border-white/5 text-slate-500 hover:text-amber-300 hover:border-amber-700/30'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('doubt'); // 'doubt', 'summarize', 'roadmap', 'quiz'
  const [loading, setLoading] = useState(false);

  // Tab 1: Ask Doubt
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hi! I am Studora AI. Ask me any math, programming, system design, or engineering question, and I will explain it for you!' }
  ]);

  // Tab 2: Summarizer
  const [inputText, setInputText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');

  // Tab 3: Roadmap
  const [targetRole, setTargetRole] = useState('');
  const [roadmapResult, setRoadmapResult] = useState('');

  // Tab 4: Quiz
  const [quizTopic, setQuizTopic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: optionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: userMsg.content })
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: '⚠️ Error: Failed to generate response. Check backend connection.' }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Please verify the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/ai/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: inputText })
      });

      if (res.ok) {
        const data = await res.json();
        setSummaryResult(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/ai/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetRole })
      });

      if (res.ok) {
        const data = await res.json();
        setRoadmapResult(data.roadmap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;

    setLoading(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/ai/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic: quizTopic })
      });

      if (res.ok) {
        const data = await res.json();
        setQuizQuestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, oIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: oIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-400" /> AI Study Assistant Hub
          </h1>
          <p className="text-sm text-slate-400">Generate learning notes, quizzes, roadmap checklists, and resolve study doubts.</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('doubt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer ${
            activeTab === 'doubt' 
              ? 'bg-violet-650/20 text-violet-400 border-violet-800/40' 
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/20'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Doubt Answering
        </button>
        <button
          onClick={() => setActiveTab('summarize')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer ${
            activeTab === 'summarize' 
              ? 'bg-violet-650/20 text-violet-400 border-violet-800/40' 
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/20'
          }`}
        >
          <FileText className="w-4 h-4" /> PDF & Note Summarizer
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer ${
            activeTab === 'roadmap' 
              ? 'bg-violet-650/20 text-violet-400 border-violet-800/40' 
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/20'
          }`}
        >
          <Map className="w-4 h-4" /> Roadmap Architect
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer ${
            activeTab === 'quiz' 
              ? 'bg-violet-650/20 text-violet-400 border-violet-800/40' 
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/20'
          }`}
        >
          <Award className="w-4 h-4" /> Practice Quiz Builder
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer ${
            activeTab === 'tools' 
              ? 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40' 
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/20'
          }`}
        >
          <Cpu className="w-4 h-4" /> AI Tools Hub
          <span className="px-1.5 py-0.5 rounded-full bg-cyan-600/20 text-cyan-400 text-[9px] font-extrabold">{ALL_TOOLS.length}+</span>
        </button>
      </div>

      {/* Dynamic Tab Body */}
      <div>
        {/* DOUBT SOLVING CHAT */}
        {activeTab === 'doubt' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 flex flex-col h-[520px] glass-panel border border-white/10 rounded-2xl overflow-hidden">
              {/* Chat log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, i) => (
                  <div 
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-violet-600 text-white rounded-tr-none'
                        : 'bg-slate-900/60 border border-white/5 text-slate-300 rounded-tl-none'
                    }`}>
                      {/* Very simple markdown formatter */}
                      <p className="whitespace-pre-wrap font-sans">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900/60 border border-white/5 text-slate-300 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Studora AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskDoubt} className="p-3 border-t border-white/10 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask a question (e.g. How does binary search work?)" 
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500/80 transition-all text-slate-200"
                />
                <Button type="submit" variant="primary" size="sm" className="px-4.5">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
            
            {/* Quick Prompts Panel */}
            <div className="space-y-4">
              <GlassCard className="border border-white/5">
                <h4 className="font-display font-bold text-xs text-slate-200 mb-3 uppercase tracking-wider">Suggested Doubts</h4>
                <div className="flex flex-col gap-2">
                  {[
                    "Explain React 19 State Hooks",
                    "How to calculate Big O time complexity?",
                    "Difference between SQL and NoSQL databases",
                    "What are TCP handshakes?"
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => setQuestion(prompt)}
                      className="text-left p-2.5 rounded-xl bg-slate-950/30 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-violet-300 text-xs transition-all cursor-pointer font-sans"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* LECTURE NOTES SUMMARIZER */}
        {activeTab === 'summarize' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="border border-white/5">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-3">Paste Study Notes / Textbook Text</h3>
              <form onSubmit={handleSummarize} className="space-y-4">
                <textarea
                  rows={14}
                  placeholder="Paste lecture transcription, study documents, or reading notes here to summarize..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="w-full p-3.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-all resize-none placeholder:text-slate-600 font-sans"
                ></textarea>
                <Button type="submit" variant="primary" className="w-full py-3" loading={loading}>
                  Summarize Content
                </Button>
              </form>
            </GlassCard>

            <GlassCard className="border border-white/5 flex flex-col h-full">
              <h3 className="font-display font-bold text-sm text-slate-200 border-b border-white/5 pb-2">AI Summary Result</h3>
              <div className="flex-1 py-4 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                {summaryResult ? (
                  summaryResult
                ) : (
                  <p className="text-slate-500 italic py-12 text-center">Summary notes will be displayed here once generated.</p>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ROADMAP ARCHITECT */}
        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="border border-white/5 h-fit">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-3">Target Career Path</h3>
              <form onSubmit={handleGenerateRoadmap} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Engineer, DevOps Analyst, Data Scientist"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                />
                <Button type="submit" variant="primary" className="w-full py-3 animate-pulse-glow" loading={loading}>
                  Build Career Roadmap
                </Button>
              </form>
            </GlassCard>

            <GlassCard className="border border-white/5 flex flex-col">
              <h3 className="font-display font-bold text-sm text-slate-200 border-b border-white/5 pb-2">Personalized Study Pathway</h3>
              <div className="flex-1 py-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {roadmapResult ? (
                  roadmapResult
                ) : (
                  <p className="text-slate-500 italic py-12 text-center">Roadmap stages and skill checksheets will load here.</p>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* INTERACTIVE MCQUIZ BUILDER */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* Input Controls */}
            <GlassCard className="border border-white/5 max-w-xl">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-3">Build Subject Practice Quiz</h3>
              <form onSubmit={handleGenerateQuiz} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter topic (e.g. Operating Systems, SQL, Javascript)" 
                  value={quizTopic}
                  onChange={e => setQuizTopic(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200"
                />
                <Button type="submit" variant="primary" size="sm" loading={loading}>
                  Generate Quiz
                </Button>
              </form>
            </GlassCard>

            {/* Questions layout */}
            {quizQuestions.length > 0 && (
              <div className="space-y-6 max-w-3xl">
                {quizQuestions.map((q, qIndex) => (
                  <GlassCard key={q.id} className="border border-white/5 flex flex-col gap-4">
                    <h4 className="font-display font-bold text-sm text-slate-200 flex gap-2">
                      <HelpCircle className="w-5 h-5 text-violet-400 shrink-0" />
                      <span>{qIndex + 1}. {q.question}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                      {q.options.map((option, oIndex) => {
                        const isSelected = selectedAnswers[qIndex] === oIndex;
                        const isCorrect = q.answerIndex === oIndex;
                        let optionStyle = "bg-slate-950/30 border-white/10 text-slate-300";
                        
                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = "bg-emerald-950/30 border-emerald-500 text-emerald-400 font-semibold";
                          } else if (isSelected) {
                            optionStyle = "bg-rose-950/30 border-rose-500 text-rose-400";
                          }
                        } else if (isSelected) {
                          optionStyle = "bg-violet-600/20 border-violet-500 text-white font-semibold";
                        }

                        return (
                          <button
                            key={oIndex}
                            type="button"
                            onClick={() => handleSelectAnswer(qIndex, oIndex)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex justify-between items-center ${optionStyle}`}
                          >
                            <span>{option}</span>
                            {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations shown on submit */}
                    {quizSubmitted && (
                      <div className="mt-2 pl-7 p-3 rounded-xl bg-violet-950/20 border border-violet-900/40 text-[11px] text-slate-300 leading-relaxed font-sans">
                        <span className="font-bold text-violet-300">Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </GlassCard>
                ))}

                {/* Score panel */}
                <div className="flex items-center gap-4 justify-between max-w-xl glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="text-xs">
                    {quizSubmitted ? (
                      <p className="font-bold text-slate-200">
                        Quiz Complete! Score: <span className="text-violet-400 font-extrabold text-base">{quizScore} / 5</span>
                      </p>
                    ) : (
                      <p className="text-slate-400">Ensure all questions are answered before submitting.</p>
                    )}
                  </div>
                  
                  {quizSubmitted ? (
                    <Button variant="outline" size="sm" onClick={() => {
                      setQuizQuestions([]);
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                    }}>
                      <RefreshCw className="w-4 h-4" /> Try Another
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                    >
                      Submit Answers
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI TOOLS HUB */}
        {activeTab === 'tools' && (
          <AIToolsHub />
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
