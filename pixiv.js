async function fetchBingImages() {
    const isWideScreen = window.innerWidth > window.innerHeight;
    const endpoint = isWideScreen ? 'https://cors-qdqqd.fly.dev/https://api.lolicon.app/setu/v2?size=regular&num=20&aspectRatio=gt1' : 'https://cors-qdqqd.fly.dev/https://api.lolicon.app/setu/v2?size=regular&num=20&aspectRatio=lt1'; 

    const response = await fetch(endpoint);
    const data = await response.json();
    return data.data.map(image => image.url);
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
    
    // 动态创建背景容器
    const backgroundDiv = document.createElement('div');
    backgroundDiv.style.position = 'fixed';
    backgroundDiv.style.top = '0';
    backgroundDiv.style.left = '0';
    backgroundDiv.style.width = '100%';
    backgroundDiv.style.height = '100%';
    backgroundDiv.style.zIndex = '-999999'; // 确保在内容后面
    document.body.appendChild(backgroundDiv);

    if (images.length > 0) {
        await preloadImages(images);

        backgroundDiv.style.backgroundImage = 'url(' + images[0] + ')';
        backgroundDiv.style.backgroundSize = 'cover';
        backgroundDiv.style.backgroundPosition = 'center';

        let index = 0;
        let currentBackgroundDiv = backgroundDiv;

        setInterval(() => {
            const nextIndex = (index + 1) % images.length;
            const nextBackgroundDiv = document.createElement('div');
            nextBackgroundDiv.className = 'background next';
            nextBackgroundDiv.style.backgroundImage = 'url(' + images[nextIndex] + ')';
            nextBackgroundDiv.style.backgroundSize = 'cover';
            nextBackgroundDiv.style.backgroundPosition = 'center';
            nextBackgroundDiv.style.position = 'absolute';
            nextBackgroundDiv.style.top = '0';
            nextBackgroundDiv.style.left = '0';
            nextBackgroundDiv.style.width = '100%';
            nextBackgroundDiv.style.height = '100%';
            nextBackgroundDiv.style.transition = 'opacity 1s';
            nextBackgroundDiv.style.opacity = 0;

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
                index = (index + 1) % images.length; // 跳过失败的图片
            };

        }, 8000);
    }
}

// 监听页面加载后执行背景切换功能
document.addEventListener('DOMContentLoaded', setBackgroundImages);
