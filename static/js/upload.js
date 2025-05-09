document.addEventListener("DOMContentLoaded", function () {
    var analysisButton = document.querySelector(".analysis-button");
    var imageTypeRadios = document.querySelectorAll('input[name="image-type"]');
    var analysisButtonText = analysisButton.querySelector("span");
    imageTypeRadios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (this.checked) {
                analysisButton.classList.remove("no-selection");
                analysisButtonText.textContent = "Analysis Now!";
            }
        });
    });
    analysisButton.addEventListener("click", function () {
        var isSelected = Array.from(imageTypeRadios).some(
            (radio) => radio.checked
        );
        if (!isSelected) {
            analysisButton.classList.add("no-selection");
            analysisButtonText.textContent = "Please Select Type!";
        } else {
            analysis(event); // 调用 analysis 函数
        }
    });
});

function sign_out_upload(event) {
    event.stopPropagation();
    sessionStorage.removeItem("userEmail");
    document.querySelector(".sign-text").textContent = "Sign In";
    const signInContent = document.querySelector(".sign-in-content");
    signInContent.style.display = "none";
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", function () {
    document
        .getElementById("file-input")
        .addEventListener("change", function (event) {
            if (event.target.files.length > 0) {
                const file = event.target.files[0];
                previewImage(file);
            }
        });
    var dropBox = document.querySelector(".drop-box"); // Selecting using class
    var fileInput = document.querySelector("#file-input"); // Assuming file-input is still an ID

    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropBox.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach((eventName) => {
        dropBox.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropBox.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropBox.classList.add("highlight");
    }

    function unhighlight(e) {
        dropBox.classList.remove("highlight");
    }

    // Handle dropped files
    dropBox.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        handleFiles(files);
    }

    // Handle files from the input file or dropped
    function handleFiles(files) {
        [...files].forEach((file) => {
            if (["image/jpeg", "image/jpg"].includes(file.type)) {
                uploadFile(file);
                previewImage(file);
            } else {
                alert("Only JPEG files are allowed.");
            }
        });
    }

    function uploadFile(file) {
        var url = "/uploadImage"; // The route in your Flask app
        var formData = new FormData();
        formData.append("file", file);

        var analysisButton = document.querySelector(".analysis-button");
        var analysisButtonText = analysisButton.querySelector("span");
        analysisButton.classList.add("no-selection");
        analysisButtonText.textContent = "Uploading...";

        fetch(url, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Success:", result);
                uploadedImageId = result.id;
                console.log(uploadedImageId);
                resetImageTypeSelection();
                if (result.file_size) {
                    document.getElementById("metadata-FileSize").textContent =
                        formatBytes(result.file_size);
                }
                if (result.file_type) {
                    document.getElementById("metadata-FileType").textContent =
                        result.file_type;
                }
                if (result.filename) {
                    document.getElementById("metadata-FileName").textContent =
                        result.filename;
                }
                updateMetadataOnPage(result.metadata);

                analysisButton.classList.remove("no-selection");
                analysisButtonText.textContent = "Analysis Now!";
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    function resetImageTypeSelection() {
        var imageTypeInputs = document.querySelectorAll(
            'input[name="image-type"]'
        );
        imageTypeInputs.forEach(function (input) {
            input.checked = false;
        });
        var analysisButton = document.querySelector(".analysis-button");
        var analysisButtonText = analysisButton.querySelector("span");
        analysisButton.classList.remove("no-selection");
        analysisButtonText.textContent = "Analysis Now!";
    }
    function updateMetadataOnPage(metadata) {
        const imageSizeElement = document.getElementById("metadata-ImageSize");

        const imageWidth =
            metadata["ImageWidth"] !== "None" ? metadata["ImageWidth"] : "None";
        const imageLength =
            metadata["ImageLength"] !== "None"
                ? metadata["ImageLength"]
                : "None";
        imageSizeElement.textContent = `${imageWidth} x ${imageLength}`;

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
            document.getElementById("metadata-FocalLength").textContent =
                metadata["FocalLength"];
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
        const LatitudeElement = document.getElementById("metadata-Latitude");
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

        const LongitudeElement = document.getElementById("metadata-Longitude");
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
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
    }

    function previewImage(file) {
        let reader = new FileReader();
        reader.onloadend = function () {
            // 显示图片
            dropBox.style.backgroundImage = "url(" + reader.result + ")";
            dropBox.innerHTML = "<p>Uploaded Successfully</p>";

            // 存储 base64 到 sessionStorage
            sessionStorage.setItem("uploadedImageBase64", reader.result);
        };
        
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    // Clicking on the dropBox will trigger the hidden file input dialog
    dropBox.addEventListener("click", function () {
        fileInput.click();
    });

    fileInput.addEventListener("change", function (e) {
        var files = e.target.files;
        handleFiles(files);
    });
});
let uploadedImageId = null;

async function updateImageSettings(
    formData,
    uploadedImageId,
    selectedImageVisibility
) {
    try {
        // Update image type
        const res1 = await fetch("/updateImageType", {
            method: "POST",
            body: formData,
            credentials: "include", // session cookie
        });

        const data1 = await res1.json();
        if (data1.status !== "success") {
            console.log("Failed to update image type.");
            return;
        }

        // Update image description
        const desc = document.getElementById("image-desc").value;
        if (desc && uploadedImageId) {
            const descFormData = new FormData();
            descFormData.append("image_id", uploadedImageId);
            descFormData.append("desc", desc);
            const descRes = await fetch("/api/updateImageDesc", {
                method: "POST",
                body: descFormData,
                credentials: "include", // session cookie
            });
            const descData = await descRes.json();
            if (descData.status !== "success") {
                console.log("Failed to update image description.");
                return;
            }
            console.log("Image description updated successfully.");
        }

        // Update image visibility
        const res2 = await fetch("/api/updateImageVisibility", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // cookie
            body: JSON.stringify({
                image_id: uploadedImageId,
                visibility: selectedImageVisibility,
            }),
        });

        const data2 = await res2.json();
        if (data2.status !== "success") {
            console.log("Failed to update image visibility.");
            return;
        }

        console.log(
            "Image type, description, and visibility updated successfully."
        );
        // 修改跳转逻辑，传递 image_id
        window.location.href = `/analysis?image_id=${uploadedImageId}`;
    } catch (error) {
        console.error("Error updating image settings:", error);
    }
}

function analysis(event) {
    var selectedImageType = document.querySelector(
        'input[name="image-type"]:checked'
    );
    var selectedImageVisibility = document.querySelector("#visibility-switch")
        .checked
        ? "private"
        : "public";
    console.log(selectedImageType.value, selectedImageVisibility);
    if (selectedImageType && uploadedImageId) {
        var formData = new FormData();
        formData.append("imageId", uploadedImageId);
        formData.append("imageType", selectedImageType.value);
        updateImageSettings(formData, uploadedImageId, selectedImageVisibility);
    } else {
        var analysisButton = document.querySelector(".analysis-button");
        var analysisButtonText = analysisButton.querySelector("span");
        analysisButton.classList.add("no-selection");
        analysisButtonText.textContent = "Please Upload Image!";
    }
}
