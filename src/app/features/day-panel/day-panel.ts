import { Component, computed, inject, input, output } from '@angular/core';
import { formatLong } from '../../core/dates';
import { holidayOn } from '../../core/holidays';
import { PlannerStore } from '../../core/planner-store';
import { DayDetail } from '../day-detail/day-detail';

/** Panel lateral con el detalle de un día: notas sin límite de espacio. */
@Component({
  selector: 'app-day-panel',
  imports: [DayDetail],
  templateUrl: './day-panel.html',
  styleUrl: './day-panel.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' },
})
export class DayPanel {
  readonly date = input.required<string>();
  readonly closed = output<void>();
  /** Abrir la vista completa del día. */
  readonly expanded = output<string>();

  private readonly store = inject(PlannerStore);

  protected readonly title = computed(() => formatLong(this.date()));
  protected readonly holiday = computed(() => holidayOn(this.date()));
  protected readonly commemorations = computed(() => this.store.commemorationsOn(this.date()));
  protected readonly image = computed(() => this.store.dayImage(this.date()));
}
