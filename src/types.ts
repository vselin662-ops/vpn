// ============================================
// 📦 ТИПЫ ДАННЫХ ДЛЯ ПРИЛОЖЕНИЯ ПИЛИГРИМ VPN
// ============================================

// 🌍 Данные о сервере (локации)
export interface ServerLocation {
  id: string;
  nameRu: string;
  nameEn: string;
  cityRu: string;
  cityEn: string;
  flagColor: string;
  emoji: string;
  baseIp: string;
  ping: number;
  load: number;
  protocol: string;
  
  // Новые поля для продвинутых протоколов (VLESS + REALITY)
  // Знак "?" означает, что поле необязательное — старые серверы продолжат работать
  realityPublicKey?: string;  // Публичный ключ для шифрования REALITY
  shortId?: string;           // Короткий идентификатор для маскировки
  sni?: string;               // Домен, под который маскируется трафик (например, cloudflare.com)
  uuid?: string;              // Уникальный идентификатор клиента
}

// 📑 Типы вкладок в приложении
export type TabType = 'connection' | 'wizard' | 'config' | 'diagnostics';

// 📊 Статистика активного соединения
export interface ConnectionStats {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  dataTransmitted: number;
}

// 💻 Записи логов в диагностическом терминале
export interface TerminalLog {
  type: 'input' | 'output' | 'system';
  text: string;
}

// 🔐 Конфигурация REALITY (для обхода блокировок)
export interface RealityConfig {
  uuid: string;
  publicKey: string;
  shortId: string;
  sni: string;
  serverIp: string;
  port: number;
}

// 🛡️ Типы поддерживаемых протоколов
export type ProtocolType = 'WireGuard' | 'VLESS' | 'Hysteria2' | 'ShadowTLS';
