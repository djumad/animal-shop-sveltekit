<script>
    export let data;
    console.log(data.animal);
  </script>
  
  <main>
    <section>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Hewan</h2>
      <form method="post" enctype="multipart/form-data" class="space-y-5 bg-white shadow-lg p-6 rounded-xl">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700" for="nama">Nama Hewan</label>
            <input
              type="text"
              value={data.animal?.nama}
              name="nama"
              id="nama"
              required
              class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div>
            <label class="block mb-1 font-medium text-gray-700" for="jenis">Jenis</label>
            <input
              type="text"
              value={data.animal?.jenis}
              name="jenis"
              id="jenis"
              required
              class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div>
            <label class="block mb-1 font-medium text-gray-700" for="harga">Harga</label>
            <input
              type="number"
              value={data.animal?.harga}
              name="harga"
              id="harga"
              required
              class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div>
            <label class="block mb-1 font-medium text-gray-700" for="foto">Foto</label>
            <input
              type="file"
              name="foto"
              id="foto"
              accept="image/*"
              class="w-full border border-gray-300 rounded-lg p-2 bg-white"
            />
            <!-- Fixed the image src by removing the extra curly brace -->
            <img src={data.animal?.foto} alt="Hewan Foto" class="mt-4 w-full h-auto object-cover" />
          </div>
        </div>
  
        <div class="pt-4">
          <button
            type="submit"
            class="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Animal
          </button>
        </div>
      </form>
    </section>
  </main>
  