import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon,
  title = 'Nothing here yet',
  description = '',
  action = null,
  actionLabel = 'Get started',
  actionTo = '/analyze',
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center text-center py-20 px-6 ${className}`}
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-5 shadow-lg">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
    {description && (
      <p className="text-slate-400 text-sm max-w-xs mb-6">{description}</p>
    )}
    {action ? (
      action
    ) : (
      <Link to={actionTo} className="btn-primary text-sm py-2.5 px-5">
        {actionLabel}
      </Link>
    )}
  </motion.div>
);

export default EmptyState;
