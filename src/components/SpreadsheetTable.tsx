import React, { useState, useEffect } from 'react';
import { PSMRecord, CashierName } from '../types';
import { CASHIERS, formatNumber } from '../utils/helpers';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, Save, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpreadsheetTableProps {
  date: string;
  records: PSMRecord[];
  onCashierClick: (name: CashierName) => void;
  onSaveRecord: (record: PSMRecord) => void;
  onQuickAdd: () => void;
}

export default function SpreadsheetTable({
  date,
  records,
  onSaveRecord,
  onQuickAdd
}: SpreadsheetTableProps) {
  
  // Toggled inline edit cashier name
  const [expandedCashier, setExpandedCashier] = useState<CashierName | null>(null);

  // Form local editing states
  const [targetPSM, setTargetPSM] = useState<number>(50);
  const [actualPSM, setActualPSM] = useState<number>(0);
  
  const [targetPWP, setTargetPWP] = useState<number>(25);
  const [actualPWP, setActualPWP] = useState<number>(0);
  
  const [targetSerba, setTargetSerba] = useState<number>(20);
  const [actualSerba, setActualSerba] = useState<number>(0);
  
  const [targetSeger, setTargetSeger] = useState<number>(15);
  const [actualSeger, setActualSeger] = useState<number>(0);
  
  const [targetMember, setTargetMember] = useState<number>(5);
  const [actualMember, setActualMember] = useState<number>(0);
  
  const [notes, setNotes] = useState<string>('');

  // Get active record for a cashier on current date
  const getRecordForCashier = (cashier: CashierName): PSMRecord | null => {
    return records.find(r => r.date === date && r.cashier === cashier) || null;
  };

  // Sync state with selected cashier when expanded
  useEffect(() => {
    if (expandedCashier) {
      const rec = getRecordForCashier(expandedCashier);
      if (rec) {
        setTargetPSM(rec.psmTarget || 0);
        setActualPSM(rec.psmActual || 0);
        
        setTargetPWP(rec.pwpTarget || 0);
        setActualPWP(rec.pwpActual || 0);
        
        setSerbaTarget(rec.serbaTarget || 0);
        setSerbaActual(rec.serbaActual || 0);
        
        setTargetSeger(rec.segerTarget || 0);
        setActualSeger(rec.segerActual || 0);
        
        setTargetMember(rec.memberTarget || 0);
        setActualMember(rec.memberActual || 0);
        
        setNotes(rec.notes || '');
      } else {
        // Defaults
        setTargetPSM(50);
        setActualPSM(0);
        
        setTargetPWP(25);
        setActualPWP(0);
        
        setSerbaTarget(20);
        setSerbaActual(0);
        
        setTargetSeger(15);
        setActualSeger(0);
        
        setTargetMember(5);
        setActualMember(0);
        
        setNotes('');
      }
    }
  }, [expandedCashier, date, records]);

  // Clean setters for serba to prevent TS/linter issues with rename
  const setSerbaTarget = (val: number) => setTargetSerba(val);
  const setSerbaActual = (val: number) => setActualSerba(val);

  // Direct toggle on click
  const handleToggleExpand = (name: CashierName) => {
    if (expandedCashier === name) {
      setExpandedCashier(null);
    } else {
      setExpandedCashier(name);
    }
  };

  // Inline submit form
  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expandedCashier) return;

    const oldRec = getRecordForCashier(expandedCashier);
    const updatedRecord: PSMRecord = {
      id: oldRec?.id || `rec_${expandedCashier}_${date}_${Date.now()}`,
      date,
      cashier: expandedCashier,
      
      psmTarget: targetPSM,
      psmActual: actualPSM,
      
      pwpTarget: targetPWP,
      pwpActual: actualPWP,
      
      serbaTarget: targetSerba,
      serbaActual: actualSerba,
      
      segerTarget: targetSeger,
      segerActual: actualSeger,
      
      memberTarget: targetMember,
      memberActual: actualMember,

      // legacy backends
      target: targetPSM,
      actualTarget: actualPSM,
      acvTarget: targetPWP,
      acvActual: actualPWP,
      
      notes: notes.trim() || undefined
    };

    onSaveRecord(updatedRecord);
    setExpandedCashier(null);
  };

  // Render difference badges
  const renderDifferenceBadge = (actual: number, target: number, isFilled: boolean) => {
    if (!isFilled) return <span className="text-slate-300 font-mono">-</span>;
    const diff = actual - target;
    
    if (diff > 0) {
      return (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold leading-none bg-emerald-50 text-emerald-700 border border-emerald-100">
          +{diff}
        </span>
      );
    } else if (diff === 0) {
      return (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold leading-none bg-blue-50 text-blue-700 border border-blue-100">
          0
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold leading-none bg-rose-50 text-rose-700 border border-rose-100">
          {diff}
        </span>
      );
    }
  };

  return (
    <div id="spreadsheet-container" className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
      
      {/* Header section explaining the spreadsheet */}
      <div className="p-5 border-b border-slate-100 bg-linear-to-r from-slate-50/50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              🎯
            </span>
            Lembar Kerja Capaian Kasir (Spreadsheet)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tekan <strong className="text-blue-600 font-bold">Nama Kasir</strong> untuk mengisi semua target (PSM, PWP, Serba Gratis, Seger, Member).
          </p>
        </div>
        
        {/* Autosave badge indicator */}
        <div className="flex items-center gap-2 text-xs bg-indigo-50/80 text-indigo-700 border border-indigo-100 px-3.5 py-2 rounded-xl font-bold animate-pulse shrink-0">
          <Sparkles size={14} className="text-indigo-500" />
          Pencatatan Otomatis Aktif
        </div>
      </div>

      {/* Primary Table view */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-6 font-semibold w-16 text-center">No</th>
              <th className="py-3 px-6 font-semibold">Nama Kasir (Tekan Nama)</th>
              <th className="py-3 px-6 font-semibold text-center">Selisih PSM</th>
              <th className="py-3 px-2 font-semibold text-center">Selisih PWP</th>
              <th className="py-3 px-2 font-semibold text-center">Selisih Serba Gratis</th>
              <th className="py-3 px-2 font-semibold text-center">Selisih Seger</th>
              <th className="py-3 px-2 font-semibold text-center">Selisih New Member</th>
              <th className="py-3 px-6 font-semibold text-center">Keterangan</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100">
            {CASHIERS.map((name, index) => {
              const record = getRecordForCashier(name);
              const isFilled = record !== null;
              const isExpanded = expandedCashier === name;

              // Extract values
              const psmT = record ? record.psmTarget : 0;
              const psmA = record ? record.psmActual : 0;
              
              const pwpT = record ? record.pwpTarget : 0;
              const pwpA = record ? record.pwpActual : 0;
              
              const serbaT = record ? record.serbaTarget : 0;
              const serbaA = record ? record.serbaActual : 0;
              
              const segerT = record ? record.segerTarget : 0;
              const segerA = record ? record.segerActual : 0;
              
              const memberT = record ? record.memberTarget : 0;
              const memberA = record ? record.memberActual : 0;

              return (
                <React.Fragment key={name}>
                  {/* Outer Main Row */}
                  <tr className={`hover:bg-slate-50/40 transition-colors ${isExpanded ? 'bg-indigo-50/10' : ''}`}>
                    {/* Index */}
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono font-medium text-center">
                      {index + 1}
                    </td>

                    {/* Cashier button - Toggles expanding card */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        id={`cashier-expand-btn-${name}`}
                        type="button"
                        onClick={() => handleToggleExpand(name)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold border transition-all duration-200 shadow-xs cursor-pointer ${
                          isExpanded 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${isExpanded ? 'bg-white animate-ping' : 'bg-blue-500'}`} />
                        <span>{name}</span>
                        {isExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1 text-slate-400" />}
                      </button>
                    </td>

                    {/* Difference metric columns in plain digits */}
                    <td className="py-4 px-2 text-center">
                      {renderDifferenceBadge(psmA, psmT, isFilled)}
                    </td>

                    <td className="py-4 px-2 text-center">
                      {renderDifferenceBadge(pwpA, pwpT, isFilled)}
                    </td>

                    <td className="py-4 px-2 text-center">
                      {renderDifferenceBadge(serbaA, serbaT, isFilled)}
                    </td>

                    <td className="py-4 px-2 text-center">
                      {renderDifferenceBadge(segerA, segerT, isFilled)}
                    </td>

                    <td className="py-4 px-2 text-center">
                      {renderDifferenceBadge(memberA, memberT, isFilled)}
                    </td>

                    {/* Description or fill shortcut */}
                    <td className="py-4 px-6 text-center">
                      {isFilled ? (
                        record.notes ? (
                          <span 
                            className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] truncate max-w-[130px] font-medium inline-block align-middle cursor-help"
                            title={record.notes}
                          >
                            {record.notes}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                            <CheckCircle2 size={13} className="text-emerald-500" />
                            Lengkap
                          </span>
                        )
                      ) : (
                        <button
                          id={`quick-open-${name}`}
                          onClick={() => handleToggleExpand(name)}
                          className="font-bold text-xs text-indigo-500 hover:text-indigo-700 cursor-pointer hover:underline"
                        >
                          Isi Laporan
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Collapsible Edit and View Panel (Shown when cashline name is clicked) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-y border-slate-150">
                        <td colSpan={8} className="p-5 md:p-6">
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <form 
                              onSubmit={handleInlineSubmit}
                              className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-md max-w-4xl mx-auto space-y-6"
                            >
                              
                              {/* Expanded Form Title */}
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🎯</span>
                                  <div>
                                    <h4 className="text-sm font-extrabold text-slate-800">
                                      Isi Target & Aktual untuk <span className="text-blue-600 block sm:inline">{name}</span>
                                    </h4>
                                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wider">
                                      Perhitungan selisih real-time
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setExpandedCashier(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full cursor-pointer"
                                >
                                  <X size={16} />
                                </button>
                              </div>

                              {/* Form Inputs Grid - 5 Target Categories */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                
                                {/* 1. PSM Box */}
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-xs font-bold text-slate-700">1. PSM</span>
                                    {renderDifferenceBadge(actualPSM, targetPSM, true)}
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Target</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={targetPSM === 0 ? '' : targetPSM}
                                        onChange={(e) => setTargetPSM(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Aktual</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={actualPSM === 0 ? '' : actualPSM}
                                        onChange={(e) => setActualPSM(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 2. PWP Box */}
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-xs font-bold text-slate-700">2. PWP</span>
                                    {renderDifferenceBadge(actualPWP, targetPWP, true)}
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Target</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={targetPWP === 0 ? '' : targetPWP}
                                        onChange={(e) => setTargetPWP(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Aktual</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={actualPWP === 0 ? '' : actualPWP}
                                        onChange={(e) => setActualPWP(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 3. Serba Gratis Box */}
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-xs font-bold text-slate-700">3. Serba Gratis</span>
                                    {renderDifferenceBadge(actualSerba, targetSerba, true)}
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Target</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={targetSerba === 0 ? '' : targetSerba}
                                        onChange={(e) => setSerbaTarget(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Aktual</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={actualSerba === 0 ? '' : actualSerba}
                                        onChange={(e) => setSerbaActual(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 4. Seger Box */}
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-xs font-bold text-slate-700">4. Seger</span>
                                    {renderDifferenceBadge(actualSeger, targetSeger, true)}
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Target</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={targetSeger === 0 ? '' : targetSeger}
                                        onChange={(e) => setTargetSeger(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Aktual</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={actualSeger === 0 ? '' : actualSeger}
                                        onChange={(e) => setActualSeger(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 5. New Member Box */}
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                    <span className="text-xs font-bold text-slate-700">5. New Member</span>
                                    {renderDifferenceBadge(actualMember, targetMember, true)}
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Target</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={targetMember === 0 ? '' : targetMember}
                                        onChange={(e) => setTargetMember(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Aktual</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={actualMember === 0 ? '' : actualMember}
                                        onChange={(e) => setActualMember(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                  </div>
                                </div>

                              </div>

                              {/* Target Notes & Description textarea row */}
                              <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  Catatan Shift / Keterangan Tambahan
                                </label>
                                <textarea
                                  rows={2}
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder="Contoh: Terjadi kendala stok habis untuk produk PSM, kasir lancar menawarkan tebus murah, dll..."
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                              </div>

                              {/* Row action button handles */}
                              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 bg-slate-50/50 -m-6 p-4 rounded-b-2xl">
                                <button
                                  type="button"
                                  onClick={() => setExpandedCashier(null)}
                                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                                >
                                  Batal
                                </button>
                                <button
                                  type="submit"
                                  className="px-5 py-2 text-xs font-extrabold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:brightness-105 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer transition-all"
                                >
                                  <Save size={14} />
                                  Simpan Laporan
                                </button>
                              </div>

                            </form>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>

                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helper Legend explaining columns and symbols */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            &gt; 0 : Surplus (Melebihi Target)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            0 : Lunas (Mencapai Target Pas)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            &lt; 0 : Defisit (Kurang Dari Target)
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1 justify-end">
          <Info size={12} className="text-slate-300" />
          Rumus Selisih: Realisasi Aktual - Sasaran Target
        </div>
      </div>
    </div>
  );
}
