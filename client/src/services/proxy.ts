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
    console.info(`MVP 模式暂不启用系统代理: ${host}:${port}`);
  }

  async clearProxy(): Promise<void> {
    console.info('MVP 模式暂不清理系统代理');
  }

  async addRoute(targetIp: string): Promise<void> {
    console.info(`MVP 模式暂不添加路由: ${targetIp}`);
  }

  async deleteRoute(targetIp: string): Promise<void> {
    console.info(`MVP 模式暂不删除路由: ${targetIp}`);
  }

  async getProxyStatus(): Promise<boolean> {
    return false;
  }
}
