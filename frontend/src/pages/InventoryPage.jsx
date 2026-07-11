import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../store';
import StatusBadge from '../components/StatusBadge';
import InventoryFormModal from '../components/InventoryFormModal';
import { useLang } from '../i18n/LangContext';

const InventoryPage = () => {
  const { items, categories, locations, fetchItems, deleteItem, fetchMasterData } = useInventoryStore();
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchMasterData();
  }, [fetchItems, fetchMasterData]);

  const filteredItems = items.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchLocation = locationFilter ? item.location === locationFilter : true;
    const matchCondition = conditionFilter ? item.condition === conditionFilter : true;
    return matchSearch && matchCategory && matchLocation && matchCondition;
  });

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-6 pb-8">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-on-surface">{t('inv_title')}</h1>
          <p className="text-on-surface-variant font-sans mt-2">{filteredItems.length} Items Total</p>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline-variant text-sm">search</span>
            <input 
              type="text" 
              placeholder={t('inv_search')} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-outline-variant/30 rounded-full py-2 pl-9 pr-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-white border border-outline-variant/30 rounded-full py-2 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">{t('inv_all_categories')}</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select 
              value={locationFilter} 
              onChange={e => setLocationFilter(e.target.value)}
              className="bg-white border border-outline-variant/30 rounded-full py-2 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">{t('inv_all_locations')}</option>
              {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
            <select 
              value={conditionFilter} 
              onChange={e => setConditionFilter(e.target.value)}
              className="bg-white border border-outline-variant/30 rounded-full py-2 px-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">{t('inv_all_conditions')}</option>
              <option value="Good">Good</option>
              <option value="Normal">Normal</option>
              <option value="Repair">Repair</option>
              <option value="Broken">Broken</option>
              <option value="Rusak">Rusak</option>
              <option value="Low Stock">Low Stock</option>
            </select>
          </div>
          
          <button 
            onClick={handleAdd}
            className="px-6 py-2.5 rounded-full border border-primary text-white font-sans text-sm font-medium bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> {t('inv_add')}
          </button>
        </div>
      </div>
      
      <div className="glass-card flex-1 rounded-[32px] p-6 shadow-sm border border-outline-variant/20 bg-white overflow-hidden flex flex-col bento-item">
        <div className="w-full overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container-highest text-on-surface-variant font-sans text-xs uppercase tracking-wider">
                <th className="pb-4 font-semibold px-4">{t('inv_col_name')}</th>
                <th className="pb-4 font-semibold px-4">{t('inv_col_category')}</th>
                <th className="pb-4 font-semibold px-4">{t('inv_col_location')}</th>
                <th className="pb-4 font-semibold px-4">{t('inv_col_condition')}</th>
                <th className="pb-4 font-semibold px-4 text-center">{t('inv_col_qty')}</th>
                <th className="pb-4 font-semibold px-4 text-right">{t('inv_col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index} className="border-b border-surface-container-highest last:border-0 hover:bg-surface-container-lowest transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">developer_board</span>
                      </div>
                      <div>
                        <p className="font-sans font-medium text-sm text-on-surface">{item.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-sans text-sm text-on-surface-variant">{item.category}</td>
                  <td className="py-4 px-4 font-sans text-sm text-on-surface-variant">{item.location}</td>
                  <td className="py-4 px-4"><StatusBadge status={item.condition} /></td>
                  <td className="py-4 px-4 font-sans text-sm text-on-surface-variant text-center">{item.quantity}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-highest"><span className="material-symbols-outlined text-sm">edit</span></button>
                      <button onClick={() => deleteItem(item.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container/50"><span className="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-surface-container-highest mt-auto">
          <p className="font-sans text-sm text-on-surface-variant">Showing 1-{filteredItems.length} of {filteredItems.length}</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors disabled:opacity-50 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors disabled:opacity-50 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <InventoryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingItem} 
      />
    </div>
  );
};

export default InventoryPage;
