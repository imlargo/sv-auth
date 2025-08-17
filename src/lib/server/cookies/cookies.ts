import type { Cookies } from '@sveltejs/kit';
import type { AuthTokens } from '$lib/types/tokens.js';
import type { AuthCookiesManagerOptions } from '$lib/types/cookies_options.js';

const maxAgeDefault = 60 * 60 * 24 * 7;

export class AuthCookiesManager {
    private accessTokenCookieName: string;
    private refreshTokenCookieName: string;
    private domain: string = "";
    private maxAgeSeconds: number; // Default to 1 week

    constructor(options: AuthCookiesManagerOptions) {
        if (!options?.maxAgeSeconds) {
            options.maxAgeSeconds = maxAgeDefault;
        }

        if (!isStringPresent(options?.accessTokenCookieName)) {
            options.accessTokenCookieName = 'access_token';
        }

        if (!isStringPresent(options?.refreshTokenCookieName)) {
            options.refreshTokenCookieName = 'refresh_token';
        }

        if (isStringPresent(options.domain)) {
            this.domain = options.domain as string;
        }

        this.accessTokenCookieName = options.accessTokenCookieName as string;
        this.refreshTokenCookieName = options.refreshTokenCookieName as string;
        this.maxAgeSeconds = options.maxAgeSeconds as number;
    }

    getTokens(cookies: Cookies): AuthTokens {
        return {
            accessToken: cookies.get(this.accessTokenCookieName) ?? '',
            refreshToken: cookies.get(this.refreshTokenCookieName) ?? '',
        };
    }

    login(cookies: Cookies, accessToken: string, refreshToken: string): void {
        this.setCookie(cookies, this.accessTokenCookieName, accessToken);
        this.setCookie(cookies, this.refreshTokenCookieName, refreshToken);
    }

    logout(cookies: Cookies): void {
        this.deleteCookie(cookies, this.accessTokenCookieName);
        this.deleteCookie(cookies, this.refreshTokenCookieName);
    }

    isAuthenticated(cookies: Cookies): boolean {
        const accessToken = cookies.get(this.accessTokenCookieName);
        const refreshToken = cookies.get(this.refreshTokenCookieName);
        return isStringPresent(accessToken) && isStringPresent(refreshToken);
    }

    private _useDomain(): boolean {
        return isStringPresent(this.domain);
    }

    private setCookie(cookies: Cookies, cookieName: string, cookieValue: string): void {
        cookies.set(cookieName, cookieValue, {
            maxAge: this.maxAgeSeconds,
            path: '/',
            httpOnly: true,
            secure: true,
            ...this._useDomain() ? { domain: this.domain } : {}
        });
    }

    private deleteCookie(cookies: Cookies, cookieName: string): void {
        cookies.delete(cookieName, {
            path: '/',
            ...this._useDomain() ? { domain: this.domain } : {}
        });
    }
}

function isStringPresent(value: string | undefined | null): boolean {
    return value !== undefined && value !== null && value !== '';
}