import { Pool } from "pg"
import env from "../config/env.js"
import { logger } from "../config/logger.js"

export const pool = new Pool({
    connectionString : env.serverConfig.DATABASE_URL
})

export const connectDB = async() => {
    try {
        await pool.connect()
        logger.info(`POSTGRESQL database connection success`)
    } catch (error) {
        logger.error(`POSTGRESQl connection error :${error}`)
        process.exit(1)
    }

}