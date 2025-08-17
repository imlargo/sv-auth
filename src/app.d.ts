// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AuthLocals } from "$lib/types/locals.ts";
import type { BaseUser } from "$lib/types/user.ts";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals extends AuthLocals<BaseUser> {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
