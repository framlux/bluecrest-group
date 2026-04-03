import { vi } from "vitest";

/**
 * Creates a mock that mimics Drizzle's fluent query builder chain.
 * Each method returns `this` (the chain) except terminal methods
 * which resolve with the provided value.
 */
export function createMockDbChain(resolvedValue: unknown[] = []) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  const self = () => chain;

  chain.select = vi.fn().mockImplementation(self);
  chain.insert = vi.fn().mockImplementation(self);
  chain.update = vi.fn().mockImplementation(self);
  chain.delete = vi.fn().mockImplementation(self);
  chain.from = vi.fn().mockImplementation(self);
  chain.where = vi.fn().mockImplementation(self);
  chain.innerJoin = vi.fn().mockImplementation(self);
  chain.orderBy = vi.fn().mockImplementation(self);
  chain.limit = vi.fn().mockResolvedValue(resolvedValue);
  chain.values = vi.fn().mockImplementation(self);
  chain.set = vi.fn().mockImplementation(self);
  chain.returning = vi.fn().mockResolvedValue(resolvedValue);
  chain.then = vi.fn().mockImplementation((resolve: (v: unknown) => void) =>
    resolve(resolvedValue)
  );

  return chain;
}
