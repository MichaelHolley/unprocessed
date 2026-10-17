<script lang="ts">
	import FoodCard from '#lib/components/FoodCard.svelte';
	import ImpactMark from '#lib/components/ImpactMark.svelte';
	import type { ImpactKind } from '#lib/foods.js';
	import { getFoods } from './foods.remote.js';

	const foods = await getFoods();

	let query = $state('');

	const results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return foods;
		return foods.filter(
			(food) =>
				food.name.toLowerCase().includes(q) ||
				food.impacts.some((impact) => impact.text.toLowerCase().includes(q))
		);
	});

	const legend: { kind: ImpactKind; text: string }[] = [
		{ kind: 'positive', text: 'Good for you' },
		{ kind: 'negative', text: 'Watch out' },
		{ kind: 'neutral', text: 'Good to know' }
	];
</script>

<svelte:head>
	<title>Unprocessed - what single ingredients do to you</title>
	<meta
		name="description"
		content="What single ingredients actually do to you, the good and the bad."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
	<header class="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
		<div>
			<h1 class="font-display text-6xl leading-[0.9] sm:text-8xl">Unprocessed</h1>
			<p class="mt-4 max-w-md text-lg text-aubergine/70">
				What single ingredients actually do to you, the good and the bad.
			</p>
		</div>

		<div class="w-full lg:w-[26rem]">
			<label for="search" class="sr-only">Search foods</label>
			<input
				id="search"
				bind:value={query}
				type="search"
				placeholder="Search broccoli, protein, omega-3…"
				class="w-full rounded-full border-2 border-aubergine/15 bg-white px-5 py-3.5 transition-colors outline-none placeholder:text-aubergine/40 focus-visible:border-aubergine"
			/>
			<ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
				{#each legend as item (item.kind)}
					<li class="flex items-center gap-2">
						<ImpactMark kind={item.kind} />
						{item.text}
					</li>
				{/each}
			</ul>
		</div>
	</header>

	<main>
		{#if results.length}
			<div class="columns-1 gap-5 sm:columns-2 lg:columns-3">
				{#each results as food (food.id)}
					<FoodCard {food} />
				{/each}
			</div>
		{:else}
			<div class="rounded-3xl border-2 border-dashed border-pistachio-deep py-16 text-center">
				<p class="font-display text-3xl">No match for “{query}”</p>
				<p class="mt-2 text-aubergine/70">Try a food like oats, or a nutrient like iron.</p>
				<button
					type="button"
					class="mt-6 rounded-full bg-aubergine px-5 py-2.5 font-semibold text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-aubergine"
					onclick={() => (query = '')}
				>
					Clear search
				</button>
			</div>
		{/if}
	</main>
</div>
