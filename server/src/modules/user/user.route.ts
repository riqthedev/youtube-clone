import express from "express"
import { processRequestBody } from "zod-express-middleware"
import requireUser from "../../middleware/requireUser"
import { registerUser } from "./user.controller"
import { createUserSchema } from "./user.schema"

const router = express.Router()
router.get('/', requireUser, (req,res) =>{
    return res.send(res.locals.user)
})
router.post("/", processRequestBody(createUserSchema), registerUser)

export default router 