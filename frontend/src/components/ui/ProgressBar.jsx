import { motion } from 'framer-motion';

const ProgressBar = ({
  value = 0,
  max = 100,
  label = '',
  sublabel = '',
  color = 'blue',
  showValue = true,
  height = 8,
  animate = true,
  className = '',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colorMap = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-green-500 to-green-400',
    amber: 'from-amber-500 to-amber-400',
    red: 'from-red-500 to-red-400',
    purple: 'from-purple-500 to-purple-400',
    cyan: 'from-cyan-500 to-cyan-400',
  };

  const gradient = colorMap[color] || colorMap.blue;

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          <div>
            {label && (
              <span className="text-sm font-medium text-slate-200">{label}</span>
            )}
            {sublabel && (
              <span className="text-xs text-slate-400 ml-2">{sublabel}</span>
            )}
          </div>
          {showValue && (
            <span className="text-sm font-semibold text-slate-300">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className="w-full bg-slate-700/50 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animate ? 1 : 0, ease: 'easeOut', delay: 0.2 }}
          style={{
            boxShadow: `0 0 8px ${
              color === 'green' ? 'rgba(34, 197, 94, 0.3)' :
              color === 'amber' ? 'rgba(245, 158, 11, 0.3)' :
              color === 'red' ? 'rgba(239, 68, 68, 0.3)' :
              color === 'purple' ? 'rgba(139, 92, 246, 0.3)' :
              'rgba(59, 130, 246, 0.3)'
            }`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
