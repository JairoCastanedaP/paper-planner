import { Category, PlannerData } from './models';

/** Las mismas categorías y colores del calendario de papel. */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'academic', name: 'Académico', color: '#ffa94d' },
  { id: 'english', name: 'Inglés', color: '#8ce563' },
  { id: 'finance', name: 'Económico', color: '#ff6fb5' },
  { id: 'birthday', name: 'Cumpleaños', color: '#f5c542', icon: '👑' },
  { id: 'project', name: 'Proyecto', color: '#6cb4ff' },
];

/** Un calendario vacío: solo las categorías. */
export function createEmptyData(): PlannerData {
  return { version: 1, categories: DEFAULT_CATEGORIES, events: [], highlights: {}, goals: [] };
}
