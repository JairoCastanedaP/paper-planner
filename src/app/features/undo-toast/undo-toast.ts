import { Component, effect, inject } from '@angular/core';
import { PlannerStore } from '../../core/planner-store';

/** Cuánto tiempo se ofrece deshacer. */
const VISIBLE_MS = 8000;

/** Aviso "Eliminado · Deshacer" en la parte inferior de la pantalla. */
@Component({
  selector: 'app-undo-toast',
  template: `
    @if (store.undo(); as entry) {
      <div class="toast" role="status" aria-live="polite">
        <span class="message">{{ entry.message }}</span>
        <button type="button" class="undo" (click)="store.undoLast()">Deshacer</button>
        <button type="button" class="close" (click)="store.dismissUndo(entry.id)" aria-label="Cerrar aviso">×</button>
      </div>
    }
  `,
  styles: `
    .toast {
      position: fixed;
      z-index: 40;
      bottom: max(16px, env(safe-area-inset-bottom));
      left: 50%;
      display: flex;
      max-width: calc(100% - 32px);
      align-items: center;
      gap: 12px;
      padding: 10px 10px 10px 16px;
      border-radius: 10px;
      background: var(--line);
      box-shadow: 0 6px 20px rgb(0 0 0 / 25%);
      color: var(--on-line);
      transform: translateX(-50%);
      animation: rise 0.2s ease-out;
    }
    .message {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .undo {
      flex-shrink: 0;
      padding: 6px 12px;
      border-color: var(--on-line);
      background: transparent;
      color: var(--on-line);
    }
    .undo:hover:not(:disabled) {
      background: color-mix(in srgb, var(--on-line) 15%, transparent);
    }
    .close {
      flex-shrink: 0;
      padding: 0 6px;
      border: 0;
      background: none;
      color: var(--on-line);
      font-size: 1.3rem;
      line-height: 1;
    }
    .close:hover:not(:disabled) {
      background: none;
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translate(-50%, 12px);
      }
    }
  `,
})
export class UndoToast {
  protected readonly store = inject(PlannerStore);

  constructor() {
    // Cada aviso nuevo se cierra solo después de unos segundos.
    effect((onCleanup) => {
      const entry = this.store.undo();
      if (!entry) return;
      const timer = setTimeout(() => this.store.dismissUndo(entry.id), VISIBLE_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }
}
