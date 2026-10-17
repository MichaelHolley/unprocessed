<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { isHttpError } from '@sveltejs/kit';
	import AdminButton from '#lib/components/AdminButton.svelte';
	import { IMPACT_KINDS } from '#lib/foods.js';
	import ImpactMark from '#lib/components/ImpactMark.svelte';
	import {
		getAdminFood,
		listAdminFoods,
		regenerateImpacts,
		removeFood,
		saveFood
	} from '../admin.remote.js';

	let { params } = $props();

	const food = $derived(await getAdminFood(params.id));
	const save = $derived(saveFood.for(params.id));

	let busy = $state(false);
	let actionError = $state('');

	async function run(action: () => Promise<void>) {
		busy = true;
		actionError = '';
		try {
			await action();
		} catch (cause) {
			actionError = isHttpError(cause) ? cause.body.message : 'Something went wrong';
		} finally {
			busy = false;
		}
	}

	const regenerate = () =>
		run(async () => {
			const updated = await regenerateImpacts(params.id);
			getAdminFood(params.id).set(updated);
			save.fields.impacts.set(updated.impacts);
		});

	const remove = () =>
		run(async () => {
			if (!confirm(`Delete ${food.name}? This cannot be undone.`)) return;
			await removeFood(params.id);
			await listAdminFoods().refresh();
			await goto(resolve('/admin'));
		});
</script>

<a href={resolve('/admin')} class="font-semibold underline underline-offset-4">&larr; All foods</a>

<h1 class="mt-4 font-display text-5xl">
	<span aria-hidden="true">{food.emoji}</span>
	{food.name}
</h1>
<p class="mt-1 text-aubergine/60">/{food.id}</p>

<form {...save} class="mt-8 rounded-3xl bg-white p-6">
	<input {...save.fields.id.as('hidden', food.id)} />

	<div class="grid grid-cols-[5rem_1fr] gap-3">
		<div>
			<label for="emoji" class="font-semibold">Emoji</label>
			<input
				{...save.fields.emoji.as('text', food.emoji)}
				id="emoji"
				class="mt-2 w-full rounded-full border-2 border-aubergine/15 px-4 py-3 text-center transition-colors outline-none focus-visible:border-aubergine"
			/>
		</div>
		<div>
			<label for="name" class="font-semibold">Name</label>
			<input
				{...save.fields.name.as('text', food.name)}
				id="name"
				class="mt-2 w-full rounded-full border-2 border-aubergine/15 px-5 py-3 transition-colors outline-none focus-visible:border-aubergine"
			/>
		</div>
	</div>

	<h2 class="mt-8 font-semibold">Impacts</h2>
	<ul class="mt-2 grid gap-3">
		{#each food.impacts as impact, i (i)}
			{@const field = save.fields.impacts[i]}
			<li class="flex items-center gap-3">
				<ImpactMark kind={field.kind.value() ?? impact.kind} />
				<select
					{...field.kind.as('select', impact.kind)}
					aria-label="Impact {i + 1} kind"
					class="rounded-full border-2 border-aubergine/15 bg-white px-3 py-3 outline-none focus-visible:border-aubergine"
				>
					{#each IMPACT_KINDS as kind (kind)}
						<option value={kind}>{kind}</option>
					{/each}
				</select>
				<input
					{...field.text.as('text', impact.text)}
					aria-label="Impact {i + 1} text"
					class="min-w-0 flex-1 rounded-full border-2 border-aubergine/15 px-5 py-3 transition-colors outline-none focus-visible:border-aubergine"
				/>
			</li>
		{/each}
	</ul>

	{#each save.fields.allIssues() ?? [] as issue (issue.message)}
		<p class="mt-3 text-sm font-medium text-bad">{issue.message}</p>
	{/each}

	<div class="mt-6">
		<AdminButton disabled={!!save.pending}>{save.pending ? 'Saving…' : 'Save'}</AdminButton>
	</div>
</form>

<div class="mt-6 flex flex-wrap gap-3">
	<AdminButton type="button" variant="secondary" disabled={busy} onclick={regenerate}>
		{busy ? 'Working…' : 'Regenerate impacts'}
	</AdminButton>
	<AdminButton type="button" variant="danger" disabled={busy} onclick={remove}>Delete</AdminButton>
</div>
{#if actionError}
	<p class="mt-3 text-sm font-medium text-bad">{actionError}</p>
{/if}
