import { redirect, type Handle } from '@sveltejs/kit';
import type { AuthCookiesManager } from '../cookies/cookies.js';

export function NewAuthMiddleware(
	authCookiesManager: AuthCookiesManager,
	publicRoutes: string[] = [],
	loginRoute: string = '/login',
	getUserCall: (accessToken: string) => Promise<any>
) {
	if (!publicRoutes.includes(loginRoute)) {
		publicRoutes.push(loginRoute);
	}

	const handle: Handle = async ({ event, resolve }) => {
		if (isPublicRoute(publicRoutes, event.url.pathname)) {
			return await resolve(event);
		}

		if (!authCookiesManager.isAuthenticated(event.cookies)) {
			redirect(303, loginRoute);
		}

		const authTokens = authCookiesManager.getTokens(event.cookies);
		event.locals.accessToken = authTokens.accessToken;
		event.locals.refreshToken = authTokens.refreshToken;

		try {
			const user = await getUserCall(authTokens.accessToken);
			event.locals.user = user;
			return await resolve(event);
		} catch (error) {
			console.error('[sv-auth] Error fetching user data:', error);
			authCookiesManager.logout(event.cookies);
			redirect(303, loginRoute);
		}
	};

	return handle;
}
function isPublicRoute(publicRoutes: string[], pathname: string) {
	return publicRoutes.includes(pathname);
}
