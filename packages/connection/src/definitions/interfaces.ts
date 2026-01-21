
export interface Connectable
{
    get connected(): boolean;

    connect(): Promise<void>;

    disconnect(): Promise<void>;
}
