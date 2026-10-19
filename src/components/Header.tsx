import { Cpu, Wifi } from 'lucide-react';

interface HeaderProps {
  isEngineerMode: boolean;
  lang: 'ru' | 'en';
  t: any;
}

export default function Header({ isEngineerMode, lang, t }: HeaderProps) {
  const currentT = t[lang];

  return (
    <header className="h-[76px] bg-[#0A0B10]/35 backdrop-blur-2xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-8 z-20 shadow-md">
      {/* Title & Slogan section */}
      <div>
        <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
          {isEngineerMode ? (
            <span className="bg-linear-to-r from-white via-zinc-200 to-cyan-400 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-none">
              {lang === 'ru' ? t.ru.title : t.en.title}
            </span>
          ) : (
            <span className="bg-gradient-to-r from-white via-[#EAEAEA] to-cyan-100 bg-clip-text text-transparent">
              {lang === 'ru' ? t.ru.title : t.en.title}
            </span>
          )}
          
          {/* Neon Expert pill if engineer panel activated */}
          {isEngineerMode && (
            <span className="text-[8px] sm:text-[9px] font-extrabold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 px-1.5 sm:px-2 py-0.5 rounded-md tracking-wider uppercase shadow-[0_0_10px_rgba(0,240,255,0.15)] animate-pulse shrink-0">
              EXP
            </span>
          )}
        </h1>
        <p className="text-[10px] sm:text-xs text-zinc-400/80 mt-0.5 sm:mt-1 font-medium font-sans hidden sm:block">
          {isEngineerMode ? (lang === 'ru' ? t.ru.engSubtitle : t.en.engSubtitle) : currentT.subtitle}
        </p>
      </div>

      {/* Right Header Stats & Info Deck */}
      <div className="flex items-center gap-6">
        {/* Dynamic VPS Telemetry panel */}
        <div className="hidden md:flex items-center gap-5 text-[11px] font-mono bg-white/[0.02] border border-white/5 px-4.5 py-2.5 rounded-xl shadow-inner backdrop-blur-md">
          <span className="flex items-center gap-2 text-zinc-400 font-medium">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            CPU: <strong className="text-zinc-100 font-bold">1.4%</strong>
          </span>
          <span className="w-[1px] h-3 bg-white/10"></span>
          <span className="flex items-center gap-2 text-zinc-400 font-medium">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            INTERFACE: <strong className="text-emerald-400 font-bold">wg0</strong>
          </span>
        </div>

        {/* Administrator profile container */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white tracking-wide">Administrator</div>
            <div className="text-[9px] text-zinc-500 font-mono tracking-wider">ID: aistudio-dev-vpn</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400/15 to-[#0088FF]/15 border border-cyan-500/30 flex items-center justify-center font-mono text-cyan-400 font-extrabold text-sm shadow-[0_4px_12px_rgba(0,136,255,0.1)] hover:border-cyan-400 hover:text-white transition-all transform active:scale-95 cursor-pointer">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
