import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Sparkles, Shield, BarChart3, CheckCircle2, Star, Brain, FileText, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-slate-950 min-h-screen pt-16 relative overflow-hidden isolate">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-600/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 font-medium">AI Resume Analysis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Your Resume,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400">
                AI-Optimized
              </span>
              <br />
              in Seconds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Drop your PDF and get an instant ATS score, skill breakdown, letter grade, and a personalized action plan - no sign-up, no cost.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-10 justify-center lg:justify-start"
            >
              <Link
                to="/analyze"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 active:scale-[0.98]"
              >
                <Upload className="w-5 h-5" />
                AI Resume Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 text-slate-300 hover:text-white font-medium rounded-2xl border border-slate-700 hover:border-slate-500 transition-all duration-200"
              >
                <Brain className="w-5 h-5" />
                How It Works
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['PS', 'JO', 'SC', 'MR', 'AP'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-slate-400 text-sm">
                <span className="text-white font-semibold">4.9</span> from{' '}
                <span className="text-white font-semibold">2,400+</span> users
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden md:block relative max-w-xl mx-auto lg:max-w-none"
          >
            <div className="relative">
              <div className="relative z-10 p-8 rounded-3xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700/50">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Resume Analysis</div>
                    <div className="text-slate-400 text-xs">Completed in 8.2s</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-300 text-xs font-medium">Analyzed</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-700/40 border border-slate-600/40">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-400 text-xs">ATS Score</span>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-white">86</span>
                      <span className="text-slate-400 text-sm mb-1">/100</span>
                    </div>
                    <div className="mt-2 w-full h-1.5 rounded-full bg-slate-600 overflow-hidden">
                      <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-700/40 border border-slate-600/40">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-400 text-xs">Grade</span>
                    </div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">A</div>
                    <div className="mt-1 text-slate-400 text-xs">Excellent</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm font-medium">Detected Skills</span>
                    <span className="text-slate-400 text-xs">14 total</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Python', 'Node.js', 'Docker', 'MongoDB', 'AWS'].map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                      +7 more
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 z-20 p-4 rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">Improvement</div>
                    <div className="text-green-400 text-xs font-medium">+32% ATS gain</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 z-20 p-4 rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/60 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">AI Powered</div>
                    <div className="text-slate-400 text-xs">Real-time analysis</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
