import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Zap } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-slate-950 to-purple-950/60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Free, instant, no sign-up
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to beat the ATS and
            <br />
            <span className="gradient-text">land more interviews?</span>
          </h2>

          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of job seekers who improved their resume scores and got more callbacks. Analyze your resume in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/analyze" className="btn-primary text-base py-4 px-10 group shadow-lg shadow-blue-500/20">
              <Upload className="w-5 h-5" />
              Upload Resume Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/services" className="btn-outline text-base py-4 px-10">
              View All Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
