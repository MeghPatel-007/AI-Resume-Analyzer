/**
 * Format bytes to human-readable string
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Get color class based on ATS score
 */
export const getScoreColor = (score) => {
  if (score >= 80) return { text: 'text-green-400', bg: 'bg-green-500', hex: '#22c55e' };
  if (score >= 65) return { text: 'text-blue-400', bg: 'bg-blue-500', hex: '#3b82f6' };
  if (score >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500', hex: '#f59e0b' };
  return { text: 'text-red-400', bg: 'bg-red-500', hex: '#ef4444' };
};

/**
 * Get color for letter grade
 */
export const getGradeColor = (grade) => {
  if (!grade) return { text: 'text-slate-400', bg: 'bg-slate-600', hex: '#64748b' };
  if (grade.startsWith('A')) return { text: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', hex: '#22c55e' };
  if (grade.startsWith('B')) return { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50', hex: '#3b82f6' };
  if (grade.startsWith('C')) return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50', hex: '#f59e0b' };
  return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', hex: '#ef4444' };
};

/**
 * Get status label and color
 */
export const getStatusInfo = (status) => {
  const map = {
    uploaded: { label: 'Uploaded', color: 'badge-blue' },
    parsing: { label: 'Parsing', color: 'badge-amber' },
    analyzing: { label: 'Analyzing', color: 'badge-amber' },
    completed: { label: 'Completed', color: 'badge-green' },
    failed: { label: 'Failed', color: 'badge-red' },
  };
  return map[status] || { label: status, color: 'badge-blue' };
};

/**
 * Format date string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

/**
 * Truncate string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

/**
 * Get score description
 */
export const getScoreDescription = (score) => {
  if (score >= 85) return 'Excellent — highly ATS compatible';
  if (score >= 70) return 'Good — likely to pass ATS screening';
  if (score >= 55) return 'Fair — needs some improvements';
  if (score >= 40) return 'Poor — significant gaps detected';
  return 'Critical — major revision needed';
};

/**
 * Get session ID from localStorage
 */
export const getSessionId = () => {
  let id = localStorage.getItem('ra_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('ra_session_id', id);
  }
  return id;
};

/**
 * Calculate total skill count
 */
export const getTotalSkills = (skills) => {
  if (!skills) return 0;
  return (
    (skills.languages?.length || 0) +
    (skills.frameworks?.length || 0) +
    (skills.databases?.length || 0) +
    (skills.tools?.length || 0) +
    (skills.other?.length || 0)
  );
};

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
