
export type Screen = 'dashboard' | 'comandas' | 'pdv' | 'estoque' | 'membros' | 'historico';
export type UserRole = 'admin' | 'atendente';

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
}

export interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  saldo: number;
  dataCadastro: string;
}

export interface ItemComanda {
  id: string;
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  total: number;
  timestamp: string;
}

export interface Comanda {
  id: string;
  membroId: string | 'guest';
  items: ItemComanda[];
  status: 'aberta' | 'fechada';
  total: number;
  abertaEm: string;
  fechadaEm?: string;
}

export interface DashboardStats {
  vendasHoje: number;
  totalComandasAbertas: number;
  lucroMensal: number;
  itensBaixoEstoque: number;
  vendasPorCategoria: { name: string; value: number }[];
  movimentacaoSemanal: { day: string; value: number }[];
}
