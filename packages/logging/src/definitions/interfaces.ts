
export interface Driver
{
    logDebug(message: string): Promise<void>;

    logInfo(message: string): Promise<void>;

    logWarn(message: string): Promise<void>;

    logError(message: string): Promise<void>;

    logFatal(message: string): Promise<void>;
}
