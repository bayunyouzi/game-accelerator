import { Command } from '@tauri-apps/plugin-shell';

export interface ProcessInfo {
  pid: number;
  name: string;
  path?: string;
  ports: number[];
}

export class ProcessService {
  private static instance: ProcessService;

  private constructor() {}

  static getInstance(): ProcessService {
    if (!ProcessService.instance) {
      ProcessService.instance = new ProcessService();
    }
    return ProcessService.instance;
  }

  async detectGameProcess(): Promise<ProcessInfo | null> {
    try {
      // 查找APEX游戏进程
      const result = await Command.create('tasklist', [
        '/FI',
        'IMAGENAME eq r5apex.exe',
        '/FO',
        'CSV',
        '/NH'
      ]).execute();

      if (result.stdout.trim()) {
        const lines = result.stdout.trim().split('\n');
        if (lines.length > 0) {
          const parts = lines[0].split(',');
          const pid = parseInt(parts[1].replace(/"/g, ''));

          return {
            pid,
            name: 'r5apex.exe',
            ports: await this.getProcessPorts(pid),
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to detect game process:', error);
      return null;
    }
  }

  async getProcessPorts(pid: number): Promise<number[]> {
    try {
      // 获取进程的网络连接
      const result = await Command.create('netstat', [
        '-ano',
        '-p',
        'udp'
      ]).execute();

      const lines = result.stdout.split('\n');
      const ports = new Set<number>();

      for (const line of lines) {
        if (line.includes(pid.toString())) {
          const match = line.match(/:(\d+)/);
          if (match) {
            const port = parseInt(match[1]);
            if (port > 0) {
              ports.add(port);
            }
          }
        }
      }

      return Array.from(ports);
    } catch (error) {
      console.error('Failed to get process ports:', error);
      return [];
    }
  }

  async startMonitoring(callback: (process: ProcessInfo | null) => void): Promise<void> {
    const checkInterval = setInterval(async () => {
      const process = await this.detectGameProcess();
      callback(process);
    }, 2000);

    // 返回清理函数
    return () => clearInterval(checkInterval);
  }
}
