import { Command } from '@tauri-apps/plugin-shell';

export interface ProxyConfig {
  host: string;
  port: number;
  enabled: boolean;
}

export class ProxyService {
  private static instance: ProxyService;

  private constructor() {}

  static getInstance(): ProxyService {
    if (!ProxyService.instance) {
      ProxyService.instance = new ProxyService();
    }
    return ProxyService.instance;
  }

  async setProxy(host: string, port: number): Promise<void> {
    const proxyServer = `${host}:${port}`;

    // 设置Windows系统代理
    await Command.create('powershell', [
      '-Command',
      `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyServer -Value "${proxyServer}"`
    ]).execute();

    await Command.create('powershell', [
      '-Command',
      `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable -Value 1`
    ]).execute();
  }

  async clearProxy(): Promise<void> {
    // 清除系统代理
    await Command.create('powershell', [
      '-Command',
      `Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable -Value 0`
    ]).execute();
  }

  async addRoute(targetIp: string): Promise<void> {
    // 添加路由规则
    await Command.create('powershell', [
      '-Command',
      `route add ${targetIp} mask 255.255.255.255 127.0.0.1 metric 1`
    ]).execute();
  }

  async deleteRoute(targetIp: string): Promise<void> {
    // 删除路由规则
    await Command.create('powershell', [
      '-Command',
      `route delete ${targetIp}`
    ]).execute();
  }

  async getProxyStatus(): Promise<boolean> {
    try {
      const result = await Command.create('powershell', [
        '-Command',
        `Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable`
      ]).execute();

      return result.stdout.includes('1');
    } catch (error) {
      return false;
    }
  }
}
