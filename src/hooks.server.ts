import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { isAdmin } from '#lib/server/auth.js';

const LOGIN_PATH = '/admin/login';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

	if (
		isAdminRoute &&
		!event.isRemoteRequest &&
		pathname !== LOGIN_PATH &&
		!isAdmin(event.cookies)
	) {
		redirect(303, LOGIN_PATH);
	}

	return resolve(event);
};
