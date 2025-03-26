// gallery.js
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortOrderParam = urlParams.get('sort');
    const searchQuery = urlParams.get('search') || ''; // 获取 URL 中的 search 参数

    // 根据 URL 参数加载初始内容
    if (searchQuery) {
        fetchImagesWithSearch(searchQuery); // 如果有搜索参数，优先加载搜索结果
    } else if (sortOrderParam === 'asce') {
        fetchSortedImages('asce');
    } else {
        fetchDefaultImages();
    }
});

let sortOrder = '';
let filter = '';

function fetchDefaultImages() {
    sortOrder = '';
    const sortIcon = document.getElementById('sortIcon');
    sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
    const searchQuery = new URLSearchParams(window.location.search).get('search') || '';
    fetch(`/images/sortByTag?tag=${encodeURIComponent(filter)}&search=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            updateGallery(data);
        })
        .catch(error => console.error('Error:', error));
}

function fetchAllImages() {
    sortOrder = '';
    filter = '';
    const sortIcon = document.getElementById('sortIcon');
    sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
    const searchQuery = new URLSearchParams(window.location.search).get('search') || '';
    fetch(`/images/sortByTag?tag=${encodeURIComponent(filter)}&search=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            updateGallery(data);
        })
        .catch(error => console.error('Error:', error));
}

function fetchSortedImages(sort) {
    if (sort === "asce") {
        sortOrder = "asce";
        toggleSort();
    }
}

function toggleSort() {
    const sortIcon = document.getElementById('sortIcon');
    const searchQuery = new URLSearchParams(window.location.search).get('search') || '';

    if (sortOrder === 'desc') {
        sortOrder = "asce";
        sortIcon.innerHTML = `<i class="fas fa-sort-up"></i> Publish Time`;
        fetch(`/images/sortByTimeAsce?tag=${encodeURIComponent(filter)}&search=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(data => {
                updateGallery(data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        sortOrder = "desc";
        sortIcon.innerHTML = `<i class="fas fa-sort-down"></i> Publish Time`;
        fetch(`/images/sortByTimeDesc?tag=${encodeURIComponent(filter)}&search=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(data => {
                updateGallery(data);
            })
            .catch(error => console.error('Error:', error));
    }
}

function fetchSortedImagesByType(tag) {
    filter = tag;
    const searchQuery = new URLSearchParams(window.location.search).get('search') || '';
    fetch(`/images/sortByTag?tag=${encodeURIComponent(filter)}&search=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            const sortIcon = document.getElementById('sortIcon');
            sortIcon.innerHTML = `<i class="fas fa-sort"></i> Publish Time`;
            updateGallery(data);
        })
        .catch(error => console.error('Failed to load images:', error));
}

function fetchImagesWithSearch(searchQuery) {
    fetch(`/images/sortByTag?tag=${encodeURIComponent(filter)}&search=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            updateGallery(data);
        })
        .catch(error => console.error('搜索出错:', error));
}

function updateGallery(data) {
    const gallery = document.querySelector('.photo-gallery');
    gallery.innerHTML = "<div class=\"photo\" style=\"display: none\">\n" +
        "                <div class=\"photo-indicators\">\n" +
        "                    <div class=\"indicator\"></div>\n" +
        "                    <div class=\"indicator\"></div>\n" +
        "                </div>\n" +
        "            </div>";

    data.forEach(image => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo';

        const img = document.createElement('img');
        img.src = `/image/${image.id}`;
        img.style.cursor = 'pointer';
        img.onclick = function () {
            location.href = `/imagedetail?source=${image.id}`;
        };
        photoDiv.appendChild(img);

        const indicatorsDiv = document.createElement('div');
        indicatorsDiv.className = 'photo-indicators';

        const firstIndicator = document.createElement('div');
        firstIndicator.className = 'indicator';
        firstIndicator.style.backgroundImage = `url('/static/images/aigc.png')`; // 示例图标
        firstIndicator.style.backgroundSize = 'cover';
        indicatorsDiv.appendChild(firstIndicator);

        const secondIndicator = document.createElement('div');
        secondIndicator.className = 'indicator';
        secondIndicator.style.backgroundImage = `url('/static/images/origin.png')`; // 示例图标
        secondIndicator.style.backgroundSize = 'cover';
        indicatorsDiv.appendChild(secondIndicator);

        photoDiv.appendChild(indicatorsDiv);
        gallery.appendChild(photoDiv);
    });
}