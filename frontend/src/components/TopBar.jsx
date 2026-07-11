import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AIAssistantDrawer from './AIAssistantDrawer';
import { useAuthStore } from '../store';

const TopBar = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();
  
  let pageTitle = 'Overview';
  if (location.pathname.includes('/inventory')) pageTitle = 'Inventory';
  if (location.pathname.includes('/settings')) pageTitle = 'Settings';

  return (
    <>
      <header className="flex justify-between items-center w-full px-gutter-grid py-6 bg-surface shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-0 z-40 transition-all duration-200 ease-in-out">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <span className="font-headline font-bold text-primary md:hidden">Shizu Leven</span>
          <h2 className="hidden md:block font-headline text-3xl font-semibold text-on-surface tracking-tight">{pageTitle}</h2>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-2 rounded-full font-sans font-medium text-sm border border-primary/20 mr-2"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>Ask AI</span>
          </button>
          
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30 cursor-pointer flex items-center justify-center text-primary font-bold">
            {user?.avatar_url ? (
              <img src={`http://localhost:8000${user.avatar_url}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.substring(0, 2) || 'SL'
            )}
          </div>
        </div>
      </header>

      <AIAssistantDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};

export default TopBar;
