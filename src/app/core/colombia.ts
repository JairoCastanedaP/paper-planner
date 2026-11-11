import type { MonthAmbience } from './themes';

/**
 * Tema "Colombiano": cada mes se ambienta con una fiesta o tradición del país.
 * Cambian el color de acento, el de domingos y festivos, la nota del mes y los adornos de
 * los márgenes laterales (estos solo en computador).
 * Índice 0 = enero.
 */
export const COLOMBIAN_MONTHS: MonthAmbience[] = [
  {
    emoji: '🎭',
    name: 'Carnaval de Negros y Blancos',
    note: 'Carnaval de Negros y Blancos: Pasto se llena de color para empezar el año.',
    tokens: { '--red': '#3a3a3a', '--red-hover': '#1f1f1f', '--sunday': '#ececec' },
    decor: {
      top: ['🎭', '🎭'],
      bottom: ['🎊', '🎉'],
      garland: { kind: 'flags', colors: ['#1d1d1d', '#ffffff', '#9e9e9e'] },
    },
  },
  {
    emoji: '🎉',
    name: 'Carnaval de Barranquilla',
    note: 'Carnaval de Barranquilla: ¡quien lo vive es quien lo goza!',
    tokens: { '--red': '#d1006f', '--red-hover': '#a8005a', '--sunday': '#ffe0f0' },
    decor: {
      top: ['🎭', '🎉'],
      bottom: ['💃', '🥁'],
      garland: { kind: 'flags', colors: ['#e6007e', '#ffd400', '#00a651', '#0072bc', '#ff6a00'] },
    },
  },
  {
    emoji: '☕',
    name: 'Café colombiano',
    note: 'Paisaje Cultural Cafetero: montañas, tradición y un buen tinto.',
    tokens: { '--red': '#6f4e37', '--red-hover': '#563c2a', '--sunday': '#f1e4d4' },
    decor: {
      top: ['⛰️', '☀️'],
      bottom: ['🌱', '☕'],
      garland: { kind: 'items', items: ['☕', '🌿'] },
    },
  },
  {
    emoji: '🪗',
    name: 'Festival Vallenato',
    note: 'Festival de la Leyenda Vallenata: Valledupar suena a acordeón, caja y guacharaca.',
    tokens: { '--red': '#0f7b5f', '--red-hover': '#0b5f49', '--sunday': '#dcf1e8' },
    decor: {
      top: ['🪗', '🪗'],
      bottom: ['🥁', '🎤'],
      garland: { kind: 'items', items: ['🎵', '🎶'] },
    },
  },
  {
    emoji: '💐',
    name: 'Mes de las madres',
    note: 'Mes de las madres: un abrazo grande para quienes nos lo dieron todo.',
    tokens: { '--red': '#c2185b', '--red-hover': '#9c1149', '--sunday': '#fde2ec' },
    decor: {
      top: ['💐', '💖'],
      bottom: ['🌷', '🎁'],
      garland: { kind: 'items', items: ['🌸', '🌷', '💗'] },
    },
  },
  {
    emoji: '🎶',
    name: 'Fiestas de San Pedro',
    note: 'Fiestas de San Juan y San Pedro: sanjuanero y bambuco en el Huila y el Tolima.',
    tokens: { '--red': '#2e7d32', '--red-hover': '#225e25', '--sunday': '#e2f1da' },
    decor: {
      top: ['🎶', '🎻'],
      bottom: ['💃', '🕺'],
      garland: { kind: 'flags', colors: ['#2e7d32', '#ffffff', '#fbc02d'] },
    },
  },
  {
    emoji: '🇨🇴',
    name: 'Independencia',
    note: '20 de julio: celebramos el grito de independencia de Colombia.',
    tokens: { '--red': '#ce1126', '--red-hover': '#a50d1e', '--sunday': '#fff1a8' },
    decor: {
      top: ['🇨🇴', '🇨🇴'],
      bottom: ['🎆', '🎉'],
      garland: { kind: 'flags', colors: ['#fcd116', '#003893', '#ce1126'] },
    },
  },
  {
    emoji: '🌸',
    name: 'Feria de las Flores',
    note: 'Feria de las Flores en Medellín, cometas al viento y el 7 de agosto, la Batalla de Boyacá.',
    tokens: { '--red': '#e65100', '--red-hover': '#bf4300', '--sunday': '#ffe6cc' },
    decor: {
      top: ['🪁', '🪁'],
      bottom: ['💐', '🌻'],
      garland: { kind: 'items', items: ['🌸', '🌼', '🌺'] },
    },
  },
  {
    emoji: '💛',
    name: 'Amor y Amistad',
    note: 'Amor y Amistad: mes para celebrar a la familia, la pareja y los amigos.',
    tokens: { '--red': '#d00000', '--red-hover': '#a80000', '--sunday': '#ffe0e0' },
    decor: {
      top: ['💌', '🎁'],
      bottom: ['🤗', '💐'],
      garland: { kind: 'items', items: ['💛', '❤️', '💕'] },
    },
  },
  {
    emoji: '🎃',
    name: 'Mes de los niños',
    note: 'Octubre de disfraces: el 31 los niños salen a pedir dulces.',
    tokens: { '--red': '#ef6c00', '--red-hover': '#c55900', '--sunday': '#ffe3c4' },
    decor: {
      top: ['🦇', '🕸️'],
      bottom: ['🎃', '👻'],
      garland: { kind: 'items', items: ['🍬', '🍭'] },
    },
  },
  {
    emoji: '⛵',
    name: 'Independencia de Cartagena',
    note: 'Cartagena celebra su independencia el 11 de noviembre con fiestas y desfiles.',
    tokens: { '--red': '#00838f', '--red-hover': '#006770', '--sunday': '#d6eff1' },
    decor: {
      top: ['⛵', '☀️'],
      bottom: ['🏰', '🌴'],
      garland: { kind: 'flags', colors: ['#d32f2f', '#fbc02d', '#2e7d32'] },
    },
  },
  {
    emoji: '🎄',
    name: 'Navidad',
    note: 'Navidad: mes para compartir con nuestros seres queridos.',
    tokens: { '--red': '#b71c1c', '--red-hover': '#931616', '--sunday': '#e1f0dc' },
    decor: {
      top: ['⭐', '🔔'],
      bottom: ['🎄', '🎅🎁'],
      garland: { kind: 'bulbs', colors: ['#ff3b3b', '#ffd43b', '#40c057', '#4dabf7'] },
    },
  },
];
