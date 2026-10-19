import { FormEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface AddServerModalProps {
  isAddServerOpen: boolean;
  setIsAddServerOpen: (v: boolean) => void;
  handleAddServer: (e: FormEvent) => void;
  newServerName: string;
  setNewServerName: (v: string) => void;
  newServerCity: string;
  setNewServerCity: (v: string) => void;
  newServerIp: string;
  setNewServerIp: (v: string) => void;
  newServerFlag: string;
  setNewServerFlag: (v: string) => void;
  currentT: any;
  lang: 'ru' | 'en';
}

export default function AddServerModal({
  isAddServerOpen,
  setIsAddServerOpen,
  handleAddServer,
  newServerName,
  setNewServerName,
  newServerCity,
  setNewServerCity,
  newServerIp,
  setNewServerIp,
  newServerFlag,
  setNewServerFlag,
  currentT,
  lang
}: AddServerModalProps) {
  if (!isAddServerOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300">
      
      {/* Modal element */}
      <div className="bg-[#0C0C12]/90 border border-white/10 rounded-3xl max-w-md w-full p-6 md:p-7.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden transform transition-all animate-fade-in">
        
        {/* Glow ambient circle */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close dialog trigger */}
        <button 
          onClick={() => setIsAddServerOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6 select-none">
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Plus className="w-5 h-5 text-cyan-400 text-glow-cyan" />
            {currentT.modalTitle}
          </h3>
          <p className="text-xs text-zinc-400/80 mt-1.5 font-sans">Configure custom external virtual server node for your local active server browser.</p>
        </div>

        <form onSubmit={handleAddServer} className="space-y-4.5">
          
          {/* Target Country Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">{currentT.countryName}</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Швеция / Sweden"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
              className="bg-black/40 border border-white/10 hover:border-cyan-400/30 p-3 rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.02] font-semibold transition-all duration-300"
            />
          </div>

          {/* City or Proxy metatag config */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">{currentT.cityLabel}</label>
            <input 
              type="text" 
              placeholder="e.g. Стокгольм #1"
              value={newServerCity}
              onChange={(e) => setNewServerCity(e.target.value)}
              className="bg-black/40 border border-white/10 hover:border-cyan-400/30 p-3 rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.02] font-semibold transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* IP Address of custom VPS node */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">{currentT.ipAddress}</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 77.244.112.5"
                value={newServerIp}
                onChange={(e) => setNewServerIp(e.target.value)}
                className="bg-black/40 border border-white/10 hover:border-cyan-400/30 p-3 rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.02] font-semibold transition-all ... font-mono"
              />
            </div>

            {/* Custom Emoji Flag Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide font-black">{lang === 'ru' ? 'Флаг / Иконка' : 'Emoji Icon'}</label>
              <input 
                type="text" 
                placeholder="e.g. 🇸🇪, 🇯🇵, 🌐, 🚀"
                value={newServerFlag}
                onChange={(e) => setNewServerFlag(e.target.value)}
                className="bg-black/40 border border-white/10 hover:border-cyan-400/30 p-3 rounded-xl text-xs text-white focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-500/[0.02] font-medium transition-all text-center"
              />
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="pt-4 pb-1.5 border-t border-white/[0.06] flex gap-3.5 justify-end">
            <button 
              type="button"
              onClick={() => setIsAddServerOpen(false)}
              className="py-2.5 px-4.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all cursor-pointer"
            >
              {currentT.cancel}
            </button>
            <button 
              type="submit"
              className="py-2.5 px-5.5 rounded-xl text-xs font-black text-zinc-950 bg-cyan-400 hover:bg-cyan-300 hover:shadow-[0_4px_15px_rgba(0,240,255,0.25)] transition-all cursor-pointer transform active:scale-95"
            >
              {currentT.save}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
