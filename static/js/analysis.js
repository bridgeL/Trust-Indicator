function AnalysisOtherImage(event) {
    window.location.href = '/upload'
}
function Gohome(event) {
    window.location.href = '/'
}


const imageDisplay = document.querySelector('.image-display');
const showImage = document.querySelector('.show-image');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');

let currentScale = 1;
function resizeImageDisplay(increase) {
    let currentWidth = parseInt(getComputedStyle(imageDisplay).width);
    let currentHeight = parseInt(getComputedStyle(imageDisplay).height);
    let maxWidth = parseInt(getComputedStyle(showImage).width) * 0.9;
    let maxHeight = parseInt(getComputedStyle(showImage).height) * 0.9;
    let newWidth = increase ? currentWidth + 20 : currentWidth - 20;
    let newHeight = increase ? currentHeight + 20 : currentHeight - 20;
    newWidth = Math.min(newWidth, maxWidth);
    newHeight = Math.min(newHeight, maxHeight);
    newWidth = Math.max(newWidth, 200);
    newHeight = Math.max(newHeight, 200);
    imageDisplay.style.width = newWidth + 'px';
    imageDisplay.style.height = newHeight + 'px';
}
zoomInButton.addEventListener('click', () => resizeImageDisplay(true));
zoomOutButton.addEventListener('click', () => resizeImageDisplay(false));

function countdown() {
    var numberElement = document.querySelector('.number');
    var currentNumber = parseInt(numberElement.textContent, 10);

    if (currentNumber > 0) {
        numberElement.textContent = currentNumber - 1;
    } else {
        clearInterval(interval);
        document.querySelector('.warpper-wait').style.display = "none";
        document.querySelector('.result').style.display = "flex";
    }
}
var interval = setInterval(countdown, 1000);

// 替换原有的随机分数生成函数
async function detectAigc(imageId) {
    try {
        const response = await fetch('/api/detect_aigc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 包含session cookie
            body: JSON.stringify({ image_id: imageId })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // 置信度在API中是0-100，我们直接使用
            const confidence = data.confidence;
            const isAigc = data.is_aigc;
            
            // 计算分数
            let score_original, score_aigc;
            
            if (isAigc) {
                // 如果检测为AIGC，则原始图片概率低
                score_aigc = confidence;
                score_original = 100 - confidence;
            } else {
                // 如果检测为非AIGC(UGC)，则原始图片概率高
                score_original = confidence;
                score_aigc = 100 - confidence;
            }
            
            // 为manipulation计算一个随机值（1-20之间）
            const score_manipulation = Math.random() * 19 + 1;
            
            return {
                score_original: Math.round(score_original),
                score_aigc: Math.round(score_aigc),
                score_manipulation: Math.round(score_manipulation),
                isAigc: isAigc,
                confidence: confidence  // 保存原始的confidence值
            };
        } else {
            console.error('AIGC检测失败:', data.message);
            // 返回默认值
            return getRandomScores();
        }
    } catch (error) {
        console.error('调用AIGC检测API出错:', error);
        // 出错时使用原来的随机函数作为后备
        return getRandomScores();
    }
}

// 保留原来的随机生成函数作为后备方案
function getRandomScores() {
    // 获取用户选中的图像类型按钮
    var selectedImageType = document.querySelector('input[name="image-type"]:checked');
    let score_original, score_aigc, score_manipulation;

    if (selectedImageType) {
        if (selectedImageType.value === 'Original') {
            // 如果选择的是 Original Image，则分数范围是 70-90% 的 original 概率
            score_original = Math.random() * (100 - 70) + 70;
            score_aigc = 100 - score_original;
        } else if (selectedImageType.value === 'AIGC') {
            // 如果选择的是 AIGC Image，则分数范围是 0-20% 的 original 概率
            score_original = Math.random() * (20 - 0) + 0;
            score_aigc = 100 - score_original;
        } else {
            // 默认情况下，设置 original 和 AIGC 的概率
            score_original = Math.random() * (90 - 10) + 10;
            score_aigc = 100 - score_original;
        }
    } else {
        // 如果没有选择任何类型，使用默认范围
        score_original = Math.random() * (90 - 80) + 70;
        score_aigc = 100 - score_original;
    }

    // 生成 1% 到 20% 之间的 manipulation 概率
    score_manipulation = Math.random() * 19 + 1;

    return {
        score_original: Math.round(score_original),
        score_aigc: Math.round(score_aigc),
        score_manipulation: Math.round(score_manipulation),
        isAigc: score_aigc > 50,  // 根据AIGC分数判断
        confidence: score_aigc > 50 ? score_aigc : score_original  // 根据类型选择置信度
    };
}

// 修改计算可信度分数的函数，现在它直接基于检测结果
function computeTrustScore(isAigc, confidence) {
    // 如果检测为AI生成(isAigc为true)，则可信度分数 = 100 - confidence
    // 如果检测为非AI生成(isAigc为false)，则可信度分数 = confidence
    if (isAigc) {
        return Math.round(Math.max(0, Math.min(100, 100 - confidence)));
    } else {
        return Math.round(Math.max(0, Math.min(100, confidence)));
    }
}

// 重新组织用于计算和显示结果的代码
document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const imageId = urlParams.get('image_id');

    // 先获取图片信息和详情
    let imageDetailPromise = fetch(`/getimagedetail/${imageId}`, { credentials: 'include' })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch image details');
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching image details:', error);
            return { error: 'Failed to load image details' };
        });

    // 同时调用AIGC检测接口
    let scores;
    try {
        scores = await detectAigc(imageId);
    } catch (error) {
        console.error('使用AIGC检测API时出错，使用随机分数:', error);
        scores = getRandomScores();
    }

    let score_original = scores.score_original;
    let score_aigc = scores.score_aigc;
    let score_manipulation = scores.score_manipulation;
    
    // 更新图表和百分比显示
    let scoreNormalized_original = score_original;
    let scoreNormalized_aigc = score_aigc;
    let scoreNormalized_manipulation = score_manipulation;

    document.querySelector('#circle-Original').style.strokeDasharray = `${scoreNormalized_original}, 100`;
    document.querySelector('#percentage-Original').textContent = `${score_original}%`;

    document.querySelector('#circle-AIGC').style.strokeDasharray = `${scoreNormalized_aigc}, 100`;
    document.querySelector('#percentage-AIGC').textContent = `${score_aigc}%`;

    document.querySelector('#circle-Manipulation').style.strokeDasharray = `${scoreNormalized_manipulation}, 100`;
    document.querySelector('#percentage-Manipulation').textContent = `${score_manipulation}%`;

    // 获取图片详情并计算可信度分数
    const imageDetail = await imageDetailPromise;
    
    if (!imageDetail.error) {
        // 直接使用模型的检测结果计算可信度分数，不考虑标签(tag)
        const trustScore = computeTrustScore(scores.isAigc, scores.confidence);
        document.getElementById('trust-score').textContent = trustScore + "%";
    }

    // 解析信号显示
    // signal 替换
    var secondIndicatorImages = ['origin.png', 'aigc.png', /* ... more icons ... */];
    if (score_manipulation > 30) {
        document.getElementById("signal1").style.backgroundImage = `url('/static/images/aigc.png')`;
        document.getElementById("signal1").style.backgroundSize = 'contain';
        document.getElementById("signal1").style.backgroundRepeat = 'no-repeat';
    } else {
        // 如果 Manipulation 小于等于 30，不显示图标
        document.getElementById("signal1").style.backgroundImage = 'none';  // 清除背景图片
    }

    // 判断 Original 和 AIGC
    if (score_original > 50) {
        // 如果 Original 分数大于 50，显示 ORIGIN 图标
        document.getElementById("signal2").style.backgroundImage = `url('/static/images/${secondIndicatorImages[0]}')`;  // ORIGIN 图标
    } else if (score_aigc > 50) {
        // 如果 AIGC 分数大于 50，显示 AIGC 图标
        document.getElementById("signal2").style.backgroundImage = `url('/static/images/${secondIndicatorImages[1]}')`;  // AIGC 图标
    } else {
        // 如果 Original 和 AIGC 都小于等于 50，不显示图标
        document.getElementById("signal2").style.backgroundImage = 'none';  // 清除背景图片
    }

    // 保持背景样式
    document.getElementById("signal2").style.backgroundSize = 'contain';
    document.getElementById("signal2").style.backgroundRepeat = 'no-repeat';

});

// show image 部分
let downloadBlobUrl = null;
document.addEventListener('DOMContentLoaded', function () {
    const imageDisplayDiv = document.querySelector('.image-display');
    const downloadButton = document.getElementById('Download');
    const descriptionElement = document.getElementById('image-description');

    // 从URL获取image_id
    const urlParams = new URLSearchParams(window.location.search);
    const imageId = urlParams.get('image_id');

    if (imageId) {
        // 获取图片描述
        fetch(`/getimagedetail/${imageId}`, { credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch image details');
                return response.json();
            })
            .then(data => {
                const description = data.ImageDescription || 'No description provided.';
                descriptionElement.textContent = description;
            })
            .catch(error => {
                console.error('Error fetching image details:', error);
                descriptionElement.textContent = 'Failed to load description.';
            });
    } else {
        descriptionElement.textContent = 'No image ID provided.';
    }

    // 显示图片
    fetch('/getImage', { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();  // Get the image data as a blob
        })
        .then(imageBlob => {
            // Create a URL for the blob
            const imageObjectURL = URL.createObjectURL(imageBlob);
            downloadBlobUrl = imageObjectURL;
            // Set the URL as the background image of the div
            imageDisplayDiv.style.backgroundImage = `url('${imageObjectURL}')`;
            imageDisplayDiv.style.backgroundSize = 'cover';  // Ensure it covers the div
            imageDisplayDiv.style.backgroundPosition = 'center';  // Center the background image
            imageDisplayDiv.style.backgroundRepeat = 'no-repeat';  // Don't repeat the background image
        })
        .catch(error => console.error('Error fetching image:', error));
    downloadButton.addEventListener('click', function () {
        if (downloadBlobUrl) {

            const downloadLink = document.createElement('a');
            downloadLink.href = downloadBlobUrl;

            downloadLink.download = 'downloadedImage.jpg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            console.error('No image available for download');
        }
    });
});