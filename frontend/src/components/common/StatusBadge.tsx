import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorStyle = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (status.toUpperCase()) {
    case 'RESERVED':
      colorStyle = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      break;
    case 'PICKED_UP':
      colorStyle = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      break;
    case 'RETURNED':
    case 'REFUNDED':
    case 'VERIFIED':
    case 'EXCELLENT':
    case 'AVAILABLE':
      colorStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      break;
    case 'OVERDUE':
    case 'FORFEITED':
    case 'NEEDS_REPAIR':
      colorStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
      break;
    case 'HELD':
    case 'PARTIALLY_FORFEITED':
    case 'PENDING':
    case 'GOOD':
      colorStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};
