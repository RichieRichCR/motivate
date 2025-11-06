import pino from 'pino';

// Default logger configuration
const defaultConfig = {
  level: process.env.LOG_LEVEL || 'info',
  // Pretty print in development, JSON in production
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
};

// Create base logger
export const logger = pino(defaultConfig);

// Create a child logger with context
export const createLogger = (context: string | Record<string, unknown>) => {
  return typeof context === 'string'
    ? logger.child({ context })
    : logger.child(context);
};

// Export pino types for convenience
export type { Logger } from 'pino';

// Backward compatibility
export const log = (...args: unknown[]): void => {
  logger.info(args);
};
