
import React, { useEffect, useState } from 'react';
import { DashboardStats } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getBusinessInsights } from '../../services/geminiService';

interface DashboardProps {
  stats: DashboardStats;
}

// Reverted to original colorful palette for charts
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const [insights, setInsights] = useState<string>('Analisando inteligência do bar...');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const text = await getBusinessInsights(stats);
    setInsights(text || "Insights indisponíveis.");
    setLoadingInsights(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // Reverting cards to original colors as requested (as they were before)
  const cards = [
    { label: 'Vendas Hoje', value: `R$ ${stats.vendasHoje.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Comandas Abertas', value: stats.totalComandasAbertas, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Receita Total', value: `R$ ${stats.lucroMensal.toFixed(2)}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Alerta Estoque', value: stats.itensBaixoEstoque, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight uppercase">Visão Geral</h1>
          <div className="h-1.5 w-16 bg-black mt-1"></div>
        </div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Insanos MC • Sede NE4 • {new Date().toLocaleTimeString()}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border border-zinc-200 flex items-center gap-4 transition-all hover:border-black hover:shadow-xl hover:shadow-zinc-200/50 group">
            <div className={`p-3 rounded-xl ${card.bg} ${card.color} transition-colors`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-xl md:text-2xl font-black text-black">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest">Fluxo Semanal</h3>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-indigo-500" />
               <span className="text-[10px] font-bold text-zinc-400 uppercase">Faturamento</span>
            </div>
          </div>
          <div className="h-64 md:h-80 min-w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.movimentacaoSemanal}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f4f4f5'}}
                  contentStyle={{borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6">Categorias</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.vendasPorCategoria}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.vendasPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {stats.vendasPorCategoria.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                  <span className="text-zinc-500">{entry.name}</span>
                </div>
                <span>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 text-white p-6 md:p-8 rounded-3xl relative overflow-hidden group border border-zinc-800 shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-lg border border-zinc-700 shadow-inner">
                <Sparkles size={18} className="text-zinc-300" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">IA Business Intelligence</h2>
            </div>
            <button 
              onClick={fetchInsights} 
              disabled={loadingInsights}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 border border-white/5"
            >
              <RefreshCw size={14} className={loadingInsights ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-zinc-400 leading-relaxed text-sm font-medium border-l-2 border-zinc-700 pl-6 italic">
              {insights}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};
