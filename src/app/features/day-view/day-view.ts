import { Component, computed, inject, input, output } from '@angular/core';
import { pad } from '../../core/dates';
import { holidayOn } from '../../core/holidays';
import { moonPhasesBetween } from '../../core/moon';
import { PreferencesService } from '../../core/preferences';
import { Occurrence } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';
import { DayDetail } from '../day-detail/day-detail';
import { EventChip } from '../event-chip/event-chip';
import { HighlightChange } from '../month-grid/month-grid';

interface HourRow {
  hour: number;
  label: string;
  items: Occurrence[];
  isNow: boolean;
}

/** Vista de un día: portada con imagen, agenda por horas y el detalle completo. */
@Component({
  selector: 'app-day-view',
  imports: [DayDetail, EventChip],
  templateUrl: './day-view.html',
  styleUrl: './day-view.scss',
})
export class DayView {
  readonly date = input.required<string>();
  readonly today = input.required<string>();
  /** Filtro de categorías activo (vacío = todas). */
  readonly filter = input<string[]>([]);
  readonly highlightChange = output<HighlightChange>();

  private readonly store = inject(PlannerStore);

  protected readonly holiday = computed(() => holidayOn(this.date()));
  protected readonly commemorations = computed(() => this.store.commemorationsOn(this.date()));
  private readonly prefs = inject(PreferencesService);
  /** Fase de la luna de ese día (si está activada en el menú). */
  protected readonly moon = computed(() =>
    this.prefs.showMoon() ? moonPhasesBetween(this.date(), this.date()).get(this.date()) : undefined,
  );
  protected readonly image = computed(() => this.store.dayImage(this.date()));

  private readonly occurrences = computed(() => {
    const filter = this.filter();
    return this.store
      .occurrencesOn(this.date())
      .filter((o) => !filter.length || filter.includes(o.event.categoryId));
  });

  protected readonly allDay = computed(() => this.occurrences().filter((o) => !o.event.time));

  /** Horas de 6 a 22 (o más, si hay actividades fuera de ese rango). */
  protected readonly hours = computed<HourRow[]>(() => {
    const timed = this.occurrences().filter((o) => o.event.time);
    const hourOf = (o: Occurrence) => Number(o.event.time!.slice(0, 2));
    const first = Math.min(6, ...timed.map(hourOf));
    const last = Math.max(22, ...timed.map(hourOf));
    const now = new Date();
    const isToday = this.date() === this.today();

    const rows: HourRow[] = [];
    for (let hour = first; hour <= last; hour++) {
      const suffix = hour >= 12 ? 'pm' : 'am';
      rows.push({
        hour,
        label: `${hour % 12 === 0 ? 12 : hour % 12}${suffix}`,
        items: timed.filter((o) => hourOf(o) === hour),
        isNow: isToday && now.getHours() === hour,
      });
    }
    return rows;
  });

  protected readonly isToday = computed(() => this.date() === this.today());

  protected timeOf(o: Occurrence): string {
    const [h, m] = o.event.time!.split(':').map(Number);
    return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)}`;
  }
}
