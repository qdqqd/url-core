async function fetchBingImages() {
    const isWideScreen = window.innerWidth > window.innerHeight;
    const endpoint = isWideScreen 
        ? 'https://i.qdqqd.com/?cors=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D20%26aspectRatio%3Dgt1%26proxy%3Di.pximg.org' 
        : 'https://i.qdqqd.com/?cors=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D20%26aspectRatio%3Dlt1%26proxy%3Di.pximg.org';
    
    // 设置请求头，伪装Referer
    const headers = {
       // 'Referer': 'https://api.lolicon.app',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('网络响应不正常');
        }

        const data = await response.json();

        // 返回图片的URL数组
        if (data.data && data.data.length > 0) {
            return data.data.map(image => image.urls.regular);
        } else {
            throw new Error('API未返回任何图像');
        }
    } catch (error) {
        console.error('使用回退映像从API获取映像时出错:', error);
        return [
            'https://img.qdqqd.com/?1',
            'https://img.qdqqd.com/?2'
        ];
    }
}

// 预加载图片，确保图片准备好再进行轮播
async function preloadImages(imageUrls) {
    return new Promise((resolve) => {
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

// 设置背景图片div并实现轮播淡入淡出
async function setBackgroundImages() {
    const images = await fetchBingImages();
    
    if (images.length > 0) {
        await preloadImages(images);

        // 创建所有图片的div并添加到页面
        const backgroundDivs = images.map((imageUrl, i) => {
            const div = createBackgroundDiv(imageUrl);
            div.style.opacity = i === 0 ? 1 : 0;  // 只有第一张图片的透明度为1，其余为0
            document.body.appendChild(div);
            return div;
        });

        // 轮播逻辑
        let currentIndex = 0;
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % backgroundDivs.length;

            backgroundDivs[currentIndex].style.opacity = 0;  // 当前图片淡出
            backgroundDivs[nextIndex].style.opacity = 1;     // 下一张图片淡入

            currentIndex = nextIndex;
        }, 8000);  // 每8秒切换一次
    }
}

// 辅助函数：创建背景Div并设置初始样式
function createBackgroundDiv(imageUrl) {
    const div = document.createElement('div');
    div.style.backgroundImage = `url(${imageUrl})`;
    div.style.backgroundSize = 'cover';
    div.style.backgroundPosition = 'center';
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.transition = 'opacity 2s';  // 设置淡入淡出过渡
    div.style.opacity = 0;  // 初始透明度为0
    div.style.zIndex = '-999999';
    return div;
}

// 页面加载后执行背景切换功能
document.addEventListener('DOMContentLoaded', setBackgroundImages);
