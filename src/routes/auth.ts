import { Router } from 'express'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

export const authRouter = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
})

authRouter.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const { email, password, firstName, lastName } = parse.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ message: 'Email already in use' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      roles: {
        create: [{ role: { connect: { name: 'MEMBER' } } }]
      }
    },
    include: { roles: { include: { role: true } } }
  })
  const token = signToken(user.id, user.roles.map((r) => r.role.name))
  res.status(201).json({ token })
})

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })

authRouter.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error.flatten())
  const { email, password } = parse.data
  const user = await prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } } } })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = signToken(user.id, user.roles.map((r) => r.role.name))
  res.json({ token })
})

function signToken(id: string, roles: string[]) {
  const secret = process.env.JWT_SECRET as string
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign({ id, roles }, secret, { expiresIn })
}

