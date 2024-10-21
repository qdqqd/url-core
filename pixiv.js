async function fetchBingImages() {
    const isWideScreen = window.innerWidth > window.innerHeight;
    const endpoint = isWideScreen 
        ? 'https://api.allorigins.win/raw?url=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D20%26aspectRatio%3Dgt1' 
        : 'https://api.allorigins.win/raw?url=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D20%26aspectRatio%3Dlt1'; 

    const response = await fetch(endpoint);
    const data = await response.json();

    // 直接使用正确的路径，返回每个图片的 regular URL
    return data.data.map(image => image.urls.regular);
}


async function preloadImages(imageUrls) {
    return new Promise((resolve, reject) => {
        let loadedImages = 0;
        const totalImages = imageUrls.length;

        if (totalImages === 0) {
            resolve();
            return;
        }

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    resolve();
                }
            };
            img.onerror = () => {
                console.error('Image failed to load:', url);
                loadedImages++;
                if (loadedImages === totalImages) {
                    resolve();
                }
            };
        });
    });
}


async function setBackgroundImages() {
    const images = await fetchBingImages();
    
    if (images.length > 0) {
        await preloadImages(images);

        let index = 0;
        let currentBackgroundDiv = document.createElement('div');
        currentBackgroundDiv.style.backgroundImage = 'url(' + images[0] + ')';
        currentBackgroundDiv.style.backgroundSize = 'cover';
        currentBackgroundDiv.style.backgroundPosition = 'center';
        currentBackgroundDiv.style.position = 'fixed';
        currentBackgroundDiv.style.top = '0';
        currentBackgroundDiv.style.left = '0';
        currentBackgroundDiv.style.width = '100%';
        currentBackgroundDiv.style.height = '100%';
        currentBackgroundDiv.style.zIndex = '-999998';
        document.body.appendChild(currentBackgroundDiv);

        setInterval(() => {
            const nextIndex = (index + 1) % images.length;
            console.log('Next image index:', nextIndex, 'Image URL:', images[nextIndex]); // Debugging output

            if (!images[nextIndex]) {
                console.error('Undefined image URL at index:', nextIndex);
                index = nextIndex; // Skip to the next image
                return;
            }

            const nextBackgroundDiv = document.createElement('div');
            nextBackgroundDiv.style.backgroundImage = 'url(' + images[nextIndex] + ')';
            nextBackgroundDiv.style.backgroundSize = 'cover';
            nextBackgroundDiv.style.backgroundPosition = 'center';
            nextBackgroundDiv.style.position = 'fixed';
            nextBackgroundDiv.style.top = '0';
            nextBackgroundDiv.style.left = '0';
            nextBackgroundDiv.style.width = '100%';
            nextBackgroundDiv.style.height = '100%';
            nextBackgroundDiv.style.transition = 'opacity 1s';
            nextBackgroundDiv.style.opacity = 0;
            nextBackgroundDiv.style.zIndex = '-999999';
            document.body.appendChild(nextBackgroundDiv);

            const img = new Image();
            img.src = images[nextIndex];
            img.onload = () => {
                nextBackgroundDiv.style.opacity = 1;
                setTimeout(() => {
                    document.body.removeChild(currentBackgroundDiv);
                    currentBackgroundDiv = nextBackgroundDiv;
                    index = nextIndex;
                }, 1000);
            };
            img.onerror = () => {
                console.error('Failed to load image:', images[nextIndex]);
                document.body.removeChild(nextBackgroundDiv);
                index = (index + 1) % images.length; // Skip the failed image
            };
        }, 8000);
    }
}


// 监听页面加载后执行背景切换功能
document.addEventListener('DOMContentLoaded', setBackgroundImages);
