/**
 * Structured logging utility for frontend (Next.js)
 * Works with process.env and NEXT_PUBLIC_ variables
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}

class Logger {
    private currentLevel: LogLevel
    private environment: string

    constructor() {
        // Next.js environment detection
        this.environment = process.env.NODE_ENV || 'development'

        const envLevel = process.env.NEXT_PUBLIC_LOG_LEVEL?.toUpperCase()

        switch (envLevel) {
            case 'DEBUG':
                this.currentLevel = LogLevel.DEBUG
                break
            case 'INFO':
                this.currentLevel = LogLevel.INFO
                break
            case 'WARN':
            case 'WARNING':
                this.currentLevel = LogLevel.WARN
                break
            case 'ERROR':
                this.currentLevel = LogLevel.ERROR
                break
            case 'NONE':
                this.currentLevel = LogLevel.NONE
                break
            default:
                // Defaults: debug in dev, info in prod
                this.currentLevel =
                    this.environment === 'production'
                        ? LogLevel.INFO
                        : LogLevel.DEBUG
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.currentLevel
    }

    private formatMessage(level: string, component: string, message: string, data?: unknown): string {
        const timestamp = new Date().toISOString()
        let formatted = `[${timestamp}] ${level} [${component}] ${message}`
        if (data !== undefined) {
            formatted += ` ${JSON.stringify(data)}`
        }
        return formatted
    }

    debug(component: string, message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(this.formatMessage('DEBUG', component, message, data))
        }
    }

    info(component: string, message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage('INFO', component, message, data))
        }
    }

    warn(component: string, message: string, data?: unknown): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage('WARN', component, message, data))
        }
    }

    error(component: string, message: string, error?: Error | unknown): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            const errorData = error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error

            console.error(this.formatMessage('ERROR', component, message, errorData))
        }
    }

    scope(component: string) {
        return {
            debug: (message: string, data?: unknown) => this.debug(component, message, data),
            info: (message: string, data?: unknown) => this.info(component, message, data),
            warn: (message: string, data?: unknown) => this.warn(component, message, data),
            error: (msg: string, error?: Error | unknown) => this.error(component, msg, error)
        }
    }
}

export const logger = new Logger()
export const createLogger = (component: string) => logger.scope(component)

