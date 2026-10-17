import { APP_LANGUAGE, OPENROUTER_API_KEY, OPENROUTER_MODEL } from '$app/env/private';
import { chat } from '@tanstack/ai';
import { createOpenRouterText } from '@tanstack/ai-openrouter';
import { generatedFoodSchema, type GeneratedFood } from '#lib/foods.js';

type OpenRouterModel = Parameters<typeof createOpenRouterText>[0];

const SYSTEM_PROMPT = `You write entries for "Unprocessed", a short, factual guide to the health impact of single-ingredient whole foods.

Given a food name, return:
- name: the food name exactly as given, with any spelling typos corrected. Do not translate, rename or otherwise change it.
- emoji: a single emoji that best represents the food.
- impacts: 4 to 6 impacts of eating the food, each with a kind and a text.

Rules for impacts:
- kind is "positive", "negative" or "neutral". Use a mix of all three where the food honestly supports it.
- Order them: all positive first, then all negative, then all neutral.
- text is one short, factual sentence with no trailing full stop, written in ${APP_LANGUAGE}. Never use another language. If ${APP_LANGUAGE} is English, use British spelling.
- Where applicable and fitting, name the organ or body system that a positive impact benefits (such as heart, liver, gut, bones, skin or eyes), and likewise the one a negative impact puts at risk.
- Neutral impacts are practical facts or tips, such as how preparation changes nutrients.
- Be accurate and measured. Never make medical claims or exaggerate.

Match the tone of these examples:
- positive: "Potassium supports heart function and healthy blood pressure"
- negative: "Can irritate the gut and cause bloating in larger amounts"
- neutral: "Steaming preserves more nutrients than boiling"`;

export class GenerationError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = 'GenerationError';
	}
}

/**
 * Generates an emoji and impacts for a food through OpenRouter structured output.
 * Throws {@link GenerationError} with an admin-readable message on any failure.
 */
export async function generateFood(name: string): Promise<GeneratedFood> {
	if (!OPENROUTER_API_KEY) throw new GenerationError('OPENROUTER_API_KEY is not configured');

	try {
		const result = await chat({
			adapter: createOpenRouterText(OPENROUTER_MODEL as OpenRouterModel, OPENROUTER_API_KEY),
			systemPrompts: [SYSTEM_PROMPT],
			messages: [{ role: 'user', content: `Food: ${name}` }],
			outputSchema: generatedFoodSchema
		});
		return generatedFoodSchema.parse(result);
	} catch (cause) {
		const detail = cause instanceof Error ? cause.message : String(cause);
		throw new GenerationError(`AI generation failed: ${detail}`, { cause });
	}
}
