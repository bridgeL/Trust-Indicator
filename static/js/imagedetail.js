const urlParams = new URLSearchParams(window.location.search);
let imageId = urlParams.get("source");

window.onload = function () {
    const userEmail = sessionStorage.getItem("userEmail");
    if (userEmail) {
        document.querySelector(".sign-text").textContent = userEmail;
        document.querySelector("#show-name").textContent = "Hi  " + userEmail;
    }

    const imageDisplay = document.querySelector(".image-display");
    const img = document.createElement("img");
    img.src = `/image/${imageId}`;
    img.className = "photo";
    imageDisplay.appendChild(img);

    loadImage(imageId);
    fetchTrustReport(imageId); // <<< 新增：加载Trust Report

    const zoomInButton = document.getElementById("zoomIn");
    const zoomOutButton = document.getElementById("zoomOut");
    let currentScale = 1;

    function resizeImageDisplay(increase) {
        const zoomFactor = 0.1;
        if (increase) {
            if (currentScale < 1.5) {
                currentScale = currentScale * (1 + zoomFactor);
                imageDisplay.style.transform = `scale(${currentScale})`;
            }
        } else {
            if (currentScale > 0.5) {
                currentScale = currentScale / (1 + zoomFactor);
                imageDisplay.style.transform = `scale(${currentScale})`;
            }
        }
    }
    zoomInButton.addEventListener("click", () => resizeImageDisplay(true));
    zoomOutButton.addEventListener("click", () => resizeImageDisplay(false));

    fetchTrustReport(imageId);

    const downloadButton = document.getElementById("Download");
    downloadButton.addEventListener("click", function () {
        const url = img.src;

        // 创建隐藏的下载链接
        const a = document.createElement("a");
        a.download = "downloaded_image.jpg"; // 设置默认文件名

        // 如果是跨域图片需要先转成blob
        if (!url.startsWith("data:")) {
            fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                    const blobUrl = URL.createObjectURL(blob);
                    a.href = blobUrl;
                    a.click();
                    URL.revokeObjectURL(blobUrl);
                })
                .catch(() => a.click()); // 降级方案
        }
    });
};

function loadImage(imageId) {
    fetch(`/getimagedetail/${imageId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((imageDetail) => {
            function updateMetadataOnPage(metadata) {
                const imageSizeElement =
                    document.getElementById("metadata-ImageSize");
                const imageWidth =
                    metadata["ImageWidth"] !== "None"
                        ? metadata["ImageWidth"]
                        : "None";
                const imageLength =
                    metadata["ImageLength"] !== "None"
                        ? metadata["ImageLength"]
                        : "None";
                imageSizeElement.textContent = `${imageWidth} x ${imageLength}`;
                if (metadata["filename"]) {
                    document.getElementById("metadata-FileName").textContent =
                        metadata["filename"];
                }
                if (metadata["filename"]) {
                    document.getElementById("metadata-FileType").textContent =
                        "image/jpeg";
                }
                if (metadata["ColorSpace"]) {
                    document.getElementById("metadata-ColorSpace").textContent =
                        metadata["ColorSpace"];
                }
                if (metadata["Created"]) {
                    document.getElementById("metadata-created").textContent =
                        metadata["Created"];
                }

                if (metadata["Make"]) {
                    document.getElementById("metadata-Make").textContent =
                        metadata["Make"];
                }
                if (metadata["Model"]) {
                    document.getElementById("metadata-Model").textContent =
                        metadata["Model"];
                }
                if (metadata["FocalLength"]) {
                    document.getElementById(
                        "metadata-FocalLength"
                    ).textContent = metadata["FocalLength"];
                }
                if (metadata["Aperture"]) {
                    document.getElementById("metadata-Aperture").textContent =
                        metadata["Aperture"];
                }
                if (metadata["Exposure"]) {
                    document.getElementById("metadata-Exposure").textContent =
                        metadata["Exposure"];
                }
                if (metadata["ISO"]) {
                    document.getElementById("metadata-ISO").textContent =
                        metadata["ISO"];
                }
                if (metadata["Flash"]) {
                    document.getElementById("metadata-Flash").textContent =
                        metadata["Flash"];
                }
                if (metadata["Altitude"]) {
                    document.getElementById("metadata-Altitude").textContent =
                        metadata["Altitude"];
                }
                const LatitudeElement =
                    document.getElementById("metadata-Latitude");
                const LatitudeRef =
                    metadata["LatitudeRef"] !== "None"
                        ? metadata["LatitudeRef"]
                        : "No Ref";
                const Latitude =
                    metadata["Latitude"] !== "None"
                        ? metadata["Latitude"]
                        : "No Latitude";

                if (
                    metadata["LatitudeRef"] !== "None" &&
                    metadata["Latitude"] !== "None"
                ) {
                    LatitudeElement.textContent = `${LatitudeRef}: ${Latitude}`;
                } else if (
                    metadata["LatitudeRef"] !== "None" &&
                    metadata["Latitude"] === "None"
                ) {
                    LatitudeElement.textContent = `${LatitudeRef}: No Latitude`;
                } else if (
                    metadata["LatitudeRef"] === "None" &&
                    metadata["Latitude"] !== "None"
                ) {
                    LatitudeElement.textContent = `No Ref: ${Latitude}`;
                } else {
                    LatitudeElement.textContent = "None";
                }

                const LongitudeElement =
                    document.getElementById("metadata-Longitude");
                const LongitudeRef =
                    metadata["LongitudeRef"] !== "None"
                        ? metadata["LongitudeRef"]
                        : "No Ref";
                const Longitude =
                    metadata["Longitude"] !== "None"
                        ? metadata["Longitude"]
                        : "No Longitude";

                if (
                    metadata["LongitudeRef"] !== "None" &&
                    metadata["Longitude"] !== "None"
                ) {
                    LongitudeElement.textContent = `${LongitudeRef}: ${Longitude}`;
                } else if (
                    metadata["LongitudeRef"] !== "None" &&
                    metadata["Longitude"] === "None"
                ) {
                    LongitudeElement.textContent = `${LongitudeRef}: No Longitude`;
                } else if (
                    metadata["LongitudeRef"] === "None" &&
                    metadata["Longitude"] !== "None"
                ) {
                    LongitudeElement.textContent = `No Ref: ${Longitude}`;
                } else {
                    LongitudeElement.textContent = "None";
                }
            }
            updateMetadataOnPage(imageDetail);
        })
        .catch((error) => {
            console.error("Error fetching the image details:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("myModal");
    const span = document.getElementById("myModalClose");
    const confirmBtn = document.getElementById("confirmDelete");
    const cancelBtn = document.getElementById("cancelDelete");
    function checkAndSetFavourite() {
        fetch(`/checkFavourite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_id: imageId }),
        })
            .then((response) => response.json())
            .then((data) => {
                const favButton = document.getElementById("favourite");
                if (data.isFavourite) {
                    favButton.style.color = "red";
                    favButton.onclick = confirmDelete;
                } else {
                    favButton.style.color = "black";
                    favButton.onclick = addToFavourite;
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                const favButton = document.getElementById("favourite");
                favButton.style.color = "black";
                favButton.onclick = addToFavourite;
            });
    }
    checkAndSetFavourite();
    hideModal();
    function showModal() {
        modal.style.display = "block";
    }
    function hideModal() {
        modal.style.display = "none";
    }

    span.onclick = function () {
        hideModal();
    };
    confirmBtn.onclick = function () {
        deleteFavourite();
        hideModal();
    };
    window.onclick = function (event) {
        if (event.target === modal) {
            hideModal();
        }
    };
    cancelBtn.onclick = function () {
        hideModal();
    };

    function addToFavourite() {
        fetch("/addToFavourite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_id: imageId }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw errorData;
                    });
                }
                return response.json();
            })
            .then((data) => {
                checkAndSetFavourite();
                showSuccessAlert(data.message);
            })
            .catch((errorData) => {
                showErrorAlert(errorData.error);
            });
    }
    function confirmDelete() {
        showModal();
    }

    function deleteFavourite() {
        fetch("/deleteFavourite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_id: imageId }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw errorData;
                    });
                }
                return response.json();
            })
            .then((data) => {
                checkAndSetFavourite();
                showSuccessAlert(data.message);
            })
            .catch((errorData) => {
                showErrorAlert(errorData.error);
            });
    }
});

function showSuccessAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
    alertBox.classList.add("success-alert");
    document.body.prepend(alertBox);

    setTimeout(function () {
        fadeOutAlert(alertBox);
    }, 3000);
}

function showErrorAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = "rgba(244, 67, 54, 0.9)";
    alertBox.classList.add("error-alert");
    document.body.prepend(alertBox);

    setTimeout(function () {
        fadeOutAlert(alertBox);
    }, 5000);
}
function createAlert(message) {
    var alertBox = document.createElement("div");
    alertBox.textContent = message;
    alertBox.style.color = "white";
    alertBox.style.padding = "15px";
    alertBox.style.margin = "15px";
    alertBox.style.borderRadius = "4px";
    alertBox.style.position = "fixed";
    alertBox.style.left = "50%";
    alertBox.style.top = "20px";
    alertBox.style.transform = "translateX(-50%)";
    alertBox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
    alertBox.style.transition = "opacity 0.5s ease, top 0.5s ease";
    alertBox.style.zIndex = "1000";
    return alertBox;
}
function fadeOutAlert(alertBox) {
    alertBox.style.opacity = "0";
    alertBox.style.top = "10px";

    setTimeout(function () {
        alertBox.remove();
    }, 500);
}

async function fetchTrustReport(imageId) {
    try {
        // Step 1: get Trust Profile
        const profileRes = await fetch("/get_trust_profile", {
            credentials: "include",
        });
        const profileData = await profileRes.json();
        const snippets = profileData.profile?.snippets || [];

        // Step 2: 找到 AI Threshold
        const thresholdSnippet = snippets.find(
            (s) => s.type === "ai_threshold" && s.enabled
        );
        let aiThreshold = 50; // default

        if (thresholdSnippet) {
            try {
                const parsedSettings = JSON.parse(thresholdSnippet.settings);
                if (parsedSettings.threshold !== undefined) {
                    aiThreshold = Number(parsedSettings.threshold);
                }
            } catch (e) {
                console.warn("⚠️ Failed to parse threshold JSON:", e);
            }
        }

        console.log("✅ AI Threshold used：", aiThreshold);

        // Step 3: 获取 AIGC confidence
        const aigcRes = await fetch("/api/get_aigc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ image_id: imageId }),
        });
        const aigcData = await aigcRes.json();

        let confidence = 0.0;
        if (aigcData && aigcData.confidence !== undefined) {
            confidence = aigcData.confidence;
        }

        console.log("✅ AIGC detector confidence：", confidence);

        // Step 4: 生成判断文本
        const trustworthy = confidence * 100 < aiThreshold;
        const resultText = `
            <strong>AI Threshold：</strong>${aiThreshold}%<br>
            <strong>Confidence from AIGC detector：</strong>${confidence.toFixed(
                1
            )}<br>
            ${
                trustworthy
                    ? "✅ According to user's trust profile, this picture is trustworthy."
                    : "❌ According to user's trust profile, this picture is not trustworthy."
            }
        `.trim();

        // Step 5: 更新 DOM
        const trustResultElement = document.getElementById("trust-result");
        if (trustResultElement) {
            trustResultElement.innerHTML = resultText;
        }
    } catch (err) {
        console.error("❌ Error for Trust Report：", err);
        const trustResultElement = document.getElementById("trust-result");
        if (trustResultElement) {
            trustResultElement.innerHTML = "⚠️ Failed to load Trust Report.";
        }
    }
}
