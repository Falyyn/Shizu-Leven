import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-8 md:p-12 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-md shadow-primary/30">
          <span className="material-symbols-outlined text-3xl">widgets</span>
        </div>
        
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Shizu Leven</h1>
        <p className="font-sans text-on-surface-variant mb-8 text-center text-sm">Sign in to your dashboard</p>
        
        {error && (
          <div className="w-full bg-error-container text-on-error-container p-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form className="w-full space-y-4" onSubmit={handleLogin}>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-outline-variant text-[20px]">mail</span>
            <input 
              type="email" 
              placeholder="admin@shizu-leven.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-2xl py-3 pl-12 pr-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-outline-variant text-[20px]">lock</span>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-2xl py-3 pl-12 pr-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="w-full bg-zinc-900 text-white rounded-full py-3.5 font-sans font-semibold text-sm hover:bg-zinc-800 transition-colors mt-6 disabled:opacity-70">
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
