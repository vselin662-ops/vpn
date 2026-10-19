import { RefreshCw, Download, Check, Copy, ShieldCheck } from 'lucide-react';
import { ServerLocation } from '../types';

interface ConfiguratorProps {
  uuid: string;
  setUuid: (v: string) => void;
  realityPublicKey: string;
  setRealityPublicKey: (v: string) => void;
  shortId: string;
  setShortId: (v: string) => void;
  sni: string;
  setSni: (v: string) => void;
  generateRealityConfig: () => void;
  handleDownloadJsonFile: () => void;
  activeServer: ServerLocation;
  triggerCopy: (c: string, type: 'config') => void;
  copiedConfig: boolean;
  lang: 'ru' | 'en';
  t: any;
}

export default function Configurator({
  uuid,
  setUuid,
  realityPublicKey,
  setRealityPublicKey,
  shortId,
  setShortId,
  sni,
  setSni,
  generateRealityConfig,
  handleDownloadJsonFile,
  activeServer,
  triggerCopy,
  copiedConfig,
  lang,
  t
}: ConfiguratorProps) {
  const currentT = t[lang];

  // Генерация JSON-конфига для Sing-box (VLESS + REALITY)
  const generateSingBoxConfig = () => {
    return JSON.stringify({
      log: { level: "info", timestamp: true },
      inbounds: [
        {
          type: "tun",
          tag: "piligrim-tun",
          inet4_address: "172.19.0.1/30",
          auto_route: true,
          strict_route: true,
          stack: "mixed",
          sniff: true
        }
      ],
      outbounds: [
        {
          type: "vless",
          tag: "piligrim-proxy",
          server: activeServer.baseIp,
          server_port: 443,
          uuid: uuid,
          flow: "xtls-rprx-vision",
          tls: {
            enabled: true,
            server_name: sni,
            utls: { enabled: true, fingerprint: "chrome" },
            reality: {
              enabled: true,
              public_key: realityPublicKey,
              short_id: shortId
            }
          },
          transport: { type: "tcp" },
          packet_encoding: "xudp"
        },
        { type: "direct", tag: "direct" },
        { type: "block", tag: "block" },
        { type: "dns", tag: "dns-out" }
      ],
      route: {
        rules: [
          { protocol: "dns", outbound: "dns-out" },
          { ip_is_private: true, outbound: "direct" }
        ],
        auto_detect_interface: true
      }
    }, null, 2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
      
      {/* Панель параметров (Слева) */}
      <div className="bg-[#0D0E14]/30 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 md:p-7.5 flex flex-col justify-between shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)]">
        <div>
          <div className="mb-5 select-none">
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              {lang === 'ru' ? 'Конфигуратор Sing-box / Xray' : 'Sing-box / Xray Configurator'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              {lang === 'ru' 
                ? 'VLESS + REALITY + Фрагментация (Обход DPI и блокировок Google AI)'
                : 'VLESS + REALITY + Fragmentation (Anti-DPI & Google AI bypass)'}
            </p>
          </div>

          <div className="space-y-4.5">
            
            {/* Кнопка генерации конфигурации */}
            <div className="select-none">
              <button 
                type="button"
                onClick={generateRealityConfig}
                className="w-full py-3 px-4 bg-cyan-400/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/60 rounded-2xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform active:scale-95 shadow-[0_4px_15px_rgba(0,240,255,0.05)]"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                {lang === 'ru' ? 'Сгенерировать REALITY конфигурацию' : 'Generate REALITY Config'}
              </button>
            </div>

            {/* Поле UUID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                UUID (Идентификатор клиента)
              </label>
              <input 
                type="text" 
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
              />
            </div>

            {/* Поле Reality Public Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                {lang === 'ru' ? 'Публичный ключ REALITY (Public Key)' : 'Reality Public Key'}
              </label>
              <input 
                type="text" 
                value={realityPublicKey}
                onChange={(e) => setRealityPublicKey(e.target.value)}
                className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
              />
            </div>

            {/* Поля Short ID и SNI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                  Short ID
                </label>
                <input 
                  type="text" 
                  value={shortId}
                  onChange={(e) => setShortId(e.target.value)}
                  className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-mono font-black tracking-wide text-zinc-500">
                  SNI (Маскировка под домен)
                </label>
                <input 
                  type="text" 
                  value={sni}
                  onChange={(e) => setSni(e.target.value)}
                  className="bg-black/50 font-mono text-[11px] p-3 rounded-xl border border-white/10 text-zinc-200 focus:outline-hidden focus:border-cyan-400 focus:bg-cyan-400/[0.03] transition-all duration-300"
                />
              </div>
            </div>

            {/* Информация о сервере */}
            <div className="p-4 bg-zinc-950/65 rounded-2xl border border-white/5 flex gap-3 items-start select-none">
              <div className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-lg border border-cyan-400/20 font-mono text-[10px] font-black uppercase shrink-0 mt-0.5 shadow-inner">
                GATEWAY
              </div>
              <div className="leading-tight">
                <h4 className="text-[11px] font-extrabold text-zinc-200 uppercase font-mono flex items-center gap-1.5 leading-none mt-0.5">
                  {lang === 'ru' ? 'Конечная точка' : 'Endpoint'}: <span className="text-cyan-400 select-all">{activeServer.baseIp}:443</span>
                </h4>
                <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                  {lang === 'ru' 
                    ? `Протокол: VLESS + REALITY (Flow: vision). Трафик маскируется под ${sni}`
                    : `Protocol: VLESS + REALITY. Traffic mimics legitimate ${sni} TLS handshake.`}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Кнопка скачивания */}
        <div className="pt-4.5 border-t border-white/[0.06] mt-5 select-none">
          <button 
            type="button"
            onClick={handleDownloadJsonFile}
            className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#07080D]/95 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_30px_rgba(0,240,255,0.2)] transform active:scale-95"
          >
            <Download className="w-4 h-4 text-zinc-950 font-black" />
            {lang === 'ru' ? 'Скачать config.json (Sing-box)' : 'Download config.json (Sing-box)'}
          </button>
        </div>

      </div>

      {/* Предпросмотр кода (Справа) */}
      <div className="bg-zinc-950/75 border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-6 md:p-7.5 flex flex-col justify-between shadow-[0_12px_45px_10px_rgba(0,0,0,0.4)] relative">
        
        {/* Кнопка копирования */}
        <button 
          onClick={() => triggerCopy(generateSingBoxConfig(), 'config')}
          className={`absolute top-6 right-6 p-2 px-3 rounded-xl text-[10px] font-black font-mono tracking-wider uppercase flex items-center gap-2 transition-all duration-300 border cursor-pointer select-none ${
            copiedConfig 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/[0.01]'
          }`}
        >
          {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedConfig ? (lang === 'ru' ? 'Скопировано' : 'Copied') : (lang === 'ru' ? 'Копировать JSON' : 'Copy JSON')}</span>
        </button>

        <div className="flex-1 space-y-4">
          <div className="border-b border-white/[0.05] pb-3 select-none">
            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">piligrim_config.json</span>
            <span className="text-[11px] text-zinc-300 mt-1 block">
              {lang === 'ru' ? 'Конфигурация для Sing-box / Xray' : 'Sing-box / Xray compatible payload'}
            </span>
          </div>

          <div className="leading-relaxed font-mono text-[10px] select-text bg-black/40 p-4.5 rounded-2xl max-h-[380px] overflow-y-auto border border-white/[0.03] text-zinc-300 scrollbar-glass whitespace-pre">
            {generateSingBoxConfig()}
          </div>
        </div>

        <div className="mt-5 p-4.5 bg-cyan-400/[0.015] rounded-3xl border border-cyan-400/10 text-[11px] text-zinc-500 leading-relaxed select-none">
          {lang === 'ru' 
            ? '💡 Импортируйте этот JSON в приложения: Hiddify, NekoBox или Sing-box. Протокол VLESS + REALITY активен по умолчанию.'
            : '💡 Import this JSON into Hiddify, NekoBox, or Sing-box clients. VLESS + REALITY protocol is enabled by default.'}
        </div>

      </div>

    </div>
  );
}
