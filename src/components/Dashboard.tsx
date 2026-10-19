import { useState } from 'react';
import { Server, Plus, Activity, RefreshCw, Cpu, Wifi, Globe, Shield, ChevronDown, X } from 'lucide-react';
import { ServerLocation, ConnectionStats } from '../types';

interface DashboardProps {
  servers: ServerLocation[];
  selectedServerId: string;
  switchServer: (id: string) => void;
  isConnecting: boolean;
  isConnected: boolean;
  handleConnectToggle: () => void;
  activeServer: ServerLocation;
  stats: ConnectionStats;
  speedPoints: string;
  activeTimeSec: number;
  formatTime: (t: number) => string;
  isEngineerMode: boolean;
  setIsAddServerOpen: (v: boolean) => void;
  lang: 'ru' | 'en';
  t: any;
}

export default function Dashboard({
  servers,
  selectedServerId,
  switchServer,
  isConnecting,
  isConnected,
  handleConnectToggle,
  activeServer,
  stats,
  speedPoints,
  activeTimeSec,
  formatTime,
  isEngineerMode,
  setIsAddServerOpen,
  lang,
  t
}: DashboardProps) {
  const currentT = t[lang];
  const [isServerDrawerOpen, setIsServerDrawerOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full">
      
      {/* 1. Server Browser (Left on Desktop, Hidden on Mobile/Tablet) */}
      <div 
        id="server_browser_desktop" 
        className="hidden lg:flex lg:col-span-4 bg-[#0D0E14]/30 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6.5 flex-col min-h-[480px] shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-5 select-none relative z-10">
          <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase flex items-center gap-2 text-glow-cyan">
            <Server className="w-4 h-4 text-cyan-400" />
            {currentT.serversTitle} ({servers.length})
          </h2>
          
          {/* Add custom node node button */}
          {isEngineerMode && (
            <button 
              id="add_server_btn"
              onClick={() => setIsAddServerOpen(true)}
              className="p-1 px-3 rounded-xl bg-cyan-400/10 text-xs font-bold text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF]/20 hover:border-cyan-400/50 cursor-pointer transition-all duration-300 transform active:scale-95 flex items-center gap-1 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] select-none shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              {lang === 'ru' ? 'Добавить' : 'Add'}
            </button>
          )}
        </div>

        {/* List of servers */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[410px] scrollbar-glass scroll-smooth select-none relative z-10">
          {servers.map((server) => {
            const isActive = selectedServerId === server.id;
            const latencyColor = server.ping < 30 ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : server.ping < 80 ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' : 'bg-rose-500 shadow-[0_0_8px_#EF4444]';
            
            return (
              <div 
                key={server.id}
                id={`server_card_desktop_${server.id}`}
                onClick={() => switchServer(server.id)}
                className={`glass-card p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer relative overflow-hidden group/card ${
                  isActive 
                    ? 'border-cyan-400/60 bg-linear-to-r from-cyan-400/[0.04] to-cyan-400/[0.01] shadow-[0_0_20px_rgba(0,240,255,0.08)]' 
                    : 'border-white/[0.04] bg-white/[0.01]'
                }`}
              >
                {/* Active Neon Border line */}
                {isActive && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 shadow-[2px_0_10px_rgba(0,240,255,0.5)]"></div>
                )}

                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="text-2xl select-none bg-zinc-950/70 p-2.5 rounded-xl h-11 w-11 flex items-center justify-center border border-white/10 group-hover/card:border-cyan-400/40 transition-colors duration-300 relative">
                    <span className="relative z-10">{server.emoji}</span>
                    <div className="absolute inset-0.5 rounded-lg opacity-15 filter blur-xs" style={{ backgroundColor: server.flagColor }}></div>
                  </div>
                  
                  <div className="leading-tight">
                    <h3 className="font-extrabold text-sm text-zinc-100 group-hover/card:text-white transition-colors">
                      {lang === 'ru' ? server.nameRu : server.nameEn}
                    </h3>
                    <p className="text-xs text-zinc-500 font-bold tracking-normal mt-0.5">
                      {lang === 'ru' ? server.cityRu : server.cityEn}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 font-mono text-[10px] relative z-10">
                  <span className="text-zinc-300 font-bold flex items-center gap-2 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
                    <span className={`w-1.5 h-1.5 rounded-full ${latencyColor}`}></span>
                    {server.ping} ms
                  </span>
                  <span className="text-zinc-600 font-bold">
                    {server.baseIp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful text block */}
        <div className="mt-4 p-4 bg-zinc-950/60 rounded-2xl border border-white/5 text-[11px] text-zinc-500 flex items-start gap-3 leading-relaxed relative z-10">
          <span className="bg-cyan-500/10 text-cyan-400 p-2 rounded-xl text-glow-cyan shrink-0">
            🛡️
          </span>
          <span className="font-medium">
            {lang === 'ru' 
              ? "Ваш трафик надёжно скрыт за туннелем Пилигрима. Данные шифруются на лету при помощи алгоритма ChaCha20-Poly1305."
              : "Your data payloads are fully locked behind Piligrim's tunnel. Traffic stream is scrambled on the fly using ChaCha20-Poly1305 cryptography."}
          </span>
        </div>
      </div>

      {/* 2. Connection Interactive Core Grid */}
      <div 
        id="main_stage" 
        className="lg:col-span-8 bg-[#0D0E14]/25 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-between relative min-h-[460px] lg:min-h-[500px] shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)]"
      >
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-85 h-85 bg-blue-600/[0.03] rounded-full blur-[110px] pointer-events-none"></div>
        
        {/* Cyber technical line decorations */}
        <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20 rounded-3xl"></div>

        {/* Top-left state notification (hidden/compact on small mobile to avoid clutter) */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 select-none z-10">
          <span className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${isConnected ? 'bg-cyan-400 text-glow-cyan animate-pulse' : 'bg-zinc-600'}`}></span>
          <span className="text-[9px] sm:text-[10px] font-mono font-black tracking-widest text-[#a1a1aa] uppercase">
            {isConnected ? 'GUARD ACTIVE' : 'SHIELD DEACTIVATED'}
          </span>
        </div>

        {/* Orb switcher core container */}
        <div 
          id="connection_ring" 
          className="relative flex flex-col items-center justify-center w-64 h-64 sm:w-72 sm:h-72 my-4 rounded-full border border-white/[0.03] bg-radial from-cyan-400/[0.01] to-transparent transition-all duration-500 z-10"
        >
          {/* Orbital Rotating Auroras */}
          <div className={`absolute inset-[-4px] rounded-full border border-dashed transition-all duration-1000 opacity-50 ${
            isConnected 
              ? 'border-cyan-400/40 rotate-[45deg] scale-[1.05] animate-spin-slow' 
              : 'border-zinc-800 scale-100'
          }`}></div>
          <div className={`absolute inset-[-12px] rounded-full border border-dotted transition-all duration-1000 opacity-30 ${
            isConnected 
              ? 'border-blue-500/25 rotate-[-120deg] scale-[1.05] animate-spin-reverse' 
              : 'border-transparent scale-100'
          }`}></div>

          {/* Glowing central orb background backlight */}
          <div className={`absolute w-36 h-36 rounded-full filter blur-xl transition-all duration-700 ${
            isConnected ? 'bg-cyan-500/20 shadow-[0_0_35px_rgba(0,240,255,0.35)]' : 'bg-transparent'
          }`}></div>

          {/* Central Power trigger Orb */}
          <button 
            id="power_switch_btn"
            onClick={handleConnectToggle}
            disabled={isConnecting}
            title={isConnected ? "Disconnect VPN" : "Connect VPN"}
            className={`relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 transform active:scale-95 border-0 outline-hidden select-none ${
              isConnecting 
                ? 'bg-zinc-800 shadow-inner' 
                : isConnected 
                  ? 'bg-gradient-to-tr from-cyan-400 via-cyan-500 to-blue-600 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] border border-white/20 transform hover:scale-[1.03]' 
                  : 'bg-gradient-to-tr from-[#1E202B] via-[#14151C] to-[#0A0B10] hover:bg-zinc-800 border border-white/10 hover:border-cyan-400/30 hover:shadow-[0_0_25px_rgba(0,240,255,0.12)] text-zinc-400 hover:text-white transform hover:scale-[1.01]'
            }`}
          >
            {/* Mirror lens glossy reflection gloss */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[85%] h-[35%] bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none z-15"></div>

            {isConnecting ? (
              <RefreshCw className="w-12 h-12 animate-spin text-cyan-400" />
            ) : (
              <svg 
                className={`w-12 h-12 transition-all duration-300 ${isConnected ? 'text-[#0A0B10] drop-shadow-md' : 'text-zinc-500 hover:text-cyan-400'}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            )}
          </button>

          {/* Dynamic subtext status overlay */}
          <div className="absolute bottom-6 sm:bottom-8 flex flex-col items-center leading-none z-20 pointer-events-none">
            <span className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
              isConnected ? 'text-cyan-200 text-glow-cyan' : 'text-zinc-600'
            }`}>
              {isConnecting ? currentT.connecting : isConnected ? currentT.connected : currentT.disconnected}
            </span>
            <span className="text-[9px] font-bold font-mono text-zinc-500 mt-1 select-all">
              {isConnecting ? '...' : isConnected ? activeServer.baseIp : '0.0.0.0'}
            </span>
          </div>
        </div>

        {/* MOBILE ACTIVE SERVER SELECTION CARD (Exclusive to Mobile/Tablet layout) */}
        <div className="w-full max-w-sm lg:hidden mb-4 relative z-20">
          <button 
            onClick={() => setIsServerDrawerOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] active:bg-white/[0.05] transition-all relative overflow-hidden group"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl bg-zinc-950/80 p-2 rounded-xl h-9 w-9 flex items-center justify-center border border-white/5">
                {activeServer.emoji}
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                  {lang === 'ru' ? 'Активная локация' : 'Active Location'}
                </span>
                <span className="text-xs font-extrabold text-zinc-200">
                  {lang === 'ru' ? activeServer.nameRu : activeServer.nameEn}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-black/40 text-zinc-400 px-2 py-0.5 rounded-lg border border-white/5">
                {activeServer.ping} ms
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </button>
        </div>

        {/* Live bandwidth spark chart container */}
        <div className="w-full max-w-md bg-zinc-950/40 p-3 sm:p-4 border border-white/[0.05] rounded-2xl flex flex-col items-center gap-1.5 backdrop-blur-md relative overflow-hidden z-10 mb-4">
          <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-zinc-500 leading-none">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              {lang === 'ru' ? 'АКТИВНОСТЬ ТРАФИКА (Мбит/с)' : 'DECOY TRAFFIC (Mbps)'}
            </span>
            <span className="text-cyan-400 font-extrabold text-[#00f0ff]">{isConnected ? `${stats.downloadSpeed} Mbps` : 'STANDBY'}</span>
          </div>
          
          <div className="w-full h-11 sm:h-14 relative overflow-hidden mt-1 bg-black/30 rounded-xl border border-white/[0.02]">
            <svg className="w-full h-full" viewBox="0 0 360 81" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cyanGlassGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {isConnected && (
                <path
                  d={`M 0,80 L ${speedPoints} L 360,80 Z`}
                  fill="url(#cyanGlassGlow)"
                  className="transition-all duration-500"
                />
              )}
              <polyline
                fill="none"
                stroke={isConnected ? "#00F0FF" : "rgba(255, 255, 255, 0.08)"}
                strokeWidth="2"
                points={isConnected ? speedPoints : "0,70 30,70 60,70 90,70 120,70 150,70 180,70 210,70 240,70 270,70 300,70 330,70 360,70"}
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Bento stats display block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4.5 w-full mt-4 pt-4 border-t border-white/[0.05] font-mono relative z-10 text-center">
          <div className="group border-r border-white/5 last:border-0 py-0.5">
            <p className="text-[8px] sm:text-[9px] text-zinc-500 uppercase font-black tracking-widest">{currentT.protocol}</p>
            <p className="text-[11px] sm:text-xs font-black text-white mt-0.5 group-hover:text-cyan-400 transition-colors uppercase">
              {activeServer.protocol}
            </p>
          </div>

          <div className="group border-r border-white/5 last:border-0 py-0.5">
            <p className="text-[8px] sm:text-[9px] text-zinc-500 uppercase font-black tracking-widest">{currentT.ping}</p>
            <p className="text-[11px] sm:text-xs font-black text-white mt-0.5 group-hover:text-cyan-400 transition-colors">
              {isConnected ? `${stats.ping} ms` : '—'}
            </p>
          </div>

          <div className="group border-r border-white/5 last:border-0 py-0.5">
            <p className="text-[8px] sm:text-[9px] text-zinc-500 uppercase font-black tracking-widest">{lang === 'ru' ? 'ЗАГРУЗКА' : 'DL SPEED'}</p>
            <p className="text-[11px] sm:text-xs font-black text-cyan-400 mt-0.5">
              {isConnected ? `${stats.downloadSpeed} Mbps` : '—'}
            </p>
          </div>

          <div className="group py-0.5">
            <p className="text-[8px] sm:text-[9px] text-zinc-500 uppercase font-black tracking-widest">{lang === 'ru' ? 'ВРЕМЯ' : 'UPTIME'}</p>
            <p className="text-[11px] sm:text-xs font-black text-zinc-200 mt-0.5">
              {isConnected ? formatTime(activeTimeSec) : '00:00:00'}
            </p>
          </div>
        </div>

      </div>

      {/* MOBILE SERVERS DRAWER BOTTOM SHEET (Extremely premium smooth interface) */}
      {isServerDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsServerDrawerOpen(false)}
          ></div>
          
          {/* Glass Drawer Panel */}
          <div className="w-full max-w-md bg-[#090A0E] border-t border-white/10 rounded-t-3xl max-h-[80vh] flex flex-col relative z-50 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Drawer handle indicator */}
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-5"></div>
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black tracking-widest text-cyan-400 uppercase flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {lang === 'ru' ? 'Выбор локации' : 'Select Location'}
              </h3>
              
              <button 
                onClick={() => setIsServerDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of servers in drawer */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pb-8 scrollbar-glass">
              {servers.map((server) => {
                const isActive = selectedServerId === server.id;
                const latencyColor = server.ping < 30 ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : server.ping < 80 ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' : 'bg-rose-500 shadow-[0_0_8px_#EF4444]';
                
                return (
                  <button 
                    key={server.id}
                    onClick={() => {
                      switchServer(server.id);
                      setIsServerDrawerOpen(false);
                    }}
                    className={`w-full glass-card p-3 rounded-2xl border flex items-center justify-between cursor-pointer relative overflow-hidden text-left ${
                      isActive 
                        ? 'border-cyan-400/40 bg-cyan-400/[0.04]' 
                        : 'border-white/[0.04] bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl bg-zinc-950 p-2 rounded-xl h-10 w-10 flex items-center justify-center border border-white/5">
                        {server.emoji}
                      </div>
                      
                      <div>
                        <h4 className="font-extrabold text-xs text-zinc-100">{lang === 'ru' ? server.nameRu : server.nameEn}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{lang === 'ru' ? server.cityRu : server.cityEn}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 font-mono text-[9px]">
                      <span className="text-zinc-300 font-bold flex items-center gap-1.5 bg-black/40 px-1.5 py-0.5 rounded-lg border border-white/5">
                        <span className={`w-1 h-1 rounded-full ${latencyColor}`}></span>
                        {server.ping} ms
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
