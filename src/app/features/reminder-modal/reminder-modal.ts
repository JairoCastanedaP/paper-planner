import { Component, inject } from '@angular/core';
import { formatLong, formatTime, todayKey } from '../../core/dates';
import { PlannerStore } from '../../core/planner-store';
import { Reminder, ReminderService } from '../../core/reminders';

/** Ventana de aviso para las actividades "muy importantes" que se acercan. */
@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.html',
  styleUrl: './reminder-modal.scss',
})
export class ReminderModal {
  protected readonly reminders = inject(ReminderService);
  private readonly store = inject(PlannerStore);

  protected color(r: Reminder): string {
    return this.store.categoryMap().get(r.occurrence.event.categoryId)?.color ?? 'var(--red)';
  }

  protected when(r: Reminder): string {
    const { date, event } = r.occurrence;
    const day = date === todayKey() ? 'Hoy' : formatLong(date).split(' de 20')[0];
    if (r.allDay) return `${day} · todo el día`;
    const minutes = Math.round((r.startsAt - Date.now()) / 60_000);
    const relative =
      minutes > 0 ? (minutes < 60 ? `en ${minutes} min` : `en ${Math.round(minutes / 60)} h`) : 'ya empezó';
    return `${day} · ${formatTime(event.time)} (${relative})`;
  }
}
