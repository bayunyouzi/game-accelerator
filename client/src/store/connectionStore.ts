import { create } from 'zustand';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface ConnectionState {
  status: ConnectionStatus;
  latency: number;
  uploadSpeed: number;
  downloadSpeed: number;
  connectedAt?: Date;
  error?: string;
  setStatus: (status: ConnectionStatus) => void;
  updateLatency: (latency: number) => void;
  updateSpeed: (upload: number, download: number) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'disconnected',
  latency: 0,
  uploadSpeed: 0,
  downloadSpeed: 0,
  setStatus: (status) => set({ status }),
  updateLatency: (latency) => set({ latency }),
  updateSpeed: (upload, download) => set({ uploadSpeed: upload, downloadSpeed: download }),
  setError: (error) => set({ error, status: 'error' }),
  reset: () => set({
    status: 'disconnected',
    latency: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    connectedAt: undefined,
    error: undefined,
  }),
}));
