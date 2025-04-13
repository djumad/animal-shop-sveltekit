<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Animal Shop</title>
</svelte:head>

{@render children()}
