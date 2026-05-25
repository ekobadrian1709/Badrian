import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileSpreadsheet, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RotateCcw, 
  Plus, 
  Search, 
  Trash2, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';

import { PSMRecord, CashierName } from './types';
import { 
  INITIAL_RECORDS, 
  CASHIERS, 
  formatIndonesianDate, 
  exportToCSV, 
  calculateSummaries,
  formatNumber,
  formatPercent
} from './utils/helpers';

import SpreadsheetTable from './components/SpreadsheetTable';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DetailsDrawer from './components/DetailsDrawer';

const LOCAL_STORAGE_KEY = 'laporan_psm_records_v1';

export default function App() {
  // 1. Core application state
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-25');
  const [records, setRecords] = useState<PSMRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Drawer editor control
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingCashier, setEditingCashier] = useState<CashierName | null>(null);

  // 2. Load records from localStorage on initial boot
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed parsing records from local storage, loading initial templates', e);
        setRecords(INITIAL_RECORDS);
      }
    } else {
      setRecords(INITIAL_RECORDS);
    }
  }, []);

  // 3. Save records to localStorage on changes
  const saveRecords = (newRecords: PSMRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecords));
  };

  // 4. Date navigation handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  const handleSetToday = () => {
    setSelectedDate('2026-05-25'); // Using fixed current mock time context
  };

  // 5. Open editor drawer for specific cashier
  const handleCashierClick = (cashierName: CashierName) => {
    setEditingCashier(cashierName);
    setIsDrawerOpen(true);
  };

  // 6. Save or update record from the details drawer
  const handleSaveDrawerRecord = (updatedRecord: PSMRecord) => {
    const index = records.findIndex(
      (r) => r.date === updatedRecord.date && r.cashier === updatedRecord.cashier
    );

    let newRecords = [...records];
    if (index >= 0) {
      // Overwrite existing record
      newRecords[index] = updatedRecord;
    } else {
      // Append new record
      newRecords.push(updatedRecord);
    }
    saveRecords(newRecords);
  };

  // 7. Delete a specific record from history
  const handleDeleteRecord = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan kasir ini dari riwayat?')) {
      const filtered = records.filter((r) => r.id !== id);
      saveRecords(filtered);
    }
  };

  // 8. Restore initial mock data (for testing & sandbox demonstration)
  const handleRestoreMockData = () => {
    if (confirm('Kembalikan lembar kerja ke data peragaan awal? Perubahan baru Anda akan diset ulang.')) {
      saveRecords(INITIAL_RECORDS);
      setSelectedDate('2026-05-25');
    }
  };

  // 9. Quick pre-fill all 5 cashiers for current date
  const handleQuickPreFillCurrentDate = () => {
    let newRecords = [...records];
    let addedCount = 0;

    CASHIERS.forEach((name) => {
      const exists = records.some((r) => r.date === selectedDate && r.cashier === name);
      if (!exists) {
        newRecords.push({
          id: `rec_${name}_${selectedDate}_${Date.now()}_${Math.random()}`,
          date: selectedDate,
          cashier: name,
          psmTarget: 50,
          psmActual: 0,
          pwpTarget: 25,
          pwpActual: 0,
          serbaTarget: 20,
          serbaActual: 0,
          segerTarget: 15,
          segerActual: 0,
          memberTarget: 5,
          memberActual: 0,
          target: 50,
          actualTarget: 0,
          acvTarget: 25,
          acvActual: 0,
          notes: 'Draf otomatis'
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      saveRecords(newRecords);
    } else {
      alert('Semua kasir untuk tanggal ini sudah terdaftar dalam lembar kerja.');
    }
  };

  // Get current active row for drawer mapping
  const activeRecord = editingCashier
    ? records.find((r) => r.date === selectedDate && r.cashier === editingCashier) || null
    : null;

  // Filter records by search query for history section
  const filteredHistory = records
    .filter((r) => {
      const matchesSearch =
        r.cashier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.date.includes(searchQuery) ||
        (r.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.cashier.localeCompare(b.cashier));

  return (
    <div id="main-app-viewport" className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* 1. Elegant Dashboard Header */}
      <header className="bg-white border-b border-slate-200 py-5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Main App branding */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <FileSpreadsheet size={24} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none animate-pulse">
                  Spreadsheet Laporan Operasional Minimarket
                </h1>
                <span className="bg-indigo-150 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-200">
                  SMART v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Sistem rekap deviasi ± (surplus/defisit) target PSM, PWP, Serba Gratis, Seger, & New Member
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Reset Defaults button */}
            <button
              id="reset-mock-btn"
              onClick={handleRestoreMockData}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Kembalikan ke data peragaan awal"
            >
              <RotateCcw size={14} />
              Reset Peragaan
            </button>

            {/* Export To Excel button */}
            <button
              id="export-csv-btn"
              onClick={() => exportToCSV(records)}
              className="px-3.5 py-2 text-xs font-extrabold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:brightness-105 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/10"
              title="Unduh seluruh database laporan dalam CSV Excel"
            >
              <Download size={14} />
              Ekspor CSV
            </button>
            
          </div>
        </div>
      </header>

      {/* 2. Primary Layout Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Date Selector Row Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 shrink-0 text-left">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
              <CalendarIcon size={18} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                TANGGAL LEMBAR KERJA
              </span>
              <span className="text-sm font-extrabold text-slate-705">
                {formatIndonesianDate(selectedDate)}
              </span>
            </div>
          </div>

          {/* Date Controls */}
          <div className="flex items-center gap-2">
            <button
              id="prev-day-btn"
              onClick={handlePrevDay}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Hari Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>

            <input
              id="date-picker-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            />

            <button
              id="next-day-btn"
              onClick={handleNextDay}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Hari Berikutnya"
            >
              <ChevronRight size={16} />
            </button>

            <button
              id="today-btn"
              onClick={handleSetToday}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 ml-1 transition-colors cursor-pointer"
            >
              Hari Ini (25 Mei)
            </button>
          </div>

          {/* Quick Pre-fill / Setup Draft for Selected Date */}
          <button
            id="prefill-all-btn"
            onClick={handleQuickPreFillCurrentDate}
            className="text-xs font-semibold px-3.5 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="Daftarkan draf 5 kasir sekaligus untuk tanggal ini"
          >
            <Plus size={14} />
            Draf 5 Kasir Sekaligus
          </button>

        </div>

        {/* Core Spreadsheet Section */}
        <section className="space-y-4">
          <SpreadsheetTable 
            date={selectedDate}
            records={records}
            onCashierClick={handleCashierClick}
            onSaveRecord={handleSaveDrawerRecord}
            onQuickAdd={handleQuickPreFillCurrentDate}
          />
        </section>

        {/* Leaderboard and SVG Charts Dashboard Widgets */}
        <section className="pt-2">
          <AnalyticsDashboard records={records} />
        </section>

        {/* 3. Historical Logs Database (Perfect reference for past entries) */}
        <section className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-linear-to-r from-slate-50/20 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="text-blue-600" size={18} />
                Riwayat Pengisian Database
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cari, pantau seluruh entri yang telah Anda disimpan, atau hapus jika terjadi kesalahan.
              </p>
            </div>

            {/* Search Input bar */}
            <div className="relative max-w-sm w-full">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Search size={15} />
              </span>
              <input
                id="search-history-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kasir, tanggal, atau catatan..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* List of saved records */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {filteredHistory.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-6">Tanggal</th>
                    <th className="py-2.5 px-6">Kasir</th>
                    <th className="py-2.5 px-6 text-right font-semibold">Target vs Aktual</th>
                    <th className="py-2.5 px-6 text-center font-semibold">% Capai</th>
                    <th className="py-2.5 px-6 text-center font-semibold">Deviasi Kategori</th>
                    <th className="py-2.5 px-6 font-semibold">Catatan</th>
                    <th className="py-2.5 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((rec) => {
                    const sumTarget = (rec.psmTarget || 0) + (rec.pwpTarget || 0) + (rec.serbaTarget || 0) + (rec.segerTarget || 0) + (rec.memberTarget || 0);
                    const sumActual = (rec.psmActual || 0) + (rec.pwpActual || 0) + (rec.serbaActual || 0) + (rec.segerActual || 0) + (rec.memberActual || 0);
                    const achievement = sumTarget > 0 ? (sumActual / sumTarget) * 100 : 0;
                    
                    const psmD = (rec.psmActual || 0) - (rec.psmTarget || 0);
                    const pwpD = (rec.pwpActual || 0) - (rec.pwpTarget || 0);
                    const serbaD = (rec.serbaActual || 0) - (rec.serbaTarget || 0);
                    const segerD = (rec.segerActual || 0) - (rec.segerTarget || 0);
                    const memberD = (rec.memberActual || 0) - (rec.memberTarget || 0);

                    const formatDev = (v: number) => (v > 0 ? `+${v}` : `${v}`);

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/45 text-xs text-slate-600 transition-colors">
                        
                        {/* Date jumping link */}
                        <td className="py-3 px-6">
                          <button
                            id={`history-date-btn-${rec.id}`}
                            onClick={() => setSelectedDate(rec.date)}
                            className="font-mono text-blue-600 hover:underline font-bold text-left cursor-pointer"
                            title="Klik untuk membuka lembar kerja tanggal ini"
                          >
                            {rec.date}
                          </button>
                        </td>

                        {/* Cashier name shortcut */}
                        <td className="py-3 px-6 font-bold text-slate-800">
                          <button
                            id={`history-cashier-btn-${rec.id}`}
                            onClick={() => {
                              setSelectedDate(rec.date);
                              handleCashierClick(rec.cashier);
                            }}
                            className="hover:underline text-left cursor-pointer"
                          >
                            {rec.cashier}
                          </button>
                        </td>

                        {/* Target values */}
                        <td className="py-3 px-6 text-right font-mono text-slate-500">
                          {sumActual} / <span className="font-semibold text-slate-650">{sumTarget}</span> pcs
                        </td>

                        {/* Target progress badge */}
                        <td className="py-3 px-6 text-center">
                          <span className={`inline-flex px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            achievement >= 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            achievement >= 80 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {achievement.toFixed(1)}%
                          </span>
                        </td>

                        {/* Mini breakdown of category differences */}
                        <td className="py-3 px-6 text-center">
                          <div className="inline-flex flex-wrap gap-1.5 justify-center max-w-sm">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${psmD >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-750'}`}>
                              PSM:{formatDev(psmD)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${pwpD >= 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-750'}`}>
                              PWP:{formatDev(pwpD)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${serbaD >= 0 ? 'bg-violet-50 text-violet-700' : 'bg-rose-50 text-rose-750'}`}>
                              SRB:{formatDev(serbaD)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${segerD >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-750'}`}>
                              SGR:{formatDev(segerD)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${memberD >= 0 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-750'}`}>
                              MEM:{formatDev(memberD)}
                            </span>
                          </div>
                        </td>

                        {/* User custom comment notes */}
                        <td className="py-3 px-6 text-slate-400 max-w-xs truncate font-medium">
                          {rec.notes || '-'}
                        </td>

                        {/* Delete entry action button */}
                        <td className="py-3 px-6 text-center">
                          <button
                            id={`delete-record-${rec.id}`}
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Hapus Laporan ini"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Tidak ada riwayat pengisian ditemukan matching kriteria pencarian Anda.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* 4. Elegant Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div>
            &copy; 2026 Laporan PSM Kasir Canggih. Tersimpan untuk toko lokal Anda.
          </div>
          <div className="flex items-center gap-1">
            <span>Didesain khusus untuk kasir:</span>
            <strong className="text-slate-600 font-semibold">Eliana, Gea, Mala, Devi, Eko</strong>
          </div>
        </div>
      </footer>

      {/* 5. Details Editor Drawer (The modal sliding form requested by the user) */}
      <DetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingCashier(null);
        }}
        cashierName={editingCashier}
        date={selectedDate}
        record={activeRecord}
        onSave={handleSaveDrawerRecord}
      />

    </div>
  );
}
