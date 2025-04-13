import { prismaClient } from '$lib/database/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const animal = await prismaClient.animal.findMany();

    return {animal};
}) satisfies PageServerLoad;