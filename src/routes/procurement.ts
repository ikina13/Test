import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const procurementRouter = Router()

// Vendors
const vendorSchema = z.object({ name: z.string(), email: z.string().email().optional(), phone: z.string().optional(), address: z.string().optional(), notes: z.string().optional() })
procurementRouter.get('/vendors', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.vendor.findMany({ orderBy: { name: 'asc' } })
  res.json(list)
})
procurementRouter.post('/vendors', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const parse = vendorSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.vendor.create({ data: parse.data })
  res.status(201).json(created)
})

// Requisitions
const reqSchema = z.object({ description: z.string().optional() })
procurementRouter.get('/requisitions', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.requisition.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(list)
})
procurementRouter.post('/requisitions', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const parse = reqSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.requisition.create({ data: { requestedById: (req as any).user.id, description: parse.data.description } })
  res.status(201).json(created)
})

// Purchase orders
const poSchema = z.object({ requisitionId: z.string().optional(), vendorId: z.string(), expectedDelivery: z.string().datetime().optional() })
procurementRouter.get('/pos', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (_req, res) => {
  const list = await prisma.purchaseOrder.findMany({ orderBy: { orderedAt: 'desc' } })
  res.json(list)
})
procurementRouter.post('/pos', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'TREASURER'), async (req, res) => {
  const parse = poSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.purchaseOrder.create({ data: parse.data })
  res.status(201).json(created)
})

