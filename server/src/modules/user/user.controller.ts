import {Request, Response} from "express"
import { StatusCodes } from "http-status-codes"
import { createUserInput } from "./user.schema"
import { createUser } from "./user.service"

export async function registerUser(
    req: Request<{}, {}, createUserInput>, 
    res:Response) {
    
    const {username, email, password} = req.body
    console.log(req.body)
   

    try {
        await createUser({username, email, password})
        return res.status(StatusCodes.CREATED).send("User created successfully")

    } catch (error) {
        console.log(error)
        if(error === 11000) {
            return res.status(StatusCodes.CONFLICT).send("User already exists")
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
}