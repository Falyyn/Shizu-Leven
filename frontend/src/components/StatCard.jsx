import React from 'react';

const StatCard = ({ title, value, growth, variant = 'dark' }) => {
  const baseClasses = "rounded-3xl p-6 shadow-md bento-item flex flex-col justify-between h-full";
  
  const variants = {
    dark: "bg-zinc-900 text-white shadow-lg",
    primary: "bg-primary text-white",
    warm: "bg-orange-50 text-orange-900 border border-orange-100",
  };

  const titleColors = {
    dark: "text-zinc-400",
    primary: "text-primary-container",
    warm: "text-orange-600/80",
  };

  return (
    <div className={`${baseClasses} ${variants[variant]}`}>
      <div>
        <h4 className={`${titleColors[variant]} font-sans text-sm mb-2`}>{title}</h4>
        <p className="font-headline text-4xl font-bold">{value}</p>
      </div>
      
      {growth && (
        <div className="flex items-center gap-1 mt-4">
          <span className={`text-xs font-semibold ${growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {growth}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
