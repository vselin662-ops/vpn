import { RefreshCw, Download, Check, Copy, ChevronRight } from 'lucide-react';
import { ServerLocation } from '../types';

interface ConfiguratorProps {
  dnsInput: string;
  setDnsInput: (v: string) => void;
  clientAddress: string;
  setClientAddress: (v: string) => void;
  clientPrivKey: string;
  setClientPrivKey: (v: string) => void;
  clientPubKey: string;
  setClientPubKey: (v: string) => void;
  generateKeysPair: () => void;
  handleDownloadConfFile: () => void;
  activeServer: ServerLocation;
  triggerCopy: (c: string, type: 'docker' | 'bash' | 'conf') => void;
  copiedConf: boolean;
  lang: 'ru' | 'en';
  t: any;
}

export default function Configurator({
  dnsInput,
  setDnsInput,
  clientAddress,
  setClientAddress,
  clientPrivKey,
  setClientPrivKey,
  clientPubKey,
  setClientPubKey,
  generateKeysPair,
  handleDownloadConfFile,
  activeServer,
  triggerCopy,
  copiedConf,
  lang,
  t
}: ConfiguratorProps) {
  const currentT = t[lang];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
      
      {/* Parameters Panel (Left) */}
      <div className="bg-[#0D0E14]/30 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 md:p-7.5 flex flex-col justify-between shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)]">
        <div>
          <div className="mb-5 select-none">
            <h2 className="text-base font-extrabold text-white tracking-tight">{currentT.wgConfigTitle}</h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">{currentT.wgConfigDesc}</p>
          </div>

          <div className="space-y-4.5">
            
            {/* Generate random private / public cryptographic keys pair */}
            <div className="select-none">
              <button 
                type="button"
                onClick={generateKeysPair}
                className="w-full py-3 px-4 bg-cyan-400/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/60 rounded-2xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform active:scale-95 shadow-[0_4px_15px_rgba(0,240,255,0.05)]"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                {currentT.genKeysBtn}
              </button>
            </div>

            {/* Client Private key field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                Client Private Key (PrivateKey)
              </label>
              <input 
                type="text" 
                value={clientPrivKey}
                onChange={(e) => setClientPrivKey(e.target.value)}
                className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
              />
            </div>

            {/* Client Public key field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                {currentT.serverPubKey}
              </label>
              <input 
                type="text" 
                value={clientPubKey}
                onChange={(e) => setClientPubKey(e.target.value)}
                className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
              />
            </div>

            {/* IP addresses allocation & DNS parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                  {currentT.clientIP}
                </label>
                <input 
                  type="text" 
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                  {currentT.dnsServers}
                </label>
                <input 
                  type="text" 
                  value={dnsInput}
                  onChange={(e) => setDnsInput(e.target.value)}
                  className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
                />
              </div>
            </div>

            {/* Socket Server endpoint info badge */}
            <div className="p-4 bg-zinc-950/65 rounded-2xl border border-white/5 flex gap-3 items-start select-none">
              <div className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-lg border border-cyan-400/20 font-mono text-[10px] font-black uppercase shrink-0 mt-0.5 shadow-inner">
                GATEWAY
              </div>
              <div className="leading-tight">
                <h4 className="text-[11px] font-extrabold text-zinc-200 uppercase font-mono flex items-center gap-1.5 leading-none mt-0.5">
                  {currentT.endpoint}: <span className="text-cyan-400 select-all">{activeServer.baseIp}:51820</span>
                </h4>
                <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                  {lang === 'ru' 
                    ? `Активная привязка: ${activeServer.nameRu} (Номинальная задержка: ${activeServer.ping} ms)`
                    : `Active binding node: ${activeServer.nameEn} (Nominal latency is approx ${activeServer.ping} ms)`}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Action download triggers */}
        <div className="pt-4.5 border-t border-white/[0.06] mt-5 select-none">
          <button 
            type="button"
            onClick={handleDownloadConfFile}
            className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#07080D]/95 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_30px_rgba(0,240,255,0.2)] transform active:scale-95"
          >
            <Download className="w-4 h-4 text-zinc-950 font-black" />
            {currentT.downloadConf}
          </button>
        </div>

      </div>

      {/* Code syntax file preview (Right) */}
      <div className="bg-zinc-950/75 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 md:p-7.5 flex flex-col justify-between shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)] relative">
        
        {/* Copy file action */}
        <button 
          onClick={() => {
            const completeConf = `[Interface]
PrivateKey = ${clientPrivKey}
Address = ${clientAddress}
DNS = ${dnsInput}

[Peer]
PublicKey = ${clientPubKey}
Endpoint = ${activeServer.baseIp}:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`;
            triggerCopy(completeConf, 'conf');
          }}
          className={`absolute top-6 right-6 p-2 px-3 rounded-xl text-[10px] font-black font-mono tracking-wider uppercase flex items-center gap-2 transition-all duration-300 border cursor-pointer select-none ${
            copiedConf 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.01]'
          }`}
        >
          {copiedConf ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedConf ? currentT.copied : (lang === 'ru' ? 'Копировать' : 'Copy config')}</span>
        </button>

        <div className="flex-1 space-y-4">
          <div className="border-b border-white/[0.05] pb-3 select-none">
            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">wg_client.conf</span>
            <span className="text-[11px] text-zinc-300 mt-1 block">Live syntax preview simulator</span>
          </div>

          <div className="leading-relaxed font-mono text-xs select-text bg-black/40 p-4.5 rounded-2xl max-h-[380px] overflow-y-auto border border-white/[0.03] text-zinc-300 scrollbar-glass">
            <span className="text-cyan-400 font-extrabold select-none">[Interface]</span><br />
            <span className="text-zinc-600 select-none"># Security token cryptographic client key details</span><br />
            <span className="text-zinc-500">PrivateKey =</span> <span className="text-emerald-400 font-medium select-all break-all">{clientPrivKey}</span><br />
            <span className="text-zinc-500">Address =</span> <span className="text-zinc-200 select-all">{clientAddress}</span><br />
            <span className="text-zinc-500">DNS =</span> <span className="text-zinc-200 select-all">{dnsInput}</span><br />
            <br />
            <span className="text-cyan-400 font-extrabold select-none">[Peer]</span><br />
            <span className="text-zinc-600 select-none"># High payload target gateway public peer key</span><br />
            <span className="text-zinc-500">PublicKey =</span> <span className="text-emerald-400 font-medium select-all break-all">{clientPubKey}</span><br />
            <span className="text-zinc-500">Endpoint =</span> <span className="text-cyan-400 font-bold select-all">{activeServer.baseIp}:51820</span><br />
            <span className="text-zinc-500 font-bold">AllowedIPs =</span> <span className="text-rose-400 font-medium select-all">0.0.0.0/0, ::/0</span><br />
            <span className="text-zinc-500">PersistentKeepalive =</span> <span className="text-zinc-200 select-all">25</span>
          </div>
        </div>

        <div className="mt-5 p-4.5 bg-cyan-400/[0.015] rounded-3xl border border-cyan-400/10 text-[11px] text-zinc-500 leading-relaxed select-none">
          {lang === 'ru' 
            ? '💡 Скопируйте данный текст (или скачайте), сохраните под именем файла "piligrim.conf" и загрузите напрямую в официальные клиенты WireGuard.'
            : '💡 Feed this plain-text structure into custom wireguard software clients directly or write to file named "piligrim.conf" of desktop systems.'}
        </div>

      </div>

    </div>
  );
}
