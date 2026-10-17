import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { IMPACT_KINDS } from '../../foods.ts';

export const foods = sqliteTable('foods', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	emoji: text('emoji').notNull()
});

export const impacts = sqliteTable('impacts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	foodId: text('food_id')
		.notNull()
		.references(() => foods.id, { onDelete: 'cascade' }),
	kind: text('kind', { enum: IMPACT_KINDS }).notNull(),
	text: text('text').notNull(),
	position: integer('position').notNull()
});

export type FoodRow = typeof foods.$inferSelect;
export type NewFoodRow = typeof foods.$inferInsert;
export type ImpactRow = typeof impacts.$inferSelect;
export type NewImpactRow = typeof impacts.$inferInsert;
