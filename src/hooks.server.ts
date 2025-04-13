import { redirect, type Handle } from '@sveltejs/kit';
import { prismaClient } from '$lib/database/prisma';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  if (session) {
    const user = await prismaClient.user.findFirst({
      where: { token : session }
    });
    if (user) {
      event.locals.user = user; // simpan user ke locals
    }else {
      event.cookies.delete('session' , {
        path : '/'
      })
    }
  }

  return resolve(event);
};
