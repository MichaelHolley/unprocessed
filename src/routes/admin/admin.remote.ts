import { error, invalid, redirect } from '@sveltejs/kit';
import { command, form, getRequestEvent, query } from '$app/server';
import { z } from 'zod';
import { impactSchema, slugify, type GeneratedFood } from '#lib/foods.js';
import { GenerationError, generateFood } from '#lib/server/ai.js';
import { createSession, destroySession, requireAdmin, verifyPassword } from '#lib/server/auth.js';
import {
	DuplicateFoodError,
	createFood,
	deleteFood,
	getFood,
	listFoods,
	replaceImpacts,
	updateFood
} from '#lib/server/foods.js';

const idSchema = z.string().min(1);

function messageOf(cause: unknown): string {
	return cause instanceof GenerationError ? cause.message : 'Something went wrong';
}

export const login = form(
	z.object({ _password: z.string().min(1, 'Enter the password') }),
	({ _password }, issue) => {
		if (!verifyPassword(_password)) invalid(issue._password('Incorrect password'));
		createSession(getRequestEvent().cookies);
		redirect(303, '/admin');
	}
);

export const logout = form(() => {
	destroySession(getRequestEvent().cookies);
	redirect(303, '/admin/login');
});

export const listAdminFoods = query(() => {
	requireAdmin();
	return listFoods().map(({ id, name, emoji }) => ({ id, name, emoji }));
});

export const getAdminFood = query(idSchema, (id) => {
	requireAdmin();
	const food = getFood(id);
	if (!food) error(404, 'Food not found');
	return food;
});

export const generateNewFood = form(
	z.object({ name: z.string().trim().min(1, 'Enter a food name') }),
	async ({ name }, issue) => {
		requireAdmin();
		const id = slugify(name);
		if (!id) invalid(issue.name('Name must contain letters or numbers'));
		if (getFood(id)) invalid(issue.name(`"${id}" already exists`));

		let generated: GeneratedFood;
		try {
			generated = await generateFood(name);
		} catch (cause) {
			invalid(messageOf(cause));
		}

		const generatedId = slugify(generated.name);
		if (!generatedId) invalid(issue.name('Name must contain letters or numbers'));

		try {
			createFood({ id: generatedId, ...generated });
		} catch (cause) {
			if (cause instanceof DuplicateFoodError)
				invalid(issue.name(`"${generatedId}" already exists`));
			throw cause;
		}

		await listAdminFoods().refresh();
	}
);

export const saveFood = form(
	z.object({
		id: idSchema,
		name: z.string().trim().min(1, 'Name is required'),
		emoji: z.string().trim().min(1, 'Emoji is required'),
		impacts: z.array(impactSchema)
	}),
	async ({ id, name, emoji, impacts }) => {
		requireAdmin();
		const existing = getFood(id);
		if (!existing) error(404, 'Food not found');
		if (impacts.length !== existing.impacts.length)
			error(400, 'Impacts cannot be added or removed');
		updateFood(id, { name, emoji, impacts });
		await listAdminFoods().refresh();
		redirect(303, '/admin');
	}
);

export const regenerateImpacts = command(idSchema, async (id) => {
	requireAdmin();
	const food = getFood(id);
	if (!food) error(404, 'Food not found');
	try {
		const { impacts } = await generateFood(food.name);
		replaceImpacts(id, impacts);
		return { ...food, impacts };
	} catch (cause) {
		error(502, messageOf(cause));
	}
});

export const removeFood = command(idSchema, (id) => {
	requireAdmin();
	deleteFood(id);
});
