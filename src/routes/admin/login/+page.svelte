<script lang="ts">
	import AdminButton from '#lib/components/AdminButton.svelte';
	import { login } from '../admin.remote.js';
</script>

<h1 class="font-display text-5xl">Admin</h1>

<form {...login} class="mt-8 rounded-3xl bg-white p-6">
	<label for="password" class="font-semibold">Password</label>
	<input
		{...login.fields._password.as('password')}
		id="password"
		autocomplete="current-password"
		class="mt-2 w-full rounded-full border-2 border-aubergine/15 px-5 py-3 transition-colors outline-none focus-visible:border-aubergine"
	/>
	{#each login.fields._password.issues() ?? [] as issue (issue.message)}
		<p class="mt-2 text-sm font-medium text-bad">{issue.message}</p>
	{/each}
	<AdminButton class="mt-4" disabled={!!login.pending}>Log in</AdminButton>
</form>
