/**
 * Redondea un valor monetario a dos decimales.
 */
export function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}