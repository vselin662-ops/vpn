import { FormEvent, RefObject } from 'react';
import { Activity, Terminal } from 'lucide-react';
import { TerminalLog } from '../types';

interface DiagnosticsProps {
  logs: string[];
  terminalLogs: TerminalLog[];
  commandValue: string;
  setCommandValue: (v: string) => void;
  handleCommandSubmit: (e: FormEvent) => void;
  terminalEndRef: RefObject<HTMLDivElement | null>;
  addLog: (m: string) => void;
  currentT: any;
  lang: 'ru' | 'en';
}

export default function Diagnostics({
  logs,
  terminalLogs,
  commandValue,
  setCommandValue,
  handleCommandSubmit,
  terminalEndRef,
  addLog,
  currentT,
  lang
}: DiagnosticsProps) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full select-none">
      
      {/* Live Event Stream Panel (Left, 4 cols) */}
      <div className="lg:col-span-4 bg-[#0D0E14]/30 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 flex flex-col justify-between shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)]">
        <div>
          <h3 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-1.5 flex items-center gap-2 text-glow-cyan">
            <Activity className="w-4 h-4 animate-spin text-cyan-400" />
            LIVE DIAGNOSTICS DECK
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5 mb-5 font-sans">Real-time signal events broadcast for routing loops.</p>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-glass select-text">
            {logs.map((logLine, index) => (
              <div 
                key={index} 
                className="text-[10px] font-mono leading-relaxed bg-zinc-950/40 p-2.5 rounded-xl border border-white/[0.03] text-zinc-400 flex items-start gap-2.5"
              >
                <span className="text-cyan-400/40 font-bold select-none">&gt;&gt;</span>
                <span className="break-all tracking-normal">{logLine}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic checking triggers actions */}
        <div className="pt-4 border-t border-white/[0.05] space-y-2.5 mt-5">
          <button 
            onClick={() => {
              addLog(lang === 'ru' 
                ? "[Анализ] Ручная проверка интерфейса туннеля..." 
                : "[Diagnostics] Triggered security checks on interface wg0..."
              );
              setTimeout(() => addLog(lang === 'ru' 
                ? "[Анализ] Мониторинг wg0 - Статус подтверждён: Аптайм проверен." 
                : "[Diagnostics] Interface monitor report: wg0 active & healthy."
              ), 450);
            }}
            className="w-full py-2.5 bg-white/[0.02] hover:bg-white/[0.06] hover:text-white border border-white/5 hover:border-cyan-400/30 rounded-xl text-[10px] font-bold text-zinc-400 font-mono text-center cursor-pointer select-none transition-all duration-300 transform active:scale-95"
          >
            PING SYSTEM PROTOCOL wg0
          </button>
          <button 
            onClick={() => {
              addLog(lang === 'ru' 
                ? "[Оптимизация] Запущен тест согласования пакетов MTU..." 
                : "[MTU Align] Starting maximum transmission packet size optimization checks..."
              );
              setTimeout(() => addLog(lang === 'ru' 
                ? "[Оптимизация] Согласовано значение MTU: 1420 байт. Потери устранены." 
                : "[MTU Align] Successfully verified and aligned MTU payload size to 1420 bytes."
              ), 450);
            }}
            className="w-full py-2.5 bg-white/[0.02] hover:bg-white/[0.06] hover:text-white border border-white/5 hover:border-cyan-400/30 rounded-xl text-[10px] font-bold text-zinc-400 font-mono text-center cursor-pointer select-none transition-all duration-300 transform active:scale-95"
          >
            TRIGGER MTU PAYLOAD OPTIMIZATION
          </button>
        </div>

      </div>

      {/* Retro Interactive Command Deck Shell (Right, 8 cols) */}
      <div className="lg:col-span-8 bg-[#040508]/90 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 flex flex-col justify-between h-[480px] shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)]">
        
        {/* Terminal frame meta */}
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
            <span className="text-[10px] font-mono font-bold text-zinc-500 ml-2">administrator@piligrim-console: ~</span>
          </div>
          <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase bg-cyan-400/5 px-2 py-0.5 rounded-md border border-cyan-400/15 text-glow-cyan">WG SECURE SHELL</span>
        </div>

        {/* Console line printing container */}
        <div className="flex-1 bg-black/40 p-4.5 rounded-2xl border border-white/[0.03] overflow-y-auto mb-4 font-mono text-[11.5px] space-y-2.5 scrollbar-glass select-text select-text">
          {terminalLogs.map((log, index) => {
            if (log.type === 'system') {
              return <div key={index} className="text-cyan-400 whitespace-pre-wrap tracking-wide text-glow-cyan leading-relaxed">{log.text}</div>;
            } else if (log.type === 'input') {
              return <div key={index} className="text-white font-extrabold whitespace-pre-wrap">{log.text}</div>;
            } else {
              return <div key={index} className="text-zinc-400/90 pl-3.5 border-l-2 border-white/10 whitespace-pre-wrap leading-relaxed">{log.text}</div>;
            }
          })}
          <div ref={terminalEndRef}></div>
        </div>

        {/* Input prompt query footer form */}
        <form onSubmit={handleCommandSubmit} className="flex gap-3 shrink-0">
          <span className="text-cyan-400 font-extrabold select-none self-center font-mono text-sm pl-1 shadow-xs text-glow-cyan">$</span>
          <input 
            type="text"
            value={commandValue}
            onChange={(e) => setCommandValue(e.target.value)}
            placeholder={currentT.terminalPlaceholder}
            className="flex-1 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-cyan-400/30 p-3 rounded-xl text-xs font-mono focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-500/[0.04] text-white transition-all duration-300 font-medium"
          />
          <button 
            type="submit"
            className="px-6 bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 hover:text-white font-black font-mono text-[10px] tracking-widest uppercase rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer hover:shadow-[0_0_15px_rgba(0,136,255,0.15)] select-none shrink-0"
          >
            EXEC
          </button>
        </form>

      </div>

    </div>
  );
}
