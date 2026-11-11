import { toKey } from './dates';

/** Una de las cuatro fases principales, en el día (hora local) en que ocurre. */
export interface MoonPhase {
  emoji: string;
  name: string;
  /** Momento exacto de la fase. */
  at: Date;
}

const PHASES = [
  { emoji: '🌑', name: 'Luna nueva' },
  { emoji: '🌓', name: 'Cuarto creciente' },
  { emoji: '🌕', name: 'Luna llena' },
  { emoji: '🌗', name: 'Cuarto menguante' },
];

const RAD = Math.PI / 180;
const sin = (deg: number) => Math.sin(deg * RAD);
const cos = (deg: number) => Math.cos(deg * RAD);

/**
 * Momento de una fase de la luna, según Jean Meeus, "Astronomical Algorithms" (cap. 49).
 * `k` entero = luna nueva; +0.25 cuarto creciente; +0.5 llena; +0.75 cuarto menguante.
 * Se omiten las correcciones planetarias (menos de un minuto): basta para saber el día.
 */
function phaseDate(k: number): Date {
  const T = k / 1236.85;
  let jde =
    2451550.09766 + 29.530588861 * k + 0.00015437 * T ** 2 - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;
  const M = 2.5534 + 29.1053567 * k - 0.0000014 * T ** 2 - 0.00000011 * T ** 3;
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T ** 2 + 0.00001238 * T ** 3 - 0.000000058 * T ** 4;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T ** 2 - 0.00000227 * T ** 3 + 0.000000011 * T ** 4;
  const O = 124.7746 - 1.56375588 * k + 0.0020672 * T ** 2 + 0.00000215 * T ** 3;
  const phase = Math.round((k - Math.floor(k)) * 4) % 4;

  if (phase === 0 || phase === 2) {
    const [a, b, c, d, e2, f] =
      phase === 0
        ? [-0.4072, 0.17241, 0.01608, 0.01039, 0.00739, -0.00514]
        : [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734, -0.00515];
    jde +=
      a * sin(Mp) +
      b * E * sin(M) +
      c * sin(2 * Mp) +
      d * sin(2 * F) +
      e2 * E * sin(Mp - M) +
      f * E * sin(Mp + M) +
      (phase === 0 ? 0.00208 : 0.00209) * E * E * sin(2 * M) -
      0.00111 * sin(Mp - 2 * F) -
      0.00057 * sin(Mp + 2 * F) +
      0.00056 * E * sin(2 * Mp + M) -
      0.00042 * sin(3 * Mp) +
      0.00042 * E * sin(M + 2 * F) +
      0.00038 * E * sin(M - 2 * F) -
      0.00024 * E * sin(2 * Mp - M) -
      0.00017 * sin(O);
  } else {
    jde +=
      -0.62801 * sin(Mp) +
      0.17172 * E * sin(M) -
      0.01183 * E * sin(Mp + M) +
      0.00862 * sin(2 * Mp) +
      0.00804 * sin(2 * F) +
      0.00454 * E * sin(Mp - M) +
      0.00204 * E * E * sin(2 * M) -
      0.0018 * sin(Mp - 2 * F) -
      0.0007 * sin(Mp + 2 * F) -
      0.0004 * sin(3 * Mp) -
      0.00034 * E * sin(2 * Mp - M) +
      0.00032 * E * sin(M + 2 * F) +
      0.00032 * E * sin(M - 2 * F) -
      0.00028 * E * E * sin(Mp + 2 * M) +
      0.00027 * E * sin(2 * Mp + M) -
      0.00017 * sin(O);
    const W =
      0.00306 -
      0.00038 * E * cos(M) +
      0.00026 * cos(Mp) -
      0.00002 * cos(Mp - M) +
      0.00002 * cos(Mp + M) +
      0.00002 * cos(2 * F);
    jde += phase === 1 ? W : -W;
  }

  // Día juliano → fecha (la diferencia TT−UTC, ~1 minuto, no cambia el día).
  return new Date((jde - 2440587.5) * 86400000);
}

/** Fases de la luna entre dos fechas (YYYY-MM-DD, incluidas), por día local. */
export function moonPhasesBetween(from: string, to: string): Map<string, MoonPhase> {
  const result = new Map<string, MoonPhase>();
  const start = new Date(`${from}T00:00:00`);
  const years = start.getFullYear() + (start.getMonth() * 30.6 + start.getDate()) / 365.25 - 2000;
  // Se empieza un ciclo antes para no perder fases al inicio del rango.
  let k = Math.floor(years * 12.3685) - 1;
  for (let i = 0; i < 200; i++) {
    for (let q = 0; q < 4; q++) {
      const at = phaseDate(k + q / 4);
      const key = toKey(at);
      if (key > to) return result;
      if (key >= from) result.set(key, { ...PHASES[q], at });
    }
    k++;
  }
  return result;
}
