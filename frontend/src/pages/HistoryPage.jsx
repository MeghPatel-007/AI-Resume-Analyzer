import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, FileText, ChevronRight, Trash2, BarChart3, RefreshCw
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { HistorySkeleton } from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import { useResume } from '../context/ResumeContext';
import { getGradeColor, getScoreColor, formatDate, formatBytes } from '../utils/helpers';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const { history, historyLoading, historyTotal, fetchHistory, deleteResume } = useResume();

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete analysis for "${name}"?`)) return;
    try {
      await deleteResume(id);
      toast.success('Analysis deleted.');
    } catch {
      toast.error('Failed to delete analysis.');
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Upload History
                </h1>
                <p className="text-slate-400 text-sm">
                  {historyTotal > 0 ? `${historyTotal} resume${historyTotal !== 1 ? 's' : ''} analyzed` : 'No resumes analyzed yet'}
                </p>
              </div>
              <button
                onClick={() => fetchHistory(1)}
                className="btn-ghost py-2 px-3 text-sm"
                aria-label="Refresh history"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Content */}
          {historyLoading ? (
            <HistorySkeleton />
          ) : history.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No analyses yet"
              description="Upload and analyze a resume to see your history here."
              actionLabel="Analyze a Resume"
              actionTo="/analyze"
            />
          ) : (
            <div className="space-y-3">
              {history.map((resume, i) => {
                const gradeColors = getGradeColor(resume.grade);
                const scoreColors = getScoreColor(resume.atsScore);

                return (
                  <motion.div
                    key={resume._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card p-5 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* File icon */}
                      <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">
                          {resume.personalInfo?.name || resume.originalFilename}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span>{resume.originalFilename}</span>
                          <span>·</span>
                          <span>{formatDate(resume.createdAt)}</span>
                          {resume.fileSize && (
                            <>
                              <span>·</span>
                              <span>{formatBytes(resume.fileSize)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="hidden sm:flex items-center gap-4 shrink-0">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${scoreColors.text}`}>{resume.atsScore}</div>
                          <div className="text-slate-500 text-xs">ATS</div>
                        </div>
                        <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm ${gradeColors.bg} ${gradeColors.text} ${gradeColors.border}`}>
                          {resume.grade}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/report/${resume._id}`}
                          className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          aria-label="View report"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(resume._id, resume.originalFilename)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/report/${resume._id}`}
                          className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          {history.length > 0 && (
            <div className="mt-8 text-center">
              <Link to="/analyze" className="btn-primary py-3 px-8">
                <FileText className="w-4 h-4" />
                Analyze Another Resume
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default HistoryPage;
