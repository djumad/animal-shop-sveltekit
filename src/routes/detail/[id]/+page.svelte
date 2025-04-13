<script lang="ts">
    export let data;
</script>

<main class="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4 py-10">
    <div class="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-md w-full transform transition duration-300 hover:scale-[1.01]">
        <img 
            src={data.animal?.foto} 
            alt={data.animal?.nama} 
            class="w-full object-cover h-full"
        />

        <div class="p-6 space-y-3">
            <h2 class="text-2xl font-bold text-gray-800">{data.animal?.nama}</h2>
            
            <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-500">Jenis:</span>
                <span class="text-gray-700">{data.animal?.jenis}</span>
            </div>

            <div class="pt-2 border-t border-gray-200">
                <p class="text-gray-500 text-sm">Harga</p>
                <p class="text-blue-600 font-extrabold text-2xl">
                    Rp {data.animal?.harga?.toLocaleString('id-ID')}
                </p>
            </div>
            <a href="/" class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200">Back</a>
        </div>
    </div>
</main>
