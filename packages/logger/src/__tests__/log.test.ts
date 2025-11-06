import { describe, it, expect } from 'vitest';
import { logger, createLogger, log } from '..';

describe('@repo/logger', () => {
  it('has basic logger methods', () => {
    expect(logger.info).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  it('creates child logger with string context', () => {
    const childLogger = createLogger('test-context');
    expect(childLogger).toBeDefined();
  });

  it('creates child logger with object context', () => {
    const childLogger = createLogger({ module: 'test', id: 123 });
    expect(childLogger).toBeDefined();
  });

  it('backward compatible log function exists', () => {
    expect(log).toBeDefined();
    expect(typeof log).toBe('function');
  });
});
