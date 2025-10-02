import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const assetsRouter = Router()

const assetSchema = z.object({
  name: z.string(),
  category: z.string().optional(),
  purchaseDate: z.string().datetime().optional(),
  cost: z.number().optional(),
  condition: z.enum(['NEW', 'GOOD', 'NEEDS_REPAIR', 'BROKEN']).optional(),
  serialNumber: z.string().optional(),
  notes: z.string().optional()
})

assetsRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const list = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(list)
})

assetsRouter.post('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = assetSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.asset.create({ data: parse.data })
  res.status(201).json(created)
})

assetsRouter.put('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = assetSchema.partial().safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const updated = await prisma.asset.update({ where: { id: req.params.id }, data: parse.data })
  res.json(updated)
})

assetsRouter.delete('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.asset.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

