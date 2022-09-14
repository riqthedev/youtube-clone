import {boolean, number, object, string, TypeOf} from 'zod'



export const updateVideoSchema = {
    body: object({
        title: string(),
        description: string(),
        published: boolean(),
        extension: string(),
        owner: number()
    }),
    params: object({
        videoId: number(),
    })
}


 export type UpdateVideoBody = TypeOf<typeof updateVideoSchema.body>
 export type UpdateVideoParams = TypeOf<typeof updateVideoSchema.params>