<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Swal from 'sweetalert2';
  
  export let data;
  export let form;
  
  let selectedImage: string | null = data.animal?.foto || null;
  let fileName: string = '';

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      fileName = input.files[0].name;
      reader.onload = (e) => {
        selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onMount(() => {
    if (form?.message) {
      Swal.fire({
        title: 'Success',
        text: form.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then(() => {
        goto('/auth/dashboard');
      });
    }
  });
</script>

<main class="max-w-4xl mx-auto px-4 py-8">
  <section class="bg-white rounded-xl shadow-md overflow-hidden">
    <!-- Header Section -->
    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800">
        {data.animal ? 'Update Hewan' : 'Tambah Hewan Baru'}
      </h2>
      <p class="text-gray-600 mt-1">
        {data.animal ? 'Perbarui informasi hewan' : 'Tambahkan hewan baru ke database'}
      </p>
    </div>

    <!-- Form Section -->
    <form method="post" enctype="multipart/form-data" class="p-6 space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Nama Hewan -->
        <div>
          <label class="block mb-2 font-medium text-gray-700" for="nama">Nama Hewan</label>
          <input
            type="text"
            value={data.animal?.nama}
            name="nama"
            id="nama"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Kucing Anggora"
          />
        </div>

        <!-- Jenis Hewan -->
        <div>
          <label class="block mb-2 font-medium text-gray-700" for="jenis">Jenis Hewan</label>
          <input
            type="text"
            value={data.animal?.jenis}
            name="jenis"
            id="jenis"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Kucing"
          />
        </div>

        <!-- Harga -->
        <div>
          <label class="block mb-2 font-medium text-gray-700" for="harga">Harga (Rp)</label>
          <input
            type="number"
            value={data.animal?.harga}
            name="harga"
            id="harga"
            required
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 1500000"
          />
        </div>

        <!-- Foto Upload -->
        <div class="md:col-span-2">
          <label class="block mb-2 font-medium text-gray-700">Foto Hewan</label>
          
          <div class="flex flex-col space-y-4">
            <!-- File Input -->
            <div class="flex items-center space-x-4">
              <label class="flex-1">
                <div class="relative">
                  <input
                    type="file"
                    name="foto"
                    id="foto"
                    accept="image/*"
                    on:change={handleFileChange}
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div class="px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <span class="text-gray-700 truncate">
                      {fileName || (data.animal?.foto ? 'Ganti foto...' : 'Pilih foto...')}
                    </span>
                  </div>
                </div>
              </label>
              {#if fileName || data.animal?.foto}
                <button
                  type="button"
                  on:click={() => { 
                    selectedImage = null; 
                    fileName = ''; 
                    const fileInput = document.getElementById('foto') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  class="text-red-600 hover:text-red-800 transition-colors"
                >
                  Hapus
                </button>
              {/if}
            </div>

            <!-- Image Preview -->
            {#if selectedImage}
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  class="w-full h-64 object-contain bg-gray-100"
                />
              </div>
            {:else}
              <div class="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-64 flex items-center justify-center">
                <div class="text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">
                    {data.animal?.foto ? 'Tidak ada gambar yang dipilih' : 'Belum ada gambar'}
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-end">
        <a
          href="/auth/dashboard"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mr-4"
        >
          Batal
        </a>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {data.animal ? 'Update Hewan' : 'Simpan Hewan'}
        </button>
      </div>
    </form>
  </section>
</main>