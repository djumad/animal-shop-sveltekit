import type { Actions, PageServerLoad } from './$types';
import { prismaClient } from '$lib/database/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { deleteFile, replaceFile, saveFile } from '$lib/server/upload';

export const load: PageServerLoad = async ({ locals }) => {
  console.log(locals.user);
  const animals = await prismaClient.animal.findMany();
  console.log(animals);
  return { animals };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    console.log('Request prototype:', Object.getPrototypeOf(request));
    console.log('typeof request.formData:', typeof request.formData);
    const user = locals.user;
    console.log(user);
    if (!user) return fail(401, { message: 'Unauthorized' });

    const formData = await request.formData();
    const nama = formData.get('nama') as string;
    const jenis = formData.get('jenis') as string;
    const harga = formData.get('harga') as string;
    const foto = formData.get('foto') as File;

    const upload = await saveFile(foto, 'uploads/animal');

    console.log(upload);
    if (!upload.success) {
      return fail(400, { message: upload.error });
    }

    await prismaClient.animal.create({
      data: {
        nama,
        jenis,
        harga: BigInt(harga),
        foto: upload.path!,
        userId: user.id
      }
    });

    throw redirect(303, '/auth/dashboard');
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

    await deleteFile(existing.foto); // hapus file dari server

    await prismaClient.animal.delete({
      where: { id }
    });

    throw redirect(303, '/auth/dashboard');
  },

  logout: async ({ cookies }) => {
    const token = cookies.get('session');

    // Hapus token dari database jika perlu
    if (token) {
      await prismaClient.user.updateMany({
        where: { token },
        data: { token: null }
      });
    }

    // Hapus cookie session
    cookies.delete('session', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Redirect ke halaman login
    throw redirect(302, '/login');

  }


};
