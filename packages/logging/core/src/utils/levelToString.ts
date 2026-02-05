
import type { LogLevel } from '../definitions/constants.js';
import { LogLevels } from '../definitions/constants.js';

const logLevels = new Map<LogLevel, string>
(
    Object.entries(LogLevels).map(([key, value]) => [value, key])
);

export default function levelToString(level: LogLevel): string
{
    return logLevels.get(level) ?? 'UNKNOWN';
}
