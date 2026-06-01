export interface BotStatus {
  public: boolean;
  uptime: number;
  clones: number;
}

export interface SystemStats {
  platform: string;
  ram_used: string;
  ram_total: string;
  cpu_usage: string;
}

export interface CloneBot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error' | string;
  uptime: number;
}
