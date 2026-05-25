/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CashierName = 'Eliana' | 'Gea' | 'Mala' | 'Devi' | 'Eko';

export interface PSMRecord {
  id: string;
  date: string; // Format: YYYY-MM-DD
  cashier: CashierName;
  
  // 5 distinct minimarket category targets (Target & Actual)
  psmTarget: number;
  psmActual: number;
  
  pwpTarget: number;
  pwpActual: number;
  
  serbaTarget: number;
  serbaActual: number;
  
  segerTarget: number;
  segerActual: number;
  
  memberTarget: number;
  memberActual: number;

  // Legacy fallback fields for calculations/compatibility
  target: number;       // maps to psmTarget
  actualTarget: number; // maps to psmActual
  acvTarget: number;    // maps to pwpTarget
  acvActual: number;    // maps to pwpActual

  notes?: string;       // Catatan khusus
}

export interface CashierSummary {
  name: CashierName;
  totalTarget: number;
  totalActual: number;
  avgTargetAchievement: number;
  avgAcvTarget: number;
  avgAcvActual: number;
  avgAcvAchievement: number;
  rank: number;
}
