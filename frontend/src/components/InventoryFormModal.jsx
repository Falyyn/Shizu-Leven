import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../store';
import { useLang } from '../i18n/LangContext';

const InventoryFormModal = ({ isOpen, onClose, initialData = null }) => {
  const { categories, locations, addItem, updateItem, addCategory, addLocation } = useInventoryStore();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    location_id: '',
    quantity: 0,
    condition: 'Good'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category_id: categories.find(c => c.name === initialData.category)?.id || initialData.category_id || '',
        location_id: locations.find(l => l.name === initialData.location)?.id || initialData.location_id || '',
        quantity: initialData.quantity || 0,
        condition: initialData.condition || 'Good'
      });
    } else {
      setFormData({
        name: '',
        category_id: '',
        location_id: '',
        quantity: 0,
        condition: 'Good'
      });
    }
    setCustomCategory('');
    setCustomLocation('');
    setCustomCondition('');
  }, [initialData, isOpen, categories, locations]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = { ...formData };
      
      if (payload.category_id === 'other' && customCategory.trim() !== '') {
        const newCat = await addCategory(customCategory);
        payload.category_id = newCat.id;
      }
      
      if (payload.location_id === 'other' && customLocation.trim() !== '') {
        const newLoc = await addLocation(customLocation);
        payload.location_id = newLoc.id;
      }
      
      if (payload.condition === 'other' && customCondition.trim() !== '') {
        payload.condition = customCondition;
      }

      if (initialData) {
        await updateItem(initialData.id, payload);
      } else {
        await addItem(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save data. Check console for errors.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface rounded-[32px] w-full max-w-xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-surface-container-highest bg-surface-container-lowest">
          <h2 className="font-headline text-xl font-bold">{initialData ? t('form_edit_title') : t('form_add_title')}</h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form id="inventory-form" onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('form_name')} *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              placeholder={t('form_name_placeholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('form_category')} *</label>
              <select 
                required
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-2"
              >
                <option value="">{t('form_category_select')}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                <option value="other">{t('form_category_other')}</option>
              </select>
              {formData.category_id === 'other' && (
                <input 
                  type="text"
                  required
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  placeholder={t('form_category_placeholder')}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all animate-in fade-in slide-in-from-top-2"
                />
              )}
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('form_location')} *</label>
              <select 
                required
                value={formData.location_id}
                onChange={e => setFormData({...formData, location_id: e.target.value})}
                className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-2"
              >
                <option value="">{t('form_location_select')}</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
                <option value="other">{t('form_location_other')}</option>
              </select>
              {formData.location_id === 'other' && (
                <input 
                  type="text"
                  required
                  value={customLocation}
                  onChange={e => setCustomLocation(e.target.value)}
                  placeholder={t('form_location_placeholder')}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all animate-in fade-in slide-in-from-top-2"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('form_quantity')} *</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{t('form_condition')} *</label>
              <select 
                required
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
                className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-2"
              >
                <option value="Good">{t('cond_good')}</option>
                <option value="Repair">{t('cond_repair')}</option>
                <option value="Broken">{t('cond_broken')}</option>
                <option value="Low Stock">{t('cond_low')}</option>
                <option value="other">{t('form_condition_other')}</option>
              </select>
              {formData.condition === 'other' && (
                <input 
                  type="text"
                  required
                  value={customCondition}
                  onChange={e => setCustomCondition(e.target.value)}
                  placeholder={t('form_condition_placeholder')}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl py-3 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all animate-in fade-in slide-in-from-top-2"
                />
              )}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-surface-container-highest bg-surface-container-lowest flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-sans text-sm font-medium text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            {t('form_cancel')}
          </button>
          <button 
            type="submit"
            form="inventory-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-full font-sans text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? t('form_saving') : t('form_save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFormModal;
