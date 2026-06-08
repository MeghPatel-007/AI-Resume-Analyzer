import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Brain, Shield, Zap, BarChart3, Code2, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const techStack = [
  { name: 'React', desc: 'Modern UI with hooks and context', color: 'text-cyan-400' },
  { name: 'Node.js + Express', desc: 'Fast, scalable REST API', color: 'text-green-400' },
  { name: 'MongoDB', desc: 'Flexible document database', color: 'text-emerald-400' },
  { name: 'pdf-parse', desc: 'Accurate PDF text extraction', color: 'text-orange-400' },
  { name: 'Framer Motion', desc: 'Smooth, professional animations', color: 'text-purple-400' },
  { name: 'Chart.js', desc: 'Interactive data visualizations', color: 'text-blue-400' },
];

const atsStats = [
  { value: '99%', label: 'of Fortune 500 use ATS' },
  { value: '75%', label: 'of resumes rejected by ATS' },
  { value: '6sec', label: 'average recruiter scan time' },
  { value: '40%', label: 'more interviews with optimized resume' },
];

const AboutPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-5">
              <Target className="w-3.5 h-3.5" />
              Our Mission
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Democratizing resume
              <br />
              <span className="gradient-text">optimization</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every qualified candidate deserves a fair shot. We built ResumeAI to give job seekers the same resume optimization tools used by professional career coaches — completely free.
            </p>
          </motion.div>

          {/* Why ATS matters */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
            id="ats"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Why ATS <span className="gradient-text">matters</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {atsStats.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="text-3xl font-black gradient-text mb-2">{value}</div>
                  <div className="text-slate-400 text-sm">{label}</div>
                </motion.div>
              ))}
            </div>
            <div className="card p-8">
              <p className="text-slate-300 leading-relaxed mb-4">
                Applicant Tracking Systems are the gatekeepers of modern hiring. Before a human ever reads your resume, it passes through software that scores it for relevance, keyword density, formatting, and structure.
              </p>
              <p className="text-slate-300 leading-relaxed">
                A resume that looks great to a human can still fail ATS screening due to missing keywords, poor formatting, or lack of structured sections. ResumeAI helps you fix these issues <em>before</em> submitting — giving you a measurable edge.
              </p>
            </div>
          </motion.section>

          {/* Technology */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Technology <span className="gradient-text">stack</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {techStack.map(({ name, desc, color }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card-hover p-5"
                >
                  <Code2 className={`w-5 h-5 ${color} mb-3`} />
                  <h3 className="font-semibold text-white mb-1">{name}</h3>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Product Vision */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-10 text-center mb-12"
          >
            <Brain className="w-12 h-12 text-blue-400 mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-white mb-4">Product Vision</h2>
            <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
              Our goal is to become the most trusted resume intelligence platform for engineers, designers, and product managers worldwide. We're building toward real-time job description matching, industry-specific scoring, and AI-powered resume rewriting suggestions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Job Description Matching', 'AI Rewriting', 'Industry Scoring', 'Team Plans', 'API Access'].map(feature => (
                <span key={feature} className="badge badge-blue">{feature}</span>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <div className="text-center">
            <Link to="/analyze" className="btn-primary text-base py-3.5 px-10 group">
              Try ResumeAI Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
