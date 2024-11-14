async function getAndJoin() {
    let blobs = [];

    for (let i = 1; i < 6; i++) {
        blobs[i] = await fetch(`./files/default.jobtemplate.hls360_0000${i}.ts`).then(r => r.blob());
    }

    return new Blob(blobs, { type: "video/mp4" });
}

function download(blob) {
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "video.mp4";
    a.click();
    URL.revokeObjectURL(url);
}

btn.addEventListener('click',() =>getAndJoin().then(download));  