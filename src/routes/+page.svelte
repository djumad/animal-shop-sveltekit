<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";

    export let data;
    const animal = data.animal;
</script>

<Navbar />
<main class="m-4">
    {#if animal.length > 0}
      <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each animal as data}
          <a href="/detail/{data.id}">
            <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col border border-gray-100">
              <img 
                src={data.foto} 
                alt={data.nama} 
                class="w-full h-56 object-cover"
                loading="lazy"
              />
              <div class="p-5 flex-1 flex flex-col">
                <div class="space-y-2 mb-4">
                  <h3 class="text-xl font-semibold text-gray-900 truncate">{data.nama}</h3>
                  <p class="text-gray-600">
                    <span class="font-medium">Jenis Hewan:</span> {data.jenis}
                  </p>
                  <p class="text-blue-600 font-bold text-lg">
                    Rp {Number(data.harga).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div></a>
        {/each}
      </div>
    {:else}
      <div class="bg-white p-8 rounded-xl shadow-sm text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada data hewan</h3>
      </div>
    {/if}
</main>

