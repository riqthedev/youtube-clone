import { PrismaClient, Video } from "@prisma/client";
import busboy from "busboy";
import { Request, Response } from "express";
import { createVideo, findVideos } from "./video.service";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";
import fs from "fs"
import { StatusCodes } from "http-status-codes";
import { findVideo } from "./video.service";
import { resolveSoa } from "dns";
import { number } from "zod";

const prisma = new PrismaClient()

const MIME_TYPES = ["video/mp4"]
const CHUNK_SIZE_IN_BYTES = 1000000 // 1mb




function getPath({videoId, extension}:{
    videoId: Video["videoId"]
    extension: Video["extension"]
}) {

    return `${process.cwd()}/uploaded/${videoId}.${extension}`
}



export async function uploadVideoHandler(req:Request, res:Response) {
    
    const bb = busboy({headers: req.headers});
    const user = res.locals.user;
    const owner: number = user.id
    const video = await createVideo({owner});
  


    bb.on('file', async(_, file, info) => {

        if(!MIME_TYPES.includes(info.mimeType)) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid File Type")
        };
     
        const extension = info.mimeType.split("/")[1];
        
        video.extension = extension;
         const filePath = getPath({
            videoId: video.videoId,
            extension: video.extension
         });



    
            

         const stream = fs.createWriteStream(filePath)
        
         file.pipe(stream)
    })

    bb.on("close", () => {
        res.writeHead(StatusCodes.CREATED, {
            Connection: 'close',
            "Content-Type": 'application/json'
        })
        res.write(JSON.stringify(video))
        res.end()
    })
    return req.pipe(bb)
 
}


export async function updateVideoHandler(req:Request<UpdateVideoParams, {}, UpdateVideoBody>, res:Response) {
    const {videoId} =  req.params
    const {title, description, published, extension} = req.body
    const {id: userId} = res.locals.user 
    const video = await findVideo({videoId})

    
    if(!videoId){
        return res.status(StatusCodes.NOT_FOUND).send("Video not found")
    }

    if(String(video?.owner.id) !== String(userId)) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized")
    }
    

    if(video != undefined) {
        video.title = title,
        video.description = description,
        video.published = published,
        video.extension = extension
     }

     const updatedVideo = await prisma.video.update({
        where:{
            videoId: Number(videoId)
        },
        data: {
            title: title,
            description: description,
            published: published,
        }
     })


     return res.status(StatusCodes.OK).send(updatedVideo)
}


export async function streamVideoHandler(req:Request<UpdateVideoParams>, res:Response){
    const {videoId} = req.params
    const range = req.headers.range

    if(!range) {
        return res.status(StatusCodes.BAD_REQUEST).send('Range must be provided')
    }

    const video = await findVideo({videoId})

    if(!video) {
        return res.status(StatusCodes.NOT_FOUND).send("Video not found")
    }
    const filePath = getPath({
        videoId: Number(videoId),
        extension: video.extension
    })
    
    const fileSizeInBytes = fs.statSync(filePath).size 
    const chunkStart = Number(range.replace(/\D/g,""))
    const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, fileSizeInBytes - 1);
   
    const  contentLength = chunkEnd - chunkStart + 1;
    const headers = {
        "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type" : `video${video.extension}`,
        "Cross-Origin-Resource-Policy": "Cross-Origin"
    };

    res.writeHead(StatusCodes.PARTIAL_CONTENT, headers)

    const videoStream = fs.createReadStream(filePath,{
        start: chunkStart,
        end: chunkEnd
    });
    console.log(res)
    videoStream.pipe(res)

}



export async function findVideosHandler(_:Request, res:Response) {
    const videos = await findVideos()
    
    return res.status(StatusCodes.OK).send(videos)
}
