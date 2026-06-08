import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Linkedin, Github,
  Briefcase, GraduationCap, Code2, FolderOpen, Award,
  CheckCircle2, XCircle, AlertTriangle, Lightbulb,
  BarChart3, Layers, RefreshCw, Clock,
  ChevronRight
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ScoreRing from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';
import { ReportSkeleton } from '../components/ui/SkeletonLoader';
import Badge from '../components/ui/Badge';
import { SkillsDoughnutChart, ScoringRadarChart, ScoringBarChart } from '../components/charts/SkillsChart';
import { useResume } from '../context/ResumeContext';
import { getGradeColor, getScoreColor, getScoreDescription, formatDate, getTotalSkills } from '../utils/helpers';

// Skill tag pill
const SkillTag = ({ label, color = 'blue' }) => (
  <span className={`badge badge-${color} text-xs`}>{label}</span>
);

// Section wrapper
const ReportSection = ({ title, icon: Icon, children, id }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-6"
    id={id}
  >
    <div className="flex items-center gap-2 mb-5">
      <Icon className="w-5 h-5 text-blue-400" />
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const ReportPage = () => {
  const { id } = useParams();
  const { fetchResume, currentResume } = useResume();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchResume(id)
      .then(() => setLoading(false))
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, fetchResume]);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <ReportSkeleton />
        </div>
      </PageLayout>
    );
  }

  if (error || !currentResume) {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <div className="card p-12">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
            <p className="text-slate-300 mb-6">{error || 'This report does not exist or has been deleted.'}</p>
            <Link to="/analyze" className="btn-primary">
              Analyze a Resume
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const resume = currentResume;
  const gradeColors = getGradeColor(resume.grade);
  const scoreColors = getScoreColor(resume.atsScore);
  const totalSkills = getTotalSkills(resume.skills);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen pt-20 pb-16 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between py-6">
            <Link
              to="/history"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-xs">
                {formatDate(resume.createdAt)}
              </span>
              <Link to="/analyze" className="btn-secondary text-sm py-2 px-4">
                <RefreshCw className="w-3.5 h-3.5" />
                New Analysis
              </Link>
            </div>
          </div>

          {/* Score Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* ATS Score Ring */}
              <ScoreRing
                score={resume.atsScore}
                size={150}
                label="ATS"
                sublabel="/100"
                color={scoreColors.hex}
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white truncate">
                    {resume.personalInfo?.name || resume.originalFilename}
                  </h1>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border-2 font-black text-xl ${gradeColors.bg} ${gradeColors.text} ${gradeColors.border}`}>
                    {resume.grade}
                  </div>
                </div>

                <p className={`text-sm font-medium ${scoreColors.text} mb-4`}>
                  {getScoreDescription(resume.atsScore)}
                </p>

                {/* Contact row */}
                <div className="flex flex-wrap gap-3 mb-5 text-sm text-slate-400">
                  {resume.personalInfo?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {resume.personalInfo.email}
                    </span>
                  )}
                  {resume.personalInfo?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {resume.personalInfo.phone}
                    </span>
                  )}
                  {resume.personalInfo?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {resume.personalInfo.location}
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{resume.readinessScore}</div>
                    <div className="text-slate-400 text-xs">Readiness</div>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{totalSkills}</div>
                    <div className="text-slate-400 text-xs">Skills</div>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{resume.experience?.length || 0}</div>
                    <div className="text-slate-400 text-xs">Roles</div>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{resume.detectedSections?.length || 0}</div>
                    <div className="text-slate-400 text-xs">Sections</div>
                  </div>
                </div>
              </div>

              {/* Readiness ring */}
              <ScoreRing
                score={resume.readinessScore}
                size={120}
                label="Ready"
                color="#8b5cf6"
              />
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-6 overflow-x-auto scrollbar-hide">
            {tabs.map(({ id: tabId, label, icon: Icon }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  activeTab === tabId
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-5">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* Scoring breakdown */}
                <ReportSection title="Scoring Breakdown" icon={BarChart3}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {resume.scoringBreakdown && Object.entries(resume.scoringBreakdown).map(([key, item]) => (
                        <ProgressBar
                          key={key}
                          value={item.score}
                          max={item.max}
                          label={item.label}
                          color={
                            item.score / item.max >= 0.8 ? 'green' :
                            item.score / item.max >= 0.6 ? 'blue' :
                            item.score / item.max >= 0.4 ? 'amber' : 'red'
                          }
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-4 text-center">Scoring Radar</p>
                      <ScoringRadarChart breakdown={resume.scoringBreakdown} />
                    </div>
                  </div>
                </ReportSection>

                {/* Personal Info */}
                <ReportSection title="Contact Information" icon={User}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: User, label: 'Name', value: resume.personalInfo?.name },
                      { icon: Mail, label: 'Email', value: resume.personalInfo?.email },
                      { icon: Phone, label: 'Phone', value: resume.personalInfo?.phone },
                      { icon: MapPin, label: 'Location', value: resume.personalInfo?.location },
                      { icon: Linkedin, label: 'LinkedIn', value: resume.personalInfo?.linkedin },
                      { icon: Github, label: 'GitHub', value: resume.personalInfo?.github },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className={`flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 ${!value ? 'opacity-40' : ''}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${value ? 'text-blue-400' : 'text-slate-500'}`} />
                        <div>
                          <div className="text-slate-400 text-xs">{label}</div>
                          <div className="text-slate-200 text-sm font-medium truncate">
                            {value || <span className="text-slate-500 italic">Not found</span>}
                          </div>
                        </div>
                        {value && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />}
                      </div>
                    ))}
                  </div>
                </ReportSection>

                {/* Detected sections */}
                <ReportSection title="Detected Resume Sections" icon={Layers}>
                  <div className="flex flex-wrap gap-2">
                    {resume.detectedSections?.map(section => (
                      <span key={section} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </span>
                    ))}
                    {(!resume.detectedSections || resume.detectedSections.length === 0) && (
                      <p className="text-slate-400 text-sm">No sections detected.</p>
                    )}
                  </div>
                </ReportSection>
              </>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <>
                <ReportSection title="Skill Distribution" icon={Code2}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <SkillsDoughnutChart skills={resume.skills} />
                    <div className="space-y-5">
                      {[
                        { key: 'languages', label: 'Languages', color: 'blue' },
                        { key: 'frameworks', label: 'Frameworks', color: 'purple' },
                        { key: 'databases', label: 'Databases', color: 'green' },
                        { key: 'tools', label: 'Tools & DevOps', color: 'amber' },
                      ].map(({ key, label, color }) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-300 text-sm font-medium">{label}</span>
                            <span className="text-slate-400 text-xs">{resume.skills?.[key]?.length || 0} detected</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {resume.skills?.[key]?.length > 0 ? (
                              resume.skills[key].map(skill => (
                                <SkillTag key={skill} label={skill} color={color} />
                              ))
                            ) : (
                              <span className="text-slate-500 text-xs italic">None detected</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ReportSection>

                <ReportSection title="Score by Category" icon={BarChart3}>
                  <ScoringBarChart breakdown={resume.scoringBreakdown} />
                </ReportSection>
              </>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <>
                {/* Summary */}
                {resume.summary && (
                  <ReportSection title="Professional Summary" icon={User}>
                    <p className="text-slate-300 text-sm leading-relaxed">{resume.summary}</p>
                  </ReportSection>
                )}

                {/* Experience */}
                <ReportSection title="Work Experience" icon={Briefcase}>
                  {resume.experience?.length > 0 ? (
                    <div className="space-y-5">
                      {resume.experience.map((exp, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-700/30 border border-slate-700/50">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="font-semibold text-white text-sm">{exp.title}</h3>
                              {exp.company && (
                                <p className="text-blue-400 text-xs mt-0.5">{exp.company}</p>
                              )}
                            </div>
                            {(exp.startDate || exp.endDate) && (
                              <span className="badge badge-blue shrink-0 text-xs">
                                {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}
                              </span>
                            )}
                          </div>
                          {exp.bullets?.length > 0 && (
                            <ul className="space-y-1 mt-3">
                              {exp.bullets.map((b, j) => (
                                <li key={j} className="flex items-start gap-2 text-slate-400 text-xs">
                                  <ChevronRight className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No work experience detected.</p>
                  )}
                </ReportSection>

                {/* Education */}
                <ReportSection title="Education" icon={GraduationCap}>
                  {resume.education?.length > 0 ? (
                    <div className="space-y-4">
                      {resume.education.map((edu, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-700/30 border border-slate-700/50">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-white text-sm">{edu.institution}</h3>
                              {edu.degree && <p className="text-slate-400 text-xs mt-0.5">{edu.degree}</p>}
                              {edu.gpa && <p className="text-slate-400 text-xs">GPA: {edu.gpa}</p>}
                            </div>
                            {(edu.startDate || edu.endDate) && (
                              <span className="badge badge-purple shrink-0 text-xs">
                                {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No education section detected.</p>
                  )}
                </ReportSection>

                {/* Projects */}
                {resume.projects?.length > 0 && (
                  <ReportSection title="Projects" icon={FolderOpen}>
                    <div className="space-y-4">
                      {resume.projects.map((proj, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-700/30 border border-slate-700/50">
                          <h3 className="font-semibold text-white text-sm mb-1">{proj.name}</h3>
                          {proj.description && (
                            <p className="text-slate-400 text-xs mb-2">{proj.description}</p>
                          )}
                          {proj.technologies?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {proj.technologies.map(t => (
                                <SkillTag key={t} label={t} color="slate" />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ReportSection>
                )}

                {/* Certifications */}
                {resume.certifications?.length > 0 && (
                  <ReportSection title="Certifications" icon={Award}>
                    <div className="flex flex-wrap gap-2">
                      {resume.certifications.map((cert, i) => (
                        <span key={i} className="badge badge-amber">{cert}</span>
                      ))}
                    </div>
                  </ReportSection>
                )}
              </>
            )}

            {/* RECOMMENDATIONS TAB */}
            {activeTab === 'recommendations' && (
              <>
                {/* Strengths */}
                <ReportSection title="Strengths" icon={CheckCircle2}>
                  {resume.recommendations?.strengths?.length > 0 ? (
                    <div className="space-y-2">
                      {resume.recommendations.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                          <p className="text-slate-300 text-sm">{s}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No major strengths detected yet.</p>
                  )}
                </ReportSection>

                {/* Weaknesses */}
                <ReportSection title="Weaknesses" icon={AlertTriangle}>
                  {resume.recommendations?.weaknesses?.length > 0 ? (
                    <div className="space-y-2">
                      {resume.recommendations.weaknesses.map((w, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          <p className="text-slate-300 text-sm">{w}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic text-green-400">No major weaknesses found!</p>
                  )}
                </ReportSection>

                {/* Missing sections */}
                {resume.recommendations?.missingSections?.length > 0 && (
                  <ReportSection title="Missing Sections" icon={XCircle}>
                    <div className="flex flex-wrap gap-2">
                      {resume.recommendations.missingSections.map((s, i) => (
                        <span key={i} className="badge badge-red">{s}</span>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs mt-3">
                      Adding these sections could significantly improve your ATS score.
                    </p>
                  </ReportSection>
                )}

                {/* Action items */}
                <ReportSection title="Action Plan" icon={Lightbulb}>
                  {resume.recommendations?.actionItems?.length > 0 ? (
                    <div className="space-y-2">
                      {resume.recommendations.actionItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/8 border border-blue-500/20">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-blue-400 text-xs font-bold">{i + 1}</span>
                          </div>
                          <p className="text-slate-300 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No action items. Great resume!</p>
                  )}
                </ReportSection>
              </>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/analyze" className="btn-primary flex-1 py-3.5">
              <RefreshCw className="w-4 h-4" />
              Analyze Another Resume
            </Link>
            <Link to="/history" className="btn-secondary flex-1 py-3.5">
              <Clock className="w-4 h-4" />
              View History
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReportPage;
