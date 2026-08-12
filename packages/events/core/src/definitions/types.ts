
export type Event = {
    topic: string;
    name: string;
};

export type EventHandler<T> = (data: T) => Promise<void>;
export type ErrorHandler = (event: Event, error: unknown) => Promise<void>;

export type Publication<T> = Event & {
    data?: T;
};

export type Subscription<T> = Event & {
    handler: EventHandler<T>;
};
