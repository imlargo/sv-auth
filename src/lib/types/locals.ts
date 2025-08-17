export type AuthLocals<T> = {
    user: T | null;
    accessToken: string | null;
    refreshToken: string | null;
};
