function openModal() {
    document.getElementById('profilePhotoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('profilePhotoModal').style.display = 'none';
}

window.onclick = function (event) {
    if (event.target === document.getElementById('profilePhotoModal')) {
        closeModal();
    } else if (event.target === document.getElementById('trustProfileModal')) {
        closeTrustProfileModal();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var selectableImages = document.querySelectorAll('.selectable-image');
    function clearSelection() {
        selectableImages.forEach(function (img) {
            img.classList.remove('selected');
        });
    }
    selectableImages.forEach(function (image) {
        image.addEventListener('click', function () {
            clearSelection(); // Clear any previous selections
            image.classList.add('selected');
        });
    });
    var exitButton = document.querySelector('.modal-options button:nth-child(2)');
    if (exitButton) {
        exitButton.addEventListener('click', function () {
            clearSelection();
            closeModal();
        });
    }

    // 加载Trust Profile数据
    loadTrustProfile();

    // 初始化Trust Profile编辑器的事件监听
    initTrustProfileEditor();
});

function saveSelection() {
    var selectedImageElement = document.querySelector('.selectable-image.selected');
    var imageSrc = selectedImageElement ? selectedImageElement.getAttribute('src') : '';
    var match = imageSrc.match(/(\d+)\.jpg$/);
    var selectedImageId = match ? match[1] : null;

    if (selectedImageElement) {
        selectedImageElement.classList.remove('selected');
    }

    if (selectedImageId) {
        fetch('/change_profile_photo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: 'selected_image=' + encodeURIComponent(selectedImageId)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('user-profile-picture').src = imageSrc;

                    showSuccessAlert(data.message);
                    closeModal();
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                showErrorAlert(error.message);
            });
    } else {
        showErrorAlert('Please select an image before saving.');
    }
}

function showSuccessAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
    alertBox.classList.add('success-alert');
    document.body.prepend(alertBox);

    setTimeout(function () {
        fadeOutAlert(alertBox);
    }, 3000);
}

function showErrorAlert(message) {
    var alertBox = createAlert(message);
    alertBox.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
    alertBox.classList.add('error-alert');
    document.body.prepend(alertBox);

    setTimeout(function () {
        fadeOutAlert(alertBox);
    }, 5000);
}

function createAlert(message) {
    var alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.style.color = 'white';
    alertBox.style.padding = '15px';
    alertBox.style.margin = '15px';
    alertBox.style.borderRadius = '4px';
    alertBox.style.position = 'fixed';
    alertBox.style.left = '50%';
    alertBox.style.top = '20px';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    alertBox.style.transition = 'opacity 0.5s ease, top 0.5s ease';
    alertBox.style.zIndex = '1000';
    return alertBox;
}

function fadeOutAlert(alertBox) {
    alertBox.style.opacity = '0';
    alertBox.style.top = '10px';

    setTimeout(function () {
        alertBox.remove();
    }, 500);
}

// Trust Profile related functions

// Store current Trust Profile data
let currentTrustProfile = {
    id: null,
    snippets: []
};

// Store selected snippets
const selectedSnippets = {};

function openTrustProfileModal() {
    document.getElementById('trustProfileModal').style.display = 'block';

    // Reset selection state
    resetTrustProfileSelection();

    // Load current user's Trust Profile
    loadUserTrustProfile();
}

function closeTrustProfileModal() {
    document.getElementById('trustProfileModal').style.display = 'none';
}

function resetTrustProfileSelection() {
    // Clear all selected snippets
    for (const key in selectedSnippets) {
        delete selectedSnippets[key];
    }

    // Reset UI
    document.querySelectorAll('.snippet-item').forEach(item => {
        item.classList.remove('selected');
        const toggle = item.querySelector('.snippet-toggle');
        if (toggle) toggle.textContent = '+';
    });

    // Show empty selection message
    const emptyMsg = document.querySelector('.empty-selection-msg');
    if (emptyMsg) emptyMsg.style.display = 'block';
}

function initTrustProfileEditor() {
    // Initialize AI threshold slider with numeric display
    const aiThresholdSlider = document.getElementById('ai-threshold');
    const aiThresholdValue = document.getElementById('ai-threshold-value');

    if (aiThresholdSlider && aiThresholdValue) {
        // Show initial value
        aiThresholdValue.textContent = aiThresholdSlider.value + '%';

        aiThresholdSlider.addEventListener('input', function () {
            aiThresholdValue.textContent = this.value + '%';

            // If already selected, update settings
            if (selectedSnippets['ai_threshold']) {
                selectedSnippets['ai_threshold'].settings.threshold = parseInt(this.value);

                // Also update the display in the selected snippets panel if it exists
                const selectedThresholdValue = document.querySelector('#selected-snippets .snippet-item[data-type="ai_threshold"] .threshold-value');
                if (selectedThresholdValue) {
                    selectedThresholdValue.textContent = this.value + '%';
                }
            }
        });
    }

    // Add click event for snippets
    document.querySelectorAll('.snippet-item').forEach(item => {
        item.addEventListener('click', function () {
            const type = this.getAttribute('data-type');
            toggleSnippetSelection(type, this);
        });
    });
}

function toggleSnippetSelection(type, element) {
    // Find the corresponding element in the available snippets panel
    const availableElement = document.querySelector(`.trust-editor-right .snippet-item[data-type="${type}"]`);

    if (selectedSnippets[type]) {
        // Cancel selection
        delete selectedSnippets[type];

        // Update UI in both panels
        if (availableElement) {
            availableElement.classList.remove('selected');
            availableElement.querySelector('.snippet-toggle').textContent = '+';
        }

        // Update selected snippets display
        updateSelectedSnippetsUI();
    } else {
        // Select
        let settings = {};

        if (type === 'ai_threshold') {
            const threshold = document.getElementById('ai-threshold').value;
            settings = { threshold: parseInt(threshold) };
        }

        selectedSnippets[type] = {
            type: type,
            settings: settings,
            enabled: true
        };

        // Update UI in both panels
        if (availableElement) {
            availableElement.classList.add('selected');
            availableElement.querySelector('.snippet-toggle').textContent = '−';
        }

        // Update selected snippets display
        updateSelectedSnippetsUI();
    }
}

function updateSelectedSnippetsUI() {
    const selectedContainer = document.getElementById('selected-snippets');
    const emptyMsg = document.querySelector('.empty-selection-msg');

    if (Object.keys(selectedSnippets).length === 0) {
        // No selected snippets
        if (emptyMsg) emptyMsg.style.display = 'block';

        // Clear all existing snippet elements except empty message
        Array.from(selectedContainer.children).forEach(child => {
            if (!child.classList.contains('empty-selection-msg')) {
                child.remove();
            }
        });
        return;
    }

    // Hide empty message
    if (emptyMsg) emptyMsg.style.display = 'none';

    // Clear existing content
    Array.from(selectedContainer.children).forEach(child => {
        if (!child.classList.contains('empty-selection-msg')) {
            child.remove();
        }
    });

    // Add selected snippets
    for (const key in selectedSnippets) {
        const snippet = selectedSnippets[key];
        const snippetElement = document.createElement('div');
        snippetElement.className = 'snippet-item selected';
        snippetElement.setAttribute('data-type', key);

        let settingsHTML = '';
        if (key === 'ai_threshold') {
            settingsHTML = `
                <div class="snippet-settings">
                    <label>Threshold: <span class="threshold-value">${snippet.settings.threshold}%</span></label>
                </div>
            `;
        }

        snippetElement.innerHTML = `
            <div class="snippet-header">
                <span class="snippet-name">${getSnippetName(key)}</span>
                <span class="snippet-toggle" data-type="${key}">−</span>
            </div>
            <div class="snippet-body">
                <p>${getSnippetDescription(key)}</p>
                ${settingsHTML}
            </div>
        `;

        // Add delete event
        snippetElement.querySelector('.snippet-toggle').addEventListener('click', function () {
            const toggleType = this.getAttribute('data-type');
            toggleSnippetSelection(toggleType, this);
        });

        selectedContainer.appendChild(snippetElement);
    }
}

function getSnippetName(type) {
    const names = {
        'ai_threshold': 'AI Content Threshold',
        'megadata_complete': 'MegaData Completeness Check'
    };
    return names[type] || type;
}

function getSnippetDescription(type) {
    const descriptions = {
        'ai_threshold': 'Set acceptable AI rate threshold for photos',
        'megadata_complete': 'Reject photos with incomplete MegaData'
    };
    return descriptions[type] || '';
}

function loadUserTrustProfile() {
    fetch('/get_trust_profile')
        .then(response => {
            if (!response.ok) {
                if (response.status === 500) {
                    // The table might not exist yet, handle gracefully
                    console.warn('Trust Profile tables may be initializing');
                    return {
                        profile: {
                            id: null,
                            snippets: []
                        }
                    };
                }
                throw new Error('Server error: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.profile) {
                currentTrustProfile = data.profile;

                // Clear any existing selections
                for (const key in selectedSnippets) {
                    delete selectedSnippets[key];
                }

                // Reset UI first
                document.querySelectorAll('.snippet-item').forEach(item => {
                    item.classList.remove('selected');
                    const toggle = item.querySelector('.snippet-toggle');
                    if (toggle) toggle.textContent = '+';
                });

                // Set selection based on existing Trust Profile
                if (data.profile.snippets && data.profile.snippets.length > 0) {
                    data.profile.snippets.forEach(snippet => {
                        try {
                            const settings = JSON.parse(snippet.settings);
                            selectedSnippets[snippet.type] = {
                                type: snippet.type,
                                settings: settings,
                                enabled: snippet.enabled
                            };

                            const element = document.querySelector(`.snippet-item[data-type="${snippet.type}"]`);
                            if (element) {
                                element.classList.add('selected');
                                element.querySelector('.snippet-toggle').textContent = '−';

                                // If it's AI threshold, set slider value
                                if (snippet.type === 'ai_threshold') {
                                    const slider = document.getElementById('ai-threshold');
                                    const value = document.getElementById('ai-threshold-value');
                                    if (slider && value && settings.threshold !== undefined) {
                                        slider.value = settings.threshold;
                                        value.textContent = settings.threshold + '%';
                                    }
                                }
                            }
                        } catch (e) {
                            console.error('Error parsing snippet settings:', e);
                        }
                    });
                }

                // Update UI
                updateSelectedSnippetsUI();
            }
        })
        .catch(error => {
            console.error('Error loading trust profile:', error);
            // Don't show error to user, just handle gracefully
            updateSelectedSnippetsUI();
        });
}

function saveTrustProfile() {
    // Build data to save from selectedSnippets
    const snippetsToSave = Object.values(selectedSnippets).map(snippet => {
        return {
            type: snippet.type,
            settings: JSON.stringify(snippet.settings || {}),
            enabled: snippet.enabled
        };
    });

    // Send to server
    fetch('/save_trust_profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ snippets: snippetsToSave })
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 500) {
                    // Database table might be initializing, wait a moment and retry
                    showSuccessAlert('Initializing Trust Profile system. Please wait...');

                    // Wait 2 seconds before retrying
                    setTimeout(() => {
                        // Retry the save operation
                        fetch('/save_trust_profile', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ snippets: snippetsToSave })
                        })
                            .then(retryResponse => retryResponse.json())
                            .then(data => {
                                if (data.status === 'success') {
                                    showSuccessAlert('Trust Profile saved successfully');
                                    closeTrustProfileModal();
                                    loadTrustProfile();
                                } else {
                                    throw new Error(data.message || 'Failed to save Trust Profile');
                                }
                            })
                            .catch(retryError => {
                                showErrorAlert('Failed to save Trust Profile: ' + retryError.message);
                            });
                    }, 2000);
                    return null;
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Server returned error ' + response.status);
                    });
                }
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                if (data.status === 'success') {
                    showSuccessAlert('Trust Profile saved successfully');
                    closeTrustProfileModal();
                    // Reload displayed Trust Profile
                    loadTrustProfile();
                } else if (data.message) {
                    throw new Error(data.message);
                }
            }
        })
        .catch(error => {
            console.error('Error saving trust profile:', error);
            showErrorAlert('Failed to save Trust Profile: ' + error.message);
        });
}

function loadTrustProfile() {
    fetch('/get_trust_profile')
        .then(response => {
            if (!response.ok) {
                if (response.status === 500) {
                    // The table might not exist yet, handle gracefully
                    console.warn('Trust Profile tables may be initializing');
                    return {
                        profile: {
                            id: null,
                            snippets: []
                        }
                    };
                }
                throw new Error('Server error: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.profile) {
                const snippetsContainer = document.getElementById('trust-profile-snippets');
                const noProfileMsg = document.getElementById('no-trust-profile');

                if (data.profile.snippets && data.profile.snippets.length > 0) {
                    // Has Trust Profile, show content
                    noProfileMsg.style.display = 'none';
                    snippetsContainer.style.display = 'block';

                    // Clear existing content
                    snippetsContainer.innerHTML = '';

                    // Add each snippet display
                    data.profile.snippets.forEach(snippet => {
                        try {
                            const settings = JSON.parse(snippet.settings || '{}');
                            const snippetEl = document.createElement('div');
                            snippetEl.className = 'trust-profile-snippet';

                            let valueText = '';
                            if (snippet.type === 'ai_threshold') {
                                valueText = `AI content must not exceed ${settings.threshold}%`;
                            } else if (snippet.type === 'megadata_complete') {
                                valueText = 'MegaData must be complete';
                            }

                            snippetEl.innerHTML = `
                                <div class="trust-profile-snippet-name">${getSnippetName(snippet.type)}</div>
                                <div class="trust-profile-snippet-value">${valueText}</div>
                            `;

                            snippetsContainer.appendChild(snippetEl);
                        } catch (e) {
                            console.error('Error parsing snippet settings:', e);
                        }
                    });
                } else {
                    // No Trust Profile, show empty message
                    noProfileMsg.style.display = 'block';
                    snippetsContainer.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('Error loading trust profile display:', error);
            // Just show no profile message instead of error
            const snippetsContainer = document.getElementById('trust-profile-snippets');
            const noProfileMsg = document.getElementById('no-trust-profile');
            if (noProfileMsg && snippetsContainer) {
                noProfileMsg.style.display = 'block';
                snippetsContainer.style.display = 'none';
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/getcurrentuserimages').then(response => response.json()).then(data => {
        const gallery = document.getElementById('uploaded-images');
        var firstIndicatorImages = ['aigc.png', 'aigc.png', /* ... more icons ... */];
        var secondIndicatorImages = ['origin.png', 'origin.png', /* ... more icons ... */];

        if (data.length > 0) {
            document.getElementById("no-uploaded").style.display = "none"; // 改为display属性
            document.getElementById("uploaded-images-container").style.display = "block"; // 改为display属性

            data.forEach(image => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo';

                const img = document.createElement('img');
                img.src = `/image/${image.id}`;
                photoDiv.appendChild(img);
                img.onclick = function () {        // Assign a function to the onclick event
                    location.href = `/imagedetail?source=${image.id}`; // Redirect to the image detail page
                };
                const indicatorsDiv = document.createElement('div');
                indicatorsDiv.className = 'photo-indicators';

                const firstIndicator = document.createElement('div');
                firstIndicator.className = 'indicator';
                firstIndicator.style.backgroundImage = `url('/static/images/${firstIndicatorImages[1]}')`;
                firstIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(firstIndicator);

                const secondIndicator = document.createElement('div');
                secondIndicator.className = 'indicator';
                secondIndicator.style.backgroundImage = `url('/static/images/${secondIndicatorImages[0]}')`;
                secondIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(secondIndicator);

                photoDiv.appendChild(indicatorsDiv);
                gallery.appendChild(photoDiv);
            });
        } else {
            document.getElementById("no-uploaded").style.display = "block";
            document.getElementById("uploaded-images-container").style.display = "none";
        }
    })
        .catch(error => console.error('Error:', error));

    fetch('/getAllFavouritesByUser').then(response => response.json()).then(data => {
        const gallery = document.getElementById('favourite-images');
        var firstIndicatorImages = ['aigc.png', 'aigc.png', /* ... more icons ... */];
        var secondIndicatorImages = ['origin.png', 'origin.png', /* ... more icons ... */];

        if (data.length > 0) {
            document.getElementById("no-favourite").style.display = "none";
            document.getElementById("favourite-images-container").style.display = "block";

            data.forEach(image => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo';

                const img = document.createElement('img');
                img.src = `/image/${image.id}`;
                photoDiv.appendChild(img);
                img.onclick = function () {        // Assign a function to the onclick event
                    location.href = `/imagedetail?source=${image.id}`; // Redirect to the image detail page
                };

                const indicatorsDiv = document.createElement('div');
                indicatorsDiv.className = 'photo-indicators';

                const firstIndicator = document.createElement('div');
                firstIndicator.className = 'indicator';
                firstIndicator.style.backgroundImage = `url('/static/images/${firstIndicatorImages[1]}')`;
                firstIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(firstIndicator);

                const secondIndicator = document.createElement('div');
                secondIndicator.className = 'indicator';
                secondIndicator.style.backgroundImage = `url('/static/images/${secondIndicatorImages[0]}')`;
                secondIndicator.style.backgroundSize = 'cover';
                indicatorsDiv.appendChild(secondIndicator);

                photoDiv.appendChild(indicatorsDiv);
                gallery.appendChild(photoDiv);
            });
        } else {
            document.getElementById("no-favourite").style.display = "block";
            document.getElementById("favourite-images-container").style.display = "none";
        }
    })
        .catch(error => console.error('Error:', error));
});

