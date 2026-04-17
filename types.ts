export interface Product {
  id: string;
  name: string;
  category?: string;
  targetDaily: number;
  unit?: string;
}

export interface ProductionRecord {
  id: string;
  productId: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  quantity: number;
  reasonForLow?: string;
  uid: string;
  createdAt: any;
}

export type View = 'dashboard' | 'products' | 'entry' | 'reports';
