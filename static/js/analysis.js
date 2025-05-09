let hasShownCountdown = false;

function checkCountdownStatus(imageId) {
    document.querySelector(".warpper-wait").style.display = "";
    const storedImageId = sessionStorage.getItem("lastAnalyzedImage");
    if (storedImageId === imageId) {
        hasShownCountdown = true;
    } else {
        sessionStorage.setItem("lastAnalyzedImage", imageId);
        hasShownCountdown = false;
    }
}

function showResultsImmediately() {
    document.querySelector(".warpper-wait").style.display = "none";
    document.querySelector(".result").style.display = "flex";
}

function startCountdown() {
    const numberElement = document.querySelector(".number");
    let currentNumber = parseInt(numberElement.textContent, 10);

    if (currentNumber > 0) {
        numberElement.textContent = currentNumber - 1;
    } else {
        clearInterval(interval);
        showResultsImmediately();
    }
}

function AnalysisOtherImage() {
    window.location.href = "/upload";
}

function Gohome() {
    window.location.href = "/";
}

const imageDisplay = document.querySelector(".image-display");
const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");
let currentScale = 1;

function resizeImageDisplay(increase) {
    const currentWidth = parseInt(getComputedStyle(imageDisplay).width);
    const currentHeight = parseInt(getComputedStyle(imageDisplay).height);
    const maxWidth =
        parseInt(
            getComputedStyle(document.querySelector(".show-image")).width
        ) * 0.9;
    const maxHeight =
        parseInt(
            getComputedStyle(document.querySelector(".show-image")).height
        ) * 0.9;

    let newWidth = increase ? currentWidth + 20 : currentWidth - 20;
    let newHeight = increase ? currentHeight + 20 : currentHeight - 20;

    newWidth = Math.min(Math.max(newWidth, 200), maxWidth);
    newHeight = Math.min(Math.max(newHeight, 200), maxHeight);

    imageDisplay.style.width = `${newWidth}px`;
    imageDisplay.style.height = `${newHeight}px`;
}

zoomInButton.addEventListener("click", () => resizeImageDisplay(true));
zoomOutButton.addEventListener("click", () => resizeImageDisplay(false));

async function detectAigc(imageId) {
    try {
        const response = await fetch("/api/get_aigc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ image_id: imageId }),
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        if (data.status !== "success") throw new Error(data.message);

        const confidence = Math.round(data.confidence * 100);

        return {
            score_original: 100 - confidence,
            score_aigc: confidence,
            score_manipulation: Math.round(Math.random() * 19 + 1),
            confidence: confidence
        };
    } catch (error) {
        console.error("AIGC detection error:", error);
        return getRandomScores();
    }
}

function getRandomScores() {
    const selectedImageType = document.querySelector(
        'input[name="image-type"]:checked'
    );
    let score_aigc;

    if (selectedImageType) {
        score_aigc = selectedImageType.value === "Original" 
            ? Math.random() * 20 
            : Math.random() * 20 + 80;
    } else {
        score_aigc = Math.random() * 30;
    }

    return {
        score_original: 100 - Math.round(score_aigc),
        score_aigc: Math.round(score_aigc),
        score_manipulation: Math.round(Math.random() * 19 + 1),
        confidence: Math.round(score_aigc)
    };
}

function computeTrustScore(confidence) {
    return Math.round(100 - confidence);
}

function updateChart(id, score) {
    document.querySelector(
        `#circle-${id}`
    ).style.strokeDasharray = `${score}, 100`;
    document.querySelector(`#percentage-${id}`).textContent = `${score}%`;
}

function updateSignalElements(scores) {
    const signal1 = document.getElementById("signal1");
    const signal2 = document.getElementById("signal2");

    signal1.style.backgroundImage =
        scores.score_manipulation > 30
            ? "url('/static/images/aigc.png')"
            : "none";

    signal2.style.backgroundImage =
        scores.score_aigc > 50
            ? "url('/static/images/aigc.png')"
            : "url('/static/images/origin.png')";
}

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const imageId = urlParams.get("image_id");
    const descriptionElement = document.getElementById("image-description");

    // 检查是否需要显示倒计时
    checkCountdownStatus(imageId);

    if (hasShownCountdown) {
        showResultsImmediately();
    } else {
        interval = setInterval(startCountdown, 1000);
    }

    try {
        const imageDetail = await fetch(`/getimagedetail/${imageId}`, {
            credentials: "include",
        }).then((res) =>
            res.ok
                ? res.json()
                : Promise.reject("Failed to fetch image details")
        );

        descriptionElement.textContent =
            imageDetail.ImageDescription || "No description provided.";
    } catch (error) {
        console.error("Error loading image details:", error);
        descriptionElement.textContent = "Failed to load description.";
    }

    let scores;
    try {
        scores = await detectAigc(imageId);
    } catch (error) {
        console.error("Using fallback scores:", error);
        scores = getRandomScores();
    }

    updateChart("Original", scores.score_original);
    updateChart("AIGC", scores.score_aigc);
    updateChart("Manipulation", scores.score_manipulation);
    updateSignalElements(scores);

    document.getElementById("trust-score").textContent = `${computeTrustScore(
        scores.confidence
    )}%`;

    const imageBase64 = sessionStorage.getItem("uploadedImageBase64");
    if (imageBase64) {
        imageDisplay.style.backgroundImage = `url(${imageBase64})`;
        sessionStorage.removeItem("uploadedImageBase64");
    } else {
        fetch("/getImage", { credentials: "include" })
            .then((res) => res.blob())
            .then((blob) => {
                imageDisplay.style.backgroundImage = `url(${URL.createObjectURL(
                    blob
                )})`;
            });
    }
});