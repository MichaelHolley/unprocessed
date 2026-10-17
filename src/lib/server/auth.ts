import { ADMIN_PASSWORD } from '$app/env/private';
import { error, type Cookies } from '@sveltejs/kit';
import { dev } from '$app/env';
import { getRequestEvent } from '$app/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function sign(payload: string): Buffer | undefined {
	if (!ADMIN_PASSWORD) return undefined;
	const key = createHmac('sha256', 'unprocessed-admin-session').update(ADMIN_PASSWORD).digest();
	return createHmac('sha256', key).update(payload).digest();
}

function safeEqual(a: Buffer, b: Buffer): boolean {
	return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyPassword(input: string): boolean {
	if (!ADMIN_PASSWORD) return false;
	const digest = (value: string) => createHmac('sha256', 'password-compare').update(value).digest();
	return safeEqual(digest(input), digest(ADMIN_PASSWORD));
}

export function createSession(cookies: Cookies): void {
	const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
	const signature = sign(String(expires));
	if (!signature) return;
	cookies.set(COOKIE_NAME, `${expires}.${signature.toString('base64url')}`, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: SESSION_SECONDS
	});
}

export function destroySession(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export function isAdmin(cookies: Cookies): boolean {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return false;
	const [expires, signature] = token.split('.');
	if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
	const expected = sign(expires);
	return !!expected && safeEqual(Buffer.from(signature, 'base64url'), expected);
}

export function requireAdmin(): void {
	if (!isAdmin(getRequestEvent().cookies)) error(401, 'Unauthorized');
}
