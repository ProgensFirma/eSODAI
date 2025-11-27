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
    try {
      const response = await fetch('/public/config.json');
      if (response.ok) {
        this.config = await response.json();
      } else {
        console.warn('Could not load config.json, using default values');
        this.config = { apiBaseUrl: 'http://localhost:8448/api' };
      }
    } catch (error) {
      console.warn('Error loading config.json, using default values:', error);
      this.config = { apiBaseUrl: 'http://localhost:8448/api' };
    }
  }

  get apiBaseUrl(): string {
    return this.config?.apiBaseUrl || 'http://localhost:8448/api';
  }
}
