async function fetchBingImages() {
    const isLandscape = window.innerWidth > window.innerHeight;

    // 定义多个 CORS 代理
    const corsProxies = [
        'https://i.qdqqd.com/?cors=',
        'https://cors.qdqqd.com/?url=',
        'https://cors-qdqqd.vercel.app/?url=',
        'https://cors-tube.vercel.app/?url=',
        'https://api.allorigins.win/raw?url='
    ];

    // 随机选择一个代理
    const randomProxy = corsProxies[Math.floor(Math.random() * corsProxies.length)];

    const encodedUrl1 = encodeURIComponent('https://api.lolicon.app/setu/v2?size=regular&proxy=i.pixiv.nl&num=20&aspectRatio=gt1');
    const encodedUrl2 = encodeURIComponent('https://api.lolicon.app/setu/v2?size=regular&proxy=i.pixiv.nl&num=20&aspectRatio=lt1');
    
    const endpoint = isLandscape 
        ? `${randomProxy}${encodedUrl1}` 
        : `${randomProxy}${encodedUrl2}`; 

    const response = await fetch(endpoint);
    const data = await response.json();

    // 直接使用正确的路径，返回每个图片的 regular URL
    return data.data.map(image => image.urls.regular);
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
    });
}

async function preloadImages(imageUrls) {
    const promises = imageUrls.map(url => loadImage(url).catch((errorUrl) => {
        console.error('Image failed to load:', errorUrl);
        return null; 
    }));

    const results = await Promise.all(promises);
    return results.filter(Boolean); // 去除加载失败的图片
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
            index = (index + 1) % images.length;
            console.log('Next image index:', index, 'Image URL:', images[index]); // Debugging output

            loadImage(images[index])
                .then(() => {
                    const nextBackgroundDiv = document.createElement('div');
                    nextBackgroundDiv.style.backgroundImage = 'url(' + images[index] + ')';
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

                    nextBackgroundDiv.style.opacity = 1;
                    setTimeout(() => {
                        document.body.removeChild(currentBackgroundDiv);
                        currentBackgroundDiv = nextBackgroundDiv;
                    }, 1000);
                })
                .catch(() => {
                    console.error('Failed to load image:', images[index]);
                    index = (index + 1) % images.length; 
                });
        }, 8000);
    }
}

// 监听页面加载后执行背景切换功能
document.addEventListener('DOMContentLoaded', setBackgroundImages);
