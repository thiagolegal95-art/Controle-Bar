
import { useState, useEffect, useCallback } from 'react';
import { Produto, Membro, Comanda, DashboardStats, ItemComanda } from '../types';

const INITIAL_PRODUTOS: Produto[] = [
  { id: '1', nome: 'Cerveja Pilsen 600ml', preco: 12.50, estoque: 48, categoria: 'Bebidas' },
  { id: '2', nome: 'Caipirinha Tradicional', preco: 18.00, estoque: 999, categoria: 'Drinks' },
  { id: '3', nome: 'Porção de Batata Frita', preco: 35.00, estoque: 20, categoria: 'Petiscos' },
];

const INITIAL_MEMBROS: Membro[] = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com', telefone: '11988887777', saldo: 0, dataCadastro: new Date().toISOString() },
];

export const useBarData = () => {
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    const saved = localStorage.getItem('bar_produtos');
    return saved ? JSON.parse(saved) : INITIAL_PRODUTOS;
  });

  const [membros, setMembros] = useState<Membro[]>(() => {
    const saved = localStorage.getItem('bar_membros');
    return saved ? JSON.parse(saved) : INITIAL_MEMBROS;
  });

  const [comandas, setComandas] = useState<Comanda[]>(() => {
    const saved = localStorage.getItem('bar_comandas');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bar_produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('bar_membros', JSON.stringify(membros));
  }, [membros]);

  useEffect(() => {
    localStorage.setItem('bar_comandas', JSON.stringify(comandas));
  }, [comandas]);

  const abrirComanda = (membroId: string | 'guest') => {
    const jaTemAberta = comandas.some(c => c.membroId === membroId && c.status === 'aberta');
    if (jaTemAberta && membroId !== 'guest') {
      alert('Este membro já possui uma comanda aberta!');
      return;
    }

    const novaComanda: Comanda = {
      id: Math.random().toString(36).substr(2, 9),
      membroId,
      items: [],
      status: 'aberta',
      total: 0,
      abertaEm: new Date().toISOString()
    };

    setComandas(prev => [...prev, novaComanda]);
    return novaComanda.id;
  };

  const registrarConsumo = (membroId: string | 'guest', produtoId: string, quantidade: number = 1) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    if (produto.estoque !== 999 && produto.estoque < quantidade) {
      alert('Estoque insuficiente!');
      return;
    }

    setComandas(prev => {
      const activeIdx = prev.findIndex(c => c.membroId === membroId && c.status === 'aberta');
      const newItem: ItemComanda = {
        id: Math.random().toString(36).substr(2, 9),
        produtoId,
        nome: produto.nome,
        quantidade,
        precoUnitario: produto.preco,
        total: produto.preco * quantidade,
        timestamp: new Date().toISOString()
      };

      if (activeIdx > -1) {
        const newComandas = [...prev];
        const comanda = { ...newComandas[activeIdx] };
        comanda.items = [...comanda.items, newItem];
        comanda.total += newItem.total;
        newComandas[activeIdx] = comanda;
        return newComandas;
      } else {
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          membroId,
          items: [newItem],
          status: 'aberta',
          total: newItem.total,
          abertaEm: new Date().toISOString()
        }];
      }
    });

    if (produto.estoque !== 999) {
      setProdutos(prev => prev.map(p => 
        p.id === produtoId ? { ...p, estoque: p.estoque - quantidade } : p
      ));
    }
  };

  const removerItemComanda = (comandaId: string, itemId: string) => {
    setComandas(prev => prev.map(c => {
      if (c.id === comandaId) {
        const item = c.items.find(i => i.id === itemId);
        if (!item) return c;
        
        // Repor estoque
        setProdutos(pPrev => pPrev.map(p => 
          p.id === item.produtoId && p.estoque !== 999 
            ? { ...p, estoque: p.estoque + item.quantidade } 
            : p
        ));

        return {
          ...c,
          items: c.items.filter(i => i.id !== itemId),
          total: c.total - item.total
        };
      }
      return c;
    }));
  };

  const fecharComanda = (comandaId: string) => {
    setComandas(prev => prev.map(c => 
      c.id === comandaId ? { ...c, status: 'fechada', fechadaEm: new Date().toISOString() } : c
    ));
  };

  const limparHistorico = () => {
    setComandas(prev => prev.filter(c => c.status === 'aberta'));
  };

  const addProduto = (p: Omit<Produto, 'id'>) => {
    setProdutos(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const updateProduto = (id: string, updates: Partial<Produto>) => {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeProduto = (id: string) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const addMembro = (m: Omit<Membro, 'id' | 'saldo' | 'dataCadastro'>) => {
    setMembros(prev => [...prev, { 
      ...m, 
      id: Math.random().toString(36).substr(2, 9), 
      saldo: 0, 
      dataCadastro: new Date().toISOString() 
    }]);
  };

  const updateMembro = (id: string, updates: Partial<Membro>) => {
    setMembros(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const getEstatisticas = (): DashboardStats => {
    const hoje = new Date().toLocaleDateString();
    const fechadas = comandas.filter(c => c.status === 'fechada');
    
    const vendasHoje = fechadas
      .filter(c => c.fechadaEm && new Date(c.fechadaEm).toLocaleDateString() === hoje)
      .reduce((acc, c) => acc + c.total, 0);

    const totalComandasAbertas = comandas.filter(c => c.status === 'aberta').length;
    
    const lucroMensal = fechadas.reduce((acc, c) => acc + c.total, 0); 
    const itensBaixoEstoque = produtos.filter(p => p.estoque !== 999 && p.estoque < 10).length;

    const catMap: Record<string, number> = {};
    produtos.forEach(p => {
      catMap[p.categoria] = (catMap[p.categoria] || 0) + 1;
    });

    return {
      vendasHoje,
      totalComandasAbertas,
      lucroMensal,
      itensBaixoEstoque,
      vendasPorCategoria: Object.entries(catMap).map(([name, value]) => ({ name, value })),
      movimentacaoSemanal: [
        { day: 'Seg', value: 400 },
        { day: 'Ter', value: 300 },
        { day: 'Qua', value: 600 },
        { day: 'Qui', value: 800 },
        { day: 'Sex', value: 1500 },
        { day: 'Sáb', value: 2000 },
        { day: 'Dom', value: 1200 },
      ]
    };
  };

  return {
    produtos,
    membros,
    comandas,
    abrirComanda,
    registrarConsumo,
    removerItemComanda,
    fecharComanda,
    limparHistorico,
    addProduto,
    updateProduto,
    removeProduto,
    addMembro,
    updateMembro,
    getEstatisticas,
  };
};
