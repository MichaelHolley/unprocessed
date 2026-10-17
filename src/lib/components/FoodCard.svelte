<script lang="ts">
	import ImpactMark from './ImpactMark.svelte';
	import type { FoodItem, ImpactKind } from '#lib/foods.js';

	let { food }: { food: FoodItem } = $props();

	const label: Record<ImpactKind, string> = {
		positive: 'Good for you',
		negative: 'Watch out',
		neutral: 'Good to know'
	};
</script>

<article class="mb-5 break-inside-avoid rounded-3xl bg-white p-6 sm:p-7">
	<header class="mb-5 flex items-center gap-4">
		<span
			class="flex size-14 shrink-0 items-center justify-center rounded-full bg-pistachio text-3xl"
			aria-hidden="true"
		>
			{food.emoji}
		</span>
		<h2 class="font-display text-[1.75rem] leading-none">{food.name}</h2>
	</header>

	<ul class="space-y-3">
		{#each food.impacts as impact, i (i)}
			<li class="flex items-start gap-3">
				<ImpactMark kind={impact.kind} class="-mt-px" />
				<span class="sr-only">{label[impact.kind]}:</span>
				<span
					class={[
						'text-[0.9375rem] leading-snug',
						impact.kind === 'neutral' ? 'text-aubergine/65' : 'text-aubergine'
					]}
				>
					{impact.text}
				</span>
			</li>
		{/each}
	</ul>
</article>
