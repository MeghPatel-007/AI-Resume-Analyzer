import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    avatar: 'PS',
    rating: 5,
    text: 'ResumeAI helped me identify that my resume was missing key cloud keywords. After updating it, I got 3x more recruiter calls. The ATS score was spot-on.',
    score: 87,
  },
  {
    name: 'James Okafor',
    role: 'Full Stack Developer',
    avatar: 'JO',
    rating: 5,
    text: "I went from a 52 to 84 ATS score in two revisions. The action items were incredibly specific — not generic advice you find everywhere. Highly recommend.",
    score: 84,
  },
  {
    name: 'Sara Chen',
    role: 'Data Scientist @ Meta',
    avatar: 'SC',
    rating: 5,
    text: "The skill categorization showed me exactly which tools I was underselling. Added them and landed my dream job within 3 weeks of updating my resume.",
    score: 91,
  },
  {
    name: 'Marcus Rivera',
    role: 'DevOps Engineer',
    avatar: 'MR',
    rating: 4,
    text: 'Fast, accurate, and actually useful. Most resume tools just tell you to add more keywords. This one tells you which specific keywords ATS systems care about.',
    score: 79,
  },
  {
    name: 'Aisha Patel',
    role: 'Product Manager @ Stripe',
    avatar: 'AP',
    rating: 5,
    text: "Analyzed 4 versions of my resume and watched my score climb from 61 to 89. The history feature is perfect for tracking real progress over time.",
    score: 89,
  },
  {
    name: 'Tom Williams',
    role: 'Backend Engineer',
    avatar: 'TW',
    rating: 5,
    text: 'No fluff, no upsells, just a clean analysis and clear recommendations. This is what every job seeker needs before sending a single application.',
    score: 76,
  },
];

const TestimonialCard = ({ testimonial, index }) => {
  const { name, role, avatar, rating, text, score } = testimonial;
  const scoreColor = score >= 80 ? 'text-green-400' : score >= 65 ? 'text-blue-400' : 'text-amber-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="card p-6 hover:border-slate-600 transition-all duration-300 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <Quote className="w-8 h-8 text-blue-500/40" />
        <div className={`text-sm font-bold ${scoreColor}`}>ATS: {score}</div>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{text}"</p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm truncate">{name}</div>
          <div className="text-slate-400 text-xs truncate">{role}</div>
        </div>
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading mb-4"
          >
            Trusted by <span className="gradient-text">job seekers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subheading mx-auto"
          >
            Real results from real candidates who improved their ATS scores and landed interviews.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
