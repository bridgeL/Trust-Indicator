function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // 检查搜索框和按钮是否存在
    if (searchInput && searchButton) {
        function performSearch() {
            const searchQuery = searchInput.value.trim();
            // 输入校验：限制搜索内容长度
            if (searchQuery.length > 100) {
                alert('搜索内容不能超过100个字符。');
                return;
            }
            // 构造搜索 URL 并跳转
            const url = `/gallery?search=${encodeURIComponent(searchQuery)}`;
            window.location.href = url;
        }

        // 为搜索按钮添加点击事件
        searchButton.addEventListener('click', performSearch);
        // 为输入框添加回车键事件
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// 在页面加载完成后初始化搜索功能
document.addEventListener('DOMContentLoaded', initSearch);