
export interface Video {
    id: string;
    owner: string;
    published: boolean;
    videoId: string;
    createdAt: Date;
    // updatedAt: Date;
    extension: string;
    description: string;
    title: string;
  }
  
  export enum QueryKeys {
    me = "me",
    videos = "videos",
  }
  
  export interface Me {
    id: string;
    email: string;
    username: string;
  }