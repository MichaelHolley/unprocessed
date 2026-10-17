<script lang="ts">
	import { resolve } from '$app/paths';
	import AdminButton from '#lib/components/AdminButton.svelte';
	import { generateNewFood, listAdminFoods, logout } from './admin.remote.js';
</script>

<a href={resolve('/')} class="font-semibold underline underline-offset-4">&larr; Back to site</a>

<header class="mt-6 flex items-center justify-between gap-4">
	<h1 class="font-display text-5xl">Admin</h1>
	<form {...logout}>
		<AdminButton variant="secondary">Log out</AdminButton>
	</form>
</header>

<form {...generateNewFood} class="mt-8 rounded-3xl bg-white p-6">
	<label for="name" class="font-semibold">Add a food</label>
	<div class="mt-2 flex flex-col gap-3 sm:flex-row">
		<input
			{...generateNewFood.fields.name.as('text')}
			id="name"
			placeholder="Sweet potato"
			autocomplete="off"
			class="min-w-0 flex-1 rounded-full border-2 border-aubergine/15 px-5 py-3 transition-colors outline-none placeholder:text-aubergine/40 focus-visible:border-aubergine"
		/>
		<AdminButton disabled={!!generateNewFood.pending}>
			{generateNewFood.pending ? 'Generating…' : 'Generate'}
		</AdminButton>
	</div>
	{#each generateNewFood.fields.allIssues() ?? [] as issue (issue.message)}
		<p class="mt-2 text-sm font-medium text-bad">{issue.message}</p>
	{/each}
</form>

<ul class="mt-8 grid gap-3 sm:grid-cols-2">
	{#each await listAdminFoods() as food (food.id)}
		<li>
			<a
				href={resolve('/admin/[id]', { id: food.id })}
				class="flex items-center gap-3 rounded-3xl bg-white px-5 py-4 font-semibold outline-offset-4 focus-visible:outline-2 focus-visible:outline-aubergine"
			>
				<span class="text-2xl" aria-hidden="true">{food.emoji}</span>
				{food.name}
			</a>
		</li>
	{/each}
</ul>
