import { prismaClient } from '$lib/database/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const id = params.id;
    const animal = await prismaClient.animal.findFirst({
        where : {
            id : id
        }
    });
    return { animal };
}) satisfies PageServerLoad;