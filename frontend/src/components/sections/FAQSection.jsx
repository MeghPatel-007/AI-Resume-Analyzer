import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is an ATS score and why does it matter?',
    a: 'An ATS (Applicant Tracking System) score measures how well your resume is optimized for automated screening software used by 99% of Fortune 500 companies. A low ATS score means your resume may never be seen by a human recruiter, even if you\'re highly qualified.',
  },
  {
    q: 'Is my resume stored on your servers?',
    a: 'No. Your uploaded PDF is processed in memory and permanently deleted immediately after analysis completes. We store only the extracted text and analysis results, never the original file.',
  },
  {
    q: 'What file formats are supported?',
    a: 'Currently only PDF format is supported. PDF is recommended for resume submission as it preserves formatting. The maximum file size is 5MB.',
  },
  {
    q: 'How accurate is the ATS scoring?',
    a: 'Our scoring engine evaluates 5 key dimensions: structure, keyword quality, formatting, skill coverage, and experience indicators. This covers the primary factors real ATS systems use. While no tool can perfectly replicate every ATS, our scoring closely correlates with real-world outcomes.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required. Your session is tracked anonymously using a local session ID stored in your browser, which allows you to view your upload history within a session.',
  },
  {
    q: 'How many times can I upload a resume?',
    a: 'You can upload up to 10 resumes per 15-minute window. This is to prevent abuse while still allowing you to test multiple versions of your resume.',
  },
  {
    q: 'What makes a resume get an A grade?',
    a: 'An A-grade resume (score 87+) has all key sections present, strong keyword density, measurable achievements with action verbs, complete contact information, and diverse technical skills across languages, frameworks, databases, and tools.',
  },
  {
    q: 'Can I use this for non-tech resumes?',
    a: 'Yes, the structure and formatting analysis works for any resume. The skill detection is currently optimized for software/tech roles, so non-technical resumes will have lower skill coverage scores but still receive accurate structural feedback.',
  },
];

const FAQItem = ({ q, a, isOpen, onToggle }) => (
  <div className="border-b border-slate-800 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left group"
      aria-expanded={isOpen}
    >
      <span className="font-medium text-slate-200 group-hover:text-white transition-colors pr-8 text-sm md:text-base">
        {q}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="text-slate-300 text-sm leading-relaxed pb-5">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-900/40 relative" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading mb-4"
          >
            Frequently asked <span className="gradient-text">questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subheading mx-auto"
          >
            Everything you need to know about ResumeAI.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="card p-2"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
