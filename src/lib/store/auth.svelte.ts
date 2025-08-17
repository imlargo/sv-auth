import type { AuthTokens } from '$lib/types/tokens.js';

export class AuthStore<T> {
	private user: T | null = null;
	private tokens: AuthTokens | null = null;

	constructor() {}

	login(accessToken: string, refreshToken: string, user: T | null) {
		if (accessToken == '') throw new Error('Access token cannot be empty');
		if (refreshToken == '') throw new Error('Refresh token cannot be empty');
		if (user === null || user === undefined) throw new Error('User cannot be null or undefined');

		this.user = user;
		this.tokens = { accessToken, refreshToken };
	}

	logout() {
		this.user = null;
		this.tokens = null;
	}

	isLoggedIn(): boolean {
		const userExists = this.user !== null && this.user !== undefined;
		const tokensExist = this.tokens !== null && this.tokens !== undefined;
		const validTokens = this.tokens?.accessToken !== '' && this.tokens?.refreshToken !== '';
		return userExists && tokensExist && validTokens;
	}

	getUser(): T | null {
		return this.user;
	}

	getAccessToken(): string | null {
		return this.tokens?.accessToken || null;
	}

	getRefreshToken(): string | null {
		return this.tokens?.refreshToken || null;
	}
}
