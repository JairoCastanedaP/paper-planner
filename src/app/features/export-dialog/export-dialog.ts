import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MONTHS, pad } from '../../core/dates';
import { daysBetween, downloadText, toCsv, toIcs } from '../../core/export';
import { Occurrence } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';

type Format = 'ics' | 'csv';
type Range = 'month' | 'year' | 'all';

/** Exportar el calendario a Google Calendar / Outlook (.ics) o a Excel (.csv). */
@Component({
  selector: 'app-export-dialog',
  imports: [FormsModule],
  templateUrl: './export-dialog.html',
  styleUrl: './export-dialog.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' },
})
export class ExportDialog {
  /** Mes que se está viendo (YYYY-MM). */
  readonly month = input.required<string>();
  /** Categorías del filtro activo (vacío = todas). */
  readonly filter = input<string[]>([]);
  readonly closed = output<void>();

  protected readonly store = inject(PlannerStore);
  protected readonly format = signal<Format>('ics');
  protected readonly range = signal<Range>('month');
  protected readonly onlyFiltered = signal(true);

  protected readonly monthName = computed(() => {
    const [y, m] = this.month().split('-').map(Number);
    return `${MONTHS[m - 1].toLowerCase()} de ${y}`;
  });
  protected readonly yearName = computed(() => this.month().slice(0, 4));
  protected readonly filterNames = computed(() =>
    this.filter()
      .map((id) => this.store.categoryMap().get(id)?.name)
      .filter(Boolean)
      .join(', '),
  );

  /** "Todas (con repeticiones)" solo tiene sentido en el formato de calendario. */
  protected readonly effectiveRange = computed<Range>(() =>
    this.format() === 'csv' && this.range() === 'all' ? 'year' : this.range(),
  );

  private readonly categoryOk = computed(() => {
    const ids = this.onlyFiltered() ? this.filter() : [];
    return (categoryId: string) => !ids.length || ids.includes(categoryId);
  });

  private readonly occurrences = computed<Occurrence[]>(() => {
    const range = this.effectiveRange();
    if (range === 'all') return [];
    const [y, m] = this.month().split('-').map(Number);
    const from = range === 'month' ? `${y}-${pad(m)}-01` : `${y}-01-01`;
    const to = range === 'month' ? `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}` : `${y}-12-31`;
    const ok = this.categoryOk();
    return daysBetween(from, to).flatMap((date) => this.store.occurrencesOn(date).filter((o) => ok(o.event.categoryId)));
  });

  private readonly series = computed(() => {
    const ok = this.categoryOk();
    return this.store.events().filter((ev) => ok(ev.categoryId));
  });

  protected readonly count = computed(() =>
    this.effectiveRange() === 'all' ? this.series().length : this.occurrences().length,
  );

  protected setFormat(f: Format): void {
    this.format.set(f);
    if (f === 'csv' && this.range() === 'all') this.range.set('year');
  }

  protected exportFile(): void {
    const range = this.effectiveRange();
    const categories = this.store.categoryMap();
    const suffix = range === 'month' ? this.month() : range === 'year' ? this.yearName() : 'todo';
    const name = `paper-planner-${suffix}`;
    if (this.format() === 'csv') {
      downloadText(toCsv(this.occurrences(), categories), `${name}.csv`, 'text/csv;charset=utf-8');
    } else {
      const source = range === 'all' ? { series: this.series() } : { occurrences: this.occurrences() };
      downloadText(toIcs(source, categories), `${name}.ics`, 'text/calendar;charset=utf-8');
    }
    this.closed.emit();
  }
}
