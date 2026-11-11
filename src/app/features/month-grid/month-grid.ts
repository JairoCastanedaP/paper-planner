import { Component, computed, inject, input, output } from '@angular/core';
import { Commemoration } from '../../core/commemorations';
import { WEEKDAYS } from '../../core/dates';
import { holidayOn } from '../../core/holidays';
import { Occurrence } from '../../core/models';
import { MoonPhase, moonPhasesBetween } from '../../core/moon';
import { PlannerStore } from '../../core/planner-store';
import { PreferencesService } from '../../core/preferences';
import { ScreenService } from '../../core/screen';
import { EventChip } from '../event-chip/event-chip';

/** Cómo se reparten las actividades de un día: junto al número y debajo. */
interface DayLayout {
  beside: Occurrence[];
  below: Occurrence[];
  hidden: number;
}

/** Desde cuántas actividades se aprovecha el espacio junto al número. */
const BESIDE_FROM = 1;
/** Cuántas caben junto al número (apiladas a la altura del número). */
const BESIDE_MAX = 2;

export interface HighlightChange {
  key: string;
  on: boolean;
}

@Component({
  selector: 'app-month-grid',
  imports: [EventChip],
  templateUrl: './month-grid.html',
  styleUrl: './month-grid.scss',
})
export class MonthGrid {
  readonly weeks = input.required<string[][]>();
  readonly month = input.required<string>();
  readonly today = input.required<string>();
  readonly occurrencesByDay = input.required<Map<string, Occurrence[]>>();

  readonly daySelected = output<string>();
  readonly highlightChange = output<HighlightChange>();

  protected readonly store = inject(PlannerStore);
  protected readonly weekdays = WEEKDAYS;
  protected readonly holidayOn = holidayOn;
  protected readonly maxVisible = 4;
  private readonly prefs = inject(PreferencesService);
  private readonly screen = inject(ScreenService);
  /** En computador los días son más altos: caben más actividades antes de "+n más". */
  private readonly desktopVisible = 5;

  /** Fases de la luna de las semanas visibles (solo si están activadas en el menú). */
  protected readonly moons = computed(() => {
    if (!this.prefs.showMoon()) return null;
    const weeks = this.weeks();
    const last = weeks.at(-1);
    return weeks.length && last ? moonPhasesBetween(weeks[0][0], last[last.length - 1]) : null;
  });

  protected moonLabel(phase: MoonPhase): string {
    return `${phase.name} · ${phase.at.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}`;
  }

  /**
   * Desde la primera actividad, las primeras (las ⭐ importantes antes) van a la derecha
   * del número, que si no queda vacío; así cada día ocupa menos alto. Con festivo no,
   * porque ese espacio lo usa el nombre del festivo.
   * En computador (pantalla grande) se mantiene el acomodo clásico: todas debajo del número.
   */
  protected layout(occurrences: Occurrence[], holiday: string | undefined): DayLayout {
    if (this.screen.isDesktop()) {
      const below = occurrences.slice(0, this.desktopVisible);
      return { beside: [], below, hidden: occurrences.length - below.length };
    }
    if (occurrences.length < BESIDE_FROM || holiday) {
      const below = occurrences.slice(0, this.maxVisible);
      return { beside: [], below, hidden: occurrences.length - below.length };
    }
    const ranked = [...occurrences].sort((a, b) => Number(!!b.event.important) - Number(!!a.event.important));
    const beside = ranked.slice(0, BESIDE_MAX);
    const rest = occurrences.filter((o) => !beside.includes(o));
    const below = rest.slice(0, this.maxVisible - 1);
    return { beside, below, hidden: rest.length - below.length };
  }

  protected dayNumber(date: string): number {
    return Number(date.slice(8));
  }

  protected namesOf(list: Commemoration[]): string {
    return list.map((c) => `${c.emoji} ${c.name}`).join(' · ');
  }

  protected inMonth(date: string): boolean {
    return date.startsWith(this.month());
  }
}
