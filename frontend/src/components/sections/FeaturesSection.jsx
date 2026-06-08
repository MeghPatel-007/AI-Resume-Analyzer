import { motion } from 'framer-motion';
import {
  FileSearch, Brain, BarChart3, Target, Layers, Zap, Clock, Lock
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'Deep Resume Parsing',
    description: 'Extracts name, contact info, education, work experience, projects, and certifications from your PDF automatically.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Brain,
    title: 'Intelligent ATS Scoring',
    description: 'Analyzes your resume against 5 key ATS dimensions: structure, keywords, formatting, skill coverage, and experience.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: BarChart3,
    title: 'Skill Categorization',
    description: 'Automatically maps your skills into programming languages, frameworks, databases, and tools with visual breakdowns.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Target,
    title: 'Letter Grade System',
    description: 'Receive a clear A–F grade based on your overall ATS compatibility, just like a professional resume evaluation.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: Layers,
    title: 'Actionable Recommendations',
    description: 'Get specific, prioritized action items: what to add, what to fix, and what keywords to include for your target role.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Full resume analysis completed in under 10 seconds. No sign-up required, no waiting in queues.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: Clock,
    title: 'Upload History',
    description: 'Track your resume improvement over time. Compare scores across multiple versions automatically saved per session.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your resume is processed securely and the file is deleted immediately after analysis. We never store raw PDFs.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
];

const FeatureCard = ({ feature, index }) => {
  const { icon: Icon, title, description, color, bg, border } = feature;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="card-hover p-6 group"
    >
      <div className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="font-semibold text-white mb-2 text-base">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-950 relative" id="features">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Everything you need
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Features built for <span className="gradient-text">job seekers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subheading mx-auto"
          >
            Professional-grade resume analysis tools, free to use. No account needed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
