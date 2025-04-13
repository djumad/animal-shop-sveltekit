import { prismaClient } from '$lib/database/prisma';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { replaceFile } from '$lib/server/upload'; // Assuming this function handles the file replacement

// Loading animal data based on ID
export const load = (async ({ params }) => {
  const id = params.id;
  const animal = await prismaClient.animal.findFirst({
    where: {
      id: id
    }
  });
  return { animal };
}) satisfies PageServerLoad;

// Handling form submission for updating animal data
export const actions: Actions = {
    default: async ({ request, locals, params }) => {
        const user = locals.user;
        if (!user) return fail(401, { message: 'Unauthorized' });
    
        const formData = await request.formData();
        const id = params.id;
        const nama = formData.get('nama') as string;
        const jenis = formData.get('jenis') as string;
        const harga = formData.get('harga') as string;
        const foto = formData.get('foto') as File;
        console.log(foto)
        const existing = await prismaClient.animal.findUnique({
          where: { id }
        });
    
        if (!existing) {
          return fail(404, { message: 'Data tidak ditemukan' });
        }
    
        let finalPath = existing.foto;
    
        // If the user uploads a new file
        if (foto && typeof foto !== 'string' && foto.size > 0) {
          const replaced = await replaceFile(existing.foto, foto, 'uploads/animal');
    
          if (!replaced.success || !replaced.path) {
            return fail(400, { message: replaced.error || 'Gagal mengganti file' });
          }
    
          finalPath = replaced.path;
        }
    
        await prismaClient.animal.update({
          where: { id },
          data: {
            nama,
            jenis,
            harga: BigInt(harga),
            foto: finalPath
          }
        });
    
        throw redirect(303, '/auth/dashboard');
      }
    
};
