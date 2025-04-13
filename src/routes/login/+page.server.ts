import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { prismaClient } from '$lib/database/prisma';
import { v4 as uuid } from 'uuid';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return fail(400, { message: 'Email atau password salah.' });
    }

    const token = uuid();

    await prismaClient.user.update({
      where: { id: user.id },
      data: { token } 
    });

    cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    });

    throw redirect(302, '/auth/dashboard');
  }
};
