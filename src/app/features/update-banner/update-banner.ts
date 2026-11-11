import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/** Revisa si hay una versión nueva publicada cada cuánto (además de al abrir la app). */
const CHECK_EVERY = 30 * 60 * 1000;

/**
 * La app instalada guarda una copia para funcionar sin internet; sin este aviso seguiría
 * mostrando la versión anterior después de publicar una nueva.
 */
@Component({
  selector: 'app-update-banner',
  template: `
    @if (ready()) {
      <aside class="update" role="status">
        <span>✨ Hay una versión nueva de Paper Planner.</span>
        <button type="button" class="primary" (click)="reload()">Actualizar</button>
      </aside>
    }
  `,
  styles: `
    .update {
      position: fixed;
      z-index: 60;
      right: 16px;
      bottom: 16px;
      left: 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      max-width: 460px;
      margin: 0 auto;
      padding: 12px 14px;
      border: 2px solid var(--line);
      border-radius: 10px;
      background: var(--card);
      box-shadow: 4px 4px 0 var(--line);
      font-weight: 600;
    }
  `,
})
export class UpdateBanner {
  private readonly updates = inject(SwUpdate);
  protected readonly ready = signal(false);

  constructor() {
    if (!this.updates.isEnabled) return;
    this.updates.versionUpdates
      .pipe(
        filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.ready.set(true));
    const check = () => this.updates.checkForUpdate().catch(() => undefined);
    check();
    // El componente vive mientras la app esté abierta: no hace falta limpiar esto.
    setInterval(check, CHECK_EVERY);
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && check());
  }

  protected reload(): void {
    document.location.reload();
  }
}
