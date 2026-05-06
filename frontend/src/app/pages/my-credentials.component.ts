import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Enrollment } from '../core/models';

@Component({
  selector: 'app-my-credentials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="heading">
      <div>
        <span class="badge">Portafolio personal</span>
        <h1>Mis credenciales</h1>
        <p class="muted">Consulta tus inscripciones y códigos verificables emitidos.</p>
      </div>
    </section>

    @if (error) {
      <div class="alert">{{ error }}</div>
    }

    <section class="grid grid-2">
      @for (item of enrollments; track item.id) {
        <article class="card item">
          <div class="row">
            <span class="badge">{{ item.status === 'ISSUED' ? 'Emitida' : 'En progreso' }}</span>
            <small>{{ item.credential.durationHours }} horas</small>
          </div>
          <h2>{{ item.credential.title }}</h2>
          <p class="muted">{{ item.credential.description }}</p>

          @if (item.status === 'ISSUED') {
            <div class="certificate">
              <span>Código verificable</span>
              <strong>{{ item.verificationCode }}</strong>
              <small>Vence: {{ item.expiresAt | date:'mediumDate' }}</small>
            </div>
          } @else {
            <button (click)="complete(item.id)">Marcar como completada</button>
          }
        </article>
      } @empty {
        <article class="card empty">
          <h2>No tienes inscripciones todavía</h2>
          <p class="muted">Ve al catálogo e inscríbete a una micro-credencial.</p>
        </article>
      }
    </section>
  `,
  styles: [`
    .heading { margin-bottom: 1rem; }
    h1 { font-size: 3rem; margin: 0.4rem 0; letter-spacing: -0.05em; }
    .item { display: grid; gap: 0.9rem; }
    .row { display: flex; justify-content: space-between; align-items: center; }
    .certificate { border: 1px dashed var(--primary); border-radius: 20px; padding: 1rem; background: #f8faff; display: grid; gap: 0.25rem; }
    .certificate strong { font-size: 1.8rem; letter-spacing: 0.08em; color: var(--primary-dark); }
    .empty { grid-column: 1 / -1; }
  `]
})
export class MyCredentialsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  error = '';

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getMyEnrollments().subscribe({
      next: (items) => (this.enrollments = items),
      error: () => (this.error = 'No se pudieron cargar tus credenciales')
    });
  }

  complete(id: number): void {
    this.api.completeEnrollment(id).subscribe({
      next: () => this.load(),
      error: (err) => (this.error = err.error?.message ?? 'No se pudo completar la credencial')
    });
  }
}
