import { Server, Copy, Check, FileText } from 'lucide-react';

interface WizardProps {
  wizardIp: string;
  setWizardIp: (v: string) => void;
  wizardPort: number;
  setWizardPort: (v: number) => void;
  wizardPass: string;
  setWizardPass: (v: string) => void;
  wizardDns: string;
  setWizardDns: (v: string) => void;
  lang: 'ru' | 'en';
  t: any;
  dockerCode: string;
  bashCode: string;
  amneziaGuide: string;
  copiedDocker: boolean;
  copiedBash: boolean;
  // ИСПРАВЛЕНО: 'conf' заменено на 'config', чтобы совпадать с App.tsx
  triggerCopy: (c: string, type: 'docker' | 'bash' | 'config') => void;
}

export default function Wizard({
  wizardIp,
  setWizardIp,
  wizardPort,
  setWizardPort,
  wizardPass,
  setWizardPass,
  wizardDns,
  setWizardDns,
  lang,
  t,
  dockerCode,
  bashCode,
  amneziaGuide,
  copiedDocker,
  copiedBash,
  triggerCopy
}: WizardProps) {
  const currentT = t[lang];

  return (
    <div className="bg-[#0D0E14]/30 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-8 flex flex-col w-full shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)] relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info Block */}
      <div className="mb-6 pb-6 border-b border-white/[0.06]">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
          <Server className="text-cyan-400 w-6 h-6 animate-pulse text-glow-cyan" />
          {currentT.setupTitle}
        </h2>
        <p className="text-xs text-zinc-400 mt-1.5 font-sans">{currentT.setupSubtitle}</p>
      </div>

      {/* Responsive Frost Glass VPS Parameter Forms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 bg-black/40 p-4.5 rounded-2xl border border-white/[0.04] mb-8">
        
        {/* Host IP field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-wide">{currentT.customIp}</label>
          <input 
            type="text" 
            value={wizardIp}
            onChange={(e) => setWizardIp(e.target.value)}
            placeholder="185.242.114.94"
            className="bg-white/[0.02] border border-white/10 p-3 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-cyan-400 focus:bg-[#00F0FF]/5 transition-all duration-300"
          />
        </div>

        {/* Port gateway selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-wide">{currentT.customPort}</label>
          <input 
            type="number" 
            value={wizardPort}
            onChange={(e) => setWizardPort(Number(e.target.value))}
            className="bg-white/[0.02] border border-white/10 p-3 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-cyan-400 focus:bg-[#00F0FF]/5 transition-all duration-300"
          />
        </div>

        {/* Administration Auth key */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-wide">{currentT.adminPass}</label>
          <input 
            type="text" 
            value={wizardPass}
            onChange={(e) => setWizardPass(e.target.value)}
            className="bg-white/[0.02] border border-white/10 p-3 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-cyan-400 focus:bg-[#00F0FF]/5 transition-all duration-300"
          />
        </div>

        {/* Dedicated primary DNS server IP */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-black uppercase text-zinc-500 tracking-wide">DNS Domain Name Server</label>
          <input 
            type="text" 
            value={wizardDns}
            onChange={(e) => setWizardDns(e.target.value)}
            className="bg-white/[0.02] border border-white/10 p-3 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:border-cyan-400 focus:bg-[#00F0FF]/5 transition-all duration-300"
          />
        </div>

      </div>

      {/* Detailed deployment options */}
      <div className="space-y-8 select-text">
        
        {/* Method 1: Docker wg-easy containers platform */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="bg-cyan-400/10 text-cyan-400 text-[10px] font-mono font-black py-0.5 px-2.5 rounded-lg border border-cyan-400/20 shadow-inner">METHOD A-1</span>
              {currentT.dockerTitle}
            </h3>
            <button 
              onClick={() => triggerCopy(dockerCode, 'docker')}
              className={`p-2 px-3 rounded-xl text-[10px] font-bold tracking-wider font-mono uppercase flex items-center gap-2 transition-all duration-300 border cursor-pointer ${
                copiedDocker 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-white/[0.03] text-zinc-300 hover:text-white border-white/10 hover:border-cyan-400/40 hover:bg-cyan-400/[0.02]'
              }`}
            >
              {copiedDocker ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedDocker ? currentT.copied : currentT.copyBtn}
            </button>
          </div>
          <p className="text-xs text-zinc-400 font-sans max-w-4xl tracking-normal leading-relaxed">{currentT.dockerDesc}</p>
          <div className="bg-zinc-950/70 p-4.5 rounded-2xl border border-white/[0.04] font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
            {dockerCode}
          </div>
        </div>

        {/* Method 2: Classic Native Bash Script installation */}
        <div className="space-y-3 pt-6 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="bg-zinc-800 text-zinc-400 text-[10px] font-mono font-black py-0.5 px-2.5 rounded-lg border border-white/5">METHOD A-2</span>
              {currentT.bashTitle}
            </h3>
            <button 
              onClick={() => triggerCopy(bashCode, 'bash')}
              className={`p-2 px-3 rounded-xl text-[10px] font-bold tracking-wider font-mono uppercase flex items-center gap-2 transition-all duration-300 border cursor-pointer ${
                copiedBash 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-white/[0.03] text-zinc-300 hover:text-white border-white/10 hover:border-cyan-400/40 hover:bg-cyan-400/[0.02]'
              }`}
            >
              {copiedBash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedBash ? currentT.copied : currentT.copyBtn}
            </button>
          </div>
          <p className="text-xs text-zinc-400 font-sans max-w-4xl tracking-normal leading-relaxed">{currentT.bashDesc}</p>
          <div className="bg-zinc-950/70 p-4.5 rounded-2xl border border-white/[0.04] font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
            {bashCode}
          </div>
        </div>

        {/* Obfuscation Bypass Guidelines (Amnezia, ShadowSocks) */}
        <div className="p-5.5 bg-cyan-400/[0.015] rounded-2xl border border-cyan-400/10 flex flex-col md:flex-row gap-4.5 items-start">
          <span className="bg-cyan-400/10 text-cyan-400 rounded-xl p-2.5 flex items-center justify-center font-black font-mono text-sm shrink-0 shadow-inner select-none">
            ℹ️
          </span>
          <div className="space-y-2">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest text-glow-cyan select-none">{currentT.amneziaTitle}</h4>
            <p className="text-xs text-zinc-300 font-sans tracking-normal leading-relaxed select-none">{currentT.amneziaDesc}</p>
            
            <div className="bg-zinc-950/75 p-4 rounded-xl border border-white/[0.03] font-mono text-[11px] text-zinc-400 space-y-2 select-text leading-relaxed">
              {amneziaGuide.split('\n').map((line, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="text-cyan-400/40 font-bold font-mono">0{i+1}:</span>
                  <span>{line.substring(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
