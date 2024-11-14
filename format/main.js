import { FFmpeg } from "./lib/index.js";
import { fetchFile } from "./lib/util/index.js";

const inName = 'in.mp4';
const outName = 'out.mp4';

const blob = await fetch(new URL(inName, import.meta.url)).then(r => r.blob());
console.log(video);

async function run( cmd) {
    console.log(cmd);
    const ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
        console.log(message);
    });

    ffmpeg.on("progress", ({ progress }) => {
        message.innerHTML = `${progress * 100} %`;
    });

    await ffmpeg.load({
        coreURL: "./ffmpeg-core.js"
    });
 
    await ffmpeg.writeFile(inName, await fetchFile(blob));
    message.innerHTML = 'Start transcoding';
 
    await ffmpeg.exec(cmd.split(' '));
 
    message.innerHTML = 'Complete transcoding';
    const data = await ffmpeg.readFile(outName);
 
    video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}
 
btn1.addEventListener('click',() =>run(`-i ${inName} ${outName}`)); //transcode
btn2.addEventListener('click',() =>run(`-i ${inName} -acodec copy -vcodec copy ${outName}`)); //transmux