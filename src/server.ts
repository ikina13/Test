import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { json, urlencoded } from 'express'

import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { membersRouter } from './routes/members'
import { announcementsRouter } from './routes/announcements'
import { eventsRouter } from './routes/events'
import { donationsRouter } from './routes/donations'
import { rosterRouter } from './routes/roster'
import { assetsRouter } from './routes/assets'
import { financeRouter } from './routes/finance'
import { procurementRouter } from './routes/procurement'
import { sermonsRouter } from './routes/sermons'

const app = express()
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'aic-changombe-api' })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/members', membersRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/donations', donationsRouter)
app.use('/api/roster', rosterRouter)
app.use('/api/assets', assetsRouter)
app.use('/api/finance', financeRouter)
app.use('/api/procurement', procurementRouter)
app.use('/api/sermons', sermonsRouter)

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})

