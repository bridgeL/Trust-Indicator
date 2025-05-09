// gallery.js
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const sortOrderParam = urlParams.get("sort");
    const searchQuery = urlParams.get("search") || "";

    if (searchQuery) {
        fetchImagesWithSearch(searchQuery);
    } else if (sortOrderParam === "asce") {
        fetchSortedImages("asce");
    } else {
        fetchDefaultImages();
    }

    setupInfiniteScroll();
});

let currentPage = 1;
let isLoading = false;
let hasMore = true;
let sortOrder = "";
let filter = "";

function showLoadingIndicator() {
    document.getElementById("loading-indicator").style.display = "block";
}

function hideLoadingIndicator() {
    document.getElementById("loading-indicator").style.display = "none";
}

function updateGallery(data, append = false) {
    const gallery = document.querySelector(".photo-gallery");

    if (!append) {
        gallery.innerHTML = "";
        currentPage = 1;
        hasMore = true;
    }

    data.images.forEach((image) => {
        const photoDiv = document.createElement("div");
        photoDiv.className = "photo";

        // 骨架屏
        const skeleton = document.createElement("div");
        skeleton.className = "skeleton-placeholder";
        photoDiv.appendChild(skeleton);

        // 图片
        const img = document.createElement("img");
        img.dataset.src = `/image/${image.id}?thumb=true`;
        img.alt = image.filename || "";
        img.style.width = "0";
        img.style.display = "";
        img.onload = function () {
            skeleton.style.display = "none";
            img.style.display = "block";
            img.classList.add("loaded");
            img.style.width = "95%";
        };
        img.onerror = function () {
            skeleton.style.display = "none";
            // 可以添加错误占位符
        };
        img.onclick = function () {
            location.href = `/imagedetail?source=${image.id}`;
        };
        photoDiv.appendChild(img);

        // 添加 indicators 等...
        const indicatorsDiv = document.createElement("div");
        indicatorsDiv.className = "photo-indicators";

        const firstIndicator = document.createElement("div");
        firstIndicator.className = "indicator";
        firstIndicator.style.backgroundImage = `url('/static/images/aigc.png')`; // 示例图标
        firstIndicator.style.backgroundSize = "cover";
        indicatorsDiv.appendChild(firstIndicator);

        const secondIndicator = document.createElement("div");
        secondIndicator.className = "indicator";
        secondIndicator.style.backgroundImage = `url('/static/images/origin.png')`; // 示例图标
        secondIndicator.style.backgroundSize = "cover";
        indicatorsDiv.appendChild(secondIndicator);

        gallery.appendChild(photoDiv);
    });

    // 初始化懒加载
    initLazyLoad();

    hasMore = currentPage < data.pages;
    currentPage++;
    hideLoadingIndicator();
}

function initLazyLoad() {
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
    });
}

function setupInfiniteScroll() {
    window.addEventListener("scroll", () => {
        if (isLoading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 500) {
            loadMoreImages();
        }
    });
}

function loadMoreImages() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    showLoadingIndicator();
    const searchQuery =
        new URLSearchParams(window.location.search).get("search") || "";

    fetch(
        `/images/sortByTag?tag=${encodeURIComponent(
            filter
        )}&search=${encodeURIComponent(searchQuery)}&page=${currentPage}`
    )
        .then((response) => response.json())
        .then((data) => {
            updateGallery(data, true);
            isLoading = false;
        })
        .catch((error) => {
            console.error("Error:", error);
            isLoading = false;
            hideLoadingIndicator();
        });
}

function fetchDefaultImages() {
    sortOrder = "";
    const sortIcon = document.getElementById("sortIcon");
    sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
    const searchQuery =
        new URLSearchParams(window.location.search).get("search") || "";
    fetch(
        `/images/sortByTag?tag=${encodeURIComponent(
            filter
        )}&search=${encodeURIComponent(searchQuery)}`
    )
        .then((response) => response.json())
        .then((data) => {
            updateGallery(data);
        })
        .catch((error) => console.error("Error:", error));
}

function fetchAllImages() {
    sortOrder = "";
    filter = "";
    const sortIcon = document.getElementById("sortIcon");
    sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
    const searchQuery =
        new URLSearchParams(window.location.search).get("search") || "";
    fetch(
        `/images/sortByTag?tag=${encodeURIComponent(
            filter
        )}&search=${encodeURIComponent(searchQuery)}`
    )
        .then((response) => response.json())
        .then((data) => {
            updateGallery(data);
        })
        .catch((error) => console.error("Error:", error));
}

function fetchSortedImages(sort) {
    if (sort === "asce") {
        sortOrder = "asce";
        toggleSort();
    }
}

function toggleSort() {
    const sortIcon = document.getElementById("sortIcon");
    const searchQuery =
        new URLSearchParams(window.location.search).get("search") || "";

    if (sortOrder === "desc") {
        sortOrder = "asce";
        sortIcon.innerHTML = `<i class="fas fa-sort-up"></i> Publish Time`;
        fetch(
            `/images/sortByTimeAsce?tag=${encodeURIComponent(
                filter
            )}&search=${encodeURIComponent(searchQuery)}`
        )
            .then((response) => response.json())
            .then((data) => {
                updateGallery(data);
            })
            .catch((error) => console.error("Error:", error));
    } else {
        sortOrder = "desc";
        sortIcon.innerHTML = `<i class="fas fa-sort-down"></i> Publish Time`;
        fetch(
            `/images/sortByTimeDesc?tag=${encodeURIComponent(
                filter
            )}&search=${encodeURIComponent(searchQuery)}`
        )
            .then((response) => response.json())
            .then((data) => {
                updateGallery(data);
            })
            .catch((error) => console.error("Error:", error));
    }
}

function fetchSortedImagesByType(tag) {
    filter = tag;
    const searchQuery =
        new URLSearchParams(window.location.search).get("search") || "";
    fetch(
        `/images/sortByTag?tag=${encodeURIComponent(
            filter
        )}&search=${encodeURIComponent(searchQuery)}`
    )
        .then((response) => response.json())
        .then((data) => {
            const sortIcon = document.getElementById("sortIcon");
            sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
            updateGallery(data);
        })
        .catch((error) => console.error("Failed to load images:", error));
}

function fetchImagesWithSearch(searchQuery) {
    fetch(
        `/images/sortByTag?tag=${encodeURIComponent(
            filter
        )}&search=${encodeURIComponent(searchQuery)}`
    )
        .then((response) => response.json())
        .then((data) => {
            updateGallery(data);
        })
        .catch((error) => console.error("搜索出错:", error));
}
