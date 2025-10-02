import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export type JwtUser = {
  id: string
  roles: string[]
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' })
  }
  const token = authHeader.substring('Bearer '.length)
  try {
    const secret = process.env.JWT_SECRET as string
    const payload = jwt.verify(token, secret) as JwtUser
    ;(req as any).user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireRoles(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtUser | undefined
    if (!user) return res.status(401).json({ message: 'Unauthenticated' })
    const ok = user.roles.some((r) => allowed.includes(r))
    if (!ok) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}

