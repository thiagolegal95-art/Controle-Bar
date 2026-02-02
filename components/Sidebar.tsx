
import React from 'react';
import { Screen, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Receipt, 
  ShoppingCart, 
  Package, 
  Users, 
  History,
  X,
  LogOut,
  Shield,
  User
} from 'lucide-react';

const LOGO_URL = "https://raw.githubusercontent.com/diego-ne4/insanos-assets/main/insanos-18.jpg";

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, isOpen, onClose, userRole, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'comandas', label: 'Comandas', icon: Receipt },
    { id: 'pdv', label: 'PDV / Caixa', icon: ShoppingCart },
    { id: 'estoque', label: 'Estoque', icon: Package },
    { id: 'membros', label: 'Membros', icon: Users },
    { id: 'historico', label: 'Histórico', icon: History, adminOnly: true },
  ];

  const visibleItems = menuItems.filter(item => !item.adminOnly || userRole === 'admin');

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col transition-transform duration-300 transform
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-8 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-[3px] border-zinc-800 p-1 bg-zinc-900 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden group">
               <img 
                src={LOGO_URL} 
                alt="Insanos MC Logo" 
                className="w-full h-full object-cover rounded-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
                onError={(e) => {
                  e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0N-OayV70uE0t9hV6_YfVf_4jV0O-J9P7Ww&s";
                }}
              />
            </div>
            <button onClick={onClose} className="md:hidden absolute -top-4 -right-12 p-3 text-zinc-400 hover:text-white bg-zinc-900 rounded-full border border-zinc-800">
              <X size={20} />
            </button>
          </div>
          <h1 className="text-xl font-black tracking-[0.25em] text-center uppercase mb-0.5 text-white">Insanos MC</h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-zinc-800"></div>
            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.4em] uppercase">Sede NE4</p>
            <div className="h-px w-6 bg-zinc-800"></div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5 mt-2">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                currentScreen === item.id 
                  ? 'bg-white text-black font-black shadow-[0_10px_20px_rgba(255,255,255,0.1)] translate-x-1' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} />
              <span className="text-xs uppercase tracking-widest font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-900 bg-zinc-950 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Identificador de Sede em Círculo */}
              <div className="w-11 h-11 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-black border border-zinc-800 text-white shadow-inner">
                NE4
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tighter text-zinc-200">
                  {userRole === 'admin' ? 'Comando' : 'Membro'}
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Sistema On</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2.5 text-zinc-600 hover:text-white hover:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-zinc-800"
              title="Encerrar Sessão"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
