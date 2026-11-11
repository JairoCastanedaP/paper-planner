import type { MonthAmbience } from './themes';

/**
 * Tema "Colombiano": cada mes se ambienta con una fiesta o tradición del país.
 * Solo cambian el color de acento, el color de domingos y festivos, y la nota del mes.
 * Índice 0 = enero.
 */
export const COLOMBIAN_MONTHS: MonthAmbience[] = [
  {
    emoji: '🎭',
    name: 'Carnaval de Negros y Blancos',
    note: 'Carnaval de Negros y Blancos: Pasto se llena de color para empezar el año.',
    tokens: { '--red': '#3a3a3a', '--red-hover': '#1f1f1f', '--sunday': '#ececec' },
  },
  {
    emoji: '🎉',
    name: 'Carnaval de Barranquilla',
    note: 'Carnaval de Barranquilla: ¡quien lo vive es quien lo goza!',
    tokens: { '--red': '#d1006f', '--red-hover': '#a8005a', '--sunday': '#ffe0f0' },
  },
  {
    emoji: '☕',
    name: 'Café colombiano',
    note: 'Paisaje Cultural Cafetero: montañas, tradición y un buen tinto.',
    tokens: { '--red': '#6f4e37', '--red-hover': '#563c2a', '--sunday': '#f1e4d4' },
  },
  {
    emoji: '🪗',
    name: 'Festival Vallenato',
    note: 'Festival de la Leyenda Vallenata: Valledupar suena a acordeón, caja y guacharaca.',
    tokens: { '--red': '#0f7b5f', '--red-hover': '#0b5f49', '--sunday': '#dcf1e8' },
  },
  {
    emoji: '💐',
    name: 'Mes de las madres',
    note: 'Mes de las madres: un abrazo grande para quienes nos lo dieron todo.',
    tokens: { '--red': '#c2185b', '--red-hover': '#9c1149', '--sunday': '#fde2ec' },
  },
  {
    emoji: '🎶',
    name: 'Fiestas de San Pedro',
    note: 'Fiestas de San Juan y San Pedro: sanjuanero y bambuco en el Huila y el Tolima.',
    tokens: { '--red': '#2e7d32', '--red-hover': '#225e25', '--sunday': '#e2f1da' },
  },
  {
    emoji: '🇨🇴',
    name: 'Independencia',
    note: '20 de julio: celebramos el grito de independencia de Colombia.',
    tokens: { '--red': '#ce1126', '--red-hover': '#a50d1e', '--sunday': '#fff1a8' },
  },
  {
    emoji: '🌸',
    name: 'Feria de las Flores',
    note: 'Feria de las Flores en Medellín, cometas al viento y el 7 de agosto, la Batalla de Boyacá.',
    tokens: { '--red': '#e65100', '--red-hover': '#bf4300', '--sunday': '#ffe6cc' },
  },
  {
    emoji: '💛',
    name: 'Amor y Amistad',
    note: 'Amor y Amistad: mes para celebrar a la familia, la pareja y los amigos.',
    tokens: { '--red': '#d00000', '--red-hover': '#a80000', '--sunday': '#ffe0e0' },
  },
  {
    emoji: '🎃',
    name: 'Mes de los niños',
    note: 'Octubre de disfraces: el 31 los niños salen a pedir dulces.',
    tokens: { '--red': '#ef6c00', '--red-hover': '#c55900', '--sunday': '#ffe3c4' },
  },
  {
    emoji: '⛵',
    name: 'Independencia de Cartagena',
    note: 'Cartagena celebra su independencia el 11 de noviembre con fiestas y desfiles.',
    tokens: { '--red': '#00838f', '--red-hover': '#006770', '--sunday': '#d6eff1' },
  },
  {
    emoji: '🎄',
    name: 'Navidad',
    note: 'Navidad: mes para compartir con nuestros seres queridos.',
    tokens: { '--red': '#b71c1c', '--red-hover': '#931616', '--sunday': '#e1f0dc' },
  },
];
