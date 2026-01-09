
export const ConnectionStates =
{
    DISCONNECTED: 'DISCONNECTED',
    DISCONNECTING: 'DISCONNECTING',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED'
} as const;

export type ConnectionState = typeof ConnectionStates[keyof typeof ConnectionStates];
