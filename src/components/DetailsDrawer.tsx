import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Sparkles, AlertCircle, Bookmark } from 'lucide-react';
import { CashierName, PSMRecord } from '../types';
import { formatIndonesianDate } from '../utils/helpers';

interface DetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cashierName: CashierName | null;
  date: string;
  record: PSMRecord | null;
  onSave: (record: PSMRecord) => void;
}

export default function DetailsDrawer({
  isOpen,
  onClose,
  cashierName,
  date,
  record,
  onSave
}: DetailsDrawerProps) {
  // Local states for the 5 target categories
  const [psmTarget, setPsmTarget] = useState<number>(50);
  const [psmActual, setPsmActual] = useState<number>(0);

  const [pwpTarget, setPwpTarget] = useState<number>(25);
  const [pwpActual, setPwpActual] = useState<number>(0);

  const [serbaTarget, setSerbaTarget] = useState<number>(20);
  const [serbaActual, setSerbaActual] = useState<number>(0);

  const [segerTarget, setSegerTarget] = useState<number>(15);
  const [segerActual, setSegerActual] = useState<number>(0);

  const [memberTarget, setMemberTarget] = useState<number>(5);
  const [memberActual, setMemberActual] = useState<number>(0);

  const [notes, setNotes] = useState<string>('');

  // Synchronize state when the record loads or changes
  useEffect(() => {
    if (record) {
      setPsmTarget(record.psmTarget || 0);
      setPsmActual(record.psmActual || 0);
      
      setPwpTarget(record.pwpTarget || 0);
      setPwpActual(record.pwpActual || 0);
      
      setSerbaTarget(record.serbaTarget || 0);
      setSerbaActual(record.serbaActual || 0);
      
      setSegerTarget(record.segerTarget || 0);
      setSegerActual(record.segerActual || 0);
      
      setMemberTarget(record.memberTarget || 0);
      setMemberActual(record.memberActual || 0);
      
      setNotes(record.notes || '');
    } else {
      // Sensible defaults
      setPsmTarget(50);
      setPsmActual(0);
      
      setPwpTarget(25);
      setPwpActual(0);
      
      setSerbaTarget(20);
      setSerbaActual(0);
      
      setSegerTarget(15);
      setSegerActual(0);
      
      setMemberTarget(5);
      setMemberActual(0);
      
      setNotes('');
    }
  }, [record, cashierName, date]);

  if (!cashierName) return null;

  // Render difference badges helper
  const renderItemDifferenceBadge = (actual: number, target: number) => {
    const diff = actual - target;
    if (diff > 0) {
      return (
        <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold font-mono">
          +{diff} Qty (Lebih)
        </span>
      );
    } else if (diff === 0) {
      return (
        <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold font-mono font-medium">
          ✓ Lunas (Pas)
        </span>
      );
    } else {
      return (
        <span className="inline-flex px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold font-mono">
          {diff} Qty (Kurang)
        </span>
      );
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecord: PSMRecord = {
      id: record?.id || `rec_${cashierName}_${date}_${Date.now()}`,
      date,
      cashier: cashierName,
      
      psmTarget,
      psmActual,
      
      pwpTarget,
      pwpActual,
      
      serbaTarget,
      serbaActual,
      
      segerTarget,
      segerActual,
      
      memberTarget,
      memberActual,

      // legacy backends
      target: psmTarget,
      actualTarget: psmActual,
      acvTarget: pwpTarget,
      acvActual: pwpActual,
      
      notes: notes.trim() || undefined
    };
    onSave(updatedRecord);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Screen */}
          <motion.div
            id="details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 z-40 cursor-pointer"
          />

          {/* Side Drawer Content */}
          <motion.div
            id="details-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-slate-150"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                    Editor Target & Aktual Kasir
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">
                    {record ? 'Edit Mode' : 'New Draft'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{cashierName}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold">
                  Tanggal Laporan: {formatIndonesianDate(date)}
                </p>
              </div>
              <button
                id="close-drawer-btn"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="Tutup Panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Entry Form */}
            <form onSubmit={handleSubmit} className="flex-1 p-6 flex flex-col justify-between space-y-6">
              
              <div className="space-y-5">
                
                {/* 1. Target PSM */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <span className="p-1 px-1.5 bg-blue-150 text-blue-700 rounded text-[10px] font-black">1</span>
                      A. Target Produk Spesial Mingguan (PSM)
                    </span>
                    {renderItemDifferenceBadge(psmActual, psmTarget)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Target (Qty)</span>
                      <input
                        type="number"
                        min="0"
                        value={psmTarget === 0 ? '' : psmTarget}
                        onChange={(e) => setPsmTarget(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Aktual Realisasi</span>
                      <input
                        type="number"
                        min="0"
                        value={psmActual === 0 ? '' : psmActual}
                        onChange={(e) => setPsmActual(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Target PWP */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <span className="p-1 px-1.5 bg-indigo-150 text-indigo-700 rounded text-[10px] font-black">2</span>
                      B. Target Purchase With Purchase (PWP)
                    </span>
                    {renderItemDifferenceBadge(pwpActual, pwpTarget)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Target (Qty)</span>
                      <input
                        type="number"
                        min="0"
                        value={pwpTarget === 0 ? '' : pwpTarget}
                        onChange={(e) => setPwpTarget(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Aktual Realisasi</span>
                      <input
                        type="number"
                        min="0"
                        value={pwpActual === 0 ? '' : pwpActual}
                        onChange={(e) => setPwpActual(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Target Serba Gratis */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <span className="p-1 px-1.5 bg-violet-150 text-violet-700 rounded text-[10px] font-black">3</span>
                      C. Target Serba Gratis (Kupon Promo)
                    </span>
                    {renderItemDifferenceBadge(serbaActual, serbaTarget)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Target (Qty)</span>
                      <input
                        type="number"
                        min="0"
                        value={serbaTarget === 0 ? '' : serbaTarget}
                        onChange={(e) => setSerbaTarget(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Aktual Realisasi</span>
                      <input
                        type="number"
                        min="0"
                        value={serbaActual === 0 ? '' : serbaActual}
                        onChange={(e) => setSerbaActual(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Target Seger */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <span className="p-1 px-1.5 bg-emerald-150 text-emerald-700 rounded text-[10px] font-black">4</span>
                      D. Target Seger (Susu & Minuman Segar)
                    </span>
                    {renderItemDifferenceBadge(segerActual, segerTarget)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Target (Qty)</span>
                      <input
                        type="number"
                        min="0"
                        value={segerTarget === 0 ? '' : segerTarget}
                        onChange={(e) => setSegerTarget(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Aktual Realisasi</span>
                      <input
                        type="number"
                        min="0"
                        value={segerActual === 0 ? '' : segerActual}
                        onChange={(e) => setSegerActual(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Target New Member */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <span className="p-1 px-1.5 bg-amber-150 text-amber-700 rounded text-[10px] font-black">5</span>
                      E. Target Perekrutan New Member
                    </span>
                    {renderItemDifferenceBadge(memberActual, memberTarget)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Target (Orang)</span>
                      <input
                        type="number"
                        min="0"
                        value={memberTarget === 0 ? '' : memberTarget}
                        onChange={(e) => setMemberTarget(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Aktual Terekrut</span>
                      <input
                        type="number"
                        min="0"
                        value={memberActual === 0 ? '' : memberActual}
                        onChange={(e) => setMemberActual(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Notes Textarea */}
                <div className="space-y-2 pt-2">
                  <label htmlFor="notes" className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Bookmark size={13} />
                    Catatan Shift Kasir
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Sangat aktif mengajak pelanggan mendaftarkan member..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2.5 px-4 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-indigo-500/10 hover:shadow-lg rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save size={15} />
                  Simpan Laporan
                </button>
              </div>

            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
