import { motion } from 'framer-motion';
import { Upload, Cpu, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Drag and drop your PDF resume or click to browse. Supports files up to 5MB. No sign-up required.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI Parses & Analyzes',
    description: 'Our engine extracts your personal info, skills, experience, and education, then scores each dimension.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Get Your Report',
    description: 'Receive your ATS score, letter grade, skill breakdown charts, strengths, weaknesses, and action items.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-slate-900/50 relative" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading mb-4"
          >
            How it <span className="gradient-text">works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subheading mx-auto"
          >
            Three simple steps to a better resume. No account, no credit card, no waiting.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-green-500/40" />

          {steps.map(({ step, icon: Icon, title, description, color, bg, border }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className={`card p-8 hover:border-slate-600 transition-all duration-300`}>
                {/* Step number */}
                <div className="text-6xl font-black text-slate-800 absolute -top-4 -right-2 select-none">
                  {step}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${bg} border ${border} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
