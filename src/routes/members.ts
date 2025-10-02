import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const membersRouter = Router()

const memberSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().datetime().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  joinDate: z.string().datetime().optional(),
  baptismDate: z.string().datetime().optional(),
  notes: z.string().optional()
})

membersRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'USHER'), async (_req, res) => {
  const list = await prisma.member.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(list)
})

membersRouter.get('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'USHER'), async (req, res) => {
  const member = await prisma.member.findUnique({ where: { id: req.params.id } })
  if (!member) return res.status(404).json({ message: 'Not found' })
  res.json(member)
})

membersRouter.post('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = memberSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.member.create({ data: parse.data })
  res.status(201).json(created)
})

membersRouter.put('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = memberSchema.partial().safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const updated = await prisma.member.update({ where: { id: req.params.id }, data: parse.data })
  res.json(updated)
})

membersRouter.delete('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.member.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

