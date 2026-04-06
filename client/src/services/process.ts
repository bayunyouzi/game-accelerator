import { invoke } from '@tauri-apps/api/core';

export interface ProcessInfo {
  pid?: number;
  name: string;
  running: boolean;
}

export class ProcessService {
  private static instance: ProcessService;
  private checkInterval: number | null = null;

  private constructor() {}

  static getInstance(): ProcessService {
    if (!ProcessService.instance) {
      ProcessService.instance = new ProcessService();
    }
    return ProcessService.instance;
  }

  async detectGameProcess(): Promise<ProcessInfo | null> {
    try {
      const result = await invoke<{ running: boolean; process_name: string; pid?: number }>('detect_apex_process');

      if (result.running) {
        return {
          pid: result.pid,
          name: result.process_name,
          running: true,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to detect game process:', error);
      return null;
    }
  }

  async startMonitoring(callback: (process: ProcessInfo | null) => void): Promise<void> {
    this.stopMonitoring();

    this.checkInterval = window.setInterval(async () => {
      const process = await this.detectGameProcess();
      callback(process);
    }, 2000);
  }

  stopMonitoring(): void {
    if (this.checkInterval !== null) {
      window.clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}
