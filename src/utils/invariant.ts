/**
 * Throws an error when the condition is false.
 * Only throws in development (NODE_ENV !== 'production') for better performance in production.
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (condition) {
    return;
  }

  throw new Error(`Invariant failed: ${message}`);
}
