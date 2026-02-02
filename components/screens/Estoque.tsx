
import React, { useState } from 'react';
import { Produto } from '../../types';
import { Package, Plus, Search, Edit2, Trash2, Info } from 'lucide-react';

interface EstoqueProps {
  produtos: Produto[];
  onAddProduto: (p: Omit<Produto, 'id'>) => void;
  onUpdateProduto: (id: string, updates: Partial<Produto>) => void;
  onRemoveProduto: (id: string) => void;
}

export const Estoque: React.FC<EstoqueProps> = ({ produtos, onAddProduto, onUpdateProduto, onRemoveProduto }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    preco: 0,
    estoque: 0,
    categoria: 'Bebidas'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateProduto(editingId, formData);
    } else {
      onAddProduto(formData);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ nome: '', preco: 0, estoque: 0, categoria: 'Bebidas' });
  };

  const startEdit = (p: Produto) => {
    setEditingId(p.id);
    setFormData({ nome: p.nome, preco: p.preco, estoque: p.estoque, categoria: p.categoria });
    setShowModal(true);
  };

  const filtered = produtos.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">Estoque</h1>
          <div className="h-1 w-12 bg-black mt-1"></div>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingId(null); }}
          className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-zinc-800 transition-all shadow-lg"
        >
          <Plus size={18} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-zinc-100 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar itens..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-50 border-none focus:ring-1 focus:ring-black outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="block md:hidden divide-y divide-zinc-100">
          {filtered.map(p => (
            <div key={p.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-100 p-2 rounded-lg text-black">
                    <Package size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-black text-xs uppercase tracking-tight leading-none">{p.nome}</h4>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mt-1">
                      {p.categoria}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="p-2 text-zinc-400 hover:text-black">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onRemoveProduto(p.id)} className="p-2 text-zinc-400 hover:text-black">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl">
                <div>
                  <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Preço</p>
                  <p className="font-black text-black">R$ {p.preco.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Quantidade</p>
                  <span className="font-black text-black">{p.estoque === 999 ? 'ILIMITADO' : p.estoque}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 py-5">Produto</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5">Preço</th>
                <th className="px-6 py-5">Estoque</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-100 p-2 rounded-lg text-black">
                        <Package size={18} />
                      </div>
                      <span className="font-black text-black text-xs uppercase tracking-tight">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      {p.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-black text-sm">R$ {p.preco.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black ${p.estoque < 10 && p.estoque !== 999 ? 'bg-zinc-900 text-white' : 'text-black'} px-2 py-1 rounded`}>
                      {p.estoque === 999 ? '∞' : p.estoque}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => startEdit(p)} className="p-2 hover:bg-zinc-900 hover:text-white rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onRemoveProduto(p.id)} className="p-2 hover:bg-zinc-900 hover:text-white rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
