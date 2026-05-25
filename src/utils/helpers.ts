import { PSMRecord, CashierName, CashierSummary } from '../types';

export const CASHIERS: CashierName[] = ['Eliana', 'Gea', 'Mala', 'Devi', 'Eko'];

// Standard PSM Product Targets for a minimarket context:
// Target typically in transaction frequency or items sold: e.g. 50 pcs/transactions
// ACV typically in Rupiah (e.g. Average Coupon Value or active sales value per customer): e.g. Rp 25,000 - Rp 50,000
export const INITIAL_RECORDS: PSMRecord[] = [
  // 2026-05-25 (Today)
  {
    id: 'rec_1a',
    date: '2026-05-25',
    cashier: 'Eliana',
    psmTarget: 50,
    psmActual: 48,
    pwpTarget: 30,
    pwpActual: 28,
    serbaTarget: 25,
    serbaActual: 26,
    segerTarget: 15,
    segerActual: 13,
    memberTarget: 5,
    memberActual: 4,
    target: 50,
    actualTarget: 48,
    acvTarget: 30,
    acvActual: 28,
    notes: 'Kinerja sangat baik, hampir mencapai target pencapaian'
  },
  {
    id: 'rec_1b',
    date: '2026-05-25',
    cashier: 'Gea',
    psmTarget: 50,
    psmActual: 52,
    pwpTarget: 25,
    pwpActual: 22,
    serbaTarget: 20,
    serbaActual: 18,
    segerTarget: 15,
    segerActual: 15,
    memberTarget: 5,
    memberActual: 6,
    target: 50,
    actualTarget: 52,
    acvTarget: 25,
    acvActual: 22,
    notes: 'Sangat baik dalam perekrutan new member!'
  },
  {
    id: 'rec_1c',
    date: '2026-05-25',
    cashier: 'Mala',
    psmTarget: 60,
    psmActual: 45,
    pwpTarget: 35,
    pwpActual: 30,
    serbaTarget: 25,
    serbaActual: 20,
    segerTarget: 20,
    segerActual: 17,
    memberTarget: 8,
    memberActual: 5,
    target: 60,
    actualTarget: 45,
    acvTarget: 35,
    acvActual: 30,
    notes: 'Toko agak sepi pada shift siang'
  },
  {
    id: 'rec_1d',
    date: '2026-05-25',
    cashier: 'Devi',
    psmTarget: 50,
    psmActual: 55,
    pwpTarget: 25,
    pwpActual: 26,
    serbaTarget: 20,
    serbaActual: 21,
    segerTarget: 15,
    segerActual: 18,
    memberTarget: 5,
    memberActual: 5,
    target: 50,
    actualTarget: 55,
    acvTarget: 25,
    acvActual: 26,
    notes: 'Melewati seluruh target harian!'
  },
  {
    id: 'rec_1e',
    date: '2026-05-25',
    cashier: 'Eko',
    psmTarget: 60,
    psmActual: 58,
    pwpTarget: 35,
    pwpActual: 38,
    serbaTarget: 30,
    serbaActual: 28,
    segerTarget: 20,
    segerActual: 19,
    memberTarget: 8,
    memberActual: 9,
    target: 60,
    actualTarget: 58,
    acvTarget: 35,
    acvActual: 38,
    notes: 'Hampir lunas target PSM, segmen PWP tercapai'
  },

  // 2026-05-24
  {
    id: 'rec_2a',
    date: '2026-05-24',
    cashier: 'Eliana',
    psmTarget: 40,
    psmActual: 42,
    pwpTarget: 20,
    pwpActual: 18,
    serbaTarget: 15,
    serbaActual: 16,
    segerTarget: 10,
    segerActual: 11,
    memberTarget: 4,
    memberActual: 3,
    target: 40,
    actualTarget: 42,
    acvTarget: 20,
    acvActual: 18,
    notes: 'Selesai shift malam dengan baik'
  },
  {
    id: 'rec_2b',
    date: '2026-05-24',
    cashier: 'Gea',
    psmTarget: 45,
    psmActual: 40,
    pwpTarget: 25,
    pwpActual: 25,
    serbaTarget: 20,
    serbaActual: 18,
    segerTarget: 15,
    segerActual: 12,
    memberTarget: 5,
    memberActual: 5,
    target: 45,
    actualTarget: 40,
    acvTarget: 25,
    acvActual: 25,
    notes: 'Kendala mesin EDC di kasir 2'
  },
  {
    id: 'rec_2c',
    date: '2026-05-24',
    cashier: 'Mala',
    psmTarget: 45,
    psmActual: 46,
    pwpTarget: 25,
    pwpActual: 24,
    serbaTarget: 15,
    serbaActual: 16,
    segerTarget: 10,
    segerActual: 11,
    memberTarget: 5,
    memberActual: 5,
    target: 45,
    actualTarget: 46,
    acvTarget: 25,
    acvActual: 24,
    notes: 'Penjualan sabun cuci piring PSM meningkat'
  },
  {
    id: 'rec_2d',
    date: '2026-05-24',
    cashier: 'Devi',
    psmTarget: 40,
    psmActual: 38,
    pwpTarget: 20,
    pwpActual: 19,
    serbaTarget: 15,
    serbaActual: 14,
    segerTarget: 10,
    segerActual: 9,
    memberTarget: 4,
    memberActual: 3,
    target: 40,
    actualTarget: 38,
    acvTarget: 20,
    acvActual: 19,
  },
  {
    id: 'rec_2e',
    date: '2026-05-24',
    cashier: 'Eko',
    psmTarget: 50,
    psmActual: 55,
    pwpTarget: 30,
    pwpActual: 32,
    serbaTarget: 25,
    serbaActual: 28,
    segerTarget: 15,
    segerActual: 14,
    memberTarget: 6,
    memberActual: 7,
    target: 50,
    actualTarget: 55,
    acvTarget: 30,
    acvActual: 32,
    notes: 'Sangat baik dalam upselling snack PSM'
  },

  // 2026-05-23
  {
    id: 'rec_3a',
    date: '2026-05-23',
    cashier: 'Eliana',
    psmTarget: 45,
    psmActual: 35,
    pwpTarget: 25,
    pwpActual: 22,
    serbaTarget: 20,
    serbaActual: 17,
    segerTarget: 15,
    segerActual: 12,
    memberTarget: 5,
    memberActual: 4,
    target: 45,
    actualTarget: 35,
    acvTarget: 25,
    acvActual: 22,
  },
  {
    id: 'rec_3b',
    date: '2026-05-23',
    cashier: 'Gea',
    psmTarget: 45,
    psmActual: 48,
    pwpTarget: 25,
    pwpActual: 27,
    serbaTarget: 20,
    serbaActual: 22,
    segerTarget: 15,
    segerActual: 16,
    memberTarget: 5,
    memberActual: 6,
    target: 45,
    actualTarget: 48,
    acvTarget: 25,
    acvActual: 27,
    notes: 'Fokus tawarkan minyak goreng PSM promo'
  },
  {
    id: 'rec_3c',
    date: '2026-05-23',
    cashier: 'Mala',
    psmTarget: 40,
    psmActual: 40,
    pwpTarget: 20,
    pwpActual: 19,
    serbaTarget: 15,
    serbaActual: 15,
    segerTarget: 10,
    segerActual: 10,
    memberTarget: 4,
    memberActual: 4,
    target: 40,
    actualTarget: 40,
    acvTarget: 20,
    acvActual: 19,
  },
  {
    id: 'rec_3d',
    date: '2026-05-23',
    cashier: 'Devi',
    psmTarget: 45,
    psmActual: 47,
    pwpTarget: 25,
    pwpActual: 25,
    serbaTarget: 20,
    serbaActual: 19,
    segerTarget: 15,
    segerActual: 14,
    memberTarget: 5,
    memberActual: 5,
    target: 45,
    actualTarget: 47,
    acvTarget: 25,
    acvActual: 25,
  },
  {
    id: 'rec_3e',
    date: '2026-05-23',
    cashier: 'Eko',
    psmTarget: 45,
    psmActual: 42,
    pwpTarget: 25,
    pwpActual: 23,
    serbaTarget: 20,
    serbaActual: 19,
    segerTarget: 15,
    segerActual: 14,
    memberTarget: 5,
    memberActual: 4,
    target: 45,
    actualTarget: 42,
    acvTarget: 25,
    acvActual: 23,
  }
];

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

export const formatPercent = (value: number): string => {
  if (isNaN(value) || !isFinite(value)) return '0%';
  return `${value.toFixed(1)}%`;
};

// Formatter for Dates
export const formatIndonesianDate = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const calculateSummaries = (records: PSMRecord[]): CashierSummary[] => {
  const summaries: Record<CashierName, {
    totalTarget: number;
    totalActual: number;
    acvTargetSum: number;
    acvActualSum: number;
    count: number;
  }> = {
    Eliana: { totalTarget: 0, totalActual: 0, acvTargetSum: 0, acvActualSum: 0, count: 0 },
    Gea: { totalTarget: 0, totalActual: 0, acvTargetSum: 0, acvActualSum: 0, count: 0 },
    Mala: { totalTarget: 0, totalActual: 0, acvTargetSum: 0, acvActualSum: 0, count: 0 },
    Devi: { totalTarget: 0, totalActual: 0, acvTargetSum: 0, acvActualSum: 0, count: 0 },
    Eko: { totalTarget: 0, totalActual: 0, acvTargetSum: 0, acvActualSum: 0, count: 0 },
  };

  records.forEach((rec) => {
    if (summaries[rec.cashier]) {
      // Aggregate sum of ALL 5 categories for holistic dashboard tracking
      const sumTarget = (rec.psmTarget || 0) + (rec.pwpTarget || 0) + (rec.serbaTarget || 0) + (rec.segerTarget || 0) + (rec.memberTarget || 0);
      const sumActual = (rec.psmActual || 0) + (rec.pwpActual || 0) + (rec.serbaActual || 0) + (rec.segerActual || 0) + (rec.memberActual || 0);
      
      summaries[rec.cashier].totalTarget += sumTarget;
      summaries[rec.cashier].totalActual += sumActual;
      summaries[rec.cashier].acvTargetSum += rec.pwpTarget || 0; // alias
      summaries[rec.cashier].acvActualSum += rec.pwpActual || 0; // alias
      summaries[rec.cashier].count += 1;
    }
  });

  const list: CashierSummary[] = CASHIERS.map((name) => {
    const data = summaries[name];
    const totalTarget = data.totalTarget;
    const totalActual = data.totalActual;
    const avgTargetAchievement = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
    
    const avgAcvTarget = data.count > 0 ? data.acvTargetSum / data.count : 0;
    const avgAcvActual = data.count > 0 ? data.acvActualSum / data.count : 0;
    const avgAcvAchievement = avgAcvTarget > 0 ? (avgAcvActual / avgAcvTarget) * 100 : 0;

    return {
      name,
      totalTarget,
      totalActual,
      avgTargetAchievement,
      avgAcvTarget,
      avgAcvActual,
      avgAcvAchievement,
      rank: 1 // Placeholder, will compute after sorting
    };
  });

  // Sort by average target achievement descending
  const sorted = [...list].sort((a, b) => b.avgTargetAchievement - a.avgTargetAchievement);
  
  return list.map((item) => {
    const rank = sorted.findIndex(s => s.name === item.name) + 1;
    return {
      ...item,
      rank
    };
  });
};

export const exportToCSV = (records: PSMRecord[]) => {
  const headers = [
    'ID', 'Tanggal', 'Nama Kasir', 
    'Target PSM', 'Actual PSM', 'Selisih PSM',
    'Target PWP', 'Actual PWP', 'Selisih PWP',
    'Target Serba Gratis', 'Actual Serba Gratis', 'Selisih Serba Gratis',
    'Target Seger', 'Actual Seger', 'Selisih Seger',
    'Target New Member', 'Actual New Member', 'Selisih New Member',
    'Catatan'
  ];
  
  const csvRows = [headers.join(',')];

  records.forEach((rec) => {
    const psmDiff = (rec.psmActual || 0) - (rec.psmTarget || 0);
    const pwpDiff = (rec.pwpActual || 0) - (rec.pwpTarget || 0);
    const serbaDiff = (rec.serbaActual || 0) - (rec.serbaTarget || 0);
    const segerDiff = (rec.segerActual || 0) - (rec.segerTarget || 0);
    const memberDiff = (rec.memberActual || 0) - (rec.memberTarget || 0);
    
    const row = [
      rec.id,
      rec.date,
      rec.cashier,
      rec.psmTarget || 0,
      rec.psmActual || 0,
      psmDiff >= 0 ? `+${psmDiff}` : `${psmDiff}`,
      rec.pwpTarget || 0,
      rec.pwpActual || 0,
      pwpDiff >= 0 ? `+${pwpDiff}` : `${pwpDiff}`,
      rec.serbaTarget || 0,
      rec.serbaActual || 0,
      serbaDiff >= 0 ? `+${serbaDiff}` : `${serbaDiff}`,
      rec.segerTarget || 0,
      rec.segerActual || 0,
      segerDiff >= 0 ? `+${segerDiff}` : `${segerDiff}`,
      rec.memberTarget || 0,
      rec.memberActual || 0,
      memberDiff >= 0 ? `+${memberDiff}` : `${memberDiff}`,
      `"${(rec.notes || '').replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_MiniMarket_Kasir_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
