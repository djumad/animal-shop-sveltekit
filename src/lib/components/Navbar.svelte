<script>
	import { goto } from "$app/navigation";

	let isOpen = $state(false);
</script>

<nav class="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
	<div class="container mx-auto flex items-center justify-between">
		<!-- Logo -->
        <a href="/">
		    <div class="flex items-center space-x-3 text-2xl font-bold text-gray-800">
                <img src="/favicon.png" alt="Animal Shop Logo" class="w-10 h-10" />
			    <span>Animal Shop</span>
            </div>
        </a>

		<!-- Desktop Menu -->
		<div class="hidden md:flex space-x-6 text-base font-medium">
			<a href="/" class="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
			<a href="#about" class="text-gray-700 hover:text-blue-600 transition-colors">About</a>
			<a href="#services" class="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
			<a href="#contact" class="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
		</div>

		<!-- Mobile Menu Button -->
		<button 
			class="md:hidden text-gray-800 focus:outline-none" 
			aria-label="Toggle menu" 
			onclick={() => isOpen = !isOpen}
		>
			{#if isOpen}
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			{:else}
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			{/if}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if isOpen}
		<div class="md:hidden px-6 pt-4 pb-4 space-y-2 animate-fade-in-down">
			<a href="/" class="block text-gray-700 hover:text-blue-600 transition-colors">Home</a>
			<a href="#about" class="block text-gray-700 hover:text-blue-600 transition-colors">About</a>
			<a href="#services" class="block text-gray-700 hover:text-blue-600 transition-colors">Services</a>
			<a href="#contact" class="block text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
		</div>
	{/if}
</nav>

<style>
	@keyframes fade-in-down {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-down {
		animation: fade-in-down 0.3s ease-out;
	}
</style>
