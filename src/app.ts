// import express from 'express';
// /**
//  * https://www.npmjs.com/package/@types/express?source=post_page---------------------------
//  * add typescript definition for express
//  */
// import {Request,Response,NextFunction} from 'express';
// const app=express();
// console.log('hello');
// app.use('/',async (req:Request, res:Response , next:NextFunction)=>{

// });
// const express = require("express");
// const fs = require('fs');
// const ytdl = require('ytdl-core');
// const app = express();
// var cors =require('cors')

//app.use(cors())
import express,{Request,Response} from 'express';
import fs from 'fs';
import ytdl from 'ytdl-core';
import cors from 'cors';

const port = 4000;
const app = express();

app.use(cors);


app.get('/', (req, res) => {
  res.send('Hello World! shubbi ');
});

const convertUrl = (url:any) =>{

  let newUrlArray;
  if(url.includes("youtu.be")){

       newUrlArray = url.split("https://youtu.be/")
      return `https://youtube.com/watch?v=${newUrlArray[1]}`
  }
  else if(url.includes("https://youtube.com/shorts/")){

       newUrlArray = url.split("https://youtube.com/shorts/")
      return `https://youtube.com/watch?v=${newUrlArray[1]}`
  }
  else if(url.includes("https://youtube.com/watch?v")){
      return url
  }
  else{
      return "https://youtube.com/watch?v=dQw4w9WgXcQ"
  }
}

//video

app.get("/video",async(req:Request,res:Response)=>{
  console.log('testing get video api'+ req.query.videoId);
  // const videoId = convertUrl(req.query.videoId);
  //  let info = await ytdl.getInfo(videoId)
  //  res.json(info);
  res.send('hello')
})

//audio

app.get("/audio",async(req,res)=>{
  const videoId = convertUrl(req.query.videoId)
   let info = await ytdl.getInfo(videoId)
   let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
   res.json(audioFormats)
})

//download
app.get("/download",async(req,res)=>{

const itag:string= req.query.itag as string
const {title,type} = req.query
const videoId = convertUrl(req.query.videoId)

 if(type === "mp4"){
res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
res.header('Content-Type', 'video/mp4');
}else if(type === "mp3"){
res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
res.header('Content-Type', 'audio/mp3');
}

ytdl(videoId, { filter: format => format.itag === parseInt(itag) }).pipe(res); 
})



app.listen(port,()=>{
  console.log('server started')
});

