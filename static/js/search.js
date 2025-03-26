function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Check if the search input and button exist
    if (searchInput && searchButton) {
        function performSearch() {
            const searchQuery = searchInput.value.trim();
            // Input validation: limit the length of the search query
            if (searchQuery.length > 100) {
                alert('Search query cannot exceed 100 characters.');
                return;
            }
            // Construct the search URL and navigate
            const url = `/gallery?search=${encodeURIComponent(searchQuery)}`;
            window.location.href = url;
        }

        // Add click event to the search button
        searchButton.addEventListener('click', performSearch);
        // Add Enter key event to the input field
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Initialize search functionality after the page loads
document.addEventListener('DOMContentLoaded', initSearch);
