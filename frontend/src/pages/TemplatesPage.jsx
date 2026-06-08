import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Star, ArrowRight, Lock } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const templates = [
  {
    name: 'Software Engineer',
    description: 'ATS-optimized template for frontend, backend, and full-stack developers.',
    score: 92,
    grade: 'A+',
    tags: ['React', 'Node.js', 'REST API'],
    free: true,
  },
  {
    name: 'Data Scientist',
    description: 'Designed for ML engineers and data analysts with Python-heavy skill sets.',
    score: 89,
    grade: 'A',
    tags: ['Python', 'TensorFlow', 'SQL'],
    free: true,
  },
  {
    name: 'DevOps Engineer',
    description: 'Cloud-focused template emphasizing infrastructure and automation skills.',
    score: 88,
    grade: 'A',
    tags: ['Docker', 'Kubernetes', 'AWS'],
    free: true,
  },
  {
    name: 'Product Manager',
    description: 'Highlights strategic thinking, roadmapping, and cross-functional leadership.',
    score: 87,
    grade: 'A',
    tags: ['Strategy', 'Roadmap', 'Agile'],
    free: false,
  },
  {
    name: 'UX/UI Designer',
    description: 'Portfolio-forward template that balances creative and technical keywords.',
    score: 85,
    grade: 'A',
    tags: ['Figma', 'Sketch', 'Prototyping'],
    free: false,
  },
  {
    name: 'Recent Graduate',
    description: 'Built for new grads with minimal experience — emphasizes projects and skills.',
    score: 83,
    grade: 'A-',
    tags: ['Projects', 'Internships', 'GPA'],
    free: true,
  },
];

const TemplatesPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-5">
              <Star className="w-3.5 h-3.5" />
              ATS-Optimized Templates
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Resume <span className="gradient-text">Templates</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Pre-built, ATS-tested resume templates for popular tech roles. Each template is structured to score 80+ on our analyzer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((template, i) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover p-6 flex flex-col"
              >
                {/* Preview mockup */}
                <div className="w-full h-40 rounded-xl bg-slate-700/40 border border-slate-700 flex items-center justify-center mb-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-30" />
                  <FileText className="w-10 h-10 text-slate-500" />
                  {!template.free && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="badge badge-green text-xs">ATS {template.score}</span>
                    <span className="badge badge-blue text-xs">Grade {template.grade}</span>
                  </div>
                </div>

                <h3 className="font-bold text-white mb-2">{template.name}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1">{template.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {template.tags.map(tag => (
                    <span key={tag} className="badge badge-slate text-xs">{tag}</span>
                  ))}
                </div>

                <div className="flex gap-2">
                  {template.free ? (
                    <button className="btn-primary flex-1 py-2.5 text-sm">
                      Use Template
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="btn-secondary flex-1 py-2.5 text-sm" disabled>
                      <Lock className="w-4 h-4" />
                      Coming Soon
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 card p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-3">Already have a resume?</h2>
            <p className="text-slate-300 mb-6">Upload it directly to check your current ATS score and get personalized recommendations.</p>
            <Link to="/analyze" className="btn-primary py-3 px-8">
              Analyze My Resume
            </Link>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TemplatesPage;
