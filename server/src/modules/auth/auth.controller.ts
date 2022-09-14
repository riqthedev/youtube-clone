import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { findUserByEmail } from "../user/user.service";
import { signJwt } from "./auth.utils";
import omit from "../../helpers/omit";
import { LoginBody } from "./auth.schema";

const bcrypt = require("bcrypt")





export async function login(req: Request<{}, {}, LoginBody>, res: Response) {
    const {email, password,} = req.body
    const user = await findUserByEmail(email);

    if (!user || !bcrypt.compare(password, user.password)) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Invalid email or password")
    } 



const payload = omit(user, ['password'])
const jwt = signJwt(payload)
res.cookie("accessToken", jwt, {
    maxAge: 3.154e10,
    httpOnly: true,
    domain: 'localhost', // when deployed set this in env var
    path: '/',
    sameSite: 'strict',
    secure: false, // in prod set to true
})

return res.status(StatusCodes.OK).send(jwt)
    
}


