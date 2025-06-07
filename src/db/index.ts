import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

if (!process.env.POSTGRES_DATABASE_URL) {
  throw new Error('POSTGRES_DATABASE_URL is not set')
}

const sql = neon(process.env.POSTGRES_DATABASE_URL!)
export const db = drizzle({ client: sql, schema })
