// /lib/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

const sql = neon("postgresql://maldb_owner:npg_iUNPEWerp4b7@ep-sweet-queen-a1clfm9f-pooler.ap-southeast-1.aws.neon.tech/maldb?sslmode=require");
export const db = drizzle(sql,{schema});