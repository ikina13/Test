import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const announcementsRouter = Router()

// Public list
announcementsRouter.get('/public', async (_req, res) => {
  const list = await prisma.announcement.findMany({
    where: { isPublic: true, published: true },
    orderBy: { publishedAt: 'desc' }
  })
  res.json(list)
})

// Admin CRUD
const annSchema = z.object({
  title: z.string(),
  content: z.string(),
  type: z.enum(['GENERAL', 'URGENT', 'EVENT_PROMO']),
  isPublic: z.boolean().optional(),
  isMemberPortal: z.boolean().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().optional()
})

announcementsRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const list = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(list)
})

announcementsRouter.post('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = annSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.announcement.create({ data: parse.data })
  res.status(201).json(created)
})

announcementsRouter.put('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = annSchema.partial().safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const updated = await prisma.announcement.update({ where: { id: req.params.id }, data: parse.data })
  res.json(updated)
})

announcementsRouter.delete('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.announcement.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

