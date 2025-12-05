import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/session.model';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-login-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-overlay">
      <div class="login-window">
        <div class="login-header">
          <h1 class="login-title">
            Logowanie do systemu eSOD
          </h1>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="login" class="form-label">
              Użytkownik
            </label>
            <input
              type="text"
              id="login"
              name="login"
              class="form-input"
              [(ngModel)]="loginData.login"
              required
              [disabled]="loading"
              placeholder="Wprowadź nazwę użytkownika"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="haslo" class="form-label">
              Hasło
            </label>
            <input
              type="password"
              id="haslo"
              name="haslo"
              class="form-input"
              [(ngModel)]="loginData.haslo"
              required
              [disabled]="loading"
              placeholder="Wprowadź hasło"
              autocomplete="current-password"
            />
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="login-button"
              [disabled]="!loginForm.valid || loading"
            >
              <span class="loading-spinner" *ngIf="loading"></span>
              {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
            </button>
            <button
              type="button"
              class="cancel-button"
              [disabled]="loading"
              (click)="onCancel()"
            >
              Anuluj
            </button>
          </div>
        </form>

        <div class="login-footer">
          <div class="version-info">
            <span class="version-label">System zarządzania dokumentami</span>
            <div class="version-number">FE: v{{ frontVersion }} BE: v{{ backendVersion }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .login-window {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 420px;
      overflow: hidden;
      animation: slideUp 0.4s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      padding: 16px 32px 12px 32px;
      text-align: center;
    }

    .login-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }


    .login-form {
      padding: 32px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .form-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.2s ease;
      background: #f9fafb;
    }

    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      background: white;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      background: #fef2f2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #fecaca;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .form-actions {
      margin-top: 32px;
      display: flex;
      flex-direction: row;
      gap: 12px;
    }

    .login-button {
      width: 100%;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .cancel-button {
      width: 100%;
      background: white;
      color: #6b7280;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cancel-button:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #d1d5db;
      transform: translateY(-1px);
    }

    .cancel-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-footer {
      background: #f9fafb;
      padding: 10px 32px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }

    .version-info {
      color: #6b7280;
      font-size: 14px;
    }

    .version-label {
      font-weight: 500;
    }

    .version-number {
      color: #9ca3af;
      font-size: 12px;
      margin-top: 4px;
    }

    @media (max-width: 480px) {
      .login-window {
        margin: 20px;
        max-width: none;
      }

      .login-header {
        padding: 12px 24px 10px 24px;
      }

      .login-title {
        font-size: 20px;
      }

      .login-form {
        padding: 24px;
      }

      .login-footer {
        padding: 8px 24px;
      }
    }
  `]
})
export class LoginWindowComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() loginCancelled = new EventEmitter<void>();

  loginData: LoginRequest = {
    login: '',
    haslo: ''
  };

  loading = false;
  errorMessage = '';
  frontVersion = environment.frontVersion;
  backendVersion = '?';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getBackendVersion().subscribe({
      next: (response) => {
        this.backendVersion = response.wersja;
      },
      error: (error) => {
        console.warn('Failed to fetch backend version:', error);
      }
    });
  }

  onSubmit() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        this.loginSuccess.emit();
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.errorMessage = 'Nieprawidłowy login lub hasło';
        } else if (error.status === 0) {
          this.errorMessage = 'Brak połączenia z serwerem';
        } else {
          this.errorMessage = 'Wystąpił błąd podczas logowania';
        }
      }
    });
  }

  onCancel() {
    this.loginCancelled.emit();
  }
}