import 'dotenv/config'
import { PrismaClient, RoleName } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Roles
  const roleNames: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'TREASURER', 'USHER', 'MEMBER']
  for (const name of roleNames) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } })
  }

  // Donation types
  const donationTypes = ['Tithe', 'Thanksgiving', 'Love Offering']
  for (const name of donationTypes) {
    await prisma.donationType.upsert({ where: { name }, update: {}, create: { name } })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seed completed')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

