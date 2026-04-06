import { create } from 'zustand';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface ConnectionState {
  status: ConnectionStatus;
  ping: number;
  latency: number;
  serverName: string;
  processRunning: boolean;
  processPid?: number;
  websocketUrl: string;
  lastEvent: string;
  connectedAt?: Date;
  error?: string;
  setStatus: (status: ConnectionStatus) => void;
  updatePing: (ping: number) => void;
  updateLatency: (latency: number) => void;
  setServerName: (serverName: string) => void;
  setProcessStatus: (running: boolean, pid?: number) => void;
  setWebsocketUrl: (url: string) => void;
  setLastEvent: (event: string) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'disconnected',
  ping: 0,
  latency: 0,
  serverName: '香港 APEX 节点',
  processRunning: false,
  processPid: undefined,
  websocketUrl: 'wss://youxi.zeabur.app/ws',
  lastEvent: '未连接',
  setStatus: (status) =>
    set({
      status,
      connectedAt: status === 'connected' ? new Date() : undefined,
    }),
  updatePing: (ping) => set({ ping }),
  updateLatency: (latency) => set({ latency }),
  setServerName: (serverName) => set({ serverName }),
  setProcessStatus: (processRunning, processPid) => set({ processRunning, processPid }),
  setWebsocketUrl: (websocketUrl) => set({ websocketUrl }),
  setLastEvent: (lastEvent) => set({ lastEvent }),
  setError: (error) => set(error ? { error, status: 'error', lastEvent: error } : { error: undefined }),
  reset: () => set({
    status: 'disconnected',
    ping: 0,
    latency: 0,
    serverName: '香港 APEX 节点',
    processRunning: false,
    processPid: undefined,
    websocketUrl: 'wss://youxi.zeabur.app/ws',
    lastEvent: '未连接',
    connectedAt: undefined,
    error: undefined,
  }),
}));
