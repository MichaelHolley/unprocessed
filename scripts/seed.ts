import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { foods, impacts } from '../src/lib/server/db/schema.ts';
import type { FoodItem } from '../src/lib/foods.ts';

const seedFoods: FoodItem[] = [
	{
		id: 'broccoli',
		name: 'Broccoli',
		emoji: '🥦',
		impacts: [
			{ kind: 'positive', text: 'Vitamin C and K support immunity and bone health' },
			{ kind: 'positive', text: 'Rich in fibre, supports digestion' },
			{ kind: 'positive', text: 'Contains sulforaphane, an antioxidant' },
			{ kind: 'negative', text: 'Can cause bloating and gas in larger amounts' },
			{ kind: 'negative', text: 'Goitrogens may affect thyroid function when eaten raw in excess' },
			{ kind: 'neutral', text: 'Steaming preserves more nutrients than boiling' }
		]
	},
	{
		id: 'walnuts',
		name: 'Walnuts',
		emoji: '🌰',
		impacts: [
			{ kind: 'positive', text: 'Plant-based omega-3 (ALA) supports heart health' },
			{ kind: 'positive', text: 'Magnesium supports muscle and nerve function' },
			{ kind: 'positive', text: 'Linked to improved blood lipid profiles' },
			{ kind: 'negative', text: 'Very calorie dense, easy to overeat' },
			{ kind: 'negative', text: 'Common tree nut allergen' },
			{ kind: 'neutral', text: 'Oils go rancid quickly, store cold' }
		]
	},
	{
		id: 'salmon',
		name: 'Salmon',
		emoji: '🐟',
		impacts: [
			{ kind: 'positive', text: 'EPA and DHA omega-3 support heart and brain health' },
			{ kind: 'positive', text: 'High quality complete protein' },
			{ kind: 'positive', text: 'Vitamin D supports bones and immunity' },
			{ kind: 'negative', text: 'May contain traces of mercury and microplastics' },
			{ kind: 'negative', text: 'Farmed salmon has a different fat profile than wild' }
		]
	},
	{
		id: 'spinach',
		name: 'Spinach',
		emoji: '🥬',
		impacts: [
			{ kind: 'positive', text: 'Folate, iron and vitamin A support blood and cell growth' },
			{ kind: 'positive', text: '👁️ Lutein and zeaxanthin protect the retina' },
			{ kind: 'positive', text: 'Very low in calories for its volume' },
			{ kind: 'negative', text: 'Oxalates can contribute to kidney stones' },
			{ kind: 'negative', text: 'Oxalates also reduce calcium and iron absorption' },
			{ kind: 'neutral', text: 'Cooking shrinks volume dramatically' }
		]
	},
	{
		id: 'blueberries',
		name: 'Blueberries',
		emoji: '🫐',
		impacts: [
			{ kind: 'positive', text: 'Very high in anthocyanin antioxidants' },
			{ kind: 'positive', text: 'Associated with better memory in older adults' },
			{ kind: 'positive', text: 'Low glycaemic index for a fruit' },
			{ kind: 'negative', text: 'Expensive compared to other fruit' },
			{ kind: 'neutral', text: 'Frozen berries keep almost all their nutrients' }
		]
	},
	{
		id: 'eggs',
		name: 'Eggs',
		emoji: '🥚',
		impacts: [
			{ kind: 'positive', text: 'Complete protein with all essential amino acids' },
			{ kind: 'positive', text: 'Rich in choline, important for brain function' },
			{ kind: 'positive', text: 'B12 and selenium support nerves and thyroid' },
			{ kind: 'negative', text: 'High in dietary cholesterol' },
			{ kind: 'negative', text: 'Frequent allergen, especially in children' },
			{ kind: 'neutral', text: 'Yolk colour reflects the hen feed, not quality' }
		]
	},
	{
		id: 'oats',
		name: 'Oats',
		emoji: '🌾',
		impacts: [
			{ kind: 'positive', text: 'Beta-glucan fibre helps lower LDL cholesterol' },
			{ kind: 'positive', text: 'Slow-release carbohydrates keep you full' },
			{ kind: 'positive', text: 'Manganese and phosphorus support bones and metabolism' },
			{ kind: 'negative', text: 'Often cross-contaminated with gluten' },
			{ kind: 'negative', text: 'Phytic acid reduces mineral absorption' }
		]
	},
	{
		id: 'avocado',
		name: 'Avocado',
		emoji: '🥑',
		impacts: [
			{ kind: 'positive', text: 'Monounsaturated fats support heart health' },
			{ kind: 'positive', text: 'Potassium supports heart and muscle function' },
			{ kind: 'positive', text: 'Helps absorption of fat-soluble vitamins' },
			{ kind: 'negative', text: 'Calorie dense, easy to overeat' },
			{ kind: 'negative', text: 'Water-intensive crop with a heavy footprint' },
			{ kind: 'neutral', text: 'Ripens only after picking' }
		]
	},
	{
		id: 'lentils',
		name: 'Lentils',
		emoji: '🫘',
		impacts: [
			{ kind: 'positive', text: 'Strong source of plant protein' },
			{ kind: 'positive', text: 'Fibre and folate support digestion and cell growth' },
			{ kind: 'positive', text: 'Cheap and shelf-stable' },
			{ kind: 'negative', text: 'Lectins and phytates require proper cooking' },
			{ kind: 'negative', text: 'Can cause gas during the first weeks of eating them' }
		]
	},
	{
		id: 'sweet-potato',
		name: 'Sweet Potato',
		emoji: '🍠',
		impacts: [
			{ kind: 'positive', text: 'Beta-carotene (vitamin A) supports eyesight and immunity' },
			{ kind: 'positive', text: 'Fibre-rich with a moderate glycaemic index' },
			{ kind: 'negative', text: 'Roasting raises the glycaemic index noticeably' },
			{ kind: 'neutral', text: 'Not botanically related to regular potatoes' }
		]
	},
	{
		id: 'garlic',
		name: 'Garlic',
		emoji: '🧄',
		impacts: [
			{ kind: 'positive', text: 'Allicin has antibacterial properties' },
			{ kind: 'positive', text: 'Modest blood-pressure lowering effect' },
			{ kind: 'negative', text: 'Common FODMAP trigger for IBS' },
			{ kind: 'negative', text: 'Large raw amounts can irritate the stomach' },
			{ kind: 'neutral', text: 'Crushing and resting 10 minutes activates allicin' }
		]
	},
	{
		id: 'almonds',
		name: 'Almonds',
		emoji: '🥜',
		impacts: [
			{ kind: 'positive', text: 'Vitamin E and magnesium protect cells and support muscles' },
			{ kind: 'positive', text: 'Fibre and fat combination blunts blood sugar spikes' },
			{ kind: 'negative', text: 'Calorie dense, easy to overeat' },
			{ kind: 'negative', text: 'Heavy water use in cultivation' },
			{ kind: 'neutral', text: 'A large part of the fat is not absorbed by the body' }
		]
	},
	{
		id: 'banana',
		name: 'Banana',
		emoji: '🍌',
		impacts: [
			{ kind: 'positive', text: 'Potassium and B6 support heart and brain function' },
			{ kind: 'positive', text: 'Quick, portable energy' },
			{ kind: 'negative', text: 'Higher in sugar than most fruit when ripe' },
			{ kind: 'neutral', text: 'Green bananas contain resistant starch instead of sugar' }
		]
	},
	{
		id: 'kale',
		name: 'Kale',
		emoji: '🥬',
		impacts: [
			{ kind: 'positive', text: 'Vitamin K supports bone health and blood clotting' },
			{ kind: 'positive', text: 'Calcium source for plant-based diets, supports bones' },
			{ kind: 'negative', text: 'Goitrogens may affect thyroid in very large raw amounts' },
			{ kind: 'negative', text: 'Vitamin K can interfere with blood thinners' }
		]
	},
	{
		id: 'greek-yogurt',
		name: 'Greek Yogurt',
		emoji: '🥛',
		impacts: [
			{ kind: 'positive', text: 'Roughly double the protein of regular yogurt' },
			{ kind: 'positive', text: 'Live cultures support gut flora' },
			{ kind: 'positive', text: 'Calcium supports bones and teeth' },
			{ kind: 'negative', text: 'Not suitable for lactose intolerance in larger portions' }
		]
	},
	{
		id: 'olive-oil',
		name: 'Olive Oil',
		emoji: '🫒',
		impacts: [
			{ kind: 'positive', text: 'Rich in monounsaturated fat and polyphenols' },
			{ kind: 'positive', text: 'Core part of the Mediterranean diet' },
			{ kind: 'negative', text: 'Very calorie dense as a pure fat' },
			{ kind: 'negative', text: 'Extra virgin loses polyphenols at high heat' },
			{ kind: 'neutral', text: 'Store dark and cool to avoid oxidation' }
		]
	}
];

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const client = new Database(url);
client.pragma('foreign_keys = ON');
const db = drizzle(client);

const existing = db.select({ id: foods.id }).from(foods).limit(1).get();

if (existing) {
	console.log('foods table is not empty, skipping seed');
} else {
	db.transaction((tx) => {
		for (const { impacts: items, ...food } of seedFoods) {
			tx.insert(foods).values(food).run();
			tx.insert(impacts)
				.values(items.map((impact, position) => ({ ...impact, foodId: food.id, position })))
				.run();
		}
	});
	console.log(`seeded ${seedFoods.length} foods`);
}

client.close();
