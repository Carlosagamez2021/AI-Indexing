/**
 * Log level enumeration.
 * @description Defines the available log levels with numeric values.
 */
interface LogLevel {
  /** Debug level for detailed information */
  DEBUG: 0
  /** Info level for general information */
  INFO: 1
  /** Warning level for potential issues */
  WARN: 2
  /** Error level for error conditions */
  ERROR: 3
}

/**
 * Log entry data structure.
 * @description Defines the structure for individual log entries.
 */
interface LogEntry {
  /** Log level of the entry */
  level: keyof LogLevel
  /** Log message content */
  message: string
  /** Timestamp when the log was created */
  timestamp: Date
  /** Optional additional context data */
  context?: Record<string, any>
}

/**
 * Singleton logger for application logging.
 * @description Handles logging with configurable levels and context.
 */
class Logger {
  /** Singleton instance of the logger */
  private static instance: Logger
  /** Current minimum log level */
  private logLevel: number = 1
  /** Internal storage for log entries */
  private logs: LogEntry[] = []

  /**
   * Private constructor for singleton pattern.
   * @description Prevents direct instantiation of the logger.
   */
  private constructor() {}

  /**
   * Gets the singleton logger instance.
   * @description Returns the existing instance or creates a new one.
   * @returns Logger singleton instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  /**
   * Sets the minimum log level.
   * @description Configures which log levels will be processed.
   * @param level - Minimum log level to process
   */
  setLevel(level: keyof LogLevel): void {
    this.logLevel = LogLevel[level]
  }

  /**
   * Internal method to process log entries.
   * @description Handles the actual logging logic with level filtering.
   * @param level - Log level for the entry
   * @param message - Log message content
   * @param context - Optional context data
   */
  private log(level: keyof LogLevel, message: string, context?: Record<string, any>): void {
    if (LogLevel[level] < this.logLevel) {
      return
    }
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: context ?? {}
    }
    this.logs.push(entry)
    console.log(`[${level}] ${entry.timestamp.toISOString()}: ${message}`, context || '')
  }

  /**
   * Logs a debug message.
   * @description Records a debug level log entry.
   * @param message - Debug message content
   * @param context - Optional context data
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log('DEBUG', message, context)
  }

  /**
   * Logs an info message.
   * @description Records an info level log entry.
   * @param message - Info message content
   * @param context - Optional context data
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('INFO', message, context)
  }

  /**
   * Logs a warning message.
   * @description Records a warning level log entry.
   * @param message - Warning message content
   * @param context - Optional context data
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('WARN', message, context)
  }

  /**
   * Logs an error message.
   * @description Records an error level log entry.
   * @param message - Error message content
   * @param context - Optional context data
   */
  error(message: string, context?: Record<string, any>): void {
    this.log('ERROR', message, context)
  }

  /**
   * Gets all stored log entries.
   * @description Returns a copy of all log entries.
   * @returns Array of log entries
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Clears all stored log entries.
   * @description Removes all log entries from storage.
   */
  clearLogs(): void {
    this.logs = []
  }
}

/**
 * Log level constants.
 * @description Numeric values for each log level.
 */
const LogLevel: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

/**
 * Exports the Logger, LogLevel, and LogEntry types.
 * @description Exports the Logger, LogLevel, and LogEntry types.
 */
export { Logger, type LogLevel, type LogEntry }
