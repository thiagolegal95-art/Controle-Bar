
import React, { useState } from 'react';
import { Comanda, Membro, Produto } from '../../types';
import { History, Trash2, Receipt, Calendar, User, X, ShoppingCart, Tag } from 'lucide-react';

interface HistoricoProps {
  comandas: Comanda[];
  membros: Membro[];
  produtos: Produto[];
  onLimparHistorico: () => void;
}

export const Historico: React.FC<HistoricoProps> = ({ comandas, membros, onLimparHistorico }) => {
  const [selectedComandaId, setSelectedComandaId] = useState<string | null>(null);

  const closedComandas = comandas.filter(c => c.status === 'fechada').sort((a, b) => {
    return new Date(b.fechadaEm!).getTime() - new Date(a.fechadaEm!).getTime();
  });

  const selectedComanda = closedComandas.find(c => c.id === selectedComandaId);
  const selectedMembro = selectedComanda ? membros.find(m => m.id === selectedComanda.membroId) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Histórico de Vendas</h1>
          <p className="text-slate-500">Consulte todas as comandas fechadas e transações anteriores.</p>
        </div>
        <button 
          onClick={onLimparHistorico}
          className="text-red-500 border border-red-100 px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:bg-red-50 transition-all"
        >
          <Trash2 size={18} />
          Limpar Histórico
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {closedComandas.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-50">
            <History size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nenhum histórico disponível.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">ID / Data</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Itens</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {closedComandas.map(c => {
                  const membro = membros.find(m => m.id === c.membroId);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">#{c.id.slice(-4).toUpperCase()}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(c.fechadaEm!).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-300" />
                          <span className="text-sm font-medium">
                            {c.membroId === 'guest' ? 'Convidado' : (membro?.nome || 'Membro Removido')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
                          {c.items.length} item(ns)
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-emerald-600">R$ {c.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedComandaId(c.id)}
                          className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Receipt size={18} />
                          <span className="text-xs font-bold uppercase">Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detalhes do Histórico */}
      {selectedComanda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Resumo da Venda</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">
                  ID: #{selectedComanda.id.toUpperCase()} • {new Date(selectedComanda.fechadaEm!).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelectedComandaId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Info Cliente */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  {selectedComanda.membroId === 'guest' ? 'G' : (selectedMembro?.nome.charAt(0) || '?')}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Cliente</p>
                  <p className="font-bold text-slate-800">
                    {selectedComanda.membroId === 'guest' ? 'Convidado / Mesa' : (selectedMembro?.nome || 'Membro Desconhecido')}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Horário</p>
                  <p className="text-sm font-medium text-slate-600">
                    {new Date(selectedComanda.abertaEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    {' às '} 
                    {new Date(selectedComanda.fechadaEm!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Lista de Itens */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShoppingCart size={14} /> Itens Consumidos
                </h3>
                <div className="space-y-2">
                  {selectedComanda.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-colors">
                      <div className="flex gap-3 items-center">
                        <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg">
                          <Tag size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.nome}</p>
                          <p className="text-[10px] text-slate-500">{item.quantidade}x R$ {item.precoUnitario.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">R$ {item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-b-3xl border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Valor Pago</span>
                <span className="text-3xl font-black text-emerald-600">R$ {selectedComanda.total.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => setSelectedComandaId(null)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
