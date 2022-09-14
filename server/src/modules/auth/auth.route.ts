import express from 'express'
import { processRequestBody } from 'zod-express-middleware'
import { login } from './auth.controller'
import { loginSchema } from './auth.schema'

const router = express.Router()

router.post ('/', processRequestBody(loginSchema), login)


export default router