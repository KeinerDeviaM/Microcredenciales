import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <form class="card form" [formGroup]="form" (ngSubmit)="submit()">
        <span class="badge">Registro funcional con JWT</span>
        <h1>Crear cuenta</h1>
        <label>
          Nombre completo
          <input formControlName="fullName" placeholder="Laura Gómez" />
        </label>
        <label>
          Correo corporativo
          <input formControlName="email" type="email" placeholder="laura@empresa.com" />
        </label>
        <label>
          Contraseña
          <input formControlName="password" type="password" placeholder="mínimo 6 caracteres" />
        </label>
        @if (error) {
          <div class="alert">{{ error }}</div>
        }
        <button [disabled]="form.invalid || loading">{{ loading ? 'Creando...' : 'Crear cuenta' }}</button>
        <p class="muted">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
      </form>
    </section>
  `,
  styles: [`
    .auth-shell { display: grid; place-items: center; min-height: 70vh; }
    .form { width: min(520px, 100%); display: grid; gap: 1rem; }
    h1 { margin: 0; font-size: 2.4rem; letter-spacing: -0.04em; }
    label { display: grid; gap: 0.4rem; font-weight: 800; }
    a { color: var(--primary); font-weight: 800; }
  `]
})
export class RegisterComponent {
  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        this.error = err.error?.message ?? 'No fue posible registrar la cuenta';
        this.loading = false;
      }
    });
  }
}
