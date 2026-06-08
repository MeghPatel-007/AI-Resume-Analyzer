import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileSearch, Brain, Code2, Lightbulb, TrendingUp, Shield,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const services = [
  {
    icon: FileSearch,
    title: 'ATS Analysis',
    description: 'Comprehensive compatibility check against real ATS systems. We evaluate your resume across 5 scoring dimensions and give you a numeric score from 0–100.',
    features: ['5-dimension scoring', 'Keyword density check', 'Formatting evaluation', 'Real-time results'],
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    cta: 'Analyze Now',
    to: '/analyze',
    badge: 'Core',
  },
  {
    icon: Brain,
    title: 'Resume Parsing',
    description: 'Intelligent extraction of all resume content including contact info, work history, education, projects, and certifications from any PDF resume.',
    features: ['Contact info extraction', 'Work history parsing', 'Education detection', 'Project identification'],
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    cta: 'Try It Free',
    to: '/analyze',
    badge: 'Included',
  },
  {
    icon: Code2,
    title: 'Skill Detection',
    description: 'Automatically detects and categorizes technical skills into 4 categories: programming languages, frameworks, databases, and dev tools.',
    features: ['Language detection', 'Framework mapping', 'Database skills', 'Tools & DevOps'],
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    cta: 'Try It Free',
    to: '/analyze',
    badge: 'Included',
  },
  {
    icon: Lightbulb,
    title: 'Resume Recommendations',
    description: 'Personalized, specific action items to improve your ATS score. Not generic advice — targeted recommendations based on what your resume is actually missing.',
    features: ['Strengths analysis', 'Weakness identification', 'Missing sections', 'Priority action list'],
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    cta: 'Get Recommendations',
    to: '/analyze',
    badge: 'Included',
  },
  {
    icon: TrendingUp,
    title: 'Career Readiness',
    description: 'A holistic readiness score that evaluates your resume\'s overall career positioning — beyond just ATS compatibility.',
    features: ['Readiness score 0–100', 'Experience indicators', 'Portfolio assessment', 'Career progression'],
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    cta: 'Check Readiness',
    to: '/analyze',
    badge: 'Included',
  },
  {
    icon: Shield,
    title: 'Grade System',
    description: 'Clear A–F letter grade based on your overall ATS score. Gives you an at-a-glance understanding of where your resume stands.',
    features: ['A+ through F grading', 'Score-to-grade mapping', 'Color-coded results', 'Historical tracking'],
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    cta: 'Get Your Grade',
    to: '/analyze',
    badge: 'Included',
  },
];

const ServiceCard = ({ service, index }) => {
  const { icon: Icon, title, description, features, color, bg, border, cta, to, badge } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="card p-7 flex flex-col hover:border-slate-600 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-2xl ${bg} border ${border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className={`badge badge-blue text-xs`}>{badge}</span>
      </div>

      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-5 flex-1">{description}</p>

      <ul className="space-y-2 mb-6">
        {features.map(feature => (
          <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Link to={to} className={`btn-outline text-sm py-2.5 mt-auto group/btn`}>
        {cta}
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

const ServicesPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-5">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything included free. No subscriptions, no paywalls, no upsells — just powerful resume analysis tools.
            </p>
          </motion.div>

          {/* Service grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-10 text-center bg-gradient-to-br from-blue-950/50 to-purple-950/50"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              All services included — completely free
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              No credit card required. Upload your resume and get your full analysis report in seconds.
            </p>
            <Link to="/analyze" className="btn-primary text-base py-3.5 px-10 group">
              Start Free Analysis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
