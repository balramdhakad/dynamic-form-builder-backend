import app from "./app.js"
import env from "./config/env.js"
import { startRedis } from "./config/redis.js"
import { connectDB } from "./db/connection.js"
import { runMigrations } from "./db/migration.js"

const PORT = env.serverConfig.PORT
const startServer = async() => {
    await connectDB()
    await startRedis()
    await runMigrations()
    app.listen(PORT,() => {
        console.log(`server is running on PORT : ${PORT}`)
    })
}

startServer()