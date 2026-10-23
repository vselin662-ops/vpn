import { useState, useEffect, useRef, FormEvent } from 'react';
import { ServerLocation, TabType, ConnectionStats, TerminalLog } from './types';
import { SlidersHorizontal, Settings, Globe, Languages, X, Info } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Wizard from './components/Wizard';
import Configurator from './components/Configurator';
import Diagnostics from './components/Diagnostics';
import AddServerModal from './components/AddServerModal';

export default function App() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [isEngineerMode, setIsEngineerMode] = useState<boolean>(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('connection');

  const [servers, setServers] = useState<ServerLocation[]>([
    { id: 'nl', nameRu: 'Нидерланды', nameEn: 'Netherlands', cityRu: 'Амстердам #4', cityEn: 'Amsterdam #4', flagColor: '#0039A6', emoji: '🇳🇱', baseIp: '37.18.102.64', ping: 22, load: 12, protocol: 'VLESS', sni: 'cloudflare.com' },
    { id: 'de', nameRu: 'Германия', nameEn: 'Germany', cityRu: 'Франкфурт #2', cityEn: 'Frankfurt #2', flagColor: '#ED2939', emoji: '🇩🇪', baseIp: '46.165.2.14', ping: 18, load: 28, protocol: 'VLESS', sni: 'www.apple.com' },
    { id: 'uk', nameRu: 'Великобритания', nameEn: 'United Kingdom', cityRu: 'Лондон #1', cityEn: 'London #1', flagColor: '#002366', emoji: '🇬🇧', baseIp: '89.238.142.122', ping: 35, load: 8, protocol: 'VLESS', sni: 'dl.google.com' },
    { id: 'us', nameRu: 'США', nameEn: 'United States', cityRu: 'Нью-Йорк #8', cityEn: 'New York #8', flagColor: '#B22234', emoji: '🇺🇸', baseIp: '198.51.100.5', ping: 104, load: 45, protocol: 'VLESS', sni: 'cloudflare.com' },
    { id: 'fr', nameRu: 'Франция', nameEn: 'France', cityRu: 'Париж #3', cityEn: 'Paris #3', flagColor: '#3137FD', emoji: '🇫🇷', baseIp: '195.154.122.9', ping: 27, load: 19, protocol: 'VLESS', sni: 'www.microsoft.com' },
  ]);

  const [selectedServerId, setSelectedServerId] = useState<string>('nl');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [activeTimeSec, setActiveTimeSec] = useState<number>(0);
  const [speedHistory, setSpeedHistory] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [stats, setStats] = useState<ConnectionStats>({ downloadSpeed: 0, uploadSpeed: 0, ping: 0, dataTransmitted: 0 });

  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerCity, setNewServerCity] = useState('');
  const [newServerIp, setNewServerIp] = useState('');
  const [newServerPort, setNewServerPort] = useState('443');
  const [newServerFlag, setNewServerFlag] = useState('🌐');

  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const [wizardIp, setWizardIp] = useState('37.18.102.64');
  const [wizardPort, setWizardPort] = useState(443);
  const [wizardPass, setWizardPass] = useState('UltraSecureVpn2026!');
  const [wizardDns, setWizardDns] = useState('1.1.1.1');

  const [uuid, setUuid] = useState<string>('');
  const [realityPublicKey, setRealityPublicKey] = useState<string>('');
  const [shortId, setShortId] = useState<string>('');
  const [sni, setSni] = useState<string>('cloudflare.com');

  const [logs, setLogs] = useState<string[]>(["Система запущена. Ожидание подключения."]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { type: 'system', text: 'Diagnostic Terminal [Version 3.0.0-ANTI-DPI] \n(c) 2026 Piligrim VPN. All systems operational.' },
    { type: 'system', text: 'Status: Ready. Type "help" to see list of available diagnosis tools.' }
  ]);
  const [commandValue, setCommandValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const t = {
    ru: {
      title: "Пилигрим VPN", subtitle: "Сверхбыстрый и безопасный доступ в один клик",
      engTitle: "Пилигрим VPN [Инженерная панель]", engSubtitle: "Панель разработчика: VLESS+REALITY, обход DPI и дебаггер",
      connTab: "Подключение", setupTab: "Установка Сервера", configTab: "Конфиг-клиент", diagTab: "Диагностика",
      serversTitle: "Локации VPN", addServerBtn: "Добавить сервер", modalTitle: "Добавить Персональный Сервер",
      countryName: "Страна", cityLabel: "Город / Прокси тег", ipAddress: "IP Адрес сервера", vpnPort: "Порт (443)",
      save: "Сохранить", cancel: "Отмена", connected: "Подключено", disconnected: "Отключено", connecting: "Подключение...",
      protocol: "Протокол", load: "Нагрузка", time: "Время соединения", dlSpeed: "Загрузка", ulSpeed: "Отдача", ping: "Пинг", dataUsed: "Данные",
      setupTitle: "Разверните свой собственный VPN сервер в пару кликов", setupSubtitle: "Интерактивный мастер для автоматической установки Xray + REALITY на ваш VPS",
      customIp: "Введите IP вашего VPS сервера", customPort: "Порт VPN соединения", adminPass: "Админ-пароль панели", copyBtn: "Копировать команду", copied: "Скопировано в буфер!",
      dockerTitle: "Способ 1: Автоматический скрипт (Рекомендуется)", dockerDesc: "Мгновенная установка Xray-core с протоколом VLESS + REALITY на ваш VPS.",
      bashTitle: "Способ 2: Ручная настройка Bash", bashDesc: "Классический скрипт для сборки ядра без накладных расходов Docker.",
      amneziaTitle: "Совет: Обход жестких блокировок", amneziaDesc: "Если операторы связи блокируют стандартные порты, используйте этот скрипт. Он настроит маскировку под cloudflare.com:443.",
      wgConfigTitle: "Генератор Клиентского Профиля", wgConfigDesc: "Создайте конфигурационный файл (.json), который можно загрузить в Hiddify, NekoBox или Sing-box.",
      genKeysBtn: "Сгенерировать REALITY конфигурацию", clientIP: "Внутренний IP клиента", dnsServers: "Адрес DNS-серверов", serverPubKey: "Публичный ключ сервера (Base64)", endpoint: "Endpoint сервера", allowedIps: "Разрешенные IP (Allowed IPs)", downloadConf: "Скачать config.json",
      diagTitle: "Интерактивный Терминал Диагностики туннеля", diagDesc: "Тестируйте пропускную способность, пингуйте узлы и считывайте метрики состояния прямо в реальном времени.", terminalPlaceholder: "Введите 'help' для просмотра команд...", activeTunnel: "Запущенный туннель"
    },
    en: {
      title: "Piligrim VPN", subtitle: "Ultra fast and secure one-click navigation protection",
      engTitle: "Piligrim VPN [Engineer Panel]", engSubtitle: "Developer hub: VLESS+REALITY, anti-DPI and diagnostic command line",
      connTab: "Connection State", setupTab: "Deploy Server Guide", configTab: "Client Configurator", diagTab: "Diagnostics Console",
      serversTitle: "VPN Locations", addServerBtn: "Add Target Server", modalTitle: "Add Custom Personal VPS Node",
      countryName: "Country Name", cityLabel: "City / Server Tag", ipAddress: "Server Target IP", vpnPort: "Port (443)",
      save: "Save Node", cancel: "Cancel", connected: "Tunnel Active", disconnected: "Tunnel Stopped", connecting: "Connecting...",
      protocol: "Protocol", load: "CPU / Node Load", time: "Session Active", dlSpeed: "Download Rate", ulSpeed: "Upload Rate", ping: "Latency Target", dataUsed: "Bytes Transmitted",
      setupTitle: "Deploy Your Personal VPN Server in 1-Click", setupSubtitle: "Interactive wizard to initiate Xray + REALITY scripts on your virtualization server",
      customIp: "Enter Your Dedicated VPS Host IP", customPort: "Tunnel Server Port", adminPass: "Web Admin Password", copyBtn: "Copy Install Command", copied: "Copied successfully!",
      dockerTitle: "Method 1: Automated Script (Recommended)", dockerDesc: "Instant deployment of Xray-core with VLESS + REALITY protocol on your VPS.",
      bashTitle: "Method 2: Manual Bash Setup", bashDesc: "Classic script to build the core without Docker virtual layers.",
      amneziaTitle: "Tip: Bypassing strict censorship", amneziaDesc: "If your ISP blocks standard ports, use this script. It configures masking as cloudflare.com:443.",
      wgConfigTitle: "Secure Client Profile Generator", wgConfigDesc: "Generate configuration file (.json) for Hiddify, NekoBox or Sing-box clients instantly.",
      genKeysBtn: "Generate REALITY Config", clientIP: "Local Subnet Client IP", dnsServers: "Client Domain Name System (DNS)", serverPubKey: "Server Public Key (b64)", endpoint: "Socket Endpoint Connection", allowedIps: "Routing Mask Rules (Allowed IPs)", downloadConf: "Download config.json",
      diagTitle: "VPN Diagnostic Shell", diagDesc: "Type utility queries to evaluate routing metrics, ping endpoints or test cryptographic handshakes.", terminalPlaceholder: "Type 'help' to review list of functions...", activeTunnel: "Active tunnel interface"
    }
  };

  const currentT = t[lang];
  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0];

  const addLog = (message: string) => {
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLogs(prev => [`[${formattedDate}] ${message}`, ...prev.slice(0, 99)]);
  };

  useEffect(() => {
    let timer: any;
    if (isConnected && !isConnecting) {
      timer = setInterval(() => {
        setActiveTimeSec(prev => prev + 1);
        setStats(prevStats => {
          const delta = (Math.random() - 0.5) * 4;
          let newDl = prevStats.downloadSpeed + delta;
          if (newDl < 15) newDl = 28.5;
          if (newDl > 120) newDl = 90.0;
          const deltaUl = (Math.random() - 0.5) * 2;
          let newUl = prevStats.uploadSpeed + deltaUl;
          if (newUl < 4) newUl = 12.0;
          if (newUl > 60) newUl = 38.0;
          const addition = (newDl / 8) * 1;
          const newData = prevStats.dataTransmitted + addition / 30;
          const deltaPing = Math.round((Math.random() - 0.5) * 3);
          let newPing = activeServer.ping + deltaPing;
          if (newPing < 4) newPing = 6;
          setSpeedHistory(prevHist => {
            const arr = [...prevHist];
            arr.push(newDl);
            if (arr.length > 20) arr.shift();
            return arr;
          });
          return { downloadSpeed: Number(newDl.toFixed(1)), uploadSpeed: Number(newUl.toFixed(1)), dataTransmitted: Number(newData.toFixed(3)), ping: newPing };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isConnected, isConnecting, selectedServerId, servers, activeServer.ping]);

  useEffect(() => { setWizardIp(activeServer.baseIp); }, [selectedServerId, activeServer.baseIp]);

  const handleConnectToggle = async () => {
    if (isConnected) {
      setIsConnected(false);
      setIsConnecting(false);
      addLog(`Соединение с ${activeServer.nameRu} разорвано пользователем.`);
    } else {
      setIsConnecting(true);
      addLog(`Попытка подключения к серверу Cloud.ru (37.18.102.64)...`);
      try {
        await fetch('https://37.18.102.64/ws', { method: 'GET', mode: 'no-cors' });
        addLog(`Сервер ответил. Установка зашифрованного канала...`);
        setTimeout(() => {
          setIsConnected(true);
          setIsConnecting(false);
          setActiveTimeSec(0);
          addLog(`Туннель запущен. Маршрутизация перехвачена.`);
        }, 1000);
      } catch (error) {
        addLog(`Ошибка: Сервер Cloud.ru недоступен.`);
        setIsConnecting(false);
      }
    }
  };

  const switchServer = (id: string) => {
    if (isConnecting) return;
    setSelectedServerId(id);
    const target = servers.find(s => s.id === id);
    if (target) {
      addLog(`Выбрано новое местоположение: ${target.nameRu} (${target.baseIp})`);
      if (isConnected) {
        setIsConnected(false); setIsConnecting(true);
        setTimeout(() => {
          setIsConnected(true); setIsConnecting(false); setActiveTimeSec(0);
          addLog(`Туннель переключен на ${target.nameRu}. Шифрованный канал готов.`);
        }, 850);
      }
    }
  };

  const handleAddServer = (e: FormEvent) => {
    e.preventDefault();
    if (!newServerName || !newServerIp) return;
    const newId = 'custom_' + Date.now();
    const added: ServerLocation = { id: newId, nameRu: newServerName, nameEn: newServerName, cityRu: newServerCity || 'Кастомный узел', cityEn: newServerCity || 'Custom VPS node', flagColor: '#10B981', emoji: newServerFlag || '⚙️', baseIp: newServerIp.trim(), ping: Math.floor(Math.random() * 45) + 15, load: 0, protocol: 'VLESS', sni: 'cloudflare.com' };
    setServers(prev => [...prev, added]); setSelectedServerId(newId); setIsAddServerOpen(false);
    addLog(`Добавлен собственный сервер: ${newServerName} (${newServerIp})`);
    setNewServerName(''); setNewServerCity(''); setNewServerIp(''); setNewServerPort('443');
  };

  const triggerCopy = (code: string, type: 'docker' | 'bash' | 'config') => {
    navigator.clipboard.writeText(code);
    if (type === 'docker') { setCopiedDocker(true); setTimeout(() => setCopiedDocker(false), 2000); }
    else if (type === 'bash') { setCopiedBash(true); setTimeout(() => setCopiedBash(false), 2000); }
    else if (type === 'config') { setCopiedConfig(true); setTimeout(() => setCopiedConfig(false), 2000); }
  };

  const generateRealityConfig = () => {
    try {
      const newUuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      setUuid(newUuid); setRealityPublicKey(Array.from({length: 43}, () => chars[Math.floor(Math.random() * chars.length)]).join('') + '='); setShortId(Array.from({length: 8}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')); setSni(activeServer.sni || 'cloudflare.com');
      addLog(`[Криптография] Сгенерирована новая конфигурация REALITY. UUID: ${newUuid.substring(0, 8)}...`);
    } catch (e) { setUuid("mock-uuid"); setRealityPublicKey("mock-pub"); setShortId("12345678"); }
  };

  const handleDownloadJsonFile = () => {
    const configData = { log: { level: "info", timestamp: true }, inbounds: [{ type: "tun", tag: "piligrim-tun", inet4_address: "172.19.0.1/30", auto_route: true, strict_route: true, stack: "mixed", sniff: true }], outbounds: [{ type: "vless", tag: "piligrim-proxy", server: activeServer.baseIp, server_port: 443, uuid: uuid, flow: "xtls-rprx-vision", tls: { enabled: true, server_name: sni, utls: { enabled: true, fingerprint: "chrome" }, reality: { enabled: true, public_key: realityPublicKey, short_id: shortId } }, transport: { type: "tcp" }, packet_encoding: "xudp" }, { type: "direct", tag: "direct" }, { type: "block", tag: "block" }, { type: "dns", tag: "dns-out" }], route: { rules: [{ protocol: "dns", outbound: "dns-out" }, { ip_is_private: true, outbound: "direct" }], auto_detect_interface: true } };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `piligrim_${activeServer.cityEn.toLowerCase().replace(/\s+/g, '_')}.json`; link.click(); URL.revokeObjectURL(url);
    addLog(`Скачан конфигурационный файл JSON для сервера ${activeServer.nameRu}`);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600); const m = Math.floor((totalSeconds % 3600) / 60); const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault(); const cmd = commandValue.trim().toLowerCase(); if (!cmd) return;
    const newLogs = [...terminalLogs, { type: 'input' as const, text: `$ ${commandValue}` }]; setCommandValue('');
    setTimeout(() => {
      if (cmd === 'help') newLogs.push({ type: 'output', text: 'help, ping, status, speedtest, server-info, clear' });
      else if (cmd === 'clear') { setTerminalLogs([]); return; }
      else if (cmd === 'status') newLogs.push({ type: 'output', text: `Статус: ${isConnected ? 'АКТИВЕН' : 'ОТКЛЮЧЕН'}` });
      else if (cmd === 'ping') newLogs.push({ type: 'output', text: `Ping: ${stats.ping} ms` });
      else if (cmd === 'server-info') newLogs.push({ type: 'output', text: `IP: ${activeServer.baseIp}` });
      else newLogs.push({ type: 'output', text: `bash: команда не найдена: ${commandValue}` });
      setTerminalLogs(newLogs); setTimeout(() => terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 100);
  };

  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [terminalLogs]);

  const speedPoints = speedHistory.map((speed, i) => `${(i / (speedHistory.length - 1)) * 360},${100 - (speed / 120) * 100}`).join(' ');

  const dockerCode = `bash -c "$(curl -L https://raw.githubusercontent.com/vselin662-ops/vpn/main/deploy.sh)"`;
  const bashCode = `wget -O deploy.sh https://raw.githubusercontent.com/vselin662-ops/vpn/main/deploy.sh\nchmod +x deploy.sh\nsudo ./deploy.sh`;
  const amneziaGuide = `1. Установка Xray-core.\n2. Генерация ключей REALITY.\n3. Маскировка под cloudflare.com:443.\n4. Запуск службы.`;

  return (
    <div id="vpn_app_shell" className="flex h-screen w-full bg-[#030406] text-[#E0E0E0] overflow-hidden font-sans select-none antialiased relative">
      <div className="absolute top-[-25%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-cyan-700/[0.04] blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }}></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-blue-600/[0.04] blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '13s' }}></div>
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none z-0"></div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} isEngineerMode={isEngineerMode} setIsEngineerMode={setIsEngineerMode} isConnected={isConnected} addLog={addLog} t={t} />
      <div className="flex flex-col flex-1 min-w-0 z-10 relative">
        <Header isEngineerMode={isEngineerMode} lang={lang} t={t} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-between scrollbar-glass">
          <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between gap-6 pb-2">
            {isEngineerMode && (
              <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-4 pt-1 mb-2 scrollbar-none select-none">
                {['connection', 'wizard', 'config', 'diagnostics'].map(tab => (
                   <button key={tab} onClick={() => setActiveTab(tab as TabType)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase border ${activeTab === tab ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-white/[0.01] text-zinc-400 border-white/[0.04]'}`}>{tab}</button>
                ))}
              </div>
            )}
            {activeTab === 'connection' && <Dashboard servers={servers} selectedServerId={selectedServerId} switchServer={switchServer} isConnecting={isConnecting} isConnected={isConnected} handleConnectToggle={handleConnectToggle} activeServer={activeServer} stats={stats} speedPoints={speedPoints} activeTimeSec={activeTimeSec} formatTime={formatTime} isEngineerMode={isEngineerMode} setIsAddServerOpen={setIsAddServerOpen} lang={lang} t={t} />}
            {activeTab === 'wizard' && isEngineerMode && <Wizard wizardIp={wizardIp} setWizardIp={setWizardIp} wizardPort={wizardPort} setWizardPort={setWizardPort} wizardPass={wizardPass} setWizardPass={setWizardPass} wizardDns={wizardDns} setWizardDns={setWizardDns} lang={lang} t={t} dockerCode={dockerCode} bashCode={bashCode} amneziaGuide={amneziaGuide} copiedDocker={copiedDocker} copiedBash={copiedBash} triggerCopy={triggerCopy} />}
            {activeTab === 'config' && isEngineerMode && <Configurator uuid={uuid} setUuid={setUuid} realityPublicKey={realityPublicKey} setRealityPublicKey={setRealityPublicKey} shortId={shortId} setShortId={setShortId} sni={sni} setSni={setSni} generateRealityConfig={generateRealityConfig} handleDownloadJsonFile={handleDownloadJsonFile} activeServer={activeServer} triggerCopy={triggerCopy} copiedConfig={copiedConfig} lang={lang} t={t} />}
            {activeTab === 'diagnostics' && isEngineerMode && <Diagnostics logs={logs} terminalLogs={terminalLogs} commandValue={commandValue} setCommandValue={setCommandValue} handleCommandSubmit={handleCommandSubmit} terminalEndRef={terminalEndRef} addLog={addLog} currentT={currentT} lang={lang} />}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 md:hidden relative z-10 w-full">
            <button onClick={() => setIsEngineerMode(!isEngineerMode)} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 ${isEngineerMode ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-400' : 'bg-[#0D0E14]/65 border-white/[0.08] text-zinc-400'}`}>
              <SlidersHorizontal className="w-5 h-5" /><div className="text-center"><p className="text-[11px] font-black uppercase">{lang === 'ru' ? 'Редактор' : 'Editor'}</p></div>
            </button>
            <button onClick={() => setIsMobileSettingsOpen(true)} className="p-4 rounded-2xl border bg-[#0D0E14]/65 border-white/[0.08] text-zinc-400 flex flex-col items-center justify-center gap-1.5">
              <Settings className="w-5 h-5" /><div className="text-center"><p className="text-[11px] font-black uppercase">{lang === 'ru' ? 'Настройки' : 'Settings'}</p></div>
            </button>
          </div>
          <footer className="w-full text-center text-zinc-600 text-[10px] uppercase tracking-widest mt-8 pt-4 border-t border-white/[0.04] select-none font-mono relative z-10 hidden md:block">
            🛡️ Пилигрим VPN &bull; Version 3.0.0 &bull; 2026
          </footer>
        </div>
      </div>
      {isMobileSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileSettingsOpen(false)}></div>
          <div className="w-full max-w-md bg-[#090A0E] border-t border-white/10 rounded-t-3xl max-h-[85vh] flex flex-col relative z-50 p-6">
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-5"></div>
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.06] pb-3">
              <h3 className="text-xs font-black tracking-widest text-cyan-400 uppercase flex items-center gap-2"><Settings className="w-4 h-4" />{lang === 'ru' ? 'Параметры' : 'Settings'}</h3>
              <button onClick={() => setIsMobileSettingsOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-zinc-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-5 pb-8">
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-center justify-between">
                <span className="text-xs font-extrabold">{lang === 'ru' ? 'Язык' : 'Language'}</span>
                <button onClick={() => setLang(prev => prev === 'ru' ? 'en' : 'ru')} className="px-3 py-1.5 bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 rounded-xl text-xs font-black uppercase">{lang === 'ru' ? 'Русский' : 'English'}</button>
              </div>
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-center justify-between">
                <span className="text-xs font-extrabold">{lang === 'ru' ? 'Добавить сервер' : 'Add Server'}</span>
                <button onClick={() => { setIsMobileSettingsOpen(false); setIsAddServerOpen(true); }} className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">+</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AddServerModal isAddServerOpen={isAddServerOpen} setIsAddServerOpen={setIsAddServerOpen} handleAddServer={handleAddServer} newServerName={newServerName} setNewServerName={setNewServerName} newServerCity={newServerCity} setNewServerCity={setNewServerCity} newServerIp={newServerIp} setNewServerIp={setNewServerIp} newServerFlag={newServerFlag} setNewServerFlag={setNewServerFlag} currentT={currentT} lang={lang} />
    </div>
  );
}
