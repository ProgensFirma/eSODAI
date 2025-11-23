import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/session.model';

@Component({
  selector: 'app-login-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-overlay">
      <div class="login-window">
        <div class="login-header">
          <h1 class="login-title">
            <span class="title-icon">🔐</span>
            Logowanie do systemu
          </h1>
          <div class="system-name">eSOD</div>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="login" class="form-label">
              <span class="label-icon">👤</span>
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
              <span class="label-icon">🔑</span>
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
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="login-button"
              [disabled]="!loginForm.valid || loading"
            >
              <span class="button-icon" *ngIf="!loading">🚀</span>
              <span class="loading-spinner" *ngIf="loading"></span>
              {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
            </button>
          </div>
        </form>

        <div class="login-footer">
          <div class="version-info">
            <span class="version-label">System zarządzania dokumentami</span>
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
      border-radius: 20px;
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
      padding: 32px 32px 24px 32px;
      text-align: center;
    }

    .login-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 700;
    }

    .title-icon {
      font-size: 28px;
    }

    .system-name {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 2px;
      opacity: 0.9;
      margin-top: 8px;
    }

    .login-form {
      padding: 32px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .label-icon {
      font-size: 16px;
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
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fef2f2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #fecaca;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .error-icon {
      font-size: 16px;
    }

    .form-actions {
      margin-top: 32px;
    }

    .login-button {
      width: 100%;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
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

    .button-icon {
      font-size: 18px;
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
      padding: 20px 32px;
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

    @media (max-width: 480px) {
      .login-window {
        margin: 20px;
        max-width: none;
      }

      .login-header {
        padding: 24px 24px 20px 24px;
      }

      .login-title {
        font-size: 20px;
      }

      .system-name {
        font-size: 28px;
      }

      .login-form {
        padding: 24px;
      }

      .login-footer {
        padding: 16px 24px;
      }
    }
  `]
})
export class LoginWindowComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  loginData: LoginRequest = {
    login: '',
    haslo: ''
  };

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

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
}