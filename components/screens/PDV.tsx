
import React, { useState } from 'react';
import { Produto } from '../../types';
import { ShoppingBasket, Search, Plus, Minus, CreditCard, Banknote, ChevronDown, ChevronUp } from 'lucide-react';

interface PDVProps {
  produtos: Produto[];
  onVenda: (membroId: string | 'guest', produtoId: string, qtd: number) => void;
}

export const PDV: React.FC<PDVProps> = ({ produtos, onVenda }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [showMobileCart, setShowMobileCart] = useState(false);

  const categories = ['Todas', ...Array.from(new Set(produtos.map(p => p.categoria)))];

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id]--;
      else delete newCart[id];
      return newCart;
    });
  };

  const cartEntries = Object.entries(cart) as [string, number][];
  const totalItems = cartEntries.reduce((a, b) => a + b[1], 0);
  const total = cartEntries.reduce((acc, [id, qty]) => {
    const prod = produtos.find(p => p.id === id);
    return acc + (prod?.preco || 0) * qty;
  }, 0);

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) return;
    cartEntries.forEach(([id, qty]) => {
      onVenda('guest', id, qty);
    });
    alert('Venda finalizada!');
    setCart({});
    setShowMobileCart(false);
  };

  const filtered = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'Todas' || p.categoria === category)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full md:h-[calc(100vh-160px)]">
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar item..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-black text-sm outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                  category === cat ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pb-24 md:pb-0">
          {filtered.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p.id)}
              className="bg-white p-3 rounded-2xl border border-zinc-200 hover:border-black transition-all text-left flex flex-col justify-between group h-36"
            >
              <div>
                <span className="text-[9px] font-black text-zinc-400 mb-0.5 block uppercase tracking-[0.1em]">{p.categoria}</span>
                <h4 className="font-bold text-black text-xs md:text-sm line-clamp-2 uppercase tracking-tight leading-tight">{p.nome}</h4>
              </div>
              <div className="mt-2 flex justify-between items-end">
                <span className="text-sm md:text-base font-black text-black">R$ {p.preco.toFixed(2)}</span>
                <div className="bg-zinc-100 p-2 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                  <Plus size={14} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`
        fixed bottom-0 left-0 right-0 z-30 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-300 md:relative md:w-96 md:h-full md:translate-y-0 md:rounded-3xl border border-zinc-200 flex flex-col
        ${showMobileCart ? 'h-[80vh]' : 'h-20 md:h-full'}
      `}>
        <div 
          className="p-5 border-b border-zinc-100 flex items-center justify-between cursor-pointer md:cursor-default"
          onClick={() => setShowMobileCart(!showMobileCart)}
        >
          <div className="flex items-center gap-2">
            <ShoppingBasket className="text-black" size={20} />
            <h3 className="font-black uppercase text-xs tracking-widest">Carrinho</h3>
            <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-black ml-1">
              {totalItems}
            </span>
          </div>
          <div className="md:hidden">
            {showMobileCart ? <ChevronDown /> : <ChevronUp />}
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-5 space-y-3 ${showMobileCart ? 'block' : 'hidden md:block'}`}>
          {cartEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-300 opacity-50 space-y-2 py-10">
              <ShoppingBasket size={32} />
              <p className="font-black uppercase text-[10px] tracking-widest">Vazio</p>
            </div>
          ) : (
            cartEntries.map(([id, qty]) => {
              const prod = produtos.find(p => p.id === id);
              if (!prod) return null;
              return (
                <div key={id} className="flex items-center gap-3 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                  <div className="flex-1">
                    <p className="font-black text-[10px] uppercase text-black tracking-tight">{prod.nome}</p>
                    <p className="text-[10px] text-zinc-400 font-bold">R$ {(prod.preco * qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-zinc-200">
                    <button onClick={(e) => { e.stopPropagation(); removeFromCart(id); }} className="p-1 hover:bg-zinc-100 rounded">
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-black w-4 text-center">{qty}</span>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(id); }} className="p-1 hover:bg-zinc-100 rounded">
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={`p-6 bg-white border-t border-zinc-200 space-y-4 ${showMobileCart ? 'block' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.2em]">Total</span>
            <span className="text-3xl font-black text-black">R$ {total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={total === 0}
            className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-20"
          >
            <CreditCard size={18} />
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
};
