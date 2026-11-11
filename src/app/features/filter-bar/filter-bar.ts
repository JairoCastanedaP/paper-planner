import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { PlannerStore } from '../../core/planner-store';

/** Chips para ver solo las actividades de ciertas categorías. */
@Component({
  selector: 'app-filter-bar',
  template: `
    <div class="bar" #bar role="group" aria-label="Filtrar por categoría">
      <span class="label" data-fixed>Ver:</span>
      <button type="button" class="chip all" data-fixed [class.on]="!selected().length" [attr.aria-pressed]="!selected().length" (click)="selectedChange.emit([])">
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
        <span class="summary" data-last role="status">{{ summary() }}</span>
      }
    </div>
  `,
  styles: `
    .bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px;
    }
    .label {
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 700;
    }
    .chip {
      padding: 2px 8px;
      border: 2px solid transparent;
      border-radius: 999px;
      background: color-mix(in srgb, var(--cat, var(--soft-line)) 30%, var(--card));
      font-size: 0.8rem;
      line-height: 1.25;
      white-space: nowrap;
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
  private readonly bar = viewChild.required<ElementRef<HTMLDivElement>>('bar');

  constructor() {
    // Reacomoda al cambiar las categorías, el resumen o el ancho disponible.
    afterRenderEffect(() => {
      this.store.categories();
      this.summary();
      this.pack();
    });
    const observer = new ResizeObserver(() => this.pack());
    afterRenderEffect(() => {
      observer.disconnect();
      observer.observe(this.bar().nativeElement);
    });
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }

  /**
   * Acomoda las categorías por ancho para llenar cada línea antes de empezar otra
   * ("primero el que quepa", de la más ancha a la más angosta), así caben más en menos líneas.
   * "Ver:" y "Todas" van siempre de primeros y el resumen de último. Solo cambia el `order`
   * visual; el orden de lectura y del teclado sigue siendo el original.
   */
  private pack(): void {
    const bar = this.bar().nativeElement;
    const available = bar.clientWidth;
    if (!available) return;
    const gap = parseFloat(getComputedStyle(bar).columnGap) || 0;
    const children = [...bar.children] as HTMLElement[];
    const width = (el: HTMLElement) => el.getBoundingClientRect().width;

    // La primera línea empieza con "Ver:" y "Todas".
    const fixed = children.filter((el) => el.hasAttribute('data-fixed'));
    const rows: { left: number; items: HTMLElement[] }[] = [
      { left: available - fixed.reduce((sum, el) => sum + width(el) + gap, 0), items: fixed },
    ];
    const chips = children
      .filter((el) => !el.hasAttribute('data-fixed') && !el.hasAttribute('data-last'))
      .map((el) => ({ el, w: width(el) }))
      .sort((a, b) => b.w - a.w);
    for (const { el, w } of chips) {
      const row = rows.find((r) => r.left >= w);
      if (row) {
        row.left -= w + gap;
        row.items.push(el);
      } else {
        rows.push({ left: available - w - gap, items: [el] });
      }
    }
    let order = 0;
    for (const row of rows) for (const el of row.items) el.style.order = String(order++);
    for (const el of children) if (el.hasAttribute('data-last')) el.style.order = String(order++);
  }

  protected toggle(id: string): void {
    const current = this.selected();
    this.selectedChange.emit(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }
}
