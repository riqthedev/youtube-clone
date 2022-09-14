import { Prisma, PrismaClient } from "@prisma/client";
import { string } from "zod";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";
const prisma = new PrismaClient()





export function createVideo({owner}: {owner:number}) {
    return prisma.video.create({
        data:{
            userID: owner
        }
    })
    
  }  
  

  export async function findVideo({videoId}:{videoId: number}) {
    const video = await prisma.video.findUnique({
        where: {
            videoId: Number(videoId)
        },
        select: {
            owner: true,
            title: true,
            description: true,
            published: true,
            extension: true
        }
    })
    return video
  }


  export async function findVideos() {
    return prisma.video.findMany({
        where: {
            published: true
        }
    })
  }


  