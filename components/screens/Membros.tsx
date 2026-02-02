
import React, { useState } from 'react';
import { Membro, Comanda } from '../../types';
import { UserPlus, Search, Phone, Mail, Calendar, Edit2, X, Receipt, Clock, User } from 'lucide-react';

interface MembrosProps {
  membros: Membro[];
  comandas: Comanda[];
  onAddMembro: (m: Omit<Membro, 'id' | 'saldo' | 'dataCadastro'>) => void;
  onUpdateMembro: (id: string, updates: Partial<Membro>) => void;
}

export const Membros: React.FC<MembrosProps> = ({ membros, comandas, onAddMembro, onUpdateMembro }) => {
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateMembro(editingId, formData);
    } else {
      onAddMembro(formData);
    }
    closeModal();
  };

  const startEdit = (m: Membro) => {
    setEditingId(m.id);
    setFormData({
      nome: m.nome,
      email: m.email,
      telefone: m.telefone
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ nome: '', email: '', telefone: '' });
  };

  const getGastoAcumulado = (membroId: string) => {
    return comandas
      .filter(c => c.membroId === membroId && c.status === 'aberta')
      .reduce((acc, c) => acc + c.total, 0);
  };

  const getItensPendentes = (membroId: string) => {
    return comandas
      .filter(c => c.membroId === membroId && c.status === 'aberta')
      .flatMap(c => c.items);
  };

  const selectedMember = membros.find(m => m.id === selectedMemberId);
  const pendencias = selectedMemberId ? getItensPendentes(selectedMemberId) : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Membros & Fidelidade</h1>
          <p className="text-slate-500">Gerencie seus clientes frequentes e controle de consumo em aberto.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
        >
          <UserPlus size={20} />
          Cadastrar Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membros.map(m => {
          const gastoAberto = getGastoAcumulado(m.id);
          return (
            <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black">
                  {m.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{m.nome}</h3>
                  <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Membro BarPro</p>
                </div>
                <button 
                  onClick={() => startEdit(m)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={18} />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-500 min-h-[20px]">
                  <Mail size={16} />
                  {m.email || <span className="text-slate-300 italic">E-mail não informado</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 min-h-[20px]">
                  <Phone size={16} />
                  {m.telefone || <span className="text-slate-300 italic">Telefone não informado</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Calendar size={16} />
                  Desde {new Date(m.dataCadastro).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Em Aberto</p>
                  <p className={`text-lg font-black ${gastoAberto > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                    R$ {gastoAberto.toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedMemberId(m.id);
                    setShowProfileModal(true);
                  }}
                  className="bg-slate-50 text-indigo-600 font-bold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          );
        })}

        {membros.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 opacity-50">
            <UserPlus size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium text-lg">Nenhum membro cadastrado.</p>
          </div>
        )}
      </div>

      {/* Modal Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in duration-200">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold">{editingId ? 'Editar Membro' : 'Cadastrar Novo Membro'}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: João Silva"
                    className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Email <span className="text-xs font-normal text-slate-400">(Opcional)</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="email@exemplo.com"
                    className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Telefone <span className="text-xs font-normal text-slate-400">(Opcional)</span>
                  </label>
                  <input 
                    type="tel" 
                    placeholder="(00) 00000-0000"
                    className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.telefone}
                    onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
                <button type="button" onClick={closeModal} className="px-6 py-2 font-bold text-slate-500">
                  Cancelar
                </button>
                <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                  {editingId ? 'Salvar Alterações' : 'Salvar Membro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Perfil Detalhado */}
      {showProfileModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black">
                  {selectedMember.nome.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedMember.nome}</h2>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <User size={14} />
                    <span>Membro ID: #{selectedMember.id.slice(-4).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Consumo Pendente (Aberto)</h3>
                <div className="space-y-3">
                  {pendencias.length === 0 ? (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                      <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-slate-500 font-medium">Nenhum item em aberto no momento.</p>
                    </div>
                  ) : (
                    pendencias.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                            <Receipt size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.nome}</p>
                            <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleDateString()} • {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}</p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 text-sm">R$ {item.total.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Pendente</p>
                  <p className="text-2xl font-black text-emerald-700">R$ {getGastoAcumulado(selectedMember.id).toFixed(2)}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Data de Cadastro</p>
                  <p className="text-base font-black text-indigo-700">{new Date(selectedMember.dataCadastro).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-b-3xl border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all"
              >
                Fechar Detalhes
              </button>
              {getGastoAcumulado(selectedMember.id) > 0 && (
                <button 
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  onClick={() => {
                    // Aqui você poderia redirecionar para a tela de comandas já com o membro filtrado
                    setShowProfileModal(false);
                    alert("Para fechar, vá até a aba Comandas e selecione a comanda deste membro.");
                  }}
                >
                  Ir para Comanda
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
