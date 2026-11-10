import { Component, computed, inject, input, output, signal } from '@angular/core';
import { formatLong } from '../../core/dates';
import { holidayOn } from '../../core/holidays';
import { Occurrence, PlannerEvent } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';
import { describeRecurrence } from '../../core/recurrence';
import { EventChip } from '../event-chip/event-chip';
import { EventForm } from '../event-form/event-form';

type Mode = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; event: PlannerEvent };

/** Panel con el detalle completo de un día: notas sin límite de espacio. */
@Component({
  selector: 'app-day-panel',
  imports: [EventChip, EventForm],
  templateUrl: './day-panel.html',
  styleUrl: './day-panel.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' },
})
export class DayPanel {
  readonly date = input.required<string>();
  readonly closed = output<void>();

  private readonly store = inject(PlannerStore);

  protected readonly title = computed(() => formatLong(this.date()));
  protected readonly holiday = computed(() => holidayOn(this.date()));
  protected readonly occurrences = computed(() => this.store.occurrencesOn(this.date()));
  protected readonly mode = signal<Mode>({ kind: 'list' });
  /** Ocurrencia cuyo borrado espera confirmación (series repetidas). */
  protected readonly confirmingDelete = signal<string | null>(null);

  protected readonly describe = describeRecurrence;

  protected setHighlight(o: Occurrence, on: boolean): void {
    this.store.setHighlighted(o.key, on);
  }

  protected save(ev: PlannerEvent): void {
    this.store.saveEvent(ev);
    this.mode.set({ kind: 'list' });
  }

  protected askDelete(o: Occurrence): void {
    if (o.event.recurrence.type === 'none') {
      // Sin confirmación: el aviso inferior permite deshacer.
      this.store.deleteEvent(o.event.id);
    } else {
      this.confirmingDelete.set(o.key);
    }
  }

  protected deleteOne(o: Occurrence): void {
    this.store.skipOccurrence(o.event.id, o.date);
    this.confirmingDelete.set(null);
  }

  protected deleteSeries(o: Occurrence): void {
    this.store.deleteEvent(o.event.id);
    this.confirmingDelete.set(null);
  }
}
