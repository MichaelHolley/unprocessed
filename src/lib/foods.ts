import { z } from 'zod';

export const IMPACT_KINDS = ['positive', 'negative', 'neutral'] as const;

export type ImpactKind = (typeof IMPACT_KINDS)[number];

export interface Impact {
	kind: ImpactKind;
	text: string;
}

export interface FoodItem {
	id: string;
	name: string;
	emoji: string;
	impacts: Impact[];
}

export const impactSchema = z.object({
	kind: z.enum(IMPACT_KINDS),
	text: z.string().trim().min(1)
});

export const generatedFoodSchema = z.object({
	name: z.string().trim().min(1),
	emoji: z.string().trim().min(1),
	impacts: z.array(impactSchema).min(1)
});

export type GeneratedFood = z.infer<typeof generatedFoodSchema>;

export function slugify(name: string): string {
	return name
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
