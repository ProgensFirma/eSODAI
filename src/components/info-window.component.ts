import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SessionData } from '../models/session.model';

@Component({
  selector: 'app-info-window',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="info-overlay" (click)="closeWindow()">
      <div class="info-window" (click)="$event.stopPropagation()">
        <div class="window-header">
          <h2 class="window-title">
            <span class="title-icon">ℹ️</span>
            Informacje o systemie
          </h2>
          <button class="close-button" (click)="closeWindow()" title="Zamknij">
            <span class="close-icon">✕</span>
          </button>
        </div>

        <div class="window-content">
          <div class="system-info">
            <div class="system-logo">
              <h1 class="system-name">eSOD</h1>
            </div>

            <div class="version-section">
              <div class="version-item">
                <span class="version-label">Backend:</span>
                <span class="version-value">{{ appServerVersion || 'Nieznana' }}</span>
              </div>
              <div class="version-item">
                <span class="version-label">Frontend:</span>
                <span class="version-value">{{ frontendVersion }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="session-section" *ngIf="sessionData">
              <h3 class="section-title">Dane sesji</h3>
              
              <div class="session-grid">
                <div class="session-item">
                  <span class="session-label">Sesja:</span>
                  <span class="session-value">{{ sessionData.sesja }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Login:</span>
                  <span class="session-value">{{ sessionData.login }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Użytkownik:</span>
                  <span class="session-value">{{ sessionData.imie }} {{ sessionData.nazwisko }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Osoba:</span>
                  <span class="session-value">{{ sessionData.osoba }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Poziom:</span>
                  <span class="session-value">{{ sessionData.poziom }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Administrator:</span>
                  <span class="session-value" [class.admin-yes]="sessionData.admin" [class.admin-no]="!sessionData.admin">
                    {{ sessionData.admin ? 'Tak' : 'Nie' }}
                  </span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">System:</span>
                  <span class="session-value">{{ sessionData.sysOper }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Baza danych:</span>
                  <span class="session-value">{{ sessionData.dB }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Czas logowania:</span>
                  <span class="session-value">{{ formatDateTime(sessionData.czasStart) }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Czas aktualny:</span>
                  <span class="session-value">{{ formatDateTime(sessionData.czasAktual) }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">Czas wygaśnięcia:</span>
                  <span class="session-value">{{ formatDateTime(sessionData.czasStop) }}</span>
                </div>
                
                <div class="session-item">
                  <span class="session-label">GUID:</span>
                  <span class="session-value guid">{{ sessionData.gUnikNr }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="window-footer">
          <button class="close-footer-button" (click)="closeWindow()">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .info-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .info-window {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 90vw;
      max-width: 700px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .window-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border-bottom: 1px solid #1d4ed8;
    }

    .window-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .title-icon {
      font-size: 24px;
    }

    .close-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .window-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    .window-content::-webkit-scrollbar {
      width: 8px;
    }

    .window-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .window-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .system-info {
      text-align: center;
    }

    .system-logo {
      margin-bottom: 32px;
    }

    .system-name {
      font-size: 48px;
      font-weight: 800;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: 3px;
    }

    .version-section {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 32px;
    }

    .version-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .version-label {
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .version-value {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      background: #f1f5f9;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
      margin: 32px 0;
    }

    .session-section {
      text-align: left;
    }

    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 24px 0;
      text-align: center;
    }

    .session-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .session-label {
      font-weight: 600;
      color: #64748b;
      font-size: 14px;
    }

    .session-value {
      font-weight: 500;
      color: #1e293b;
      font-size: 14px;
      text-align: right;
    }

    .session-value.admin-yes {
      color: #16a34a;
      font-weight: 700;
    }

    .session-value.admin-no {
      color: #dc2626;
    }

    .session-value.guid {
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    .window-footer {
      padding: 20px 24px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }

    .close-footer-button {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 32px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .close-footer-button:hover {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    @media (max-width: 768px) {
      .info-window {
        width: 95vw;
        max-height: 95vh;
      }

      .window-content {
        padding: 24px;
      }

      .system-name {
        font-size: 36px;
      }

      .version-section {
        flex-direction: column;
        gap: 20px;
      }

      .session-grid {
        grid-template-columns: 1fr;
      }

      .session-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .session-value {
        text-align: left;
      }
    }
  `]
})
export class InfoWindowComponent implements OnInit {
  @Output() closeRequested = new EventEmitter<void>();

  sessionData: SessionData | null = null;
  appServerVersion = '';
  frontendVersion = 'v1.0.0'; // Stała wersja frontend

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.sessionData = this.authService.getCurrentSession();
    this.appServerVersion = this.authService.getCurrentAppServerVersion();
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  closeWindow() {
    this.closeRequested.emit();
  }
}