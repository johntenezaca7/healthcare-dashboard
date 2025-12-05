import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';

declare global {
  const expect: typeof import('vitest').expect;
  const test: typeof import('vitest').test;
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const vi: typeof import('vitest').vi;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;
  // eslint-disable-next-line no-var
  var global: typeof globalThis;
}
