const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
    corePath: chrome.runtime.getURL("lib/ffmpeg-core.js"),
    log: true,
    mainName: 'main'
});

async function runFFmpeg(inputFileName, outputFileName, commandStr, file) {
    if (ffmpeg.isLoaded()) {
        await ffmpeg.exit();
    }

    await ffmpeg.load();

    const commandList = commandStr.split(' ');
    if (commandList.shift() !== 'ffmpeg') {
        alert('Please start with ffmpeg');
        return;
    }

    ffmpeg.FS('writeFile', inputFileName, await fetchFile(file));
    console.log(commandList);
    await ffmpeg.run(...commandList);
    const data = ffmpeg.FS('readFile', outputFileName);
    const blob = new Blob([data.buffer]);
    downloadFile(blob, outputFileName);
}

function downloadFile(blob, fileName) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}

// convert sample file //
// convert sample_video.avi to sample_video.mp4
async function convertWebmToMp4() {
    const inputFileName = 'xxx.mp4';
    const outputFileName = 'all.mp4';
    const inputVideoUrl = chrome.runtime.getURL(`data/${inputFileName}`);

    const commandStr = `ffmpeg -i ${inputFileName} -c copy ${outputFileName}`;
    await runFFmpeg(inputFileName, outputFileName, commandStr, inputVideoUrl);
}
 
const convertVideo = document.getElementById('convert-video');
convertVideo.addEventListener('click', async () => {
    await convertWebmToMp4();
});
 


// convert custom file //
const run = document.getElementById('run');
run.addEventListener('click', async () => {
    const file = document.getElementById('file-input').files[0];
    if (!file) {
        alert('Please select a file');
        return;
    }
    const commandInput = document.getElementById('command-input');
    const command = commandInput.value;
    const inputFileName = file.name;
    const outputFileName = command.split(' ').pop();

    await runFFmpeg(inputFileName, outputFileName, command, file);
});
