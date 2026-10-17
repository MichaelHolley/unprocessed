import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

const requiredAtRuntime = building ? z.string().optional() : z.string().min(1);

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Path to the SQLite database file',
		schema: building ? z.string().default(':memory:') : z.string().min(1)
	},
	ADMIN_PASSWORD: {
		description: 'Password for the /admin login',
		schema: requiredAtRuntime
	},
	OPENROUTER_API_KEY: {
		description: 'OpenRouter API key used for AI generation',
		schema: requiredAtRuntime
	},
	OPENROUTER_MODEL: {
		description: 'OpenRouter model id used for AI generation',
		schema: z.string().min(1).default('google/gemini-2.5-flash')
	}
});
