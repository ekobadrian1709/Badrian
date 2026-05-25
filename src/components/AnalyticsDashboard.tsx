import { useState } from 'react';
import { PSMRecord, CashierName } from '../types';
import { calculateSummaries, formatPercent, formatNumber, CASHIERS } from '../utils/helpers';
import { Trophy, TrendingUp, Sparkles, AlertCircle, ShoppingCart, Percent, UserPlus, Calendar, Filter, Sparkle } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsDashboardProps {
  records: PSMRecord[];
}

export default function AnalyticsDashboard({ records }: AnalyticsDashboardProps) {
  // State for cashier filter selection
  const [selectedCashier, setSelectedCashier] = useState<CashierName | 'all'>('all');

  // Filter records based on selected cashier
  const activeRecords = selectedCashier === 'all'
    ? records
    : records.filter(r => r.cashier === selectedCashier);

  const summaries = calculateSummaries(records);
  
  // Calculate dynamic statistics based on filter state by summing all 5 categories
  const totalTargetStore = activeRecords.reduce((sum, r) => {
    return sum + (r.psmTarget || 0) + (r.pwpTarget || 0) + (r.serbaTarget || 0) + (r.segerTarget || 0) + (r.memberTarget || 0);
  }, 0);
  
  const totalActualStore = activeRecords.reduce((sum, r) => {
    return sum + (r.psmActual || 0) + (r.pwpActual || 0) + (r.serbaActual || 0) + (r.segerActual || 0) + (r.memberActual || 0);
  }, 0);

  const realStoreAchievementPercent = totalTargetStore > 0 ? (totalActualStore / totalTargetStore) * 100 : 0;

  // Track new members terekrut
  const totalNewMembers = activeRecords.reduce((sum, r) => sum + (r.memberActual || 0), 0);
  const totalNewMembersTarget = activeRecords.reduce((sum, r) => sum + (r.memberTarget || 0), 0);

  const uniqueDays = Array.from(new Set(activeRecords.map(r => r.date))).length;

  // Find the top cashier overall based on percentage achievement
  const sortedByAchievement = [...summaries].sort((a, b) => b.avgTargetAchievement - a.avgTargetAchievement);
  const topCashier = sortedByAchievement[0];

  // Specific category counters for the details grid
  const catPSMTarget = activeRecords.reduce((sum, r) => sum + (r.psmTarget || 0), 0);
  const catPSMActual = activeRecords.reduce((sum, r) => sum + (r.psmActual || 0), 0);

  const catPWPTarget = activeRecords.reduce((sum, r) => sum + (r.pwpTarget || 0), 0);
  const catPWPActual = activeRecords.reduce((sum, r) => sum + (r.pwpActual || 0), 0);

  const catSerbaTarget = activeRecords.reduce((sum, r) => sum + (r.serbaTarget || 0), 0);
  const catSerbaActual = activeRecords.reduce((sum, r) => sum + (r.serbaActual || 0), 0);

  const catSegerTarget = activeRecords.reduce((sum, r) => sum + (r.segerTarget || 0), 0);
  const catSegerActual = activeRecords.reduce((sum, r) => sum + (r.segerActual || 0), 0);

  const catMemberTarget = activeRecords.reduce((sum, r) => sum + (r.memberTarget || 0), 0);
  const catMemberActual = activeRecords.reduce((sum, r) => sum + (r.memberActual || 0), 0);

  // Colors for leaderboard rankings
  const getRankBadgeColor = (r: number) => {
    switch (r) {
      case 1: return { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: '🏆 Juara 1' };
      case 2: return { bg: 'bg-slate-200 text-slate-800 border-slate-300', text: '🥈 Juara 2' };
      case 3: return { bg: 'bg-amber-50 text-amber-900 border-amber-200/50', text: '🥉 Juara 3' };
      default: return { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: `Peringkat ${r}` };
    }
  };

  // Grouped breakdown array for visual render
  const categoriesBreakdown = [
    { name: 'Produk Spesial Mingguan (PSM)', target: catPSMTarget, actual: catPSMActual, icon: '📦', color: 'blue' },
    { name: 'Purchase With Purchase (PWP)', target: catPWPTarget, actual: catPWPActual, icon: '🏷️', color: 'indigo' },
    { name: 'Serba Gratis Promo', target: catSerbaTarget, actual: catSerbaActual, icon: '🍿', color: 'violet' },
    { name: 'Susu & Minuman Segar', target: catSegerTarget, actual: catSegerActual, icon: '🥛', color: 'emerald' },
    { name: 'Perekrutan New Member', target: catMemberTarget, actual: catMemberActual, icon: '👥', color: 'amber' }
  ];

  // Chronological timeline data for individual cashier mode
  const cashierDays = [...activeRecords]
    .sort((a, b) => a.date.localeCompare(b.date)) // oldest to newest
    .slice(-5); // last 5 recorded days

  // Get dynamic max limit for SVG Chart Y-axis scale based on sum values
  const getSumMax = (r: PSMRecord) => {
    return (r.psmActual || 0) + (r.pwpActual || 0) + (r.serbaActual || 0) + (r.segerActual || 0) + (r.memberActual || 0);
  };
  const getSumTarget = (r: PSMRecord) => {
    return (r.psmTarget || 0) + (r.pwpTarget || 0) + (r.serbaTarget || 0) + (r.segerTarget || 0) + (r.memberTarget || 0);
  };

  const maxChartValue = selectedCashier === 'all'
    ? Math.max(...summaries.map(s => Math.max(s.totalTarget, s.totalActual)), 100)
    : Math.max(...cashierDays.map(r => Math.max(getSumTarget(r), getSumMax(r))), 50);

  // Helper formatting for difference
  const formatDiffText = (actual: number, target: number) => {
    const d = actual - target;
    if (d > 0) return `+${d}`;
    return `${d}`;
  };

  return (
    <div className="space-y-6">
      
      {/* 0. Filter Panel */}
      <div id="analytics-filter-controls" className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Filter size={18} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              Penyaringan Dashboard Analitik
            </h4>
            <p className="text-xs text-slate-400 font-medium max-w-lg">
              Saring semua grafik, statistik, dan pencapaian target di bawah berdasarkan kasir tertentu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label htmlFor="cashier-filter" className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Pilih Kasir:
          </label>
          <select
            id="cashier-filter"
            value={selectedCashier}
            onChange={(e) => setSelectedCashier(e.target.value as CashierName | 'all')}
            className="w-full md:w-60 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl py-2 px-3.5 text-xs font-bold text-slate-700 focus:outline-none transition-all cursor-pointer"
          >
            <option value="all">🌐 Semua Kasir (Gabungan Toko)</option>
            <option value="Eliana">👩 Eliana</option>
            <option value="Gea">👩 Gea</option>
            <option value="Mala">👩 Mala</option>
            <option value="Devi">👩 Devi</option>
            <option value="Eko">👨 Eko</option>
          </select>
        </div>
      </div>
      
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Realisasi (Pcs) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart size={22} />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">
              {selectedCashier === 'all' ? 'Total Item Terjual' : `Pencapaian Item (${selectedCashier})`}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {formatNumber(totalActualStore)}
              </span>
              <span className="text-xs text-slate-400 font-medium">pcs</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Dari sasaran {formatNumber(totalTargetStore)} pcs target
            </p>
          </div>
        </div>

        {/* Card 2: Rerata Capaian Target */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Percent size={22} />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">
              Rata-rata Capaian Target
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {formatPercent(realStoreAchievementPercent)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Akumulasi semua kelompok belanja
            </p>
          </div>
        </div>

        {/* Card 3: New Member Terekrut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <UserPlus size={22} />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">
              {selectedCashier === 'all' ? 'Total Member Baru' : `Member oleh ${selectedCashier}`}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {totalNewMembers}
              </span>
              <span className="text-xs text-slate-400 font-medium">orang</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Rasio target: {totalNewMembers}/{totalNewMembersTarget}
            </p>
          </div>
        </div>

        {/* Card 4: Total Hari Tercover */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar size={22} />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">
              Jumlah Hari Terisi
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {uniqueDays}
              </span>
              <span className="text-xs text-slate-400 font-medium">Hari</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Tercatat di basis data lokal
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual Breakdown of All 5 Targets with +/- Deviation Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs text-left">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-500 animate-spin" />
              Rincian Kurang / Lebih per Kategori Belanja
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 italic">
              Menampilkan selisih riil berdasarkan angka (Actual - Target) dari hasil pencatatan {selectedCashier === 'all' ? 'semua kasir' : 'kasir ' + selectedCashier}
            </p>
          </div>
        </div>

        {/* Breakdown Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoriesBreakdown.map((cat) => {
            const diffNum = cat.actual - cat.target;
            const isSurplus = diffNum > 0;
            const isZero = diffNum === 0;

            let cardBg = 'bg-slate-50 border-slate-200';
            let textAccent = 'text-slate-700';
            let badgeBg = 'bg-slate-100 text-slate-600 border-slate-200';

            if (isSurplus) {
              cardBg = 'bg-emerald-50/50 border-emerald-100';
              textAccent = 'text-emerald-800';
              badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            } else if (isZero) {
              cardBg = 'bg-blue-50/50 border-blue-100';
              textAccent = 'text-blue-800';
              badgeBg = 'bg-blue-100 text-blue-800 border-blue-200';
            } else {
              cardBg = 'bg-rose-50/50 border-rose-100';
              textAccent = 'text-rose-800';
              badgeBg = 'bg-rose-100 text-rose-800 border-rose-200';
            }

            return (
              <div key={cat.name} className={`p-4 border rounded-xl space-y-3 shadow-2xs ${cardBg}`}>
                <div className="flex items-start justify-between">
                  <span className="text-2xl" role="img" aria-label={cat.name}>{cat.icon}</span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 border rounded-md font-mono ${badgeBg}`}>
                    {isSurplus ? `+${diffNum}` : diffNum}
                  </span>
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-slate-700 truncate" title={cat.name}>
                    {cat.name}
                  </h5>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Target/Aktual</span>
                    <span className="text-xs font-extrabold text-slate-800 font-mono">
                      {cat.actual}/{cat.target}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium italic block text-right">
                    {isSurplus ? 'Lebih (Surplus)' : isZero ? 'Lunas Sesuai' : 'Kurang (Defisit)'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Grid: Leaderboard & SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs lg:col-span-5 flex flex-col justify-between text-left">
          <div>
            <div className="mb-5">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="text-amber-500" size={18} />
                Klasemen Kontribusi Toko (5 Kasir)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Urutan kontribusi berdasarkan persentase capaian seluruh 5 kategori.
              </p>
            </div>

            {/* List */}
            <div className="space-y-3">
              {summaries
                .sort((a, b) => b.avgTargetAchievement - a.avgTargetAchievement)
                .map((sum, index) => {
                  const colors = getRankBadgeColor(index + 1);
                  const isSelected = selectedCashier === sum.name;
                  
                  return (
                    <div
                      key={sum.name}
                      onClick={() => setSelectedCashier(isSelected ? 'all' : sum.name)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between hover:shadow-xs transition-all cursor-pointer bg-linear-to-r from-slate-50/20 to-white ${
                        isSelected 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-md shadow-indigo-500/5' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 border rounded-full ${colors.bg}`}>
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-sm font-extrabold text-slate-800 block">
                            {sum.name}
                          </span>
                          <span className="text-[10.5px] text-slate-400 font-semibold font-mono">
                            {sum.totalActual} dari {sum.totalTarget} terjual
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-slate-700 block font-mono">
                          {formatPercent(sum.avgTargetAchievement)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest">
                          Capaian
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/60 flex items-start gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-indigo-900 block">
                Petunjuk Klasifikasi
              </span>
              <p className="text-[11px] text-indigo-700 mt-0.5 leading-relaxed">
                Klasemen dihitung secara adil dari total akumulasi produk PSM, PWP, Serba Gratis, Seger, dan New Member yang lunas atau terekrut dibandingkan target harian masing-masing kasir.
              </p>
            </div>
          </div>
        </div>

        {/* SVG Chart Visualizer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs lg:col-span-7 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={18} />
                  {selectedCashier === 'all' 
                    ? 'Total Target vs Target Tercapai Gabungan' 
                    : `Siklus Target Terjual: ${selectedCashier}`}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {selectedCashier === 'all'
                    ? 'Menilai performa total kuantitas unit (gabungan 5 target) per individu kasir'
                    : `Evaluasi komparasi kuantitas (gabungan 5 target) harian ${selectedCashier} (5 hari terakhir)`}
                </p>
              </div>
            </div>

            {/* Custom SVG Drawing */}
            <div className="relative w-full h-64 bg-slate-50/50 rounded-xl border border-slate-100/60 p-4">
              <svg viewBox="0 0 500 220" className="w-full h-full">
                {/* Y-axis grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = 180 - ratio * 140;
                  return (
                    <g key={i}>
                      <line
                        x1="40"
                        y1={yVal}
                        x2="480"
                        y2={yVal}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x="10"
                        y={yVal + 4}
                        fontFamily="monospace"
                        fontSize="9"
                        fontWeight="semibold"
                        fill="#94a3b8"
                        textAnchor="start"
                      >
                        {Math.round(ratio * maxChartValue)}
                      </text>
                    </g>
                  );
                })}

                {/* Bars column rendering dynamically */}
                {selectedCashier === 'all' ? (
                  summaries.map((sum, index) => {
                    const columnSpacing = 85; 
                    const startX = 65 + index * columnSpacing;
                    
                    const targetHeight = (sum.totalTarget / maxChartValue) * 140 || 3;
                    const actualHeight = (sum.totalActual / maxChartValue) * 140 || 3;

                    const targetY = 180 - targetHeight;
                    const actualY = 180 - actualHeight;

                    return (
                      <g key={sum.name} className="group cursor-help">
                        {/* Target (Left side grey bar) */}
                        <rect
                          x={startX}
                          y={targetY}
                          width="16"
                          height={targetHeight}
                          rx="3"
                          fill="#cbd5e1"
                        />

                        {/* Actual (Right side blue bar) */}
                        <rect
                          x={startX + 20}
                          y={actualY}
                          width="16"
                          height={actualHeight}
                          rx="3"
                          fill="url(#blueIndigoGradient)"
                        />

                        {/* Text values */}
                        <text
                          x={startX + 18}
                          y={Math.min(targetY, actualY) - 8}
                          fontFamily="monospace"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#475569"
                          textAnchor="middle"
                        >
                          {sum.totalActual}/{sum.totalTarget}
                        </text>

                        {/* Name */}
                        <text
                          x={startX + 18}
                          y="198"
                          fontFamily="sans-serif"
                          fontSize="10px"
                          fontWeight="bold"
                          fill="#475569"
                          textAnchor="middle"
                        >
                          {sum.name}
                        </text>

                        {/* Percentage */}
                        <text
                          x={startX + 18}
                          y="212"
                          fontFamily="monospace"
                          fontSize="9px"
                          fontWeight="extrabold"
                          fill={sum.avgTargetAchievement >= 100 ? '#10b981' : '#f59e0b'}
                          textAnchor="middle"
                        >
                          {sum.avgTargetAchievement.toFixed(0)}%
                        </text>
                      </g>
                    );
                  })
                ) : (
                  cashierDays.map((rec, index) => {
                    const columnSpacing = 85; 
                    const startX = 65 + index * columnSpacing;
                    
                    const tVal = getSumTarget(rec);
                    const aVal = getSumMax(rec);

                    const targetHeight = (tVal / maxChartValue) * 140 || 3;
                    const actualHeight = (aVal / maxChartValue) * 140 || 3;

                    const targetY = 180 - targetHeight;
                    const actualY = 180 - actualHeight;

                    const achievement = tVal > 0 ? (aVal / tVal) * 100 : 0;
                    const partsCheck = rec.date.split('-');
                    const displayLabel = partsCheck.length === 3 ? `${partsCheck[2]}/${partsCheck[1]}` : rec.date;

                    return (
                      <g key={rec.id} className="group cursor-help">
                        {/* Target */}
                        <rect
                          x={startX}
                          y={targetY}
                          width="16"
                          height={targetHeight}
                          rx="3"
                          fill="#cbd5e1"
                        />

                        {/* Actual */}
                        <rect
                          x={startX + 20}
                          y={actualY}
                          width="16"
                          height={actualHeight}
                          rx="3"
                          fill="url(#blueIndigoGradient)"
                        />

                        {/* Values */}
                        <text
                          x={startX + 18}
                          y={Math.min(targetY, actualY) - 8}
                          fontFamily="monospace"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#475569"
                          textAnchor="middle"
                        >
                          {aVal}/{tVal}
                        </text>

                        {/* Date */}
                        <text
                          x={startX + 18}
                          y="198"
                          fontFamily="sans-serif"
                          fontSize="10px"
                          fontWeight="bold"
                          fill="#475569"
                          textAnchor="middle"
                        >
                          {displayLabel}
                        </text>

                        {/* Percent */}
                        <text
                          x={startX + 18}
                          y="212"
                          fontFamily="monospace"
                          fontSize="9px"
                          fontWeight="extrabold"
                          fill={achievement >= 100 ? '#10b981' : '#f59e0b'}
                          textAnchor="middle"
                        >
                          {achievement.toFixed(0)}%
                        </text>
                      </g>
                    );
                  })
                )}

                <defs>
                  <linearGradient id="blueIndigoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-300 inline-block" />
              <span>Target (Gabungan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
              <span>Aktual Terjual (Gabungan)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
