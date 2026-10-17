import { query } from '$app/server';
import { listFoods } from '#lib/server/foods.js';

export const getFoods = query(() => listFoods());
