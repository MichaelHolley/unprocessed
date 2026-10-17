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

export const IMPACT_LIMITS: Record<ImpactKind, { min: number; max: number }> = {
	positive: { min: 2, max: 4 },
	negative: { min: 1, max: 2 },
	neutral: { min: 0, max: 2 }
};

export const impactsSchema = z.array(impactSchema).superRefine((impacts, ctx) => {
	for (const kind of IMPACT_KINDS) {
		const { min, max } = IMPACT_LIMITS[kind];
		const count = impacts.filter((impact) => impact.kind === kind).length;
		if (count < min || count > max)
			ctx.addIssue({
				code: 'custom',
				message: `Needs ${min}-${max} ${kind} impacts, got ${count}`
			});
	}
});

export const generatedFoodSchema = z.object({
	name: z.string().trim().min(1),
	emoji: z.string().trim().min(1),
	impacts: impactsSchema
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
