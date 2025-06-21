async function fetchBingImages() {
    const isWideScreen = window.innerWidth > window.innerHeight;
    const endpoint = isWideScreen 
        ? 'https://i.qdqqd.com/?cors=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D7%26aspectRatio%3Dgt1' 
        : 'https://i.qdqqd.com/?cors=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D7%26aspectRatio%3Dlt1';
    
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
            return ['https://img.qdqqd.com/?1','https://img.qdqqd.com/?2'];
        }
    } catch (error) {
        console.error('使用回退映像从API获取映像时出错:', error);
        return [
            'https://img.qdqqd.com/?1',
            'https://img.qdqqd.com/?2'
        ];
    }
}


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

const effects = [
  { name: 'fade', init: div => { div.style.opacity='0'; div.style.transform=''; div.style.filter=''; }, transition: 'opacity 1.8s cubic-bezier(0.16,0.85,0.3,1)', apply: div => div.style.opacity='1' },
  { name: 'elastic-slide', init: div => { div.style.transform='translateX(-120%)'; div.style.opacity='1'; div.style.filter=''; }, transition: 'transform 1.5s cubic-bezier(0.68,-0.6,0.32,1.6)', apply: div => div.style.transform='translateX(0)' },
  { name: 'parallax-3d', init: div => { div.style.transform='perspective(1000px) rotateY(15deg) translateX(30%)'; div.style.opacity='0.8'; div.style.filter=''; }, transition: 'transform 1.6s ease, opacity 1.6s ease', apply: div => { div.style.transform='perspective(1000px) rotateY(0deg) translateX(0)'; div.style.opacity='1'; } },
  { name: 'motion-blur', init: div => { div.style.filter='blur(15px)'; div.style.opacity='0'; div.style.transform=''; }, transition: 'filter 1.4s ease, opacity 1.4s ease', apply: div => { div.style.filter='blur(0)'; div.style.opacity='1'; } },
  { name: 'glass-break', init: div => { div.style.clipPath='polygon(20% 0%,80% 0%,100% 20%,100% 80%,80% 100%,20% 100%,0% 80%,0% 20%)'; div.style.transform='scale(1.3)'; div.style.opacity='0'; div.style.filter=''; }, transition: 'all 1.8s cubic-bezier(0.7,0,0.3,1)', apply: div => { div.style.clipPath='polygon(0 0,100% 0,100% 100%,0 100%)'; div.style.transform='scale(1)'; div.style.opacity='1'; } },
  { name: 'soft-zoom', init: div => { div.style.transform='scale(0.92)'; div.style.opacity='0'; div.style.filter=''; }, transition: 'transform 1.5s cubic-bezier(0.18,0.89,0.32,1.28), opacity 1.5s ease', apply: div => { div.style.transform='scale(1)'; div.style.opacity='1'; } },
  { name: 'diagonal-wipe', init: div => { div.style.clipPath='polygon(0 0,0 0,100% 100%,100% 100%)'; div.style.opacity='1'; div.style.transform=''; }, transition: 'clip-path 1.6s cubic-bezier(0.77,0,0.18,1)', apply: div => div.style.clipPath='polygon(0 0,100% 0,100% 100%,0 100%)' }
];

// 基础样式
const baseCSS = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-size: cover;
  background-position: center;
  z-index: -999999;
`;

// 切换间隔（毫秒）
const intervalTime = 8000;


async function preloadAndFilter(urls) {
  const results = await Promise.all(urls.map(url => new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve({url, ok: true});
    img.onerror = () => resolve({url, ok: false});
  })));
  return results.filter(r => r.ok).map(r => r.url);
}


function animateNext(div, imageUrl) {
  div.style.transition = '';
  div.style.cssText = baseCSS + `background-image:url(${imageUrl});`;
  const ef = effects[Math.floor(Math.random() * effects.length)];
  ef.init(div);
  void div.offsetWidth;
  div.style.transition = ef.transition;
  requestAnimationFrame(() => ef.apply(div));
}


async function setBackgroundImages() {
  const urls = await fetchBingImages();
  if (!urls.length) return;

  // 过滤掉404或加载失败的链接
  const validUrls = await preloadAndFilter(urls);
  if (!validUrls.length) return;

  // 创建背景层
  const divs = validUrls.map((url, idx) => {
    const d = document.createElement('div');
    d.style.cssText = baseCSS + `background-image:url(${url}); opacity:${idx===0?1:0}`;
    document.body.appendChild(d);
    return d;
  });

  let curr = 0;
  setInterval(() => {
    const next = (curr + 1) % divs.length;
    divs[curr].style.opacity = '0';
    divs[next].style.opacity = '1';
    animateNext(divs[next], validUrls[next]);
    curr = next;
  }, intervalTime);
}

document.addEventListener('DOMContentLoaded', setBackgroundImages);
