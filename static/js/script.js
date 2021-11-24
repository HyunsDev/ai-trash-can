const URL = AIData.modelURL;
let model, webcam, labelContainer, maxPredictions;

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    console.log(maxPredictions)

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let recognized = {
        className: "None",
        probability: 0
    }

    for (let i = 0; i < maxPredictions; i++) {
        // console.log(prediction[i])
        if (recognized.probability < prediction[i].probability) {
            recognized = prediction[i]
        }
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    let kind = recognized.className.split("_")[0]

    if (!AIData.model[kind]) {
        document.getElementById("text").innerText = "인식할 수 없어요."
        document.getElementById("screen").style.backgroundColor = "#000000"
        return
    }
    document.getElementById("text").innerText = AIData.model[kind].text
    document.getElementById("screen").style.backgroundColor = AIData.model[kind].background
    ipcRenderer.send('trash', AIData.model[kind].isMain ? `{"status":"scanning"}` : JSON.stringify({
        status: "found",
        kind: kind
    }));
    
    await sleep(300)
}
init()