function top_register() {
    window.location.href = "/signup";
}

function background_register() {
    window.location.href = "/signup";
}

function upload() {
    var userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        window.location.href = "/upload";
    } else {
        window.location.href = "/login";
    }
}

document.addEventListener('click', function(event) {
    const signInDiv = document.querySelector('.login-container');
    const signInContent = document.querySelector('.sign-in-content');
    const languageChangeDiv = document.querySelector('.language-change');
    const languageOptions = document.getElementById('language-options');

    if (signInContent.style.display === 'block' &&
        !signInDiv.contains(event.target) &&
        !signInContent.contains(event.target)) {
        signInContent.style.display = 'none';
        wasContentShown = false;
    }

    if (!languageChangeDiv.contains(event.target)) {
        languageOptions.classList.add('hidden');
    }
});

function sign_in(event) {
    event.stopPropagation();
    var userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        const signInContent = document.querySelector('.sign-in-content');
        if (signInContent.style.display === 'block') {
            signInContent.style.display = 'none';
        } else {
            signInContent.style.display = 'block';
        }
    } else {
        window.location.href = "/login";
    }
    const dropdown = document.getElementById('language-options');
    dropdown.classList.add('hidden');
}

window.onload = function() {
    var userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        document.querySelector(".sign-text").textContent = userEmail;
        document.querySelector("#show-name").textContent = "Hi  " + userEmail;
    }
};

function sign_out(event){
    event.stopPropagation();
    sessionStorage.removeItem('userEmail');
    document.querySelector(".sign-text").textContent = "Sign In";
    const signInContent = document.querySelector('.sign-in-content');
    signInContent.style.display = 'none';
    window.location.href = "/logout";
}

function GotoImageHubs(event){
    window.location.href="https://en.wikipedia.org/wiki/Image_file_format";
}
function WhatIsJpeg(event){
    window.location.href="https://en.wikipedia.org/wiki/JPEG";
}
function BecomeMembership(event){
    window.location.href = "/signup";
}
function LearnMetaData(event){
     window.location.href="https://en.wikipedia.org/wiki/Metadata#:~:text=Metadata%20is%20defined%20as%20the,Time%20and%20date%20of%20creation";
}
document.addEventListener("DOMContentLoaded", function() {
    const changePasswordSection = document.getElementById('change-password');
    changePasswordSection.addEventListener('click', function() {
        window.location.href = 'changepassword';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const profile = document.getElementById('edit-profile');
    profile.addEventListener('click', function() {
        window.location.href = 'userprofile';
    });
});


let wasContentShown = false;
window.addEventListener('scroll', function() {
    let content = document.querySelector('.sign-in-content');
    if (window.scrollY > 0) {
        content.style.display = 'none';
    } else if (window.scrollY === 0 && wasContentShown) {
        content.style.display = 'block';
    }
});

function toggleDropdown(event) {
    event.stopPropagation();

    const dropdown = document.getElementById('language-options');
    const signInContent = document.querySelector('.sign-in-content');
    if(dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        signInContent.style.display = 'none';
    } else {
        dropdown.classList.add('hidden');
    }
    wasContentShown = false;
}
function updateLanguage(code, event) {
    const selectedLanguage = document.getElementById('selected-language');
    selectedLanguage.textContent = code;
    const dropdown = document.getElementById('language-options');
    dropdown.classList.add('hidden');
    event.stopPropagation();
}

function GotoGallery(event){
    window.location.href = "/gallery";
}
function GoToFeedback(event){
    window.location.href = "/feedback";
}

document.addEventListener('DOMContentLoaded', () => {
    let slides = document.querySelectorAll('.slide');
    let thumbnails = document.querySelectorAll('.thumbnail');
    let currentSlide = 0;

    let prevButton = document.querySelector('.prev');
    let nextButton = document.querySelector('.next');
    prevButton.addEventListener('click', () => changeSlide(-1));
    nextButton.addEventListener('click', () => changeSlide(1));
    function changeSlide(direction) {
        slides[currentSlide].style.opacity = 0;
        currentSlide = (currentSlide + slides.length + direction) % slides.length;
        slides[currentSlide].style.opacity = 1;
        setActiveSlide(currentSlide);
    }
    const setActiveSlide = (index) => {
        slides.forEach(slide => slide.style.opacity = 0);
        slides[index].style.opacity = 1;
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
    };

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (e) => {
            let index = parseInt(e.target.getAttribute('data-index'));
            currentSlide = index;
            setActiveSlide(currentSlide);
        });
    });

    // Initial set up
    setActiveSlide(currentSlide);
});

document.addEventListener("DOMContentLoaded", function() {
    function rearrangeMenu() {
        var ul = document.querySelector('#mcmenu > ul');
        // 获取各个元素
        var home = document.getElementById('menu-ahome');
        var gallery = document.getElementById('menu-gallery');
        var upload = document.getElementById('menu-upload');
        var whatWeDo = document.getElementById('menu-whatwedo');
        var help = document.getElementById('menu-zhelp');
        if(window.innerWidth <= 1000 && window.innerWidth >700) {
            ul.appendChild(home);
            ul.appendChild(gallery);
            ul.appendChild(upload);
            ul.appendChild(whatWeDo);
            ul.appendChild(help);
        } else {
            ul.appendChild(home);
            ul.appendChild(gallery);
            ul.appendChild(upload);
            ul.appendChild(whatWeDo);
            ul.appendChild(help);
        }
    }
    rearrangeMenu();
    window.addEventListener('resize', rearrangeMenu);

    var menuIconWrapper = document.querySelector('.menu-icon-wrapper');
    var sidebar = document.querySelector('.sidebar');
    var mainMenu = sidebar.querySelector('.main-menu');
    var submenus = sidebar.querySelectorAll('.submenu');
    var submenus2 = sidebar.querySelectorAll('.submenu2');
    var menuLinks = mainMenu.querySelectorAll('a[data-target]');

    if (menuIconWrapper) {
        menuIconWrapper.addEventListener('click', function() {
            var threeLine = this.querySelector('.three-line');

            if (threeLine.classList.contains('cross')) {
                threeLine.classList.remove('cross');
                sidebar.style.display = 'none';
            } else {
                threeLine.classList.add('cross');
                sidebar.style.display = 'block';
                mainMenu.style.display = 'block';
                submenus.forEach(function(submenu) {
                    submenu.style.display = 'none';
                });
                submenus2.forEach(function(submenu2) {
                    submenu2.style.display = 'none';
                });
            }
        });
    }

    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var targetMenuId = link.getAttribute('data-target');
            var targetMenu = sidebar.querySelector('#' + targetMenuId);
            if (targetMenu) {
                mainMenu.style.display = 'none';
                targetMenu.style.display = 'block';
            }
        });
    });

    var backLinks = sidebar.querySelectorAll('.back-to-main');
    backLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    });
    var backFromGallery = document.querySelector('.back-from-gallery');
    if (backFromGallery) {
        backFromGallery.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    }
    var backFromHelp = document.querySelector('.back-from-help');
    if (backFromHelp) {
        backFromHelp.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    }
    var backFromCommunity = document.querySelector('.back-from-community');
    if (backFromCommunity) {
        backFromCommunity.addEventListener('click', function(event) {
            event.preventDefault();
            mainMenu.style.display = 'block';
            submenus.forEach(function(submenu) {
                submenu.style.display = 'none';
            });
            submenus2.forEach(function(submenu2) {
                submenu2.style.display = 'none';
            });
        });
    }

    window.addEventListener('resize', function() {
        var threeLine = document.querySelector('.menu-icon-wrapper .three-line');
        if (window.innerWidth > 700) {
            document.querySelector('.sidebar').style.display = 'none';
            if (threeLine.classList.contains('cross')) {
                threeLine.classList.remove('cross');
            }
        } else {
            if (document.querySelector('.sidebar').style.display === 'block' && !threeLine.classList.contains('cross')) {
                threeLine.classList.add('cross');
            }
        }
    });

});


// Fix for screen resize
let currentSlide = 0;

function slide(direction) {
    const gallery = document.getElementById('gallery');
    const divs = gallery.children;
    let visibleDivs = 5;

    // Calculate the margin in pixels (3% of gallery width)
    const marginRightPixels = 0.03 * gallery.clientWidth;

    // Combine the width of the div and the margin to get the total width per div
    let divWidth = divs[0].getBoundingClientRect().width + marginRightPixels;

    // Logic for smaller screens
    if (window.innerWidth <= 950) {
        visibleDivs = 3;
        // If there are any different specifications for smaller screens, adjust here
    }

    if (direction === 'left' && currentSlide > 0) {
        currentSlide--;
    } else if (direction === 'right' && currentSlide < divs.length - visibleDivs) {
        currentSlide++;
    }

    gallery.style.transform = `translateX(-${currentSlide * divWidth}px)`;
}
// Fix for screen resize
window.addEventListener('resize', function() {
    const gallery = document.getElementById('gallery');
    const divs = gallery.children;

    // Calculate the margin in pixels (3% of gallery width)
    const marginRightPixels = 0.03 * gallery.clientWidth;

    // Combine the width of the div and the margin to get the total width per div
    const divWidth = divs[0].getBoundingClientRect().width + marginRightPixels;

    // Update the transform position of the gallery
    gallery.style.transform = `translateX(-${currentSlide * divWidth}px)`;
});

function showBetaDisclaimer() {
    // Get stored status and timestamp
    const disclaimerShown = localStorage.getItem('betaDisclaimerShown');
    const lastShownTime = localStorage.getItem('betaDisclaimerTime');
    
    // Check if popup has been shown before and if it's within 5 minutes
    const currentTime = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (!disclaimerShown || !lastShownTime || (currentTime - parseInt(lastShownTime)) > fiveMinutes) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        
        // Create modal content
        const modal = document.createElement('div');
        modal.style.backgroundColor = 'white';
        modal.style.padding = '25px';
        modal.style.borderRadius = '8px';
        modal.style.maxWidth = '500px';
        modal.style.margin = '0 15px';
        modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        
        // Modal title
        const title = document.createElement('h2');
        title.textContent = 'Disclaimer: Beta Version Notice';
        title.style.marginTop = '0';
        title.style.color = '#333';
        
        // Modal content
        const content = document.createElement('div');
        content.innerHTML = `
            <p>Please note that our website is currently in its beta phase. As such, some features and functionalities presented in our promotional materials, including our pitch video, may not yet be fully implemented or operational.</p>
            <p>We are actively working to develop and enhance the platform, and we appreciate your understanding and patience during this period.</p>
            <p>For a preview of our vision and planned features, you can view our pitch video here: <a href="https://youtu.be/4iku4OLeG5M" target="_blank" style="color: #007bff; text-decoration: none;">https://youtu.be/4iku4OLeG5M</a>.</p>
        `;
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'I Understand';
        closeButton.style.marginTop = '15px';
        closeButton.style.padding = '8px 16px';
        closeButton.style.backgroundColor = '#007bff';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        
        // Assemble modal
        modal.appendChild(title);
        modal.appendChild(content);
        modal.appendChild(closeButton);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Close button event
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            // Set localStorage flag and timestamp
            localStorage.setItem('betaDisclaimerShown', 'true');
            localStorage.setItem('betaDisclaimerTime', currentTime.toString());
        });
    }
}

// Call when page finishes loading
window.addEventListener('DOMContentLoaded', showBetaDisclaimer);