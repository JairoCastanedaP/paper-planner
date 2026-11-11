import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MONTHS, WEEKDAY_INITIALS, WEEKDAYS, endOfMonthKey, fromKey } from '../../core/dates';
import { newId } from '../../core/ids';
import { Currency, PlannerEvent, RecurrenceType } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';
import { describeRecurrence } from '../../core/recurrence';
import { DEFAULT_REMINDER_MINUTES } from '../../core/reminders';

interface Draft {
  title: string;
  categoryId: string;
  date: string;
  time: string;
  notes: string;
  amount: number | null;
  currency: Currency;
  recurrence: RecurrenceType;
  weekdays: boolean[];
  /** Hasta cuándo se repite: nunca termina, al final del mes de inicio o en una fecha. */
  ends: 'never' | 'month' | 'date';
  until: string;
  important: boolean;
  reminderMinutes: number;
}

@Component({
  selector: 'app-event-form',
  imports: [FormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit {
  /** Actividad a editar; si no hay, se crea una nueva en `date`. */
  readonly event = input<PlannerEvent | null>(null);
  readonly date = input.required<string>();
  readonly saved = output<PlannerEvent>();
  readonly cancelled = output<void>();

  protected readonly store = inject(PlannerStore);
  protected readonly initials = WEEKDAY_INITIALS;
  protected readonly weekdayNames = WEEKDAYS;
  protected readonly reminderOptions = [
    { value: 0, label: 'En el momento' },
    { value: 15, label: '15 minutos antes' },
    { value: 60, label: '1 hora antes' },
    { value: 180, label: '3 horas antes' },
    { value: 1440, label: '1 día antes' },
  ];
  protected readonly isEdit = computed(() => this.event() !== null);
  protected draft!: Draft;

  ngOnInit(): void {
    const ev = this.event();
    const date = ev?.date ?? this.date();
    const weekdays = Array<boolean>(7).fill(false);
    if (ev?.recurrence.weekdays?.length) ev.recurrence.weekdays.forEach((d) => (weekdays[d] = true));
    else weekdays[fromKey(date).getDay()] = true;

    this.draft = {
      title: ev?.title ?? '',
      categoryId: ev?.categoryId ?? this.store.categories()[0]?.id ?? '',
      date,
      time: ev?.time ?? '',
      notes: ev?.notes ?? '',
      amount: ev?.amount ?? null,
      currency: ev?.currency ?? 'USD',
      recurrence: ev?.recurrence.type ?? 'none',
      weekdays,
      ends: !ev?.recurrence.until ? 'never' : ev.recurrence.until === endOfMonthKey(date) ? 'month' : 'date',
      until: ev?.recurrence.until ?? '',
      important: ev?.important ?? false,
      reminderMinutes: ev?.reminderMinutes ?? DEFAULT_REMINDER_MINUTES,
    };
  }

  protected onCategoryChange(): void {
    // Los cumpleaños se repiten cada año por defecto.
    if (this.draft.categoryId === 'birthday' && this.draft.recurrence === 'none') {
      this.draft.recurrence = 'yearly';
    }
  }

  /** 'noviembre': el mes en que empieza la repetición. */
  protected startMonth(): string {
    return this.draft.date ? MONTHS[fromKey(this.draft.date).getMonth()].toLowerCase() : 'el mes';
  }

  /** Fecha final según la opción de "Termina" ('' = nunca). */
  private untilKey(): string {
    const d = this.draft;
    if (d.recurrence === 'none' || !d.date) return '';
    if (d.ends === 'month') return endOfMonthKey(d.date);
    if (d.ends === 'date') return d.until;
    return '';
  }

  /** Resumen en palabras, p. ej. "Cada lun, mié, vie, hasta el 30 de noviembre de 2026". */
  protected repeatSummary(): string {
    const d = this.draft;
    if (!d.date) return '';
    return describeRecurrence({
      date: d.date,
      recurrence: {
        type: d.recurrence,
        weekdays: d.weekdays.flatMap((on, i) => (on ? [i] : [])),
        until: this.untilKey() || undefined,
      },
    } as PlannerEvent);
  }

  protected toggleWeekday(i: number): void {
    this.draft.weekdays[i] = !this.draft.weekdays[i];
  }

  protected submit(): void {
    const d = this.draft;
    const title = d.title.trim();
    if (!title || !d.date) return;

    const weekdays = d.weekdays.flatMap((on, i) => (on ? [i] : []));
    if (d.recurrence === 'weekly' && weekdays.length === 0) return;
    const until = this.untilKey();
    if (d.recurrence !== 'none' && d.ends === 'date' && (!until || until < d.date)) return;

    const prev = this.event();
    this.saved.emit({
      id: prev?.id ?? newId(),
      title,
      categoryId: d.categoryId,
      date: d.date,
      time: d.time || undefined,
      notes: d.notes.trim() || undefined,
      amount: d.amount && d.amount > 0 ? d.amount : undefined,
      currency: d.amount && d.amount > 0 ? d.currency : undefined,
      recurrence: {
        type: d.recurrence,
        weekdays: d.recurrence === 'weekly' ? weekdays : undefined,
        until: until || undefined,
      },
      important: d.important || undefined,
      reminderMinutes: d.important ? Number(d.reminderMinutes) : undefined,
      exceptions: prev?.exceptions,
    });
  }
}
