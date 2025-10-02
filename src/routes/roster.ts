import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const rosterRouter = Router()

const rosterSchema = z.object({
  date: z.string().datetime(),
  serviceName: z.string().optional(),
  eventId: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'TREASURER', 'USHER', 'MEMBER']),
  userId: z.string()
})

rosterRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const list = await prisma.rosterAssignment.findMany({ orderBy: { date: 'desc' } })
  res.json(list)
})

rosterRouter.post('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = rosterSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.rosterAssignment.create({ data: parse.data })
  res.status(201).json(created)
})

