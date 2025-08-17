import type { AuthCookiesManagerOptions } from "$lib/types/cookies_options.js";

const maxAgeDefault = 60 * 60 * 24 * 7;

export function parseAuthCookiesManagerOptions(options: AuthCookiesManagerOptions) {
    const parsed: AuthCookiesManagerOptions = {
        cookies: {},
    };

    parsed.cookies.maxAgeSeconds = options?.cookies?.maxAgeSeconds ? options.cookies.maxAgeSeconds : maxAgeDefault;
    parsed.cookies.accessTokenCookieName = stringOrDefault(options?.cookies?.accessTokenCookieName, 'access_token');
    parsed.cookies.refreshTokenCookieName = stringOrDefault(options?.cookies?.refreshTokenCookieName, 'refresh_token');
    parsed.cookies.domain = stringOrDefault(options?.cookies?.domain, '');
    parsed.cookies.sameSite = stringOrDefault(options?.cookies?.sameSite, '') as "";

    return parsed;
}

function isStringPresent(value: string | undefined | null): boolean {
    return value !== undefined && value !== null && value !== '';
}

function stringOrDefault(value: string | undefined | null, defaultValue: string): string {
    return isStringPresent(value) ? value as string : defaultValue;
}