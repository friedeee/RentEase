const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@rentease.com' },
    update: {},
    create: {
      email: 'admin@rentease.com',
      password: hashedPassword,
      name: 'Administrateur'
    }
  })

  console.log('Utilisateur créé !')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())