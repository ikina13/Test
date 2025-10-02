import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const financeRouter = Router()

// Categories
const categorySchema = z.object({ name: z.string(), type: z.enum(['INCOME', 'EXPENSE']) })
financeRouter.get('/categories', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.financeCategory.findMany({ orderBy: { name: 'asc' } })
  res.json(list)
})
financeRouter.post('/categories', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const parse = categorySchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.financeCategory.create({ data: parse.data })
  res.status(201).json(created)
})

// Transactions
const txSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.number().int().optional(),
  amount: z.number().positive(),
  date: z.string().datetime().optional(),
  description: z.string().optional(),
  isPettyCash: z.boolean().optional()
})
financeRouter.get('/transactions', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.financeTransaction.findMany({ orderBy: { date: 'desc' } })
  res.json(list)
})
financeRouter.post('/transactions', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const parse = txSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.financeTransaction.create({ data: { ...parse.data, createdById: (req as any).user.id } })
  res.status(201).json(created)
})

// Petty cash
const pettySchema = z.object({ direction: z.enum(['ADD', 'SPEND']), amount: z.number().positive(), description: z.string().optional() })
financeRouter.get('/pettycash', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.pettyCashTransaction.findMany({ orderBy: { date: 'desc' } })
  res.json(list)
})
financeRouter.post('/pettycash', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const parse = pettySchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.pettyCashTransaction.create({
    data: { ...parse.data, createdById: (req as any).user.id }
  })
  res.status(201).json(created)
})

