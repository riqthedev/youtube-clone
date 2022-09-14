import {z, TypeOf} from 'zod'



export const loginSchema = z.object({
    email: z.string({
        required_error: 'email is required',
    }).email('Not valid email'),

    password: z.string({
        required_error: 'password is required',
    }).min(6, 'password must be at least 6 characters long').max(32, 'password must not be longer than 32 characters')
})

export type LoginBody = TypeOf<typeof loginSchema>