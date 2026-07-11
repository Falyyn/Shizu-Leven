import React, { useEffect, useState, useRef } from 'react';
import { useInventoryStore, useAuthStore } from '../store';
import { useLang } from '../i18n/LangContext';

const SettingsPage = () => {
  const { categories, locations, fetchMasterData, addCategory, addLocation, deleteCategory, deleteLocation } = useInventoryStore();
  const { user, updateProfile } = useAuthStore();
  const { lang, changeLang, t } = useLang();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url ? `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/api\/v1\/?$/, '')}${user.avatar_url}` : null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const handleAddCategory = async () => {
    const name = window.prompt(t('set_add_cat_prompt'));
    if (name) {
      try {
        await addCategory(name);
      } catch (e) {
        alert(t('set_add_failed'));
      }
    }
  };

  const handleAddLocation = async () => {
    const name = window.prompt(t('set_add_loc_prompt'));
    if (name) {
      try {
        await addLocation(name);
      } catch (e) {
        alert(t('set_add_failed'));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (avatarFile) formData.append('avatar', avatarFile);

    const success = await updateProfile(formData);
    if (success) {
      alert(t('set_profile_updated'));
      setPassword('');
    } else {
      alert(t('set_profile_failed'));
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 pb-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">{t('set_title')}</h1>
        <p className="text-on-surface-variant font-sans mt-2">{t('set_subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Language Setting */}
          <div className="glass-card rounded-[32px] p-8 shadow-sm border border-outline-variant/20 bg-white bento-item">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">language</span>
              <h2 className="font-headline text-2xl font-bold">{t('set_language')}</h2>
            </div>
            <p className="text-on-surface-variant font-sans text-sm mb-6">{t('set_language_subtitle')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => changeLang('id')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm font-semibold transition-all border-2 ${
                  lang === 'id'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-on-surface border-outline-variant/40 hover:border-primary/40'
                }`}
              >
                <span className="text-lg">🇮🇩</span>
                {t('set_lang_id')}
              </button>
              <button
                onClick={() => changeLang('en')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans text-sm font-semibold transition-all border-2 ${
                  lang === 'en'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-on-surface border-outline-variant/40 hover:border-primary/40'
                }`}
              >
                <span className="text-lg">🇬🇧</span>
                {t('set_lang_en')}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card rounded-[32px] p-8 shadow-sm border border-outline-variant/20 bg-white bento-item">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-2xl font-bold">{t('set_categories')}</h2>
              <button onClick={handleAddCategory} className="flex items-center gap-2 text-primary font-medium hover:bg-primary/10 px-4 py-2 rounded-full transition-colors text-sm">
                <span className="material-symbols-outlined text-[18px]">add</span> {t('set_add_category')}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl border border-surface-container-highest bg-surface-container-lowest hover:border-primary/30 transition-colors group">
                  <span className="font-sans text-sm font-medium">{cat.name}</span>
                  <button className="text-outline-variant opacity-0 group-hover:opacity-100 hover:text-error transition-all" onClick={() => deleteCategory(cat.id)}><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="glass-card rounded-[32px] p-8 shadow-sm border border-outline-variant/20 bg-white bento-item">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-2xl font-bold">{t('set_locations')}</h2>
              <button onClick={handleAddLocation} className="flex items-center gap-2 text-primary font-medium hover:bg-primary/10 px-4 py-2 rounded-full transition-colors text-sm">
                <span className="material-symbols-outlined text-[18px]">add</span> {t('set_add_location')}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {locations.map(loc => (
                <div key={loc.id} className="flex items-center justify-between p-4 rounded-2xl border border-surface-container-highest bg-surface-container-lowest hover:border-primary/30 transition-colors group">
                  <span className="font-sans text-sm font-medium">{loc.name}</span>
                  <button className="text-outline-variant opacity-0 group-hover:opacity-100 hover:text-error transition-all" onClick={() => deleteLocation(loc.id)}><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Account Settings */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-[32px] p-8 shadow-sm border border-outline-variant/20 bg-white h-full bento-item">
            <h2 className="font-headline text-2xl font-bold mb-6">{t('set_account')}</h2>
            
            <div className="flex flex-col items-center mb-8 relative">
              <div 
                className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mb-4 border border-primary/30 uppercase cursor-pointer overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.substring(0, 2) || 'SL'
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-24 h-24 mx-auto top-0">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <h3 className="font-sans font-semibold text-lg text-on-surface">{user?.name || 'Admin'}</h3>
              <p className="font-sans text-sm text-on-surface-variant">{user?.email || 'admin@example.com'}</p>
            </div>

            <form className="space-y-4" onSubmit={handleProfileUpdate}>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('set_display_name')}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('set_email')}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('set_password')}</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-zinc-900 text-white rounded-full py-3 font-sans font-semibold text-sm hover:bg-zinc-800 transition-colors">
                  {t('set_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
