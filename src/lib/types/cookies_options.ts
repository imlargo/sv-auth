export type AuthCookiesManagerOptions = {
    maxAgeSeconds: number;
    accessTokenCookieName?: string;
    refreshTokenCookieName?: string;
    domain?: string;
}