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
}

export type TabType = 'connection' | 'wizard' | 'config' | 'diagnostics';

export interface ConnectionStats {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  dataTransmitted: number;
}

export interface TerminalLog {
  type: 'input' | 'output' | 'system';
  text: string;
}
