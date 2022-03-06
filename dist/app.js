"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const cors_1 = __importDefault(require("cors"));
const port = 7082;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000' //this origin can access
}));
const convertUrl = (url) => {
    let newUrlArray;
    if (url.includes("youtu.be")) { //url short can be: www.youtu.be/
        newUrlArray = url.split("https://youtu.be/");
        return `https://youtube.com/watch?v=${newUrlArray[1]}`;
    }
    else if (url.includes("https://youtube.com/shorts/")) {
        newUrlArray = url.split("https://youtube.com/shorts/");
        return `https://youtube.com/watch?v=${newUrlArray[1]}`;
    }
    else if (url.includes("https://youtube.com/watch?v")) {
        return url;
    }
    else {
        console.log("url:  " + url);
        console.log('hello');
        return "https://www.youtube.com/watch?v=_zSZXBdYOjc";
    }
};
//video
app.get("/video", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('testing get video api' + req.query.v);
    const videoId = convertUrl(req.query.videoId);
    let info = yield ytdl_core_1.default.getInfo(videoId);
    res.json(info);
    // res.send('hello');
}));
//audio
app.get("/audio", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoId = convertUrl(req.query.videoId);
    let info = yield ytdl_core_1.default.getInfo(videoId);
    let audioFormats = ytdl_core_1.default.filterFormats(info.formats, 'audioonly');
    res.json(audioFormats);
}));
//download
app.get("/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itag = req.query.itag;
    const { title, type } = req.query;
    const videoId = convertUrl(req.query.videoId);
    if (type === "mp4") {
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.header('Content-Type', 'video/mp4');
    }
    else if (type === "mp3") {
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mp3');
    }
    (0, ytdl_core_1.default)(videoId, { filter: format => format.itag === parseInt(itag) }).pipe(res);
}));
app.get('/', (req, res) => {
    res.send('<h1>Hello World! shubbi </h1>');
});
app.listen(port);
