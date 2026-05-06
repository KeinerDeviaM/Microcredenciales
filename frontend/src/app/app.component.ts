import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="container nav">
        <a routerLink="/dashboard" class="brand">
          <span class="brand-mark">MC</span>
          <span>
            <strong>MicroCred Corp</strong>
            <small>EdTech empresarial</small>
          </span>
        </a>

        @if (auth.isAuthenticated()) {
          <nav>
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/credentials" routerLinkActive="active">Catálogo</a>
            <a routerLink="/my-credentials" routerLinkActive="active">Mis credenciales</a>
          </nav>

          <div class="session">
            <span class="badge">{{ auth.user()?.role }}</span>
            <span class="user">{{ auth.user()?.fullName }}</span>
            <button type="button" class="ghost" (click)="logout()">Salir</button>
          </div>
        }
      </div>
    </header>

    <main class="container page">
      <router-outlet />
    </main>
  `,
  styles: [`
    .topbar {
      position: sticky;
      top: 0;
      z-index: 5;
      backdrop-filter: blur(18px);
      background: rgba(245, 247, 251, 0.82);
      border-bottom: 1px solid rgba(217, 224, 239, 0.75);
    }
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 76px;
      gap: 1rem;
    }
    .brand { display: inline-flex; align-items: center; gap: 0.8rem; }
    .brand-mark {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 16px;
      background: var(--primary);
      color: white;
      font-weight: 900;
    }
    .brand small { display: block; color: var(--muted); font-size: 0.78rem; }
    nav { display: flex; gap: 0.55rem; flex-wrap: wrap; }
    nav a {
      padding: 0.65rem 0.85rem;
      border-radius: 12px;
      color: var(--muted);
      font-weight: 700;
    }
    nav a.active, nav a:hover { background: var(--surface-2); color: var(--primary-dark); }
    .session { display: flex; align-items: center; gap: 0.7rem; }
    .user { color: var(--muted); font-weight: 700; }
    .ghost { background: transparent; color: var(--primary); border: 1px solid var(--border); }
    .ghost:hover { background: var(--surface-2); }
    .page { padding: 2rem 0 3rem; }
    @media (max-width: 980px) {
      .nav { align-items: flex-start; flex-direction: column; padding: 1rem 0; }
      .session { flex-wrap: wrap; }
    }
  `]
})
export class AppComponent {
  constructor(public readonly auth: AuthService, private readonly router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
