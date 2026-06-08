import { motion } from 'framer-motion';

const ScoreRing = ({
  score = 0,
  size = 160,
  strokeWidth = 12,
  label = 'Score',
  sublabel = '',
  color = '#3b82f6',
  animate = true,
  className = '',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={animate ? { strokeDashoffset: offset } : { strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-bold text-white"
          style={{ fontSize: size * 0.18 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span
          className="text-slate-400 font-medium"
          style={{ fontSize: size * 0.09 }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className="text-slate-400"
            style={{ fontSize: size * 0.075 }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreRing;
