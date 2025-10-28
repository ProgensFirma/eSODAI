import { Injectable } from '@angular/core';

export interface AppConfig {
  apiBaseUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;

  async loadConfig(): Promise<void> {
    const response = await fetch('/config.json');
    this.config = await response.json();
  }

  get apiBaseUrl(): string {
    return this.config?.apiBaseUrl || 'http://localhost:8448';
  }
}
