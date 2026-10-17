<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		variant = 'primary',
		class: className = '',
		children,
		...rest
	}: HTMLButtonAttributes & { variant?: 'primary' | 'secondary' | 'danger' } = $props();

	const styles = {
		primary: 'bg-aubergine text-white',
		secondary: 'border-2 border-aubergine/15 bg-white text-aubergine',
		danger: 'border-2 border-bad/30 bg-white text-bad'
	};
</script>

<button
	{...rest}
	class={[
		'rounded-full px-5 py-2.5 font-semibold outline-offset-4 focus-visible:outline-2 focus-visible:outline-aubergine disabled:opacity-50',
		styles[variant],
		className
	]}
>
	{@render children?.()}
</button>
