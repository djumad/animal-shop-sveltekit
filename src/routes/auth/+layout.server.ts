// src/routes/auth/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prismaClient } from '$lib/database/prisma';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('session');
  console.log("session : " , token);

  if (!token) {
    throw redirect(302, '/login');
  }

  const user = await prismaClient.user.findFirst({
    where: { token }
  });

  if (!user) {
    // token tidak valid
    cookies.delete('session', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });      
    throw redirect(302, '/login');
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      nama: user.nama,
      role : user.role
    }
  };
};
