import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'good':
      case 'normal':
        return 'bg-emerald-100/50 text-emerald-700 border-emerald-200';
      case 'low stock':
      case 'rusak/normal':
        return 'bg-amber-100/50 text-amber-700 border-amber-200';
      case 'repair':
        return 'bg-blue-100/50 text-blue-700 border-blue-200';
      case 'broken':
      case 'rusak':
        return 'bg-rose-100/50 text-rose-700 border-rose-200';
      default:
        return 'bg-surface-container-highest text-on-surface border-outline-variant';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
