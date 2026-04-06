export interface ServerConfig {
  websocketUrl: string;
  statusUrl: string;
}

export interface ConnectionCallbacks {
  onPing?: (ping: number) => void;
  onLatency?: (latency: number) => void;
  onStatus?: (event: string) => void;
  onConfig?: (payload: unknown) => void;
}

export class ConnectionService {
  private static instance: ConnectionService;
  private ws: WebSocket | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private latencyInterval: ReturnType<typeof setInterval> | null = null;
  private pendingPingAt: number | null = null;
  private pendingLatencyAt: number | null = null;
  private callbacks: ConnectionCallbacks = {};

  private constructor() {}

  static getInstance(): ConnectionService {
    if (!ConnectionService.instance) {
      ConnectionService.instance = new ConnectionService();
    }
    return ConnectionService.instance;
  }

  async connect(serverConfig: ServerConfig, callbacks?: ConnectionCallbacks): Promise<void> {
    this.callbacks = callbacks || {};
    const wsUrl = serverConfig.websocketUrl;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.callbacks.onStatus?.('控制通道已连接');
          this.startHeartbeat();
          this.startLatencyCheck();
          resolve();
        };

        this.ws.onerror = () => {
          this.callbacks.onStatus?.('连接异常');
          reject(new Error('连接失败'));
        };

        this.ws.onclose = () => {
          this.callbacks.onStatus?.('连接已断开');
          this.stopHeartbeat();
          this.stopLatencyCheck();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (_error) {
            this.callbacks.onStatus?.('收到非 JSON 消息');
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.stopLatencyCheck();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private handleMessage(message: any): void {
    if (message.type === 'welcome') {
      this.callbacks.onStatus?.(message.message || '已连接到节点');
      return;
    }

    if (message.type === 'pong' && this.pendingPingAt) {
      const ping = Math.max(1, Date.now() - this.pendingPingAt);
      this.pendingPingAt = null;
      this.callbacks.onPing?.(ping);
      this.callbacks.onStatus?.(`Ping ${ping} ms`);
      return;
    }

    if (message.type === 'latency_result' && this.pendingLatencyAt) {
      const latency = Math.max(1, Date.now() - this.pendingLatencyAt);
      this.pendingLatencyAt = null;
      this.callbacks.onLatency?.(latency);
      this.callbacks.onStatus?.(`延迟 ${latency} ms`);
      return;
    }

    if (message.type === 'apex_config') {
      this.callbacks.onConfig?.(message.payload);
      this.callbacks.onStatus?.('已同步 APEX 配置');
      return;
    }

    if (message.type === 'status') {
      this.callbacks.onStatus?.('已同步节点状态');
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.pendingPingAt = Date.now();
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startLatencyCheck(): void {
    this.latencyInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const startTime = Date.now();
        this.pendingLatencyAt = startTime;
        this.ws.send(JSON.stringify({ type: 'latency_check', timestamp: startTime }));
      }
    }, 10000);
  }

  private stopLatencyCheck(): void {
    if (this.latencyInterval) {
      clearInterval(this.latencyInterval);
      this.latencyInterval = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  requestStatus(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'get_status' }));
    }
  }

  requestApexConfig(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'get_apex_config' }));
    }
  }

  sendManualPing(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.pendingPingAt = Date.now();
      this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
    }
  }

  sendManualLatencyCheck(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.pendingLatencyAt = Date.now();
      this.ws.send(JSON.stringify({ type: 'latency_check', timestamp: Date.now() }));
    }
  }
}
