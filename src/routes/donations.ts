import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const donationsRouter = Router()

const donationSchema = z.object({
  memberId: z.string().optional(),
  donationTypeId: z.number().int(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['CASH', 'STRIPE', 'PAYPAL', 'MPESA']),
  externalReference: z.string().optional()
})

donationsRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.donation.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(list)
})

donationsRouter.post('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const parse = donationSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.donation.create({
    data: { ...parse.data, amount: parse.data.amount, receivedByUserId: (req as any).user.id }
  })
  res.status(201).json(created)
})

// Donation types
donationsRouter.get('/types', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.donationType.findMany({ orderBy: { name: 'asc' } })
  res.json(list)
})

donationsRouter.post('/types', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const schema = z.object({ name: z.string(), active: z.boolean().optional() })
  const parse = schema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.donationType.create({ data: { name: parse.data.name, active: parse.data.active ?? true } })
  res.status(201).json(created)
})

