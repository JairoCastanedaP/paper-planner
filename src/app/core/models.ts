/** Categoría de actividad: define el color del marcador y un icono opcional. */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export type RecurrenceType = 'none' | 'weekly' | 'monthly' | 'yearly';

export interface Recurrence {
  type: RecurrenceType;
  /** Solo para 'weekly': 0 = domingo … 6 = sábado. */
  weekdays?: number[];
  /** Último día (inclusive) en que se repite, formato YYYY-MM-DD. */
  until?: string;
}

export type Currency = 'USD' | 'COP';

/** Una actividad. Si se repite, `date` es el primer día de la serie. */
export interface PlannerEvent {
  id: string;
  title: string;
  categoryId: string;
  date: string;
  time?: string;
  notes?: string;
  amount?: number;
  currency?: Currency;
  recurrence: Recurrence;
  /** "Muy importante": aparece destacada y genera un recordatorio. */
  important?: boolean;
  /** Minutos de anticipación del recordatorio (0 = en el momento, 1440 = un día antes). */
  reminderMinutes?: number;
  /** Días de la serie que se eliminaron individualmente. */
  exceptions?: string[];
}

/** Una aparición concreta de una actividad en un día. */
export interface Occurrence {
  event: PlannerEvent;
  date: string;
  /** Identificador único `eventId@YYYY-MM-DD`, usado para el resaltado. */
  key: string;
  highlighted: boolean;
}

/** Objetivo del mes. Con `target` se vuelve un contador automático. */
export interface MonthGoal {
  id: string;
  /** Mes al que pertenece, formato YYYY-MM. */
  month: string;
  title: string;
  /** Meta numérica (p. ej. 25 clases). Sin ella, el objetivo es una casilla. */
  target?: number;
  /** Cuenta solo actividades resaltadas de esta categoría… */
  categoryId?: string;
  /** …cuyo título contenga este texto (sin distinguir mayúsculas). */
  match?: string;
  done: boolean;
  /** Detalle opcional: se ve al pasar el cursor por el nombre y se edita con un clic. */
  detail?: string;
}

export interface PlannerData {
  version: 1;
  categories: Category[];
  events: PlannerEvent[];
  /** Claves de ocurrencias resaltadas con el marcador. */
  highlights: Record<string, true>;
  goals: MonthGoal[];
}
