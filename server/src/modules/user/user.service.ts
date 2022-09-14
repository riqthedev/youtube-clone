import { PrismaClient } from "@prisma/client"
import { createUserInput } from "./user.schema"
const bcrypt = require("bcrypt")
const prisma = new PrismaClient()


export async function createUser(input: createUserInput) {
    const user = await prisma.user.create({
        data: {
            username: input.username,
            email: input.email,
            password: bcrypt.hashSync(input.password, 8)
        }
    })
} 



export async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return user
}