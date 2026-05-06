import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { CredentialPayload, MicroCredential } from '../core/models';

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="heading">
      <div>
        <span class="badge">Catálogo corporativo</span>
        <h1>Micro-credenciales</h1>
        <p class="muted">Consulta rutas de aprendizaje internas y emite evidencia de habilidades.</p>
      </div>
    </section>

    @if (message) {
      <div class="alert success">{{ message }}</div>
    }
    @if (error) {
      <div class="alert">{{ error }}</div>
    }

    @if (auth.isAdmin()) {
      <section class="card admin-form">
        <h2>Nueva micro-credencial</h2>
        <form [formGroup]="form" (ngSubmit)="create()" class="grid grid-2">
          <label>Título <input formControlName="title" /></label>
          <label>Área <input formControlName="businessArea" /></label>
          <label>Nivel <input formControlName="level" /></label>
          <label>Duración horas <input formControlName="durationHours" type="number" min="1" /></label>
          <label>Emisor <input formControlName="issuer" /></label>
          <label>Habilidades separadas por coma <input formControlName="skillTags" /></label>
          <label class="wide">Descripción <textarea formControlName="description" rows="3"></textarea></label>
          <button class="wide" [disabled]="form.invalid || loading">{{ loading ? 'Guardando...' : 'Crear micro-credencial' }}</button>
        </form>
      </section>
    }

    <section class="grid grid-3 list">
      @for (credential of credentials; track credential.id) {
        <article class="card credential">
          <div class="card-head">
            <span class="badge">{{ credential.businessArea }}</span>
            <span class="level">{{ credential.level }}</span>
          </div>
          <h2>{{ credential.title }}</h2>
          <p class="muted">{{ credential.description }}</p>
          <div class="tags">
            @for (tag of credential.skillTags; track tag) {
              <span>{{ tag }}</span>
            }
          </div>
          <div class="meta">
            <strong>{{ credential.durationHours }} h</strong>
            <small>{{ credential.issuer }}</small>
          </div>
          <button (click)="enroll(credential.id)">Inscribirme</button>
        </article>
      }
    </section>
  `,
  styles: [`
    .heading { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    h1 { font-size: 3rem; margin: 0.4rem 0; letter-spacing: -0.05em; }
    .admin-form { margin-bottom: 1rem; }
    form label { display: grid; gap: 0.4rem; font-weight: 800; }
    .wide { grid-column: 1 / -1; }
    .list { margin-top: 1rem; }
    .credential { display: flex; flex-direction: column; gap: 0.9rem; }
    .credential h2 { margin: 0; letter-spacing: -0.03em; }
    .card-head { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
    .level { color: var(--muted); font-weight: 900; }
    .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .tags span { padding: 0.35rem 0.55rem; border-radius: 999px; border: 1px solid var(--border); color: var(--muted); font-weight: 700; font-size: 0.82rem; }
    .meta { display: flex; justify-content: space-between; align-items: center; color: var(--muted); margin-top: auto; }
  `]
})
export class CredentialsComponent implements OnInit {
  credentials: MicroCredential[] = [];
  loading = false;
  error = '';
  message = '';

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    businessArea: ['Talento Humano', Validators.required],
    level: ['Básico', Validators.required],
    description: ['', Validators.required],
    durationHours: [8, [Validators.required, Validators.min(1)]],
    issuer: ['Academia Corporativa', Validators.required],
    skillTags: ['Liderazgo, Productividad', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    public readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCredentials();
  }

  loadCredentials(): void {
    this.api.getCredentials().subscribe({
      next: (credentials) => (this.credentials = credentials),
      error: () => (this.error = 'No se pudo cargar el catálogo')
    });
  }

  create(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.message = '';
    const raw = this.form.getRawValue();
    const payload: CredentialPayload = {
      ...raw,
      skillTags: raw.skillTags.split(',').map((tag) => tag.trim()).filter(Boolean),
      active: true
    };
    this.api.createCredential(payload).subscribe({
      next: () => {
        this.message = 'Micro-credencial creada correctamente';
        this.loading = false;
        this.form.reset({
          title: '',
          businessArea: 'Talento Humano',
          level: 'Básico',
          description: '',
          durationHours: 8,
          issuer: 'Academia Corporativa',
          skillTags: 'Liderazgo, Productividad'
        });
        this.loadCredentials();
      },
      error: (err) => {
        this.error = err.error?.message ?? 'No se pudo crear la micro-credencial';
        this.loading = false;
      }
    });
  }

  enroll(credentialId: number): void {
    this.error = '';
    this.message = '';
    this.api.enroll(credentialId).subscribe({
      next: () => (this.message = 'Inscripción creada. Revisa Mis credenciales.'),
      error: (err) => (this.error = err.error?.message ?? 'No se pudo realizar la inscripción')
    });
  }
}
