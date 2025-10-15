// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const installBanner = document.getElementById('installBanner');
const cookieBanner = document.getElementById('cookieBanner');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const closeMobileNav = document.getElementById('closeMobileNav');
const pasteBtn = document.getElementById('pasteBtn');
const urlInput = document.querySelector('.url-input');
const formatOptions = document.querySelectorAll('.format-option');
const downloadBtn = document.getElementById('downloadBtn');
const downloadSection = document.getElementById('downloadSection');
const progressSection = document.getElementById('progressSection');
const successSection = document.getElementById('successSection');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const progressStatus = document.getElementById('progressStatus');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const estimatedTime = document.getElementById('estimatedTime');
const downloadLink = document.getElementById('downloadLink');
const downloadAgainBtn = document.getElementById('downloadAgainBtn');
const backToTopBtn = document.getElementById('backToTopBtn');
const installNowBtn = document.getElementById('installNowBtn');
const installLaterBtn = document.getElementById('installLaterBtn');
const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2000);

    if (!getCookie('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 2500);
    }

    if (!localStorage.getItem('appInstallPrompted') && isMobile()) {
        setTimeout(() => {
            installBanner.style.display = 'block';
        }, 3000);
    }

    const preferredFormat = getCookie('preferredFormat') || 'mp4';
    setActiveFormat(preferredFormat);
    initEventListeners();
});

// Event Listeners
function initEventListeners() {
    mobileMenuBtn.addEventListener('click', toggleMobileNav);
    closeMobileNav.addEventListener('click', toggleMobileNav);

    formatOptions.forEach(option => {
        option.addEventListener('click', function () {
            setActiveFormat(this.dataset.format);
            setCookie('preferredFormat', this.dataset.format, 365);
        });
    });

    pasteBtn.addEventListener('click', async function () {
        try {
            const text = await navigator.clipboard.readText();
            urlInput.value = text;
            validateUrl(text);
        } catch (err) {
            urlInput.placeholder = "Paste didn't work. Please paste manually.";
            urlInput.focus();
        }
    });

    urlInput.addEventListener('input', function () {
        validateUrl(this.value);
    });

    // ✅ Real Download Function
    downloadBtn.addEventListener('click', async function () {
        const url = urlInput.value.trim();
        if (!validateUrl(url)) {
            alert('Please enter a valid YouTube URL');
            return;
        }

        const activeFormat = document.querySelector('.format-option.active').dataset.format;

        downloadSection.style.display = 'none';
        progressSection.style.display = 'block';

        try {
            progressStatus.textContent = 'Starting download...';
            progressBar.style.width = '5%';
            progressPercentage.textContent = '5%';

           // Replace with the live URL you get from Render
const backendUrl = "https://YOUR-LIVE-BACKEND-URL.onrender.com"; 

// Update the fetch call
const response = await fetch(`${backendUrl}/download`, {
    method: "POST",
    // ... rest of the code
});

            if (!response.ok) throw new Error("Download failed from server");

            // Blob download
            const blob = await response.blob();
            const a = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = activeFormat === "mp3" ? "audio.mp3" : "video.mp4";
            a.click();
            URL.revokeObjectURL(objectUrl);

            progressStatus.textContent = 'Finishing up...';
            progressBar.style.width = '100%';
            progressPercentage.textContent = '100%';

            setTimeout(() => {
                progressSection.style.display = 'none';
                successSection.style.display = 'block';
            }, 1000);
        } catch (err) {
            alert("⚠️ Error: " + err.message);
            progressSection.style.display = 'none';
            downloadSection.style.display = 'block';
        }
    });

    downloadAgainBtn.addEventListener('click', function () {
        successSection.style.display = 'none';
        downloadSection.style.display = 'block';
        urlInput.value = '';
        urlInput.focus();
    });

    backToTopBtn.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleBackToTopButton);

    installNowBtn.addEventListener('click', function () {
        installBanner.style.display = 'none';
        localStorage.setItem('appInstallPrompted', 'true');
        alert('App installation would start here in a real application.');
    });

    installLaterBtn.addEventListener('click', function () {
        installBanner.style.display = 'none';
        localStorage.setItem('appInstallPrompted', 'true');
    });

    cookieAcceptBtn.addEventListener('click', function () {
        cookieBanner.style.display = 'none';
        setCookie('cookiesAccepted', 'true', 365);
        setCookie('analytics', 'true', 365);
        setCookie('preferences', 'true', 365);
    });

    cookieSettingsBtn.addEventListener('click', function () {
        alert('Cookie settings would open here in a real application.');
    });
}

// Helper Functions
function toggleMobileNav() {
    mobileNav.classList.toggle('active');
}

function setActiveFormat(format) {
    formatOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.format === format);
    });
}

function validateUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const isValid = youtubeRegex.test(url);

    if (url && !isValid) {
        urlInput.classList.add('error');
        downloadBtn.disabled = true;
    } else {
        urlInput.classList.remove('error');
        downloadBtn.disabled = !url;
    }
    return isValid;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Cookie functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
