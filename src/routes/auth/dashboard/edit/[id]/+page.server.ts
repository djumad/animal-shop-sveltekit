import { prismaClient } from '$lib/database/prisma';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { replaceFile } from '$lib/server/upload';
import { z } from 'zod';

// Schema validasi Zod
const animalSchema = z.object({
  nama: z.string().min(1, 'Nama harus diisi'),
  jenis: z.string().min(1, 'Jenis harus diisi'),
  harga: z.string().refine(val => !isNaN(Number(val)), {
    message: 'Harga harus berupa angka',
  }),
});

// Load animal berdasarkan ID
export const load = (async ({ params }) => {
  const id = params.id;
  const animal = await prismaClient.animal.findFirst({
    where: {
      id: id
    }
  });
  return { animal };
}) satisfies PageServerLoad;

// Update animal
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

    // Validasi input
    const parsed = animalSchema.safeParse({ nama, jenis, harga });
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return fail(400, { message: 'Validasi gagal', errors });
    }

    const existing = await prismaClient.animal.findUnique({
      where: { id }
    });

    if (!existing) {
      return fail(404, { message: 'Data tidak ditemukan' });
    }

    let finalPath = existing.foto;

    // Ganti file jika ada file baru diupload
    if (foto && typeof foto !== 'string' && foto.size > 0) {
      const replaced = await replaceFile(existing.foto, foto, 'uploads/animal');

      if (!replaced.success || !replaced.path) {
        return fail(400, { message: replaced.error || 'Gagal mengganti file' });
      }

      finalPath = replaced.path;
    }

    const animal = await prismaClient.animal.update({
      where: { id },
      data: {
        nama: parsed.data.nama,
        jenis: parsed.data.jenis,
        harga: BigInt(parsed.data.harga),
        foto: finalPath
      }
    });

    return {message : `Data ${animal.nama} berhasil di update`};
  }
};