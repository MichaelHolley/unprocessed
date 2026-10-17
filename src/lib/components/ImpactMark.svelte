<script lang="ts">
	import type { ImpactKind } from '#lib/foods.js';

	let { kind, class: className = '' }: { kind: ImpactKind; class?: string } = $props();

	const fill: Record<ImpactKind, string> = {
		positive: 'bg-good',
		negative: 'bg-bad',
		neutral: 'bg-tip'
	};
</script>

<span
	class={[
		'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-white ring-2 ring-white',
		fill[kind],
		className
	]}
	aria-hidden="true"
>
	<svg
		viewBox="0 0 16 16"
		class="size-3.5"
		fill="none"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
	>
		{#if kind === 'positive'}
			<path d="M8 3v10M3 8h10" />
		{:else if kind === 'negative'}
			<path d="M3 8h10" />
		{:else}
			<path d="M8 7.5v5M8 3.6v.1" />
		{/if}
	</svg>
</span>
