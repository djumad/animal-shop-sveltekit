<script lang="ts">
  import { goto } from '$app/navigation';
  import Swal from 'sweetalert2';
  import { onMount } from 'svelte';

  export let data;
  export let form;
  let selectedImage: string | null = null;

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  const animal = data.animals;

  onMount(() => {
    if (form?.message) {
      Swal.fire({
        title: 'Sukses!',
        text: form.message,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Oke',
      }).then(() => {
        goto('/auth/dashboard');
      });
    }

    if (form?.deleteSuccess) {
      Swal.fire({
        title: 'Data dihapus!',
        text: 'Data hewan telah berhasil dihapus',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Oke',
      }).then(() => {
        goto('/auth/dashboard');
      });
    }
  });

  // Fungsi untuk konfirmasi delete
  function confirmDelete(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    Swal.fire({
      title: 'Yakin ingin menghapus hewan ini?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  }

  // Fungsi untuk konfirmasi logout
  function confirmLogout(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    Swal.fire({
      title: 'Yakin ingin logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  }
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Header dengan tombol logout -->
  <header class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
    <form action="?/logout" method="post" on:submit|preventDefault={confirmLogout}>
      <button 
        type="submit" 
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </form>
  </header>

  <!-- Section Daftar Hewan -->
  <section class="mb-12">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Daftar Hewan</h2>
      <a 
        href="#tambah-hewan" 
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        + Tambah Hewan
      </a>
    </div>

    {#if animal.length > 0}
      <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each animal as data}
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
                  <span class="font-medium">Jenis:</span> {data.jenis}
                </p>
                <p class="text-blue-600 font-bold text-lg">
                  Rp {Number(data.harga).toLocaleString('id-ID')}
                </p>
              </div>
              <div class="mt-auto flex gap-2">
                <a
                  href={`/auth/dashboard/edit/${data.id}`}
                  class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors text-sm text-center"
                >
                  Edit
                </a>

                <form method="post" action="?/delete" class="flex-1" on:submit|preventDefault={confirmDelete}>
                  <input type="hidden" name="id" value={data.id} />
                  <button
                    type="submit"
                    class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="bg-white p-8 rounded-xl shadow-sm text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada data hewan</h3>
        <p class="mt-1 text-gray-500">Tambahkan hewan pertama Anda dengan mengklik tombol di atas</p>
      </div>
    {/if}
  </section>

  <!-- Section Tambah Hewan -->
  <section id="tambah-hewan" class="bg-white shadow-lg rounded-xl overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800">Tambah Hewan Baru</h2>
    </div>
    <form method="post" action="?/create" enctype="multipart/form-data" class="p-6 space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block mb-2 font-medium text-gray-700" for="nama">Nama Hewan</label>
          <input
            type="text"
            name="nama"
            id="nama"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Kucing Anggora"
          />
        </div>

        <div>
          <label class="block mb-2 font-medium text-gray-700" for="jenis">Jenis Hewan</label>
          <input
            type="text"
            name="jenis"
            id="jenis"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Kucing"
          />
        </div>

        <div>
          <label class="block mb-2 font-medium text-gray-700" for="harga">Harga (Rp)</label>
          <input
            type="number"
            name="harga"
            id="harga"
            required
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 1500000"
          />
        </div>

        <div>
          <label class="block mb-2 font-medium text-gray-700" for="foto">Foto Hewan</label>
          <div class="flex items-center justify-center w-full">
            <label for="foto" class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer transition-colors">
              <div class="flex flex-col items-center justify-center pt-5 pb-6 h-full">
                {#if !selectedImage}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">
                    <span class="font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                {:else}
                  <img src={selectedImage} class="h-full w-full object-contain" alt="Preview gambar" />
                {/if}
              </div>
              <input 
                id="foto" 
                name="foto" 
                type="file" 
                accept="image/*" 
                required 
                class="hidden"
                on:change={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Simpan Data Hewan
        </button>
      </div>
    </form>
  </section>
</main>