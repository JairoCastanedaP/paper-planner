import { Component, inject, input, output } from '@angular/core';
import { PlannerStore } from '../../core/planner-store';

/** Chips para ver solo las actividades de ciertas categorías. */
@Component({
  selector: 'app-filter-bar',
  template: `
    <div class="bar" role="group" aria-label="Filtrar por categoría">
      <span class="label">Ver:</span>
      <button type="button" class="chip all" [class.on]="!selected().length" [attr.aria-pressed]="!selected().length" (click)="selectedChange.emit([])">
        Todas
      </button>
      @for (c of store.categories(); track c.id) {
        <button
          type="button"
          class="chip"
          [style.--cat]="c.color"
          [class.on]="selected().includes(c.id)"
          [attr.aria-pressed]="selected().includes(c.id)"
          (click)="toggle(c.id)"
        >
          {{ c.icon ?? '' }} {{ c.name }}
        </button>
      }
      @if (summary()) {
        <span class="summary" role="status">{{ summary() }}</span>
      }
    </div>
  `,
  styles: `
    .bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }
    .label {
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 700;
    }
    .chip {
      padding: 3px 10px;
      border: 2px solid transparent;
      border-radius: 999px;
      background: color-mix(in srgb, var(--cat, var(--soft-line)) 30%, var(--card));
      font-size: 0.82rem;
    }
    .chip:hover:not(:disabled) {
      background: color-mix(in srgb, var(--cat, var(--soft-line)) 50%, var(--card));
    }
    .chip.on {
      border-color: var(--line);
      background: var(--cat, var(--line));
      color: var(--ink-on-highlight);
    }
    .chip.all.on {
      color: var(--on-line);
    }
    .summary {
      margin-left: 4px;
      font-family: var(--hand);
      font-size: 1.1rem;
    }
  `,
})
export class FilterBar {
  readonly selected = input<string[]>([]);
  /** Conteo del periodo visible cuando hay filtro (p. ej. "12 en noviembre · 9 resaltadas"). */
  readonly summary = input('');
  readonly selectedChange = output<string[]>();

  protected readonly store = inject(PlannerStore);

  protected toggle(id: string): void {
    const current = this.selected();
    this.selectedChange.emit(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }
}
