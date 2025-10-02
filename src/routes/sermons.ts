import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const sermonsRouter = Router()

// Public
sermonsRouter.get('/public', async (_req, res) => {
  const list = await prisma.sermon.findMany({ where: { published: true }, orderBy: { date: 'desc' } })
  res.json(list)
})

// Admin CRUD
const sermonSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  speaker: z.string().optional(),
  date: z.string().datetime().optional(),
  mediaType: z.enum(['AUDIO', 'VIDEO', 'PDF']),
  mediaUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  fileSizeBytes: z.number().int().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().datetime().optional()
})

sermonsRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const list = await prisma.sermon.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(list)
})

sermonsRouter.post('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = sermonSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.sermon.create({ data: parse.data })
  res.status(201).json(created)
})

sermonsRouter.put('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = sermonSchema.partial().safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const updated = await prisma.sermon.update({ where: { id: req.params.id }, data: parse.data })
  res.json(updated)
})

sermonsRouter.delete('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.sermon.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

