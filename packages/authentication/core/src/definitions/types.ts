
type Identity = {
    name: string;
    nickname: string | undefined;
    picture: string | undefined;
    email: string;
    email_verified: boolean;
};

type Token = string;

type Session = {
    id: string;
    key?: string;
    requester?: unknown;
    identity: Identity;
    accessToken: Token;
    refreshToken?: Token;
    expires: Date;
};

export type { Identity, Session };
