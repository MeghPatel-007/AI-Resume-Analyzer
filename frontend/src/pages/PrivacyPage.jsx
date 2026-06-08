import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const sections = [
  {
    title: 'Information We Collect',
    content: 'When you upload a resume, we extract and store the text content (name, email, phone, experience, skills, etc.) along with analysis results. We do not store the original PDF file — it is deleted immediately after text extraction.',
  },
  {
    title: 'How We Use Your Data',
    content: 'The extracted resume data is used solely to generate your analysis report. We may use anonymized, aggregated statistics (e.g., average ATS score across all users) to improve our scoring algorithms. We never sell or share individual resume data.',
  },
  {
    title: 'Data Retention',
    content: 'Analysis results are retained for 90 days from the date of upload, keyed to your anonymous session ID. You can delete individual analyses at any time from the History page.',
  },
  {
    title: 'Cookies & Local Storage',
    content: 'We use browser localStorage to store your session ID, which links your uploads to your history. No tracking cookies, advertising cookies, or third-party analytics are used.',
  },
  {
    title: 'File Security',
    content: 'PDF files are transmitted over HTTPS and deleted from our servers immediately after parsing. We never share, sell, or store raw resume files.',
  },
  {
    title: 'Your Rights',
    content: 'You can delete your analysis history at any time from the History page. If you want all data associated with your session ID deleted, contact us with your session ID.',
  },
  {
    title: 'Contact',
    content: 'If you have questions about this privacy policy, contact us at privacy@resumeai.dev.',
  },
];

const PrivacyPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-slate-300">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-8 space-y-8"
          >
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-200 text-sm leading-relaxed">
                <strong>TL;DR:</strong> We don't store your PDF. We don't sell your data. Your session is anonymous. You can delete your data anytime.
              </p>
            </div>

            {sections.map(({ title, content }, i) => (
              <div key={i}>
                <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed">{content}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPage;
