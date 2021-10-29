const URL = "https://teachablemachine.withgoogle.com/models/NRtXOvRzU/";
let model, webcam, labelContainer, maxPredictions;
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

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
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        if (recognized.probability < prediction[i].probability) {
            recognized = prediction[i]
        }
    }
    document.getElementById("text").innerText = AIData[recognized.className].text
    document.getElementById("screen").style.backgroundColor = AIData[recognized.className].background
    console.log(AIData[recognized.className])
}
init()
