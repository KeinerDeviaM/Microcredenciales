import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { DashboardSummary } from '../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero card">
      <div>
        <span class="badge">Panel ejecutivo</span>
        <h1>Hola, {{ auth.user()?.fullName }}</h1>
        <p class="muted">Administra y consulta el avance de las micro-credenciales corporativas.</p>
      </div>
      <a routerLink="/credentials" class="cta">Ver catálogo</a>
    </section>

    @if (summary) {
      <section class="grid grid-4 stats">
        <article class="card stat">
          <span>Total credenciales</span>
          <strong>{{ summary.totalCredentials }}</strong>
        </article>
        <article class="card stat">
          <span>Activas</span>
          <strong>{{ summary.activeCredentials }}</strong>
        </article>
        <article class="card stat">
          <span>Inscripciones</span>
          <strong>{{ summary.totalEnrollments }}</strong>
        </article>
        <article class="card stat">
          <span>Emitidas</span>
          <strong>{{ summary.issuedCredentials }}</strong>
        </article>
      </section>
    }

    <section class="grid grid-2 mt">
      <article class="card">
        <h2>Flujo principal</h2>
        <ol>
          <li>El administrador crea micro-credenciales desde Catálogo.</li>
          <li>El colaborador se inscribe en una ruta activa.</li>
          <li>Al completar la ruta, se emite un código verificable.</li>
        </ol>
      </article>
      <article class="card">
        <h2>Seguridad</h2>
        <p class="muted">El frontend usa un interceptor para enviar el token JWT. El backend protege rutas con Spring Security y roles.</p>
      </article>
    </section>
  `,
  styles: [`
    .hero { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    h1 { font-size: clamp(2rem, 4vw, 4.5rem); margin: 0.6rem 0; letter-spacing: -0.06em; }
    .cta { display: inline-flex; background: var(--primary); color: white; border-radius: 16px; padding: 0.85rem 1rem; font-weight: 900; }
    .grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .stat { display: grid; gap: 0.5rem; }
    .stat span { color: var(--muted); font-weight: 800; }
    .stat strong { font-size: 2.6rem; letter-spacing: -0.05em; }
    .mt { margin-top: 1rem; }
    li { margin: 0.5rem 0; }
    @media (max-width: 900px) { .hero { flex-direction: column; align-items: flex-start; } .grid-4 { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px) { .grid-4 { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  summary?: DashboardSummary;

  constructor(private readonly api: ApiService, public readonly auth: AuthService) {}

  ngOnInit(): void {
    this.api.getSummary().subscribe((summary) => (this.summary = summary));
  }
}
