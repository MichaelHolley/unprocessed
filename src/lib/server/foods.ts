import { asc, eq } from 'drizzle-orm';
import type { FoodItem, Impact } from '#lib/foods.js';
import { db } from './db/index.ts';
import { foods, impacts } from './db/schema.ts';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class DuplicateFoodError extends Error {
	constructor(public readonly id: string) {
		super(`A food with id "${id}" already exists`);
		this.name = 'DuplicateFoodError';
	}
}

function toFoodItems(
	foodRows: (typeof foods.$inferSelect)[],
	impactRows: (typeof impacts.$inferSelect)[]
): FoodItem[] {
	const byFood = new Map<string, Impact[]>();
	for (const { foodId, kind, text } of impactRows) {
		const list = byFood.get(foodId) ?? [];
		list.push({ kind, text });
		byFood.set(foodId, list);
	}
	return foodRows.map((food) => ({ ...food, impacts: byFood.get(food.id) ?? [] }));
}

function insertImpacts(tx: Tx, foodId: string, items: Impact[]) {
	if (items.length === 0) return;
	tx.insert(impacts)
		.values(items.map((impact, position) => ({ ...impact, foodId, position })))
		.run();
}

export function listFoods(): FoodItem[] {
	const foodRows = db.select().from(foods).orderBy(asc(foods.name)).all();
	const impactRows = db.select().from(impacts).orderBy(asc(impacts.position)).all();
	return toFoodItems(foodRows, impactRows);
}

export function getFood(id: string): FoodItem | undefined {
	const food = db.select().from(foods).where(eq(foods.id, id)).get();
	if (!food) return undefined;
	const impactRows = db
		.select()
		.from(impacts)
		.where(eq(impacts.foodId, id))
		.orderBy(asc(impacts.position))
		.all();
	return toFoodItems([food], impactRows)[0];
}

export function createFood(food: FoodItem): FoodItem {
	return db.transaction((tx) => {
		const existing = tx.select({ id: foods.id }).from(foods).where(eq(foods.id, food.id)).get();
		if (existing) throw new DuplicateFoodError(food.id);
		tx.insert(foods).values({ id: food.id, name: food.name, emoji: food.emoji }).run();
		insertImpacts(tx, food.id, food.impacts);
		return food;
	});
}

export function updateFood(
	id: string,
	food: { name: string; emoji: string; impacts: Impact[] }
): void {
	db.transaction((tx) => {
		tx.update(foods).set({ name: food.name, emoji: food.emoji }).where(eq(foods.id, id)).run();
		tx.delete(impacts).where(eq(impacts.foodId, id)).run();
		insertImpacts(tx, id, food.impacts);
	});
}

export function replaceImpacts(id: string, items: Impact[]): void {
	db.transaction((tx) => {
		tx.delete(impacts).where(eq(impacts.foodId, id)).run();
		insertImpacts(tx, id, items);
	});
}

export function deleteFood(id: string): void {
	db.delete(foods).where(eq(foods.id, id)).run();
}
