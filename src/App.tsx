import { useState, useEffect, useRef, FormEvent } from 'react';
import { ServerLocation, TabType, ConnectionStats, TerminalLog } from './types';
import { SlidersHorizontal, Settings, Globe, Languages, X, Info } from 'lucide-react';

// Import our premium glassy components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Wizard from './components/Wizard';
import Configurator from './components/Configurator';
import Diagnostics from './components/Diagnostics';
import AddServerModal from './components/AddServerModal';

export default function App() {
  // Locale state
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  // Engineer mode state (defaults to false for extreme simplicity for ordinary users)
  const [isEngineerMode, setIsEngineerMode] = useState<boolean>(false);

  // Mobile settings drawer state
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState<boolean>(false);

  // Sidebar Tabs
  const [activeTab, setActiveTab] = useState<TabType>('connection');

  // Server state
  const [servers, setServers] = useState<ServerLocation[]>([
    { id: 'nl', nameRu: 'Нидерланды', nameEn: 'Netherlands', cityRu: 'Амстердам #4', cityEn: 'Amsterdam #4', flagColor: '#0039A6', emoji: '🇳🇱', baseIp: '185.242.114.94', ping: 22, load: 12, protocol: 'WireGuard' },
    { id: 'de', nameRu: 'Германия', nameEn: 'Germany', cityRu: 'Франкфурт #2', cityEn: 'Frankfurt #2', flagColor: '#ED2939', emoji: '🇩🇪', baseIp: '46.165.2.14', ping: 18, load: 28, protocol: 'WireGuard' },
    { id: 'uk', nameRu: 'Великобритания', nameEn: 'United Kingdom', cityRu: 'Лондон #1', cityEn: 'London #1', flagColor: '#002366', emoji: '🇬🇧', baseIp: '89.238.142.122', ping: 35, load: 8, protocol: 'OpenVPN' },
    { id: 'us', nameRu: 'США', nameEn: 'United States', cityRu: 'Нью-Йорк #8', cityEn: 'New York #8', flagColor: '#B22234', emoji: '🇺🇸', baseIp: '198.51.100.5', ping: 104, load: 45, protocol: 'WireGuard' },
    { id: 'fr', nameRu: 'Франция', nameEn: 'France', cityRu: 'Париж #3', cityEn: 'Paris #3', flagColor: '#3137FD', emoji: '🇫🇷', baseIp: '195.154.122.9', ping: 27, load: 19, protocol: 'ShadowSocks' },
  ]);

  const [selectedServerId, setSelectedServerId] = useState<string>('nl');

  // Interactive Connection States
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [activeTimeSec, setActiveTimeSec] = useState<number>(145); // 02:25 initial value
  const [speedHistory, setSpeedHistory] = useState<number[]>([30, 32, 28, 35, 42, 40, 38, 45, 41, 44, 42, 43, 40, 42, 45]);
  const [stats, setStats] = useState<ConnectionStats>({
    downloadSpeed: 42.5,
    uploadSpeed: 18.2,
    ping: 22,
    dataTransmitted: 234.85 // MB
  });

  // Modal State for custom servers
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerCity, setNewServerCity] = useState('');
  const [newServerIp, setNewServerIp] = useState('');
  const [newServerPort, setNewServerPort] = useState('51820');
  const [newServerFlag, setNewServerFlag] = useState('🌐');

  // Copy-Clipboard helper states
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const [copiedConf, setCopiedConf] = useState(false);

  // Self-hosted variables
  const [wizardIp, setWizardIp] = useState('185.242.114.94');
  const [wizardPort, setWizardPort] = useState(51820);
  const [wizardPass, setWizardPass] = useState('UltraSecureVpn2026!');
  const [wizardDns, setWizardDns] = useState('1.1.1.1');

  // Custom client configs
  const [dnsInput, setDnsInput] = useState('1.1.1.1, 8.8.8.8');
  const [clientAddress, setClientAddress] = useState('10.8.0.2/24');
  const [clientPrivKey, setClientPrivKey] = useState('eB9M+ZgP4bN6Xv5Yh7t+z8y8r9j0kKqMvNuPx9V8X3c=');
  const [clientPubKey, setClientPubKey] = useState('uL8K8nK9m2t3n8b4v7b6r9k0j7h5g4f3d2s1s0p9o8n=');

  // Interactive Diagnostic logs
  const [logs, setLogs] = useState<string[]>([
    "Система запущенна. Все подсистемы Wireguard активны.",
    "Конфигурация [wg0] загружена успешно.",
    "Интерфейс поднят. UDP порт 51820 прослушивается.",
    "Соединение с Амстердам #4 активно."
  ]);

  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { type: 'system', text: 'Diagnostic Terminal [Version 2.8.5] \n(c) 2026 Personal VPN. All servers operational.' },
    { type: 'system', text: 'Status: Connected to Amsterdam #4 node.' },
    { type: 'system', text: 'Type "help" to see list of available diagnosis tools.' }
  ]);
  const [commandValue, setCommandValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Dictionary translations
  const t = {
    ru: {
      title: "Пилигрим VPN",
      subtitle: "Сверхбыстрый и безопасный доступ в один клик",
      engTitle: "Пилигрим VPN [Инженерная панель]",
      engSubtitle: "Панель разработчика: автоматическая сборка VPS, ключи шифрования и дебаггер",
      connTab: "Подключение",
      setupTab: "Установка Сервера",
      configTab: "Конфиг-клиент",
      diagTab: "Диагностика",
      serversTitle: "Локации VPN",
      addServerBtn: "Добавить сервер",
      modalTitle: "Добавить Персональный Сервер",
      countryName: "Страна",
      cityLabel: "Город / Прокси тег",
      ipAddress: "IP Адрес сервера",
      vpnPort: "Порт WireGuard",
      save: "Сохранить",
      cancel: "Отмена",
      connected: "Подключено",
      disconnected: "Отключено",
      connecting: "Подключение...",
      protocol: "Протокол",
      load: "Нагрузка",
      time: "Время соединения",
      dlSpeed: "Загрузка",
      ulSpeed: "Отдача",
      ping: "Пинг",
      dataUsed: "Данные",
      setupTitle: "Разверните свой собственный VPN сервер в пару кликов",
      setupSubtitle: "Интерактивный мастер для автоматической установки туннеля на ваш VPS",
      customIp: "Введите IP вашего VPS сервера",
      customPort: "Порт VPN соединения",
      adminPass: "Админ-пароль панели",
      copyBtn: "Копировать команду",
      copied: "Скопировано в буфер!",
      dockerTitle: "Способ 1: С помощью Docker (wg-easy)",
      dockerDesc: "Идеально подходит для новичков. Автоматически разворачивает WireGuard туннель и красивую веб-панель для создания пользователей и скачивания QR-кодов в браузере.",
      bashTitle: "Способ 2: Нативный инсталлятор Bash",
      bashDesc: "Классический скрипт для мгновенной сборки ядра WireGuard без накладных расходов. Работает напрямую в Ubuntu, Debian, Centos.",
      amneziaTitle: "Совет: Обход блокировок Роскомнадзора с Amnezia / ShadowSocks",
      amneziaDesc: "Если операторы связи в вашем регионе блокируют Wireguard, используйте более защищенные протоколы через бесплатное ПО Amnezia VPN. Скрипт разворачивает OpenVPN over Cloak или Xray VLESS.",
      wgConfigTitle: "Генератор Клиентского Профиля",
      wgConfigDesc: "Создайте индивидуальный конфигурационный файл (.conf), который можно загрузить в официальный клиент WireGuard на Android, iOS, Windows или MacOS.",
      genKeysBtn: "Сгенерировать случайные ключи",
      clientIP: "Внутренний IP клиента",
      dnsServers: "Адрес DNS-серверов",
      serverPubKey: "Публичный ключ сервера (Base64)",
      endpoint: "Endpoint сервера",
      allowedIps: "Разрешенные IP (Allowed IPs)",
      downloadConf: "Скачать файл client.conf",
      diagTitle: "Интерактивный Терминал Диагностики туннеля",
      diagDesc: "Тестируйте пропускную способность, пингуйте узлы и считывайте метрики состояния прямо в реальном времени.",
      terminalPlaceholder: "Введите 'help' для просмотра команд...",
      activeTunnel: "Запущенный туннель"
    },
    en: {
      title: "Piligrim VPN",
      subtitle: "Ultra fast and secure one-click navigation protection",
      engTitle: "Piligrim VPN [Engineer Panel]",
      engSubtitle: "Developer hub: automated VPS installation, crypto key pairs, and diagnostic command line",
      connTab: "Connection State",
      setupTab: "Deploy Server Guide",
      configTab: "Client Configurator",
      diagTab: "Diagnostics Console",
      serversTitle: "VPN Locations",
      addServerBtn: "Add Target Server",
      modalTitle: "Add Custom Personal VPS Node",
      countryName: "Country Name",
      cityLabel: "City / Server Tag",
      ipAddress: "Server Target IP",
      vpnPort: "Tunnel Gateway Port",
      save: "Save Node",
      cancel: "Cancel",
      connected: "Tunnel Active",
      disconnected: "Tunnel Stopped",
      connecting: "Connecting...",
      protocol: "Protocol",
      load: "CPU / Node Load",
      time: "Session Active",
      dlSpeed: "Download Rate",
      ulSpeed: "Upload Rate",
      ping: "Latency Target",
      dataUsed: "Bytes Transmitted",
      setupTitle: "Deploy Your Personal VPN Server in 1-Click",
      setupSubtitle: "Interactive wizard to initiate automated scripts on your virtualization server",
      customIp: "Enter Your Dedicated VPS Host IP",
      customPort: "Tunnel Server Port",
      adminPass: "Web Admin Password",
      copyBtn: "Copy Install Command",
      copied: "Copied successfully!",
      dockerTitle: "Method 1: Using Docker Containers (wg-easy)",
      dockerDesc: "Highly recommended. Spins up the VPN server alongside a beautiful, secure web dashboard where you can add accounts, download client configurations, and show real-time graphs.",
      bashTitle: "Method 2: Direct Bash Installation Command",
      bashDesc: "Fastest native command line tool setup to install WireGuard directly on metal Debian/Ubuntu. Perfect if you do not want Docker virtual layers.",
      amneziaTitle: "Censorship Bypass: Advanced Obfuscated Amnezia / ShadowSocks",
      amneziaDesc: "In countries with active Deep-Packet-Inspection (DPI) censorship, standard Wireguard can be blocked. Deploy OpenVPN over ShadowSocks or AmneziaWG for secure stealth tunnels.",
      wgConfigTitle: "Secure client.conf Generator",
      wgConfigDesc: "Generate the WireGuard configuration file. Save and import it to the mobile or desktop WireGuard clients instantly.",
      genKeysBtn: "Generate Keypair Pair (Curve25519)",
      clientIP: "Local Subnet Client IP",
      dnsServers: "Client Domain Name System (DNS)",
      serverPubKey: "Server Public Key (b64)",
      endpoint: "Socket Endpoint Connection",
      allowedIps: "Routing Mask Rules (Allowed IPs)",
      downloadConf: "Download wg_client.conf",
      diagTitle: "VPN Diagnostic Shell Shell",
      diagDesc: "Type utility queries to evaluate routing metrics, ping endpoints or test cryptographic handshakes.",
      terminalPlaceholder: "Type 'help' to review list of functions...",
      activeTunnel: "Active tunnel interface wg0"
    }
  };

  const currentT = t[lang];

  // Helper: Get active server
  const activeServer = servers.find(s => s.id === selectedServerId) || servers[0];

  // WireGuard real base64 mock generator
  const generateKeysPair = () => {
    try {
      const privBytes = new Uint8Array(32);
      window.crypto.getRandomValues(privBytes);
      let privStr = '';
      for (let i = 0; i < privBytes.length; i++) {
        privStr += String.fromCharCode(privBytes[i]);
      }
      const privateKey = btoa(privStr);

      const pubBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        pubBytes[i] = (privBytes[i] ^ 0x6E) % 256;
      }
      let pubStr = '';
      for (let i = 0; i < pubBytes.length; i++) {
        pubStr += String.fromCharCode(pubBytes[i]);
      }
      const publicKey = btoa(pubStr);

      setClientPrivKey(privateKey);
      setClientPubKey(publicKey);

      addLog(`[Криптография] Сгенерированы новые ключи Curve25519. Приватный ключ: ${privateKey.substring(0, 8)}...`);
    } catch (e) {
      // Fallback
      setClientPrivKey("wN+PrivateKeyMock" + Math.random().toString(36).substring(2, 7) + "=");
      setClientPubKey("pB+PublicKeyMock" + Math.random().toString(36).substring(2, 7) + "=");
    }
  };

  // Add Log helper
  const addLog = (message: string) => {
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setLogs(prev => [`[${formattedDate}] ${message}`, ...prev.slice(0, 99)]);
  };

  // Effect to simulate dynamic live speeds and uptime
  useEffect(() => {
    let timer: any;
    if (isConnected && !isConnecting) {
      timer = setInterval(() => {
        // Increment uptime seconds
        setActiveTimeSec(prev => prev + 1);

        // Update statistics smoothly
        setStats(prevStats => {
          const delta = (Math.random() - 0.5) * 4;
          let newDl = prevStats.downloadSpeed + delta;
          if (newDl < 15) newDl = 28.5;
          if (newDl > 120) newDl = 90.0;

          const deltaUl = (Math.random() - 0.5) * 2;
          let newUl = prevStats.uploadSpeed + deltaUl;
          if (newUl < 4) newUl = 12.0;
          if (newUl > 60) newUl = 38.0;

          // Increment bytes routed
          const addition = (newDl / 8) * 1; // megabytes
          const newData = prevStats.dataTransmitted + addition / 30; // approximate scaled rate

          const deltaPing = Math.round((Math.random() - 0.5) * 3);
          let newPing = activeServer.ping + deltaPing;
          if (newPing < 4) newPing = 6;

          // Update SVG graph sequence
          setSpeedHistory(prevHist => {
            const arr = [...prevHist];
            arr.push(newDl);
            if (arr.length > 20) arr.shift();
            return arr;
          });

          return {
            downloadSpeed: Number(newDl.toFixed(1)),
            uploadSpeed: Number(newUl.toFixed(1)),
            dataTransmitted: Number(newData.toFixed(3)),
            ping: newPing
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isConnected, isConnecting, selectedServerId, servers, activeServer.ping]);

  // Synchronize wizard host and client config with active selected server
  useEffect(() => {
    setWizardIp(activeServer.baseIp);
  }, [selectedServerId, activeServer.baseIp]);

  // Handle interactive connection sequence
  const handleConnectToggle = () => {
    if (isConnected) {
      setIsConnected(false);
      setIsConnecting(false);
      addLog(`Соединение с ${activeServer.nameRu} разорвано пользователем.`);
    } else {
      setIsConnecting(true);
      addLog(`Запуск соединения с ${activeServer.nameRu} (${activeServer.baseIp})...`);
      
      setTimeout(() => {
        addLog(`Инициализация рукопожатия WireGuard... отправка зашифрованных UDP пакетов.`);
        
        setTimeout(() => {
          addLog(`Успешный обмен ключами с пиром [${activeServer.baseIp}]. Время задержки: ${activeServer.ping} ms.`);
          
          setTimeout(() => {
            setIsConnected(true);
            setIsConnecting(false);
            setActiveTimeSec(0);
            addLog(`Туннель запущен. Маршрутизация IPv4/6 перехвачена на wg0.`);
          }, 400);
        }, 500);
      }, 400);
    }
  };

  // Setup quick Server Switch
  const switchServer = (id: string) => {
    if (isConnecting) return;
    setSelectedServerId(id);
    const target = servers.find(s => s.id === id);
    if (target) {
      addLog(`Выбрано новое местоположение: ${target.nameRu} (${target.baseIp})`);
      if (isConnected) {
        // Automatically reconnect to the new node
        setIsConnected(false);
        setIsConnecting(true);
        setTimeout(() => {
          setIsConnected(true);
          setIsConnecting(false);
          setActiveTimeSec(0);
          addLog(`Туннель переключен на ${target.nameRu}. Шифрованный канал готов.`);
        }, 850);
      }
    }
  };

  // Add custom user VPS server node
  const handleAddServer = (e: FormEvent) => {
    e.preventDefault();
    if (!newServerName || !newServerIp) return;

    const newId = 'custom_' + Date.now();
    const parsedIp = newServerIp.trim();
    const validatedPing = Math.floor(Math.random() * 45) + 15;

    const added: ServerLocation = {
      id: newId,
      nameRu: newServerName,
      nameEn: newServerName,
      cityRu: newServerCity || 'Кастомный узел',
      cityEn: newServerCity || 'Custom VPS node',
      flagColor: '#10B981',
      emoji: newServerFlag || '⚙️',
      baseIp: parsedIp,
      ping: validatedPing,
      load: 0,
      protocol: 'WireGuard'
    };

    setServers(prev => [...prev, added]);
    setSelectedServerId(newId);
    setIsAddServerOpen(false);
    addLog(`Добавлен собственный сервер: ${newServerName} (${parsedIp})`);

    // Reset fields
    setNewServerName('');
    setNewServerCity('');
    setNewServerIp('');
    setNewServerPort('51820');
  };

  // Copy with tooltip state transition
  const triggerCopy = (code: string, type: 'docker' | 'bash' | 'conf') => {
    navigator.clipboard.writeText(code);
    if (type === 'docker') {
      setCopiedDocker(true);
      setTimeout(() => setCopiedDocker(false), 2000);
    } else if (type === 'bash') {
      setCopiedBash(true);
      setTimeout(() => setCopiedBash(false), 2000);
    } else {
      setCopiedConf(true);
      setTimeout(() => setCopiedConf(false), 2000);
    }
  };

  // Native config download
  const handleDownloadConfFile = () => {
    const configContent = `[Interface]
# Имя клиента: pc-client-1
PrivateKey = ${clientPrivKey}
Address = ${clientAddress}
DNS = ${dnsInput}

[Peer]
PublicKey = ${clientPubKey}
Endpoint = ${activeServer.baseIp}:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`;

    const blob = new Blob([configContent], { type: 'text/plain' });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `personal_vpn_${activeServer.cityEn.toLowerCase().replace(/\s+/g, '_')}_wg.conf`;
    link.click();
    URL.revokeObjectURL(fileUrl);
    addLog(`Скачан конфигурационный файл client.conf для сервера ${activeServer.nameRu}`);
  };

  // Format dynamic connection timer
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Diagnostic shell command submission
  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = commandValue.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, { type: 'input' as const, text: `$ ${commandValue}` }];
    setCommandValue('');

    setTimeout(() => {
      if (cmd === 'help') {
        newLogs.push(
          { type: 'output', text: 'Персональная VPN Утилита диагностики [Справка]:' },
          { type: 'output', text: '  ping        - Тест пакетов задержки до удаленного хоста VPN' },
          { type: 'output', text: '  wg show     - Позволяет считать сессию WireGuard и ключи пира' },
          { type: 'output', text: '  speedtest   - Запуск имитации замера пиковой скорости канала' },
          { type: 'output', text: '  status      - Краткие сведения о состояния запущенного туннеля' },
          { type: 'output', text: '  server-info - Технические спецификации и характеристики VPS' },
          { type: 'output', text: '  clear       - Очистить консоль ввода' }
        );
      } else if (cmd === 'clear') {
        setTerminalLogs([]);
        return;
      } else if (cmd === 'status') {
        newLogs.push({
          type: 'output',
          text: `Туннель: [wg-client0]\nСтатус: ${isConnected ? 'АКТИВЕН / CONNECTED' : 'ОТКЛЮЧЕН / DEACTIVATED'}\nИнтерфейс IP: ${clientAddress}\nВходящие/Исходящие DNS: ${dnsInput}`
        });
      } else if (cmd === 'ping') {
        if (!isConnected) {
          newLogs.push({ type: 'output', text: 'Ошибка: Сетевой интерфейс wg0 выключен. Хост временно недоступен.' });
        } else {
          const nodeIp = activeServer.baseIp;
          newLogs.push(
            { type: 'output', text: `Отправка 64 байт на ${nodeIp} (ICMP)...` },
            { type: 'output', text: `  64 bytes from ${nodeIp}: icmp_seq=1 ttl=64 time=${stats.ping} ms` },
            { type: 'output', text: `  64 bytes from ${nodeIp}: icmp_seq=2 ttl=64 time=${(stats.ping + 2)} ms` },
            { type: 'output', text: `  64 bytes from ${nodeIp}: icmp_seq=3 ttl=64 time=${Math.max(4, stats.ping - 1)} ms` },
            { type: 'output', text: `  64 bytes from ${nodeIp}: icmp_seq=4 ttl=64 time=${(stats.ping + 4)} ms` },
            { type: 'output', text: `--- Статистика пинга до ${activeServer.nameRu} ---` },
            { type: 'output', text: `4 пакетов передано, 4 получено, 0% потеряно, средний rtt: ${stats.ping + 1} ms` }
          );
        }
      } else if (cmd === 'wg show') {
        if (!isConnected) {
          newLogs.push({ type: 'output', text: 'Интерфейс Wireguard (туннель wg-client0) не запущен.' });
        } else {
          newLogs.push(
            { type: 'output', text: 'interface: wg-client0' },
            { type: 'output', text: `  public key: ${clientPrivKey.replace(/./g, '*').substring(0, 16)}... (скрыт)` },
            { type: 'output', text: '  listening port: 51820' },
            { type: 'output', text: `  peer: ${clientPubKey.substring(0, 12)}...` },
            { type: 'output', text: `    endpoint: ${activeServer.baseIp}:51820` },
            { type: 'output', text: `    allowed ips: ${clientAddress}` },
            { type: 'output', text: `    handshake: 41 секунду назад` },
            { type: 'output', text: `    transfer: ${stats.dataTransmitted.toFixed(2)} MB получено, ${(stats.dataTransmitted / 5).toFixed(2)} MB отправлено` }
          );
        }
      } else if (cmd === 'server-info') {
        newLogs.push(
          { type: 'output', text: `Имя узла: node-${activeServer.id}.personal-vpn` },
          { type: 'output', text: `IP адрес: ${activeServer.baseIp}` },
          { type: 'output', text: 'OC: Ubuntu 24.04 LTS x86_64 Core-Linux' },
          { type: 'output', text: 'Виртуализация: KVM QEMU Hypervisor' },
          { type: 'output', text: 'Версия ПО: wireguard-tools v1.0.2' },
          { type: 'output', text: 'Канал аплинка: 10 Gbps Symmetric Port' },
          { type: 'output', text: `Пинг-тест: среднее значение ${stats.ping} ms` }
        );
      } else if (cmd === 'speedtest') {
        newLogs.push({ type: 'output', text: 'Определение лучшего сервера поблизости...' });
        setTimeout(() => {
          setTerminalLogs(tLogs => [...tLogs, { type: 'output', text: `Тестирование соединения с ${activeServer.nameRu} [${activeServer.baseIp}]` }]);
          setTimeout(() => {
            setTerminalLogs(tLogs => [...tLogs, 
              { type: 'output', text: `  DOWNLOAD (Загрузка): [====================] ${stats.downloadSpeed} Mbps` },
              { type: 'output', text: `  UPLOAD   (Отдача):   [=================== ] ${stats.uploadSpeed} Mbps` },
              { type: 'output', text: `  PING: ${stats.ping} ms  | JITTER: 2.1 ms` }
            ]);
            // Scroll
            setTimeout(() => {
              terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }, 800);
        }, 400);
      } else {
        newLogs.push({ type: 'output', text: `bash: команда не найдена: ${commandValue}. Введите 'help' для просмотра списка доступных команд.` });
      }

      setTerminalLogs(newLogs);
      setTimeout(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }, 100);
  };

  // Helper auto-scroll diagnostic terminal on startup
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Generating coordinates of path SVG for real-time speed diagram
  const getSpeedGraphPoints = () => {
    const maxVal = 120; // Mbps range
    const width = 360;
    const height = 100;
    
    return speedHistory.map((speed, i) => {
      const x = (i / (speedHistory.length - 1)) * width;
      const y = height - (speed / maxVal) * height;
      return `${x},${y}`;
    }).join(' ');
  };

  const speedPoints = getSpeedGraphPoints();

  // Code Strings for Interactive Setup Scripts
  const dockerCode = `docker run -d \\
  --name=wg-easy \\
  -e WG_HOST=${wizardIp} \\
  -e PASSWORD=${wizardPass} \\
  -e PORT=${wizardPort} \\
  -e WG_PORT=${wizardPort} \\
  -e WG_DEFAULT_DNS=${wizardDns} \\
  -v ~/.wg-easy:/etc/wireguard \\
  -p ${wizardPort}:${wizardPort}/udp \\
  -p 51821:51821/tcp \\
  --cap-add=NET_ADMIN \\
  --cap-add=SYS_MODULE \\
  --sysctl="net.ipv4.conf.all.src_valid_mark=1" \\
  --sysctl="net.ipv4.ip_forward=1" \\
  --restart unless-stopped \\
  ghcr.io/wg-easy/wg-easy`;

  const bashCode = `wget -O wireguard-install.sh https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
sudo AUTO_INSTALL=y \\
     SERVER_IP=${wizardIp} \\
     PORT=${wizardPort} \\
     DNS_SERVER=${wizardDns} \\
     ./wireguard-install.sh`;

  const amneziaGuide = `1. Скачайте бесплатный клиент Amnezia VPN на Android, iOS, Windows или MacOS.
2. Подключитесь к вашему новому VPS серверу: напишите IP: ${wizardIp}, пароль root от VPS.
3. Выберите протокол: "AmneziaWG", "VLESS-Xray" или "OpenVPN over Cloak".
4. Нажмите "Настроить" — Amnezia сама установит Docker и развернет обход блокировок!`;

  return (
    <div id="vpn_app_shell" className="flex h-screen w-full bg-[#030406] text-[#E0E0E0] overflow-hidden font-sans select-none antialiased relative">
      
      {/* Visual Glass Blur Backdrop Glow Lights */}
      <div className="absolute top-[-25%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-cyan-700/[0.04] blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }}></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-blue-600/[0.04] blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '13s' }}></div>

      {/* Cyber Mesh Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none z-0"></div>

      {/* 1. Sidebar Nav Rail Widget */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang}
        isEngineerMode={isEngineerMode}
        setIsEngineerMode={setIsEngineerMode}
        isConnected={isConnected}
        addLog={addLog}
        t={t}
      />

      {/* Main Layout Area */}
      <div className="flex flex-col flex-1 min-w-0 z-10 relative">
        
        {/* Top Header Panel Section */}
        <Header isEngineerMode={isEngineerMode} lang={lang} t={t} />

        {/* Main Content Pane Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-between scrollbar-glass">
          
          <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between gap-6 pb-2">
            
            {/* MOBILE EXPERT TAB CHANGER */}
            {isEngineerMode && (
              <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-4 pt-1 mb-2 scrollbar-none select-none">
                <button 
                  onClick={() => { setActiveTab('connection'); addLog(lang === 'ru' ? "Переключение на Связь" : "Switched to Connection tab"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 shrink-0 ${
                    activeTab === 'connection' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
                      : 'bg-white/[0.01] text-zinc-400 border-white/[0.04] hover:text-white'
                  }`}
                >
                  {lang === 'ru' ? 'Связь' : 'Connect'}
                </button>
                <button 
                  onClick={() => { setActiveTab('wizard'); addLog(lang === 'ru' ? "Переключение на Сервер" : "Switched to Wizard tab"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 shrink-0 ${
                    activeTab === 'wizard' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
                      : 'bg-white/[0.01] text-zinc-400 border-white/[0.04] hover:text-white'
                  }`}
                >
                  {lang === 'ru' ? 'Сервер' : 'Wizard'}
                </button>
                <button 
                  onClick={() => { setActiveTab('config'); addLog(lang === 'ru' ? "Переключение на Клиент" : "Switched to Config tab"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 shrink-0 ${
                    activeTab === 'config' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
                      : 'bg-white/[0.01] text-zinc-400 border-white/[0.04] hover:text-white'
                  }`}
                >
                  {lang === 'ru' ? 'Клиент' : 'Config'}
                </button>
                <button 
                  onClick={() => { setActiveTab('diagnostics'); addLog(lang === 'ru' ? "Переключение на Консоль" : "Switched to Debug tab"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all duration-300 shrink-0 ${
                    activeTab === 'diagnostics' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
                      : 'bg-white/[0.01] text-zinc-400 border-white/[0.04] hover:text-white'
                  }`}
                >
                  {lang === 'ru' ? 'Консоль' : 'Debug'}
                </button>
              </div>
            )}

            {/* TABS SELECT ROUTING */}
            {activeTab === 'connection' && (
              <Dashboard 
                servers={servers}
                selectedServerId={selectedServerId}
                switchServer={switchServer}
                isConnecting={isConnecting}
                isConnected={isConnected}
                handleConnectToggle={handleConnectToggle}
                activeServer={activeServer}
                stats={stats}
                speedPoints={speedPoints}
                activeTimeSec={activeTimeSec}
                formatTime={formatTime}
                isEngineerMode={isEngineerMode}
                setIsAddServerOpen={setIsAddServerOpen}
                lang={lang}
                t={t}
              />
            )}

            {activeTab === 'wizard' && isEngineerMode && (
              <Wizard 
                wizardIp={wizardIp}
                setWizardIp={setWizardIp}
                wizardPort={wizardPort}
                setWizardPort={setWizardPort}
                wizardPass={wizardPass}
                setWizardPass={setWizardPass}
                wizardDns={wizardDns}
                setWizardDns={setWizardDns}
                lang={lang}
                t={t}
                dockerCode={dockerCode}
                bashCode={bashCode}
                amneziaGuide={amneziaGuide}
                copiedDocker={copiedDocker}
                copiedBash={copiedBash}
                triggerCopy={triggerCopy}
              />
            )}

            {activeTab === 'config' && isEngineerMode && (
              <Configurator 
                dnsInput={dnsInput}
                setDnsInput={setDnsInput}
                clientAddress={clientAddress}
                setClientAddress={setClientAddress}
                clientPrivKey={clientPrivKey}
                setClientPrivKey={setClientPrivKey}
                clientPubKey={clientPubKey}
                setClientPubKey={setClientPubKey}
                generateKeysPair={generateKeysPair}
                handleDownloadConfFile={handleDownloadConfFile}
                activeServer={activeServer}
                triggerCopy={triggerCopy}
                copiedConf={copiedConf}
                lang={lang}
                t={t}
              />
            )}

            {activeTab === 'diagnostics' && isEngineerMode && (
              <Diagnostics 
                logs={logs}
                terminalLogs={terminalLogs}
                commandValue={commandValue}
                setCommandValue={setCommandValue}
                handleCommandSubmit={handleCommandSubmit}
                terminalEndRef={terminalEndRef}
                addLog={addLog}
                currentT={currentT}
                lang={lang}
              />
            )}

          </div>

          {/* MOBILE DUAL GLASS CONTROLS (Exactly matching the uploaded design) */}
          <div className="grid grid-cols-2 gap-4 mt-6 md:hidden relative z-10 w-full">
            {/* Left Card: "Редактор" (Toggles isEngineerMode directly!) */}
            <button
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
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                isEngineerMode
                  ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.12)]'
                  : 'bg-[#0D0E14]/65 border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/20'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5 text-glow-cyan" />
              <div className="text-center">
                <p className="text-[11px] font-black tracking-wider uppercase leading-none">
                  {lang === 'ru' ? 'Редактор' : 'Editor'}
                </p>
                <p className="text-[8px] text-zinc-500 mt-0.5 leading-none font-bold">
                  {isEngineerMode 
                    ? (lang === 'ru' ? 'Режим: Эксперт' : 'Mode: Expert') 
                    : (lang === 'ru' ? 'Включить проф-настройки' : 'Enable Dev mode')
                  }
                </p>
              </div>
            </button>

            {/* Right Card: "Настройки" (Toggles language switcher & other parameters bottom sheet!) */}
            <button
              onClick={() => setIsMobileSettingsOpen(true)}
              className="p-4 rounded-2xl border bg-[#0D0E14]/65 border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Settings className="w-5 h-5 text-zinc-500 hover:text-cyan-400" />
              <div className="text-center">
                <p className="text-[11px] font-black tracking-wider uppercase leading-none">
                  {lang === 'ru' ? 'Настройки' : 'Settings'}
                </p>
                <p className="text-[8px] text-zinc-500 mt-0.5 leading-none font-bold">
                  {lang === 'ru' ? 'Язык, инфо и узлы' : 'Lang, info & nodes'}
                </p>
              </div>
            </button>
          </div>

          {/* Copyright branding footer */}
          <footer className="w-full text-center text-zinc-600 text-[10px] uppercase tracking-widest mt-8 pt-4 border-t border-white/[0.04] select-none font-mono relative z-10 hidden md:block">
            {isEngineerMode ? (
              <span>🛡️ Пилигрим VPN Tunnel Engine &bull; Version 2.8.5-STABLE &bull; ChaCha20 Keys &bull; 2026</span>
            ) : (
              <span>🛡️ Пилигрим VPN &bull; {lang === 'ru' ? 'Сверхбыстрое и безопасное интернет-соединение' : 'Ultra-fast and secure internet connection'}</span>
            )}
          </footer>

        </div>

      </div>

      {/* MOBILE SETTINGS GLASS DRAWER / BOTTOM SHEET */}
      {isMobileSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          {/* Backdrop Glass Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-350"
            onClick={() => setIsMobileSettingsOpen(false)}
          ></div>
          
          {/* Frosted Glass Sheet Panel */}
          <div className="w-full max-w-md bg-[#090A0E] border-t border-white/10 rounded-t-3xl max-h-[85vh] flex flex-col relative z-50 p-6 shadow-[0_-12px_45px_10px_rgba(0,0,0,0.6)] animate-[slideUp_0.30s_cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Grab Bar Handle */}
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-5"></div>
            
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.06] pb-3">
              <h3 className="text-xs font-black tracking-widest text-cyan-400 uppercase flex items-center gap-2 text-glow-cyan">
                <Settings className="w-4 h-4 text-cyan-400" />
                {lang === 'ru' ? 'Параметры соединения' : 'Configuration Settings'}
              </h3>
              
              <button 
                onClick={() => setIsMobileSettingsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content inside sheet */}
            <div className="flex-1 overflow-y-auto space-y-5 pb-8">
              
              {/* Option: Language Toggle */}
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Languages className="w-4.5 h-4.5 text-cyan-400" />
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-200">{lang === 'ru' ? 'Язык интерфейса' : 'Language'}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Toggle active app localization</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setLang(prev => prev === 'ru' ? 'en' : 'ru')}
                  className="px-3 py-1.5 bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 rounded-xl text-xs font-black uppercase font-mono shadow-inner tracking-widest"
                >
                  {lang === 'ru' ? 'Русский 🇷🇺' : 'English 🇺🇸'}
                </button>
              </div>

              {/* Option: Quick Server Add node (shortcut available for ease of use!) */}
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4.5 h-4.5 text-cyan-400" />
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-200">{lang === 'ru' ? 'Новые Серверы' : 'Custom Nodes'}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">{lang === 'ru' ? 'Добавить личный узел' : 'Introduce dedicated host VPS'}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setIsMobileSettingsOpen(false);
                    setIsAddServerOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-white/5 text-zinc-300 border border-white/10 hover:border-cyan-400/30 rounded-xl text-xs font-bold"
                >
                  {lang === 'ru' ? '+ Добавить' : '+ New Node'}
                </button>
              </div>

              {/* Hardware specifications telemetry banner */}
              <div className="p-4 bg-blue-600/[0.02] border border-blue-500/10 rounded-2xl">
                <span className="text-[9px] font-mono font-black text-cyan-400 tracking-wider flex items-center gap-1.5 mb-2">
                  <Info className="w-3.5 h-3.5" />
                  PILIGRIM DECOY TUNNEL DATA
                </span>
                <p className="text-xs text-zinc-400/80 leading-normal mb-3 font-sans">
                  {lang === 'ru' 
                    ? "Узлы связи используют современную криптографическую подпись для верификации и предотвращения цензуры провайдера."
                    : "Communication sockets use robust cryptographic signatures to authorize handshakes and avoid provider-level censorship."}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/[0.03] pt-2">
                  <span>INTERFACE: wg0</span>
                  <span>LOAD: 1.4%</span>
                </div>
              </div>

              {/* Developer copyright info */}
              <div className="text-center pt-2">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-relaxed">
                  🛡️ Пилигрим VPN &bull; version 2.8.5
                </p>
                <p className="text-[9px] font-mono text-zinc-700 mt-1 uppercase tracking-wider">
                  Engineered in 2026 for ultimate digital comfort
                </p>
              </div>

            </div>
            
          </div>
        </div>
      )}

      {/* Portal Modal Overlay - Add Custom Server */}
      <AddServerModal 
        isAddServerOpen={isAddServerOpen}
        setIsAddServerOpen={setIsAddServerOpen}
        handleAddServer={handleAddServer}
        newServerName={newServerName}
        setNewServerName={setNewServerName}
        newServerCity={newServerCity}
        setNewServerCity={setNewServerCity}
        newServerIp={newServerIp}
        setNewServerIp={setNewServerIp}
        newServerFlag={newServerFlag}
        setNewServerFlag={setNewServerFlag}
        currentT={currentT}
        lang={lang}
      />

    </div>
  );
}
