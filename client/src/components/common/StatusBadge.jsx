const StatusBadge = ({ status, className = '' }) => {
  const normalized = String(status || 'pending').toLowerCase();
  const palette = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    inactive: 'bg-slate-200 text-slate-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    open: 'bg-blue-100 text-blue-700',
    closed: 'bg-slate-200 text-slate-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
    cancelled: 'bg-slate-200 text-slate-700',
    default: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${palette[normalized] || palette.default} ${className}`}>
      {normalized}
    </span>
  );
};

export default StatusBadge;
