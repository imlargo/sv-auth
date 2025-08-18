import { redirect, type Handle } from '@sveltejs/kit';
import type { AuthCookiesManager } from '../cookies/cookies.js';

/**
 * Creates a SvelteKit middleware for authentication and user session management.
 *
 * This middleware checks if the current route is public, verifies authentication status via cookies,
 * fetches user data using the provided `getUserCall` function, and handles redirection to the login route if needed.
 *
 * @param authCookiesManager - An instance responsible for managing authentication cookies.
 * @param publicRoutes - An array of route paths that do not require authentication. The login route is automatically included.
 * @param loginRoute - The path to the login route. Defaults to '/login'.
 * @param getUserCall - An async function that retrieves user data given an access token.
 * @returns A SvelteKit `Handle` function to be used as middleware.
 */
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
