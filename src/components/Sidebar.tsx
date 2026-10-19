import { Globe, Server, Shield, Terminal, Settings, Languages } from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  lang: 'ru' | 'en';
  setLang: (lang: 'ru' | 'en' | ((p: 'ru' | 'en') => 'ru' | 'en')) => void;
  isEngineerMode: boolean;
  setIsEngineerMode: (v: boolean | ((p: boolean) => boolean)) => void;
  isConnected: boolean;
  addLog: (m: string) => void;
  t: any;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isEngineerMode,
  setIsEngineerMode,
  isConnected,
  addLog,
  t
}: SidebarProps) {
  const currentT = t[lang];

  return (
    <aside 
      id="nav_rail" 
      className="hidden md:flex w-[92px] bg-[#0A0B10]/45 backdrop-blur-2xl border-r border-white/10 flex-col items-center justify-between py-6 shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)] select-none"
    >
      {/* 1. Logo Branding Section */}
      <div className="flex flex-col items-center gap-1">
        <div 
          id="app_logo" 
          className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-[#0088FF] to-blue-600 rounded-2xl flex items-center justify-center font-extrabold text-black text-2xl shadow-[0_0_25px_rgba(0,240,255,0.3)] select-none border border-white/20 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden glass-shine shrink-0"
        >
          P
          <div className="absolute inset-0 bg-white/20 transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        <span className="text-[10px] text-cyan-400 font-extrabold tracking-widest uppercase mt-2.5 text-center leading-none text-glow-cyan max-w-full truncate px-1">
          {lang === 'ru' ? 'ПИЛИГРИМ' : 'PILIGRIM'}
        </span>
      </div>

      {/* 2. Interactive Glassy Navigation Tabs */}
      <div className="flex flex-col gap-4 my-auto w-full px-2">
        {/* Connection Tab */}
        <button 
          id="nav_btn_connection"
          onClick={() => { setActiveTab('connection'); addLog(lang === 'ru' ? "Переключение на вкладку подключения" : "Switched to Connection tab"); }}
          title={currentT.connTab}
          className={`group relative flex flex-col items-center justify-center py-3.5 w-full rounded-2xl transition-all duration-300 border cursor-pointer ${
            activeTab === 'connection' 
              ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.12)] font-semibold' 
              : 'text-zinc-500 hover:text-zinc-200 bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5'
          }`}
        >
          <Globe className="w-5 h-5 transition-transform duration-300 group-hover:scale-115" />
          <span className="text-[9px] font-bold mt-1.5 tracking-wider uppercase truncate max-w-full">
            {lang === 'ru' ? 'Связь' : 'Connect'}
          </span>
          {activeTab === 'connection' && (
            <div className="absolute left-0 w-[4px] h-8 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00F0FF]"></div>
          )}
        </button>

        {isEngineerMode && (
          <>
            {/* Setup Wizard */}
            <button 
              id="nav_btn_wizard"
              onClick={() => { setActiveTab('wizard'); addLog(lang === 'ru' ? "Переключение на мастер установки VPS" : "Switched to VPS deployment guide"); }}
              title={currentT.setupTab}
              className={`group relative flex flex-col items-center justify-center py-3.5 w-full rounded-2xl transition-all duration-300 border cursor-pointer ${
                activeTab === 'wizard' 
                  ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.12)] font-semibold' 
                  : 'text-zinc-500 hover:text-zinc-200 bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5'
              }`}
            >
              <Server className="w-5 h-5 transition-transform duration-300 group-hover:scale-115" />
              <span className="text-[9px] font-bold mt-1.5 tracking-wider uppercase truncate max-w-full">
                {lang === 'ru' ? 'Сервер' : 'Wizard'}
              </span>
              {activeTab === 'wizard' && (
                <div className="absolute left-0 w-[4px] h-8 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00F0FF]"></div>
              )}
            </button>

            {/* Client Configurator */}
            <button 
              id="nav_btn_config"
              onClick={() => { setActiveTab('config'); addLog(lang === 'ru' ? "Переключение на генератор клиентских конфигов" : "Switched to client profile generator"); }}
              title={currentT.configTab}
              className={`group relative flex flex-col items-center justify-center py-3.5 w-full rounded-2xl transition-all duration-300 border cursor-pointer ${
                activeTab === 'config' 
                  ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.12)] font-semibold' 
                  : 'text-zinc-500 hover:text-zinc-200 bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5'
              }`}
            >
              <Shield className="w-5 h-5 transition-transform duration-300 group-hover:scale-115" />
              <span className="text-[9px] font-bold mt-1.5 tracking-wider uppercase truncate max-w-full">
                {lang === 'ru' ? 'Клиент' : 'Config'}
              </span>
              {activeTab === 'config' && (
                <div className="absolute left-0 w-[4px] h-8 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00F0FF]"></div>
              )}
            </button>

            {/* Diagnostics Terminal */}
            <button 
              id="nav_btn_diagnostics"
              onClick={() => { setActiveTab('diagnostics'); addLog(lang === 'ru' ? "Переключение на консоль отладки" : "Switched to terminal terminal"); }}
              title={currentT.diagTab}
              className={`group relative flex flex-col items-center justify-center py-3.5 w-full rounded-2xl transition-all duration-300 border cursor-pointer ${
                activeTab === 'diagnostics' 
                  ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.12)] font-semibold' 
                  : 'text-zinc-500 hover:text-zinc-200 bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5'
              }`}
            >
              <Terminal className="w-5 h-5 transition-transform duration-300 group-hover:scale-115" />
              <span className="text-[9px] font-bold mt-1.5 tracking-wider uppercase truncate max-w-full">
                {lang === 'ru' ? 'Консоль' : 'Debug'}
              </span>
              {activeTab === 'diagnostics' && (
                <div className="absolute left-0 w-[4px] h-8 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00F0FF]"></div>
              )}
            </button>
          </>
        )}
      </div>

      {/* 3. Footer Options (Theme / Eng Switcher, Lang switch) */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Modern Switcher Glassy Switch for Engineer Panel */}
        <button 
          id="engineer_mode_toggle"
          onClick={() => {
            const nextState = !isEngineerMode;
            setIsEngineerMode(nextState);
            addLog(lang === 'ru' 
              ? `Раздел "${nextState ? 'Инженерная панель' : 'Простой интерфейс'}" активирован.`
              : `Navigation mode changed. Expert panel is now ${nextState ? 'enabled' : 'disabled'}.`
            );
            if (!nextState) {
              setActiveTab('connection');
            }
          }}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
            isEngineerMode 
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
              : 'text-zinc-500 bg-zinc-950/80 border border-white/5 hover:text-zinc-300 hover:border-zinc-700'
          }`}
          title={lang === 'ru' ? "Сменить уровень доступа" : "Toggle developer utilities"}
        >
          <Settings className={`w-4.5 h-4.5 ${isEngineerMode ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          <span className="text-[8px] font-extrabold mt-1 tracking-wider uppercase">
            {lang === 'ru' ? 'Эксперт' : 'Dev'}
          </span>
        </button>

        {/* Glossy Language Toggle */}
        <button 
          id="lang_toggle"
          onClick={() => setLang(prev => prev === 'ru' ? 'en' : 'ru')}
          className="w-10 h-10 bg-zinc-950/80 border border-white/5 hover:border-cyan-400/30 hover:bg-cyan-400/5 rounded-xl flex items-center justify-center text-xs font-bold transition-all text-zinc-300 cursor-pointer shadow-md"
          title="Switch Language / Смена языка"
        >
          <Languages className="w-4 h-4 text-zinc-500 mr-0.5" />
          <span className="uppercase text-[9px] font-extrabold">{lang === 'ru' ? 'RU' : 'EN'}</span>
        </button>

        {/* Animated Connected node state radar point */}
        <div className="relative group p-1 shrink-0">
          <div className="relative flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isConnected ? 'bg-[#00F0FF]' : 'bg-red-500'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border border-white/10 ${
              isConnected ? 'bg-cyan-400 shadow-[0_0_10px_#00F0FF]' : 'bg-red-500'
            }`}></span>
          </div>
          <div className="absolute hidden group-hover:block bottom-10 left-1/2 -translate-x-1/2 bg-zinc-950/95 border border-white/10 px-2.5 py-1 text-[10px] rounded-lg whitespace-nowrap z-50 shadow-xl text-zinc-200">
            {isConnected ? currentT.connected : currentT.disconnected}
          </div>
        </div>
      </div>
    </aside>
  );
}
