const Badge = ({ children, variant = 'blue', size = 'sm', className = '' }) => {
  const variants = {
    blue: 'badge-blue',
    green: 'badge-green',
    amber: 'badge-amber',
    red: 'badge-red',
    purple: 'badge-purple',
    slate: 'badge bg-slate-700/60 text-slate-300 border border-slate-600/50',
  };

  const sizes = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`${variants[variant] || variants.blue} ${sizes[size]} inline-flex items-center gap-1 rounded-full font-medium ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
