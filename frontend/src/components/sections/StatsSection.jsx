import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Zap } from 'lucide-react';

const stats = [
  { icon: Users, value: '12,400+', label: 'Resumes Analyzed', color: 'text-blue-400' },
  { icon: TrendingUp, value: '68%', label: 'Average ATS Score Increase', color: 'text-green-400' },
  { icon: Award, value: '94%', label: 'User Satisfaction Rate', color: 'text-amber-400' },
  { icon: Zap, value: '<10s', label: 'Average Analysis Time', color: 'text-purple-400' },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-slate-900 to-purple-950/40" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
              <div className={`text-3xl md:text-4xl font-bold ${color} mb-1`}>{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
