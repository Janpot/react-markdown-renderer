/**
 * Validation utilities to strictly extract and validate props
 */

/**
 * Validates that a value is a string or undefined
 * @throws Error if value is neither a string nor undefined
 */
export function maybeString(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected string or undefined, got ${typeof value}`);
  }

  return value;
}

/**
 * Validates that a value is a string
 * @throws Error if value is not a string
 */
export function string(value: unknown, defaultValue = ''): string {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`);
  }

  return value;
}

/**
 * Validates that a value is a boolean or undefined
 * @throws Error if value is neither a boolean nor undefined
 */
export function maybeBoolean(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Expected boolean or undefined, got ${typeof value}`);
  }

  return value;
}

/**
 * Validates that a value is a boolean
 * @throws Error if value is not a boolean
 */
export function boolean(value: unknown, defaultValue = false): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Expected boolean, got ${typeof value}`);
  }

  return value;
}

/**
 * Validates that a value is a number or undefined
 * @throws Error if value is neither a number nor undefined
 */
export function maybeNumber(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Expected number or undefined, got ${typeof value}`);
  }

  return value;
}

/**
 * Validates that a value is a number
 * @throws Error if value is not a number
 */
export function number(value: unknown, defaultValue = 0): number {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Expected number, got ${typeof value}`);
  }

  return value;
}

/**
 * Validates and ensures a value is a heading depth (1-6)
 * @throws Error if value is not a valid heading depth
 */
export function headingDepth<T extends 1 | 2 | 3 | 4 | 5 | 6>(
  value: unknown,
  defaultValue: T
): T {
  const depth = number(value, defaultValue);

  if (depth < 1 || depth > 6) {
    throw new Error(`Heading depth must be between 1-6, got ${depth}`);
  }

  return depth as T;
}
