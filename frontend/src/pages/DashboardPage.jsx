import React, { useEffect, useState } from 'react';
import { useDashboardStore, useInventoryStore } from '../store';
import { mockDashboardStats } from '../services/mockData';
import StatCard from '../components/StatCard';
import DonutChart from '../components/DonutChart';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLang } from '../i18n/LangContext';

const DashboardPage = () => {
  const { stats, fetchStats, isLoading } = useDashboardStore();
  const { items: inventoryItems, fetchItems } = useInventoryStore();
  const { t } = useLang();
  
  useEffect(() => {
    fetchStats();
    fetchItems();
    const interval = setInterval(() => {
      fetchStats();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchItems]);

  const currentStats = stats || mockDashboardStats;

  const [isExporting, setIsExporting] = useState(false);

  // Helper: draw page footer
  const drawFooter = (pdf, W, pageH, pageNum, totalPages) => {
    pdf.setFillColor(103, 75, 181);
    pdf.rect(0, pageH - 10, W, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Shizu Leven Inventory System — Laporan otomatis', W / 2, pageH - 4, { align: 'center' });
    pdf.text(`Halaman ${pageNum} dari ${totalPages}`, W - 12, pageH - 4, { align: 'right' });
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const { totalComponents, conditionStats, categoryStats } = currentStats;
      const good = conditionStats?.good ?? 0;
      const repair = conditionStats?.repair ?? 0;
      const broken = conditionStats?.broken ?? 0;
      const total = good + repair + broken || 1;

      // All inventory items from store
      const allInventory = inventoryItems || [];

      const pdf = new jsPDF('p', 'mm', 'a4');
      const W = 210;
      const pageH = 297;

      // ─────────────────── PAGE 1: STATISTICS ───────────────────
      pdf.setFillColor(250, 249, 251);
      pdf.rect(0, 0, W, pageH, 'F');

      // Header
      pdf.setFillColor(103, 75, 181);
      pdf.roundedRect(10, 10, W - 20, 26, 4, 4, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SHIZU LEVEN — Laporan Statistik Inventaris', 20, 26);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(new Date().toLocaleString('id-ID'), W - 20, 26, { align: 'right' });

      // Stat Cards
      const cardY = 44;
      const cardH = 22;
      const cardW = (W - 20 - 8) / 4;
      const cards = [
        { label: 'Total Komponen', val: totalComponents, color: [103, 75, 181] },
        { label: 'Kondisi Baik', val: good, color: [16, 185, 129] },
        { label: 'Perlu Perbaikan', val: repair, color: [245, 158, 11] },
        { label: 'Rusak', val: broken, color: [239, 68, 68] },
      ];
      cards.forEach((c, i) => {
        const x = 10 + i * (cardW + 8 / 3);
        pdf.setFillColor(...c.color);
        pdf.roundedRect(x, cardY, cardW, cardH, 3, 3, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text(c.label, x + 4, cardY + 7);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(c.val), x + 4, cardY + 18);
      });

      // Condition bars
      const donutY = 75;
      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Kondisi Komponen', 10, donutY);
      const barX = 10;
      const barW = 85;
      const barH = 8;
      const condItems = [
        { label: 'Baik / Normal', val: good, pct: Math.round(good / total * 100), color: [16, 185, 129] },
        { label: 'Perbaikan', val: repair, pct: Math.round(repair / total * 100), color: [245, 158, 11] },
        { label: 'Rusak', val: broken, pct: Math.round(broken / total * 100), color: [239, 68, 68] },
      ];
      condItems.forEach((item, i) => {
        const y = donutY + 7 + i * 16;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        pdf.text(item.label, barX, y + 5);
        pdf.setFillColor(230, 230, 235);
        pdf.roundedRect(barX, y + 6, barW, barH, 2, 2, 'F');
        const fillW = Math.max((item.pct / 100) * barW, item.pct > 0 ? 3 : 0);
        pdf.setFillColor(...item.color);
        pdf.roundedRect(barX, y + 6, fillW, barH, 2, 2, 'F');
        pdf.setTextColor(30, 30, 30);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${item.pct}%  (${item.val})`, barX + barW + 3, y + 13);
      });

      // Category bar chart
      const catSectionX = 108;
      const catSectionY = donutY;
      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Stok per Kategori', catSectionX, catSectionY);
      const sortedCats = [...(categoryStats || [])].sort((a, b) => b.val - a.val).slice(0, 10);
      const maxVal = sortedCats[0]?.val || 1;
      const catBarMaxW = W - catSectionX - 10;
      sortedCats.forEach((cat, i) => {
        const y = catSectionY + 7 + i * 13;
        const bW = Math.max((cat.val / maxVal) * (catBarMaxW - 32), 2);
        const shortName = cat.name.length > 18 ? cat.name.slice(0, 17) + '…' : cat.name;
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        pdf.text(shortName, catSectionX, y + 5);
        pdf.setFillColor(230, 230, 235);
        pdf.roundedRect(catSectionX, y + 6, catBarMaxW - 32, 6, 1, 1, 'F');
        const shade = i % 2 === 0 ? [103, 75, 181] : [130, 100, 210];
        pdf.setFillColor(...shade);
        pdf.roundedRect(catSectionX, y + 6, bW, 6, 1, 1, 'F');
        pdf.setTextColor(30, 30, 30);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(cat.val), catSectionX + catBarMaxW - 30, y + 11);
      });

      // ── Calculate total pages for inventory ────────────────
      const tH = { no: 12, name: 65, cat: 35, qty: 18, loc: 35, cond: 25 };
      const rowH = 9;
      const maxCondY = donutY + 7 + condItems.length * 16;
      const maxCatY = catSectionY + 7 + sortedCats.length * 13;
      const firstPageTableStart = Math.max(maxCondY, maxCatY) + 15;
      const firstPageTableHeaderY = firstPageTableStart + 8;
      const rowsOnFirstPage = Math.max(0, Math.floor((pageH - 20 - firstPageTableHeaderY - 8) / rowH));
      const rowsPerOtherPage = Math.floor((pageH - 20 - 28 - 8) / rowH); // 28 = header block on new pages
      const remainingItems = Math.max(0, allInventory.length - rowsOnFirstPage);
      const extraPages = remainingItems > 0 ? Math.ceil(remainingItems / rowsPerOtherPage) : 0;
      const totalPages = 1 + extraPages;

      // Draw footer for page 1
      drawFooter(pdf, W, pageH, 1, totalPages);

      // ── INVENTORY TABLE starts on page 1 ──────────────────
      const dividerY = firstPageTableStart - 4;
      pdf.setDrawColor(220, 220, 225);
      pdf.line(10, dividerY, W - 10, dividerY);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text(`Data Inventori Lengkap (${allInventory.length} item)`, 10, firstPageTableStart + 2);

      // Draw table header helper
      const drawTableHeader = (startY) => {
        pdf.setFillColor(103, 75, 181);
        pdf.roundedRect(10, startY, W - 20, 8, 1, 1, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        let cx = 13;
        pdf.text('No', cx, startY + 5.5); cx += tH.no;
        pdf.text('Nama Komponen', cx, startY + 5.5); cx += tH.name;
        pdf.text('Kategori', cx, startY + 5.5); cx += tH.cat;
        pdf.text('Qty', cx, startY + 5.5); cx += tH.qty;
        pdf.text('Lokasi', cx, startY + 5.5); cx += tH.loc;
        pdf.text('Kondisi', cx, startY + 5.5);
      };

      // Draw a single item row
      const drawRow = (item, idx, rowY) => {
        if (idx % 2 === 0) {
          pdf.setFillColor(245, 243, 250);
          pdf.rect(10, rowY, W - 20, rowH, 'F');
        }
        pdf.setTextColor(50, 50, 60);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        let rx = 13;
        pdf.text(String(idx + 1), rx, rowY + 6); rx += tH.no;
        const shortN = (item.name || '-').length > 26 ? (item.name || '-').slice(0, 25) + '…' : (item.name || '-');
        pdf.text(shortN, rx, rowY + 6); rx += tH.name;
        const shortC = (item.category || '-').length > 14 ? (item.category || '-').slice(0, 13) + '…' : (item.category || '-');
        pdf.text(shortC, rx, rowY + 6); rx += tH.cat;
        pdf.text(String(item.quantity ?? 0), rx, rowY + 6); rx += tH.qty;
        const shortL = (item.location || '-').length > 14 ? (item.location || '-').slice(0, 13) + '…' : (item.location || '-');
        pdf.text(shortL, rx, rowY + 6); rx += tH.loc;
        const cond = item.condition || '-';
        const cl = cond.toLowerCase();
        if (cl.includes('normal') || cl.includes('good') || cl.includes('baik')) pdf.setTextColor(16, 185, 129);
        else if (cl.includes('repair') || cl.includes('low') || cl.includes('perbaikan')) pdf.setTextColor(245, 158, 11);
        else if (cl.includes('rusak') || cl.includes('broken')) pdf.setTextColor(239, 68, 68);
        else pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'bold');
        pdf.text(cond.length > 14 ? cond.slice(0, 13) + '…' : cond, rx, rowY + 6);
        pdf.setTextColor(50, 50, 60);
      };

      // Page 1 table
      drawTableHeader(firstPageTableHeaderY);
      const page1Items = allInventory.slice(0, rowsOnFirstPage);
      page1Items.forEach((item, i) => {
        drawRow(item, i, firstPageTableHeaderY + 8 + i * rowH);
      });

      // Additional pages
      let itemIndex = rowsOnFirstPage;
      for (let p = 2; p <= totalPages; p++) {
        pdf.addPage();
        pdf.setFillColor(250, 249, 251);
        pdf.rect(0, 0, W, pageH, 'F');

        // Mini header
        pdf.setFillColor(103, 75, 181);
        pdf.roundedRect(10, 10, W - 20, 14, 3, 3, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SHIZU LEVEN — Data Inventori Lengkap (lanjutan)', 20, 20);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text(new Date().toLocaleString('id-ID'), W - 20, 20, { align: 'right' });

        const pageTableHeaderY = 28;
        drawTableHeader(pageTableHeaderY);

        const pageItems = allInventory.slice(itemIndex, itemIndex + rowsPerOtherPage);
        pageItems.forEach((item, i) => {
          drawRow(item, itemIndex + i, pageTableHeaderY + 8 + i * rowH);
        });
        itemIndex += pageItems.length;

        drawFooter(pdf, W, pageH, p, totalPages);
      }

      pdf.save(`shizu-leven-inventori-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Gagal membuat PDF. Error: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };
  const recentItems = currentStats.recentItems || []; 
  const categoryData = currentStats.categoryStats || [];
  
  if (isLoading && !stats) {
    return <div className="flex items-center justify-center h-full">{t('dash_loading')}</div>;
  }

  return (
    <div id="dashboard-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-8 bg-surface">
      <div className="lg:col-span-9 flex flex-col gap-6">
        
        {/* Main Chart */}
        <div className="glass-card rounded-3xl p-6 h-96 flex flex-col border border-outline-variant/20 bg-white shadow-sm bento-item">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline font-semibold text-lg">{t('dash_stock_analytics')}</h3>
              <p className="text-on-surface-variant font-sans text-xs">{t('dash_inventory_levels')}</p>
            </div>
            <div className="bg-surface-container-low px-4 py-1.5 rounded-full text-xs font-medium">{t('dash_this_year')}</div>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e1e6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7a7583' }} angle={-45} textAnchor="end" interval={0} height={80} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7a7583' }} />
                <Tooltip cursor={{ fill: '#f9f9fa' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="val" fill="#674bb5" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6 h-72 flex flex-col border border-outline-variant/20 bg-white shadow-sm bento-item">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-headline font-semibold text-lg">{t('dash_condition')}</h3>
              <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <DonutChart data={currentStats.conditionStats} />
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-6 h-72 flex flex-col border border-outline-variant/20 bg-white shadow-sm bento-item">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-semibold text-lg">{t('dash_last_activity')}</h3>
              <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-sm">arrow_outward</span></button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
              {currentStats.recentActivity && currentStats.recentActivity.length > 0 ? currentStats.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30 flex items-center justify-center text-primary font-bold text-xs uppercase">
                      {activity.user.substring(0,2)}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-sm text-on-surface">{activity.user}</p>
                      <p className={`font-sans text-[10px] font-bold uppercase tracking-wider ${activity.type === 'report' ? 'text-rose-500' : 'text-emerald-500'}`}>{activity.action}</p>
                    </div>
                  </div>
                  <span className="font-sans text-xs text-on-surface-variant group-hover:text-primary transition-colors">{activity.id}</span>
                </div>
              )) : (
                <div className="text-sm text-on-surface-variant flex items-center justify-center h-full">{t('dash_no_activity')}</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Items Table */}
        <div className="glass-card rounded-3xl p-6 border border-outline-variant/20 bg-white shadow-sm bento-item">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-semibold text-lg">{t('dash_recent_items')}</h3>
            <button className="text-outline hover:text-primary"><span className="material-symbols-outlined text-lg">filter_list</span></button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container-highest text-on-surface-variant font-sans text-xs uppercase tracking-wider">
                  <th className="pb-4 font-semibold">{t('dash_item')}</th>
                  <th className="pb-4 font-semibold">{t('dash_stock')}</th>
                  <th className="pb-4 font-semibold">{t('dash_location')}</th>
                  <th className="pb-4 font-semibold">{t('dash_status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.length > 0 ? recentItems.map((item, index) => (
                  <tr key={index} className="border-b border-surface-container-highest last:border-0 hover:bg-surface-container-lowest transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">developer_board</span>
                        </div>
                        <span className="font-sans font-medium text-sm">{item.name || 'Item'}</span>
                      </div>
                    </td>
                    <td className="py-4 font-sans text-sm text-on-surface-variant">{item.quantity || 0}</td>
                    <td className="py-4 font-sans text-sm text-on-surface-variant">{item.location || '-'}</td>
                    <td className="py-4"><StatusBadge status={item.condition || 'Good'} /></td>
                  </tr>
                )) : <tr><td colSpan="4" className="py-4 text-center">{t('dash_no_items')}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>

      <div className="lg:col-span-3 flex flex-col gap-6">
        <StatCard 
          title={t('dash_total_components')} 
          value={currentStats.totalComponents.toLocaleString('id-ID')} 
          variant="dark" 
        />

        {!isExporting && (
          <button 
            onClick={handleExport}
            className="w-full bg-zinc-900 text-white rounded-2xl py-4 font-sans text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-lg flex items-center justify-center gap-2 mt-auto bento-item"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {t('dash_export')}
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
