import { PrismaClient } from "@prisma/client";
import { disconnect } from "process";
import logger from "./logger";
const prisma = new PrismaClient()

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING ||"postgresql://showtimeriq:cherrod12@localhost:5432/youtube_db?schema=public"


export async function connectToDatabase() {
    try {
        await prisma.$connect()
        logger.info("Connect to the Database")
    } catch (err) {
        logger.error(err, "Faied to connect to the Database")
        process.exit(1)
    }
}


export async function disconnectFromDatabase() {
    await prisma.$disconnect()
    logger.info("disconnect from Database")
    return
}