/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ReactNode } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
} from 'firebase/firestore';
import { db } from './firebase';
import { View, Product, ProductionRecord } from './types';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  BarChart3, 
  Plus, 
  Factory,
  ChevronRight
} from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductionEntry from './components/ProductionEntry';
import Reports from './components/Reports';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [records, setRecords] = useState<ProductionRecord[]>([]);

  useEffect(() => {
    const productsSub = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    const recordsSub = onSnapshot(
      query(collection(db, 'productionRecords'), orderBy('date', 'desc')),
      (snapshot) => {
        setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionRecord)));
      }
    );

    return () => {
      productsSub();
      recordsSub();
    };
  }, []);

  return (
    <div className="flex h-screen bg-paper text-ink overflow-hidden p-10 gap-10">
      {/* Editorial Sidebar Navigation */}
      <nav className="w-64 flex flex-col pt-0 pb-0 shrink-0 h-full border-r border-line pr-10">
        <div className="mb-10 text-left">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Facility Records</div>
          <h2 className="font-serif text-4xl italic leading-none">Ledger</h2>
        </div>

        <div className="flex-1 space-y-6">
          <NavItem 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')}
            icon={<LayoutDashboard size={16} />}
            label="Overview"
          />
          <NavItem 
            active={currentView === 'products'} 
            onClick={() => setCurrentView('products')}
            icon={<Package size={16} />}
            label="Inventory"
          />
          <NavItem 
            active={currentView === 'entry'} 
            onClick={() => setCurrentView('entry')}
            icon={<ClipboardList size={16} />}
            label="Daily Log"
          />
          <NavItem 
            active={currentView === 'reports'} 
            onClick={() => setCurrentView('reports')}
            icon={<BarChart3 size={16} />}
            label="Analysis"
          />
        </div>

        <div className="mt-auto pt-8 border-t-2 border-ink">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-none border border-line flex items-center justify-center bg-paper">
              <Factory size={20} className="text-muted" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold truncate uppercase tracking-widest leading-none mb-1">System Admin</span>
              <span className="text-[10px] font-sans text-muted truncate italic">Root Access</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pr-4">
        <header className="flex justify-between items-end border-b-2 border-ink pb-5 mb-10">
          <div className="title-block">
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted leading-none mb-2">Vol. 2026 / No. 4</div>
            <h1 className="font-serif text-5xl font-normal italic leading-none">Industrial Journal</h1>
          </div>
          <div className="text-right text-[11px] font-sans leading-relaxed">
            <strong className="uppercase">Report Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</strong><br />
            <span className="text-muted uppercase">Global Production Monitoring Line A</span>
          </div>
        </header>

        {currentView === 'dashboard' && <Dashboard products={products} records={records} />}
        {currentView === 'products' && <ProductList products={products} />}
        {currentView === 'entry' && <ProductionEntry products={products} records={records} />}
        {currentView === 'reports' && <Reports products={products} records={records} />}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { 
  active: boolean; 
  onClick: () => void; 
  icon: ReactNode; 
  label: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group w-full flex items-center gap-4 py-2 transition-all text-left",
        active ? "text-accent border-b-2 border-accent" : "text-muted hover:text-ink"
      )}
    >
      <div className={cn("opacity-60 group-hover:opacity-100", active && "opacity-100")}>
        {icon}
      </div>
      <span className="text-xs uppercase tracking-[0.2em] font-bold">{label}</span>
    </button>
  );
}
