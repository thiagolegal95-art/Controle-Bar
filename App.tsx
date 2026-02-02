
import React, { useState, useEffect } from 'react';
import { Screen, UserRole } from './types';
import { useBarData } from './hooks/useBarData';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/screens/Dashboard';
import { Comandas } from './components/screens/Comandas';
import { PDV } from './components/screens/PDV';
import { Estoque } from './components/screens/Estoque';
import { Membros } from './components/screens/Membros';
import { Historico } from './components/screens/Historico';
import { Menu, Shield, User, LogOut, Lock, X, AlertCircle } from 'lucide-react';

const LOGO_URL = "https://raw.githubusercontent.com/diego-ne4/insanos-assets/main/insanos-18.jpg";
const ADMIN_PASSWORD = "sempreinsano";

const App = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Admin Auth States
  const [showPassModal, setShowPassModal] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [passError, setPassError] = useState(false);
  
  const {
    comandas,
    produtos,
    membros,
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
  } = useBarData();

  const stats = getEstatisticas();

  useEffect(() => {
    if (userRole === 'atendente' && currentScreen === 'historico') {
      setCurrentScreen('dashboard');
    }
  }, [userRole, currentScreen]);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  };

  const handleAdminAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordAttempt === ADMIN_PASSWORD) {
      setUserRole('admin');
      setShowPassModal(false);
      setPasswordAttempt('');
      setPassError(false);
    } else {
      setPassError(true);
      setPasswordAttempt('');
    }
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[120px]" />
        </div>

        <div className="max-w-md w-full bg-black rounded-[3rem] p-10 border border-zinc-800 shadow-[0_0_50px_rgba(255,255,255,0.05)] flex flex-col items-center text-center relative z-10">
          <div className="w-36 h-36 rounded-full border-4 border-zinc-800 p-1 mb-8 shadow-2xl bg-zinc-900 overflow-hidden">
            <img 
              src={LOGO_URL} 
              alt="Insanos MC Logo" 
              className="w-full h-full object-cover scale-110"
              onError={(e) => {
                e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0N-OayV70uE0t9hV6_YfVf_4jV0O-J9P7Ww&s";
              }}
            />
          </div>
          
          <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-white mb-2">Insanos BarPro</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-10">Controle de Sede • NE4</p>
          
          <div className="grid grid-cols-1 gap-4 w-full">
            <button 
              onClick={() => { setShowPassModal(true); setPassError(false); }}
              className="group flex items-center justify-between p-6 bg-white text-black rounded-3xl hover:bg-zinc-200 transition-all transform hover:scale-[1.02] shadow-xl"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-black/5 rounded-2xl">
                  <Shield size={24} className="text-black" />
                </div>
                <div>
                  <p className="font-black uppercase text-sm tracking-tight">Administrador</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Acesso Protegido</p>
                </div>
              </div>
              <Lock size={16} className="text-zinc-400 opacity-50" />
            </button>

            <button 
              onClick={() => setUserRole('atendente')}
              className="group flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 text-white rounded-3xl hover:bg-zinc-800 transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-white/5 rounded-2xl">
                  <User size={24} className="text-zinc-400" />
                </div>
                <div>
                  <p className="font-black uppercase text-sm tracking-tight">Atendente</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Gestão de Vendas</p>
                </div>
              </div>
            </button>
          </div>
          
          <p className="mt-12 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.5em]">18 DO FORTE • Insanos MC</p>
        </div>

        {/* Password Modal */}
        {showPassModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="max-w-xs w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative">
              <button 
                onClick={() => setShowPassModal(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Lock size={28} className="text-white" />
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-[0.2em] mb-2">Área Restrita</h3>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-8">Digite a senha do Comando</p>
                
                <form onSubmit={handleAdminAuth} className="w-full space-y-4">
                  <div className="relative">
                    <input 
                      autoFocus
                      type="password"
                      placeholder="Senha"
                      className={`w-full bg-zinc-950 border ${passError ? 'border-red-500' : 'border-zinc-800'} rounded-2xl px-5 py-4 text-white text-center font-bold tracking-[0.5em] focus:outline-none focus:border-white transition-colors`}
                      value={passwordAttempt}
                      onChange={(e) => setPasswordAttempt(e.target.value)}
                    />
                    {passError && (
                      <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-1.5 text-red-500 animate-bounce">
                        <AlertCircle size={10} />
                        <span className="text-[9px] font-black uppercase">Senha Incorreta</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-200 transition-all mt-4"
                  >
                    Confirmar
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'comandas': return (
        <Comandas
          membros={membros}
          produtos={produtos}
          comandas={comandas}
          onAbrirComanda={abrirComanda}
          onRegistrarConsumo={registrarConsumo}
          onRemoverItem={removerItemComanda}
          onFecharComanda={fecharComanda}
        />
      );
      case 'pdv': return <PDV produtos={produtos} onVenda={registrarConsumo} />;
      case 'estoque': return (
        <Estoque
          produtos={produtos}
          onAddProduto={addProduto}
          onUpdateProduto={updateProduto}
          onRemoveProduto={removeProduto}
        />
      );
      case 'membros': return (
        <Membros 
          membros={membros} 
          comandas={comandas}
          onAddMembro={addMembro} 
          onUpdateMembro={updateMembro} 
        />
      );
      case 'historico': return userRole === 'admin' ? (
        <Historico 
          comandas={comandas} 
          membros={membros} 
          produtos={produtos} 
          onLimparHistorico={limparHistorico}
        />
      ) : <Dashboard stats={stats} />;
      default: return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 text-black flex-col md:flex-row overflow-hidden">
      <header className="md:hidden bg-black text-white p-4 flex justify-between items-center sticky top-0 z-40 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-zinc-800 overflow-hidden bg-zinc-900">
            <img 
              src={LOGO_URL} 
              alt="Insanos MC Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0N-OayV70uE0t9hV6_YfVf_4jV0O-J9P7Ww&s";
              }}
            />
          </div>
          <span className="font-black tracking-tighter uppercase text-sm">Sede NE4</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setUserRole(null)} className="p-2 text-zinc-500">
            <LogOut size={18} />
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userRole={userRole}
        onLogout={() => setUserRole(null)}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto pb-20 md:pb-0">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
};

export default App;
