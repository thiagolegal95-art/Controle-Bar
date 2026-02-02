
import React, { useState } from 'react';
import { Comanda, Membro, Produto } from '../../types';
import { 
  Plus, 
  Search, 
  X, 
  Trash2, 
  CheckCircle2, 
  UserPlus,
  Clock,
  MoreVertical,
  Receipt,
  Users,
  ShoppingCart,
  User as UserIcon
} from 'lucide-react';

interface ComandasProps {
  comandas: Comanda[];
  membros: Membro[];
  produtos: Produto[];
  onAbrirComanda: (membroId: string | 'guest') => void;
  onRegistrarConsumo: (membroId: string | 'guest', produtoId: string, qtd: number) => void;
  onRemoverItem: (comandaId: string, itemId: string) => void;
  onFecharComanda: (comandaId: string) => void;
}

export const Comandas: React.FC<ComandasProps> = ({ 
  comandas, 
  membros, 
  produtos, 
  onAbrirComanda,
  onRegistrarConsumo, 
  onRemoverItem, 
  onFecharComanda 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedComandaId, setSelectedComandaId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');

  const activeComandas = comandas.filter(c => c.status === 'aberta');
  
  const filteredComandas = activeComandas.filter(c => {
    const membro = membros.find(m => m.id === c.membroId);
    const name = c.membroId === 'guest' ? 'Convidado' : (membro?.nome || '');
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedComanda = activeComandas.find(c => c.id === selectedComandaId);

  const filteredProducts = produtos.filter(p => 
    p.nome.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 5);

  const filteredMembersForNewComanda = membros.filter(m => 
    m.nome.toLowerCase().includes(memberSearchTerm.toLowerCase()) &&
    !activeComandas.some(c => c.membroId === m.id)
  );

  const handleOpenNewComanda = (membroId: string | 'guest') => {
    onAbrirComanda(membroId);
    setShowAddModal(false);
    setMemberSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">Comandas</h1>
          <div className="h-1 w-12 bg-black mt-1"></div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-zinc-800 transition-all shadow-xl"
        >
          <Plus size={18} />
          Nova Comanda
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar cliente nas comandas abertas..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-zinc-200 focus:border-black focus:outline-none transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredComandas.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-zinc-200 opacity-50">
          <Receipt size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="font-bold text-zinc-400 uppercase tracking-widest text-sm">Nenhuma comanda aberta</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComandas.map(comanda => {
            const membro = membros.find(m => m.id === comanda.membroId);
            return (
              <div 
                key={comanda.id} 
                className="bg-white rounded-2xl border border-zinc-200 hover:border-black transition-all overflow-hidden cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => setSelectedComandaId(comanda.id)}
              >
                <div className="p-5 border-b border-zinc-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-black uppercase text-sm tracking-tight">
                      {comanda.membroId === 'guest' ? 'Convidado' : membro?.nome}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold mt-1">
                      <Clock size={10} />
                      {new Date(comanda.abertaEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="bg-zinc-100 text-black text-[10px] font-black px-2 py-1 rounded">
                    #{comanda.id.slice(-4).toUpperCase()}
                  </div>
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {comanda.items.length === 0 ? (
                      <p className="text-zinc-400 text-[11px] font-medium italic">Vazia. Clique para adicionar itens.</p>
                    ) : (
                      comanda.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                          <span className="text-zinc-500">{item.quantidade}x {item.nome}</span>
                          <span className="text-black">R$ {item.total.toFixed(2)}</span>
                        </div>
                      ))
                    )}
                    {comanda.items.length > 3 && (
                      <p className="text-[9px] text-zinc-400 font-bold uppercase">+ {comanda.items.length - 3} itens...</p>
                    )}
                  </div>
                  
                  <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Total</span>
                    <span className="text-lg font-black text-black">R$ {comanda.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nova Comanda (Seleção de Membro) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col max-h-[80vh]">
            <button 
              onClick={() => { setShowAddModal(false); setMemberSearchTerm(''); }}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">Abrir Comanda</h2>
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Selecione o cliente ou membro</p>
            </div>

            <button 
              onClick={() => handleOpenNewComanda('guest')}
              className="w-full flex items-center gap-4 p-5 bg-white text-black rounded-2xl mb-6 hover:bg-zinc-200 transition-all font-black uppercase text-xs tracking-widest group shadow-lg"
            >
              <div className="p-2 bg-black/10 rounded-lg group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              Convidado / Avulso
            </button>

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text"
                placeholder="Filtrar membros..."
                className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-white transition-colors outline-none"
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredMembersForNewComanda.length === 0 ? (
                <div className="py-8 text-center text-zinc-600">
                  <p className="text-[10px] font-black uppercase">Nenhum membro disponível</p>
                </div>
              ) : (
                filteredMembersForNewComanda.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleOpenNewComanda(m.id)}
                    className="w-full flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400">
                        {m.nome.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-tight">{m.nome}</span>
                    </div>
                    <Plus size={14} className="text-zinc-600" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes Comanda (Existing Modal) */}
      {selectedComanda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  {selectedComanda.membroId === 'guest' ? 'Convidado' : membros.find(m => m.id === selectedComanda.membroId)?.nome}
                </h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">ID: {selectedComanda.id.toUpperCase()}</p>
              </div>
              <button onClick={() => { setSelectedComandaId(null); setProductSearch(''); }} className="p-2 hover:bg-zinc-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section className="bg-zinc-100 p-4 rounded-2xl">
                <h3 className="text-[10px] font-black text-zinc-500 mb-3 flex items-center gap-2 uppercase tracking-widest">
                  <Plus size={12} /> Adicionar Item
                </h3>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <input 
                    type="text"
                    placeholder="Filtrar produtos..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:border-black outline-none"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {filteredProducts.map(prod => (
                    <button
                      key={prod.id}
                      onClick={() => onRegistrarConsumo(selectedComanda.membroId, prod.id, 1)}
                      className="flex items-center justify-between p-2 bg-white hover:bg-zinc-900 hover:text-white rounded-lg border border-zinc-200 transition-all group"
                    >
                      <span className="text-xs font-bold uppercase tracking-tighter">{prod.nome}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black">R$ {prod.preco.toFixed(2)}</span>
                        <Plus size={12} className="opacity-40 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-zinc-400 mb-3 uppercase tracking-widest">Resumo de Consumo</h3>
                <div className="space-y-2">
                  {selectedComanda.items.length === 0 ? (
                    <div className="text-center py-6 text-zinc-300">
                      <p className="text-[10px] font-black uppercase">Nenhum item adicionado ainda</p>
                    </div>
                  ) : (
                    selectedComanda.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-100">
                        <div>
                          <p className="font-bold text-black uppercase text-xs tracking-tight">{item.nome}</p>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase">{item.quantidade}x @ R$ {item.precoUnitario.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-black text-sm">R$ {item.total.toFixed(2)}</span>
                          <button 
                            onClick={() => onRemoverItem(selectedComanda.id, item.id)}
                            className="text-zinc-300 hover:text-black p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Total Final</span>
                <span className="text-3xl font-black text-black">R$ {selectedComanda.total.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    onFecharComanda(selectedComanda.id);
                    setSelectedComandaId(null);
                  }}
                  className="bg-black text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-zinc-800 transition-all shadow-lg"
                >
                  <CheckCircle2 size={18} />
                  Fechar
                </button>
                <button 
                  onClick={() => setSelectedComandaId(null)}
                  className="bg-white border border-zinc-300 text-black p-4 rounded-2xl font-bold hover:bg-zinc-100 transition-all"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
