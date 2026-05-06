import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <div class="hero card">
        <span class="badge">Angular 21 + Spring Boot + JWT</span>
        <h1>Acceso a micro-credenciales corporativas</h1>
        <p class="muted">Gestiona formación interna, emisión de constancias y evidencias de habilidades para colaboradores.</p>
        <div class="demo">
          <strong>Usuarios demo</strong>
          <code>admin@empresa.com / Admin123*</code>
          <code>colaborador@empresa.com / User123*</code>
        </div>
      </div>

      <form class="card form" [formGroup]="form" (ngSubmit)="submit()">
        <h2>Iniciar sesión</h2>
        <label>
          Correo
          <input formControlName="email" type="email" placeholder="admin@empresa.com" />
        </label>
        <label>
          Contraseña
          <input formControlName="password" type="password" placeholder="Admin123*" />
        </label>
        @if (error) {
          <div class="alert">{{ error }}</div>
        }
        <button [disabled]="form.invalid || loading">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
        <p class="muted">¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
      </form>
    </section>
  `,
  styles: [`
    .auth-shell { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 1rem; align-items: stretch; }
    .hero { min-height: 430px; display: flex; flex-direction: column; justify-content: center; }
    h1 { font-size: clamp(2.2rem, 4vw, 4.8rem); line-height: 0.95; margin: 1rem 0; letter-spacing: -0.06em; }
    .form { display: grid; gap: 1rem; align-content: center; }
    label { display: grid; gap: 0.4rem; font-weight: 800; }
    .demo { display: grid; gap: 0.6rem; margin-top: 1rem; }
    code { display: block; background: #101828; color: white; padding: 0.75rem; border-radius: 12px; }
    a { color: var(--primary); font-weight: 800; }
    @media (max-width: 860px) { .auth-shell { grid-template-columns: 1fr; } }
  `]
})
export class LoginComponent {
  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    email: ['admin@empresa.com', [Validators.required, Validators.email]],
    password: ['Admin123*', [Validators.required]]
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
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        this.error = err.error?.message ?? 'No fue posible iniciar sesión';
        this.loading = false;
      }
    });
  }
}
