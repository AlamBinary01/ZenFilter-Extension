import { NsfwSpy } from './nsfw.ts';

const nsfwSpy = new NsfwSpy(chrome.runtime.getURL('./models/model.json'));

async function init() {
    await nsfwSpy.load();
    observeImages();
    monitorVideos();
    observeDOMChanges();
}

function observeImages() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                classifyImage(img);
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px 0px', threshold: 0.01 });

    document.querySelectorAll('img:not(.processed)').forEach(img => {
        observer.observe(img);
    });
}

async function classifyImage(img) {
    const imageUrl = img.src || img.dataset.src;
    img.classList.add('processed');

    if (!imageUrl) return;

    try {
        const explicitResultPromise = nsfwSpy.classifyImageUrl(imageUrl);
        const violenceResultPromise = fetchViolenceClassification(imageUrl);

        const [explicitResult, violenceResult] = await Promise.all([explicitResultPromise, violenceResultPromise]);

        if (shouldBlur(explicitResult, violenceResult)) {
            applyBlur(img);
        }
    } catch (error) {
        console.error('Error classifying image:', error);
    }
}

async function fetchViolenceClassification(imageUrl) {
    const response = await fetch('http://localhost:5000/fetchImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
    });
    if (!response.ok) throw new Error('Failed to fetch image through proxy');
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob);
    const result = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData });
    return result.json();
}

function shouldBlur(explicitResult, violenceResult) {
    return ['pornography', 'sexy', 'hentai'].includes(explicitResult.predictedLabel) ||
           ['fight on a street', 'fire on a street', 'street violence', 'car crash', 'violence in office', 'fire in office'].includes(violenceResult.label);
}

function applyBlur(img) {
    img.style.filter = 'blur(10px)';
}

async function monitorVideos() {
    document.querySelectorAll('video:not(.processed)').forEach(video => {
        video.classList.add('processed');
        processVideoFrames(video);
    });
}

async function processVideoFrames(video) {
    let intervalId;
    const processFrame = throttle(async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

 	  console.log("Video Frame Captured");

        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const formData = new FormData();
        formData.append('file', blob);

        try {
            const explicitResult = await nsfwSpy.classifyImage(canvas);
            const violenceResult = await fetch('http://127.0.0.1:5000/predict', { method: 'POST', body: formData }).then(response => response.json());

            if (['pornography', 'sexy', 'hentai'].includes(explicitResult.predictedLabel) || ['fight on a street', 'fire on a street', 'street violence', 'car crash', 'violence in office', 'fire in office'].includes(violenceResult.label)) {
                showNotification("You're watching sensitive content");
                clearInterval(intervalId);
                redirectToDashboard();
                return;
            }
        } catch (error) {
            console.error('Error processing video frame:', error);
        }
    }, 1000);

    video.addEventListener('play', () => {
        const interval = setInterval(() => {
            if (video.paused || video.ended) clearInterval(interval);
            else processFrame();
        }, 1000);
    });
}

function observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'IMG' && !node.classList.contains('processed')) {
                    classifyImage(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

async function redirectToDashboard() {
    const currentUrl = window.location.origin;

    // Use a Promise to wait for the email value
    const email = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["userEmail"], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result.userEmail);
            }
        });
    });

    // Now get the token the same way, for consistency and to handle possible errors
    const token = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["token"], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result.token);
            }
        });
    });

    // Proceed if token is available
    if (token) {
        try {
            const response = await fetch("http://localhost:5000/addBlockedUrl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ email, url: currentUrl }),
            });

            // Handle response...
            // For example, check if response was successful and then redirect
            if (response.ok) {
                // Assuming you want to redirect on successful addition
                console.log("Hahahahahaahahahahaahahah")
                // window.location.href = "https://zenfilter.netlify.app";
            } else {
                console.error('Failed to add blocked site: ', await response.text());
            }
        } catch (error) {
            console.error('Failed to add blocked site:', error);
        }
    } else {
        console.log("Token not found in storage.");
    }
}

  

function showNotification(message) {
    // Check if a notification already exists, if so, remove it
    const existingNotification = document.getElementById('customNotification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create the notification element
    const notification = document.createElement('div');
    notification.id = 'customNotification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'black';
    notification.style.color = 'red';
    notification.style.padding = '20px 40px';
    notification.style.borderRadius = '20px';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '24px';
    notification.style.fontWeight = 'bold';
    notification.style.fontFamily = 'Montserrat, sans-serif';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '80%';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';

    // Append the notification to the body
    document.body.appendChild(notification);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}


function throttle(callback, limit) {
    let waiting = false;
    return function () {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}

init();
