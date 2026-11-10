import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MONTHS, formatLong, formatTime, toKey, todayKey } from '../../core/dates';
import { MonthGoal, Occurrence, PlannerEvent } from '../../core/models';
import { PlannerStore } from '../../core/planner-store';
import { occurrenceKey, occursOn } from '../../core/recurrence';

/** Días hacia atrás y hacia adelante en los que se buscan repeticiones. */
const RANGE_DAYS = 400;
const MAX_PER_GROUP = 20;

/** Minúsculas y sin tildes, para que "jénkins" encuentre "Jenkins". */
const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

interface GoalResult {
  goal: MonthGoal;
  monthLabel: string;
}

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.html',
  styleUrl: './search-panel.scss',
  host: { '(document:keydown.escape)': 'closed.emit()' },
})
export class SearchPanel {
  readonly closed = output<void>();
  readonly daySelected = output<string>();
  readonly monthSelected = output<string>();

  private readonly store = inject(PlannerStore);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('queryInput');

  protected readonly query = signal('');
  private readonly needle = computed(() => normalize(this.query().trim()));
  protected readonly active = computed(() => this.needle().length >= 2);

  private readonly matchingEvents = computed<PlannerEvent[]>(() => {
    if (!this.active()) return [];
    const needle = this.needle();
    const categories = this.store.categoryMap();
    return this.store.events().filter((ev) =>
      [ev.title, ev.notes ?? '', categories.get(ev.categoryId)?.name ?? ''].some((text) =>
        normalize(text).includes(needle),
      ),
    );
  });

  /** Todas las apariciones de las actividades encontradas, de la más antigua a la más nueva. */
  private readonly occurrences = computed<Occurrence[]>(() => {
    const events = this.matchingEvents();
    if (!events.length) return [];
    const result: Occurrence[] = [];
    const now = new Date();
    for (let offset = -RANGE_DAYS; offset <= RANGE_DAYS; offset++) {
      const date = toKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset));
      for (const event of events) {
        if (!occursOn(event, date)) continue;
        const key = occurrenceKey(event.id, date);
        result.push({ event, date, key, highlighted: this.store.isHighlighted(key) });
      }
    }
    return result;
  });

  protected readonly past = computed(() => {
    const today = todayKey();
    return this.occurrences()
      .filter((o) => o.date < today)
      .reverse()
      .slice(0, MAX_PER_GROUP);
  });

  protected readonly upcoming = computed(() => {
    const today = todayKey();
    return this.occurrences()
      .filter((o) => o.date >= today)
      .slice(0, MAX_PER_GROUP);
  });

  protected readonly goals = computed<GoalResult[]>(() => {
    if (!this.active()) return [];
    const needle = this.needle();
    return this.store
      .goals()
      .filter((g) => normalize(`${g.title} ${g.detail ?? ''}`).includes(needle))
      .sort((a, b) => b.month.localeCompare(a.month))
      .map((goal) => {
        const [y, m] = goal.month.split('-').map(Number);
        return { goal, monthLabel: `${MONTHS[m - 1]} ${y}` };
      });
  });

  protected readonly empty = computed(
    () => this.active() && !this.past().length && !this.upcoming().length && !this.goals().length,
  );

  constructor() {
    afterNextRender(() => this.input().nativeElement.focus());
  }

  protected color(o: Occurrence): string {
    return this.store.categoryMap().get(o.event.categoryId)?.color ?? '#bbb';
  }

  protected icon(o: Occurrence): string {
    return this.store.categoryMap().get(o.event.categoryId)?.icon ?? '';
  }

  protected when(o: Occurrence): string {
    const time = formatTime(o.event.time);
    return formatLong(o.date) + (time ? ` · ${time}` : '');
  }

  protected openDay(date: string): void {
    this.daySelected.emit(date);
  }
}
