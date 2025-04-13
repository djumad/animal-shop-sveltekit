import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.createMany({
    data: [
      {
        nama: 'Admin Desa',
        email: 'admin@desa.com',
        profile: 'profile1.jpg',
        password: hashedPassword,
        role: 'admin',
      },
      {
        nama: 'User Biasa',
        email: 'user@desa.com',
        profile: 'profile2.jpg',
        password: hashedPassword,
        role: 'members',
      },
    ],
  })

  console.log('✅ User seed berhasil!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
