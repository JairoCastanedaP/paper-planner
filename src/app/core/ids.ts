/**
 * crypto.randomUUID solo existe en contextos seguros (https o localhost);
 * al probar desde la tablet por la red local (http://192.168…) no está disponible.
 */
export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
