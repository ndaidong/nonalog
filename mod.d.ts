// Type definitions

export interface LoggerOptions {
    separator?: string;
    event?: boolean;
    print?: boolean;
}

export interface LoggerInstance {
    debug: (message: string) => void;
    error: (message: string) => void;
    trace: (message: string) => void;
    branch: (namespace: string, options?: LoggerOptions) => LoggerInstance;
}

export function logger(namespace: string, options?: LoggerOptions): LoggerInstance;

export function debug(message: string): void;
export function error(message: string): void;
export function trace(message: string): void;
