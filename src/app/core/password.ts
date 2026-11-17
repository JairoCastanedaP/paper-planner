import { tx } from './i18n';
/**
 * Reglas de contraseña: las mismas de la política de Firebase Authentication
 * (mínimo 8 caracteres, con minúsculas y números). Se revisan antes de enviar
 * para mostrar qué falta mientras se escribe.
 */
export const PASSWORD_RULES = [
  { text: () => tx('Mínimo 8 caracteres', 'At least 8 characters'), ok: (p: string) => p.length >= 8 },
  { text: () => tx('Una letra minúscula', 'One lowercase letter'), ok: (p: string) => /[a-zà-öø-ÿ]/.test(p) },
  { text: () => tx('Un número', 'One number'), ok: (p: string) => /\d/.test(p) },
];

export function passwordIsValid(password: string): boolean {
  return PASSWORD_RULES.every((r) => r.ok(password));
}
