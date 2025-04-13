import type { Actions, PageServerLoad } from './$types';
import { prismaClient } from '$lib/database/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { deleteFile, saveFile } from '$lib/server/upload';
import { z } from 'zod';

const animalSchema = z.object({
  nama: z.string().min(1, 'Nama harus diisi'),
  jenis: z.string().min(1, 'Jenis harus diisi'),
  harga: z.string().refine(val => !isNaN(Number(val)), {
    message: 'Harga harus berupa angka',
  }),
});

export const load: PageServerLoad = async ({ locals }) => {
  console.log(locals.user);
  const animals = await prismaClient.animal.findMany();
  console.log(animals);
  return { animals };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) return fail(401, { message: 'Unauthorized' });

    const formData = await request.formData();
    const nama = formData.get('nama') as string;
    const jenis = formData.get('jenis') as string;
    const harga = formData.get('harga') as string;
    const foto = formData.get('foto') as File;

    // Validasi input dengan Zod
    const parsed = animalSchema.safeParse({ nama, jenis, harga });
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return fail(400, { message: 'Validasi gagal', errors });
    }

    const upload = await saveFile(foto, 'uploads/animal');

    if (!upload.success) {
      return fail(400, { message: upload.error });
    }

    await prismaClient.animal.create({
      data: {
        nama: parsed.data.nama,
        jenis: parsed.data.jenis,
        harga: BigInt(parsed.data.harga),
        foto: upload.path!,
        userId: user.id
      }
    });

    // throw redirect(303, '/auth/dashboard') && {message : "success"};
    return {message : "success"};
  },

  delete: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) return fail(401, { message: 'Unauthorized' });

    const formData = await request.formData();
    const id = formData.get('id') as string;

    const existing = await prismaClient.animal.findUnique({
      where: { id }
    });

    if (!existing) {
      return fail(404, { message: 'Data tidak ditemukan' });
    }

    await deleteFile(existing.foto);

    await prismaClient.animal.delete({
      where: { id }
    });

    return {deleteSuccess : "Delete Success"};
  },

  logout: async ({ cookies }) => {
    const token = cookies.get('session');

    if (token) {
      await prismaClient.user.updateMany({
        where: { token },
        data: { token: null }
      });
    }

    cookies.delete('session', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return {logoutSuccess : "Logout Success"}
  }
};
