import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import ResumeUploader from '../components/ui/ResumeUploader';
import { CheckCircle2, Zap, Shield, BarChart3 } from 'lucide-react';
import { useEffect } from 'react';

const highlights = [
  { icon: Zap, text: 'Analysis in under 10 seconds' },
  { icon: Shield, text: 'File deleted after processing' },
  { icon: BarChart3, text: 'Detailed skill breakdown' },
  { icon: CheckCircle2, text: 'Actionable improvement tips' },
];

const AnalyzePage = () => {

  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-5">
              <Zap className="w-3.5 h-3.5" />
              Instant ATS Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI Resume Analyzer
            </h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              Upload your PDF resume and get your ATS score, grade, skill map, and actionable recommendations in seconds.
            </p>
          </motion.div>

          {/* Uploader */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10"
          >
            <ResumeUploader />
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-400 text-xs">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AnalyzePage;
