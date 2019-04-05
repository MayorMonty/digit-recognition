/**
 * Sigmoid function, used for anti aliasing
 */

export function sigmoid(t: number, b: number, u: number) {
  return 1 / (1 + Math.E ** (-t * b)) ** (1 / u);
}
