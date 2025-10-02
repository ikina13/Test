import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, requireRoles } from '../middleware/auth'
import { z } from 'zod'

export const eventsRouter = Router()

// Public: list upcoming events
eventsRouter.get('/public', async (_req, res) => {
  const now = new Date()
  const list = await prisma.event.findMany({
    where: { isPublic: true, startAt: { gte: now } },
    orderBy: { startAt: 'asc' }
  })
  res.json(list)
})

const eventSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  location: z.string().optional(),
  isPublic: z.boolean().optional()
})

eventsRouter.get('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const list = await prisma.event.findMany({ orderBy: { startAt: 'desc' } })
  res.json(list)
})

eventsRouter.post('/', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = eventSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const created = await prisma.event.create({
    data: { ...parse.data, createdById: (req as any).user.id }
  })
  res.status(201).json(created)
})

eventsRouter.put('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parse = eventSchema.partial().safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const updated = await prisma.event.update({ where: { id: req.params.id }, data: parse.data })
  res.json(updated)
})

eventsRouter.delete('/:id', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.event.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

// RSVP
const rsvpSchema = z.object({ status: z.enum(['GOING', 'INTERESTED', 'NOT_GOING']) })
eventsRouter.post('/:id/rsvp', authenticate, async (req, res) => {
  const parse = rsvpSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const member = await prisma.member.findFirst({ where: { userId: (req as any).user.id } })
  if (!member) return res.status(400).json({ message: 'No member profile' })
  const rsvp = await prisma.eventRSVP.upsert({
    where: { eventId_memberId: { eventId: req.params.id, memberId: member.id } },
    update: { status: parse.data.status },
    create: { eventId: req.params.id, memberId: member.id, status: parse.data.status }
  })
  res.json(rsvp)
})

// Attendance
eventsRouter.post('/:id/checkin/:memberId', authenticate, requireRoles('SUPER_ADMIN', 'ADMIN', 'USHER'), async (req, res) => {
  const att = await prisma.eventAttendance.upsert({
    where: { eventId_memberId: { eventId: req.params.id, memberId: req.params.memberId } },
    update: { checkedInAt: new Date(), markedByUserId: (req as any).user.id },
    create: { eventId: req.params.id, memberId: req.params.memberId, checkedInAt: new Date(), markedByUserId: (req as any).user.id }
  })
  res.json(att)
})

