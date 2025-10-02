import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'

export const usersRouter = Router()

usersRouter.get('/me', authenticate, async (req, res) => {
  const userId = (req as any).user.id as string
  const me = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } }, member: true }
  })
  res.json(me)
})

usersRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(users)
})

