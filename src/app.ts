

import express,{Request,Response} from 'express';
import ytdl from 'ytdl-core';
import cors from 'cors';

const port = 7082;
const app = express();

app.use(cors({
  origin:'http://localhost:3000'  //this origin can access
}));




const convertUrl = (url:any) =>{

  let newUrlArray;
  if(url.includes("youtu.be")){  //url short can be: www.youtu.be/

       newUrlArray = url.split("https://youtu.be/")
      return `https://youtube.com/watch?v=${newUrlArray[1]}`
  }
  else if(url.includes("https://youtube.com/shorts/")){

       newUrlArray = url.split("https://youtube.com/shorts/")
      return `https://youtube.com/watch?v=${newUrlArray[1]}`
  }
  else if(url.includes("https://youtube.com/watch?v")){
      return url;
  }
  else{
    console.log("url:  "+url);
    console.log('hello');
      return "https://www.youtube.com/watch?v=_zSZXBdYOjc"
  }
}



//video

app.get("/video",async(req:Request,res:Response)=>{
  console.log('testing get video api'+ req.query.v);
  const videoId = convertUrl(req.query.videoId);
   let info = await ytdl.getInfo(videoId)
   res.json(info);
  // res.send('hello');
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

app.get('/', (req:Request, res:Response) => {
  res.send('<h1>Hello World! shubbi </h1>');
});

app.listen(port);

