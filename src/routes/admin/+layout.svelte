<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Unprocessed admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
	{@render children()}
</div>
