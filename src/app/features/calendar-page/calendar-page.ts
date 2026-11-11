import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { hasCurrentConsent } from '../../core/account';
import { AuthService } from '../../core/auth';
import { MONTHS, WEEKDAYS, fromKey, monthGrid, monthKeyOf, toKey, todayKey } from '../../core/dates';
import { Occurrence } from '../../core/models';
import { PlannerStore, goalProgress } from '../../core/planner-store';
import { PreferencesService } from '../../core/preferences';
import { ThemeService } from '../../core/themes';
import { quoteOfMonth } from '../../core/quotes';
import { ReminderService } from '../../core/reminders';
import { TourService } from '../../core/tour';
import { AccountDialog } from '../account-dialog/account-dialog';
import { CategoryManager } from '../category-manager/category-manager';
import { ConsentDialog } from '../consent-dialog/consent-dialog';
import { DayPanel } from '../day-panel/day-panel';
import { DayView } from '../day-view/day-view';
import { FilterBar } from '../filter-bar/filter-bar';
import { MonthGoals } from '../month-goals/month-goals';
import { HighlightChange, MonthGrid } from '../month-grid/month-grid';
import { ReminderModal } from '../reminder-modal/reminder-modal';
import { SearchPanel } from '../search-panel/search-panel';
import { ThemePicker } from '../theme-picker/theme-picker';
import { TourOverlay } from '../tour-overlay/tour-overlay';
import { UndoToast } from '../undo-toast/undo-toast';
import { YearView } from '../year-view/year-view';

type View = 'month' | 'year' | 'day';

@Component({
  selector: 'app-calendar-page',
  imports: [
    MonthGrid,
    MonthGoals,
    DayPanel,
    DayView,
    YearView,
    FilterBar,
    ThemePicker,
    ReminderModal,
    CategoryManager,
    SearchPanel,
    UndoToast,
    TourOverlay,
    AccountDialog,
    ConsentDialog,
  ],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.scss',
  host: {
    '(document:keydown.arrowleft)': 'onArrow($event, -1)',
    '(document:keydown.arrowright)': 'onArrow($event, 1)',
    '(document:keydown)': 'onShortcut($event)',
    '(window:scroll)': 'onScroll()',
    '(document:click)': 'menuOpen.set(false)',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class CalendarPage {
  protected readonly store = inject(PlannerStore);
  private readonly router = inject(Router);
  private readonly reminders = inject(ReminderService);
  protected readonly tour = inject(TourService);
  protected readonly auth = inject(AuthService);
  private readonly stickyHeader = viewChild.required<ElementRef<HTMLElement>>('sticky');

  protected readonly view = signal<View>('month');
  protected readonly today = signal(todayKey());
  protected readonly year = signal(new Date().getFullYear());
  protected readonly month = signal(new Date().getMonth());
  /** Día de la vista de día. */
  protected readonly day = signal(todayKey());
  protected readonly selectedDate = signal<string | null>(null);
  protected readonly themesOpen = signal(false);
  protected readonly accountOpen = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly prefs = inject(PreferencesService);
  /** Cuántos elementos lleva cada guirnalda lateral, según su tipo (tema Colombiano). */
  protected readonly bulbSlots = Array.from({ length: 22 });
  protected readonly flagSlots = Array.from({ length: 18 });
  protected readonly itemSlots = Array.from({ length: 14 });
  /** Para la ambientación por mes de temas como "Colombiano". */
  protected readonly theme = inject(ThemeService);
  /** La cuenta aún no aceptó la versión vigente de la política y los términos. */
  protected readonly needsConsent = signal(false);
  protected readonly categoriesOpen = signal(false);
  protected readonly searchOpen = signal(false);
  /** Categorías filtradas (vacío = todas). */
  protected readonly filter = signal<string[]>([]);
  /** Al bajar, el encabezado se compacta y queda fijo arriba. */
  protected readonly compact = signal(false);

  protected readonly monthKey = computed(() => monthKeyOf(this.year(), this.month()));

  protected readonly kicker = computed(() => {
    switch (this.view()) {
      case 'month':
        return `Paper Planner ${this.year()}`;
      case 'year':
        return 'Paper Planner · Vista anual';
      case 'day': {
        const d = fromKey(this.day());
        return `${MONTHS[d.getMonth()]} ${d.getFullYear()} · Vista del día`;
      }
    }
  });

  /** Textos más largos posibles de cada vista: reservan el ancho del título. */
  protected readonly longest = computed(() => {
    switch (this.view()) {
      case 'month':
        return { kicker: `Paper Planner ${this.year()}`, title: 'Septiembre' };
      case 'year':
        return { kicker: 'Paper Planner · Vista anual', title: String(this.year()) };
      case 'day':
        return { kicker: `Septiembre ${fromKey(this.day()).getFullYear()} · Vista del día`, title: 'Miércoles 30' };
    }
  });

  protected readonly title = computed(() => {
    switch (this.view()) {
      case 'month':
        return MONTHS[this.month()];
      case 'year':
        return String(this.year());
      case 'day': {
        const d = fromKey(this.day());
        return `${WEEKDAYS[d.getDay()]} ${d.getDate()}`;
      }
    }
  });

  protected readonly periodName = computed(() =>
    ({ month: 'mes', year: 'año', day: 'día' })[this.view()],
  );

  protected readonly weeks = computed(() => monthGrid(this.year(), this.month()));

  private readonly occurrencesByDay = computed(() => {
    const map = new Map<string, Occurrence[]>();
    for (const week of this.weeks()) {
      for (const day of week) map.set(day, this.store.occurrencesOn(day));
    }
    return map;
  });

  private readonly passesFilter = computed(() => {
    const filter = this.filter();
    return (o: Occurrence) => !filter.length || filter.includes(o.event.categoryId);
  });

  /** Lo que se ve en el mes, con el filtro aplicado. */
  protected readonly visibleByDay = computed(() => {
    const pass = this.passesFilter();
    const map = new Map<string, Occurrence[]>();
    for (const [day, occurrences] of this.occurrencesByDay()) map.set(day, occurrences.filter(pass));
    return map;
  });

  /** Solo los días del mes visible (sin filtro), para metas y totales. */
  protected readonly monthOccurrences = computed(() =>
    [...this.occurrencesByDay()]
      .filter(([day]) => day.startsWith(this.monthKey()))
      .flatMap(([, occurrences]) => occurrences),
  );

  /** Con filtro: cuántas actividades hay en el periodo visible y cuántas se resaltaron. */
  protected readonly filterSummary = computed(() => {
    if (!this.filter().length) return '';
    const pass = this.passesFilter();
    let found: Occurrence[];
    let where: string;
    switch (this.view()) {
      case 'month':
        found = this.monthOccurrences().filter(pass);
        where = `en ${MONTHS[this.month()].toLowerCase()}`;
        break;
      case 'day':
        found = this.store.occurrencesOn(this.day()).filter(pass);
        where = 'este día';
        break;
      case 'year': {
        found = [];
        const year = this.year();
        for (let d = new Date(year, 0, 1); d.getFullYear() === year; d.setDate(d.getDate() + 1)) {
          found.push(...this.store.occurrencesOn(toKey(d)).filter(pass));
        }
        where = `en ${year}`;
        break;
      }
    }
    const done = found.filter((o) => o.highlighted).length;
    return `${found.length} ${found.length === 1 ? 'actividad' : 'actividades'} ${where} · ${done} resaltadas`;
  });

  constructor() {
    const user = this.auth.user();
    if (user && !user.guest) {
      // Sin conexión no se puede comprobar: se vuelve a revisar en la próxima visita.
      hasCurrentConsent(user.uid)
        .then((ok) => this.needsConsent.set(!ok))
        .catch((e) => console.warn('No se pudo revisar la autorización', e));
    }
    const destroyRef = inject(DestroyRef);
    // Temas con ambientación por mes: se aplica la del mes que se está viendo (no en la vista anual).
    effect(() => {
      const view = this.view();
      const month = view === 'month' ? this.month() : view === 'day' ? fromKey(this.day()).getMonth() : null;
      this.theme.ambienceMonth.set(month);
    });
    destroyRef.onDestroy(() => this.theme.ambienceMonth.set(null));
    // La altura del encabezado fijo la usa la fila de días de la semana para quedar justo debajo.
    afterNextRender(() => {
      const el = this.stickyHeader().nativeElement;
      const observer = new ResizeObserver(() =>
        document.documentElement.style.setProperty('--sticky-h', `${el.offsetHeight}px`),
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
      this.tour.startIfFirstTime();
    });
  }

  /** Objetivos del mes en una línea, para el encabezado compacto. */
  protected readonly goalStrip = computed(() => {
    const month = this.monthKey();
    const occurrences = this.monthOccurrences();
    return this.store
      .goals()
      .filter((g) => g.month === month)
      .map((g) => ({
        id: g.id,
        title: g.title,
        done: g.done,
        count: g.target ? `${goalProgress(g, occurrences)}/${g.target}` : '',
      }));
  });

  /** Frase del mes que se está viendo (en la vista de día, la del mes de ese día). */
  protected readonly quote = computed(() => {
    const d = this.view() === 'day' ? fromKey(this.day()) : new Date(this.year(), this.month(), 1);
    return quoteOfMonth(d.getFullYear(), d.getMonth());
  });

  protected toggleMenu(e: Event): void {
    // Sin esto, el clic llegaría al documento y cerraría el menú de inmediato.
    e.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  protected onScroll(): void {
    this.compact.set(window.scrollY > 60);
  }

  protected setView(view: View): void {
    if (view === 'day' && this.view() !== 'day') {
      // Al entrar a la vista de día: hoy si está en el mes visible, si no el día 1.
      const today = todayKey();
      this.day.set(today.startsWith(this.monthKey()) ? today : `${this.monthKey()}-01`);
    }
    this.view.set(view);
  }

  protected move(delta: number): void {
    switch (this.view()) {
      case 'year':
        this.year.update((y) => y + delta);
        return;
      case 'day': {
        const d = fromKey(this.day());
        this.openDayView(toKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta)));
        return;
      }
      case 'month': {
        const d = new Date(this.year(), this.month() + delta, 1);
        this.year.set(d.getFullYear());
        this.month.set(d.getMonth());
      }
    }
  }

  protected goToday(): void {
    const now = new Date();
    this.today.set(todayKey());
    this.year.set(now.getFullYear());
    this.month.set(now.getMonth());
    this.day.set(todayKey());
  }

  /** Vista de día en esa fecha (y el mes y el año siguen al día). */
  protected openDayView(date: string): void {
    const d = fromKey(date);
    this.selectedDate.set(null);
    this.day.set(date);
    this.year.set(d.getFullYear());
    this.month.set(d.getMonth());
    this.view.set('day');
  }

  /** Desde la búsqueda: ir al mes de ese día y abrir su detalle. */
  protected openDayFromSearch(date: string): void {
    this.searchOpen.set(false);
    this.goToMonth(date.slice(0, 7));
    this.selectedDate.set(date);
  }

  protected goToMonth(monthKey: string): void {
    const [y, m] = monthKey.split('-').map(Number);
    this.searchOpen.set(false);
    this.year.set(y);
    this.month.set(m - 1);
    this.view.set('month');
  }

  protected openMonth(index: number): void {
    this.month.set(index);
    this.view.set('month');
  }

  protected startTour(): void {
    this.selectedDate.set(null);
    this.view.set('month');
    window.scrollTo({ top: 0 });
    this.tour.start();
  }

  protected onHighlight(change: HighlightChange): void {
    this.store.setHighlighted(change.key, change.on);
  }

  protected async logout(): Promise<void> {
    await this.store.flush();
    await this.auth.logout();
    // Al cerrar sesión se vuelve a la pantalla de bienvenida.
    this.router.navigate(['/']);
  }

  /** "/" o Ctrl+K abren el buscador. */
  protected onShortcut(e: KeyboardEvent): void {
    if (isTyping(e) || this.tour.step()) return;
    if (e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      this.searchOpen.set(true);
    }
  }

  protected onArrow(e: Event, delta: number): void {
    const overlayOpen =
      this.selectedDate() ||
      this.themesOpen() ||
      this.accountOpen() ||
      this.needsConsent() ||
      this.categoriesOpen() ||
      this.searchOpen() ||
      this.tour.step() ||
      this.reminders.due().length;
    if (!isTyping(e) && !overlayOpen) this.move(delta);
  }
}

/** ¿El usuario está escribiendo en un campo? (Entonces los atajos de teclado no aplican.) */
function isTyping(e: Event): boolean {
  return e.target instanceof Element && !!e.target.closest('input, textarea, select, [contenteditable]');
}
