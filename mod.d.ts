// Type definitions

export interface LoggerOptions {
    separator?: string;
    event?: boolean;
    print?: boolean;
}

export interface LoggerInstance {
    debug: (args: any[]) => void;
    info: (args: any[]) => void;
    error: (args: any[]) => void;
    trace: (args: any[]) => void;
    branch: (namespace: string, options?: LoggerOptions) => LoggerInstance;
}

export function logger(namespace: string, options?: LoggerOptions): LoggerInstance;

export function debug(args: any[]): void;
export function info(args: any[]): void;
export function error(args: any[]): void;
export function trace(args: any[]): void;
