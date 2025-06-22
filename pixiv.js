// 作者：by柯乐

async function fetchBingImages() {
    const isWideScreen = window.innerWidth > window.innerHeight;
    const endpoint = isWideScreen 
        ? 'https://i.qdqqd.com/?cors=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D7%26aspectRatio%3Dgt1' 
        : 'https://i.qdqqd.com/?cors=https%3A%2F%2Fapi.lolicon.app%2Fsetu%2Fv2%3Fsize%3Dregular%26num%3D7%26aspectRatio%3Dlt1';
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    try {
        const response = await fetch(endpoint, { method: 'GET', headers });
        if (!response.ok) return ['https://img.qdqqd.com/?1','https://img.qdqqd.com/?2'];
        const data = await response.json();
        if (data.data && data.data.length) {
            return data.data.map(i => i.urls.regular);
        } else {
            return ['https://img.qdqqd.com/?1','https://img.qdqqd.com/?2'];
        }
    } catch (e) {
        console.error(e);
        return ['https://img.qdqqd.com/?1','https://img.qdqqd.com/?2'];
    }
}

async function preloadAndFilter(urls) {
  const results = await Promise.all(urls.map(url => new Promise(res => {
    const img = new Image();
    img.src = url;
    img.onload  = () => res({url, ok: true});
    img.onerror = () => res({url, ok: false});
  })));
  return results.filter(r => r.ok).map(r => r.url);
}

const baseCSS = `
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background-size: cover; background-position: center;
  z-index: -999999;
`;
const intervalTime = 8000;

const effects=[
  {name:'fade',duration:1800,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});opacity:0;`,transition:'opacity 1.8s cubic-bezier(0.16,0.85,0.3,1)',apply:d=>d.style.opacity='1'},
  {name:'elastic-slide',duration:1500,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});transform:translateX(-120%);opacity:1;`,transition:'transform 1.5s cubic-bezier(0.68,-0.6,0.32,1.6)',apply:d=>d.style.transform='translateX(0)'},
  {name:'parallax-3d',duration:1600,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});transform:perspective(1000px) rotateY(15deg) translateX(30%);opacity:0.8;`,transition:'transform 1.6s ease,opacity 1.6s ease',apply:d=>{d.style.transform='perspective(1000px) rotateY(0) translateX(0)';d.style.opacity='1'}},
  {name:'motion-blur',duration:1400,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});filter:blur(15px);opacity:0;`,transition:'filter 1.4s ease,opacity 1.4s ease',apply:d=>{d.style.filter='blur(0)';d.style.opacity='1'}},
  {name:'glass-break',duration:1800,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});clip-path:polygon(20% 0%,80% 0%,100% 20%,100% 80%,80% 100%,20% 100%,0% 80%,0% 20%);transform:scale(1.3);opacity:0;`,transition:'all 1.8s cubic-bezier(0.7,0,0.3,1)',apply:d=>{d.style.clipPath='polygon(0 0,100% 0,100% 100%,0 100%)';d.style.transform='scale(1)';d.style.opacity='1'}},
  {name:'soft-zoom',duration:1500,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});transform:scale(0.92);opacity:0;`,transition:'transform 1.5s cubic-bezier(0.18,0.89,0.32,1.28),opacity 1.5s ease',apply:d=>{d.style.transform='scale(1)';d.style.opacity='1'}},
  {name:'diagonal-wipe',duration:1600,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});clip-path:polygon(0 0,0 0,100% 100%,100% 100%);opacity:1;`,transition:'clip-path 1.6s cubic-bezier(0.77,0,0.18,1)',apply:d=>d.style.clipPath='polygon(0 0,100% 0,100% 100%,0 100%)'},
  {name:'firefly-glow',duration:1000,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});filter:brightness(1);opacity:0.7;transform:scale(1);`,transition:'filter 1s ease-in-out,opacity 1s ease-in-out,transform 1s ease-in-out',apply:d=>d.style.cssText+=`filter:brightness(2);opacity:1;transform:scale(1.05);`},
  {name:'spin-zoom',duration:1200,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});transform:rotate(-45deg) scale(0.8);opacity:0;`,transition:'transform 1.2s ease-out,opacity 1.2s ease-out',apply:d=>d.style.cssText+=`transform:rotate(0deg) scale(1);opacity:1;`},
  {name:'ripple',duration:1500,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});clip-path:circle(0% at 50% 50%);opacity:0.8;`,transition:'clip-path 1.5s ease,opacity 1.5s ease',apply:d=>d.style.cssText+=`clip-path:circle(150% at 50% 50%);opacity:1;`},
  {name:'neon-pulse',duration:1000,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});box-shadow:0 0 20px rgba(0,255,255,0.5);opacity:0.6;`,transition:'box-shadow 1s ease-in-out,opacity 1s ease-in-out',apply:d=>d.style.cssText+=`box-shadow:0 0 40px rgba(0,255,255,1);opacity:1;`},
  {name:'matrix-rain',duration:3000,init:(d,url)=>d.style.cssText=baseCSS+`background-image:url(${url});animation:matrixRain 3s linear forwards;`,transition:'',apply:d=>{}}
  ];

function animateNext(div, imageUrl) {
  div.style.transition = '';        
  const ef = effects[Math.floor(Math.random() * effects.length)];
  ef.init(div, imageUrl);           
  void div.offsetWidth;             
  div.style.transition = ef.transition;
  requestAnimationFrame(() => ef.apply(div));
  return ef.duration;
}

async function setBackgroundImages() {
  const urls = await fetchBingImages();
  if (!urls.length) return;

  const validUrls = await preloadAndFilter(urls);
  if (!validUrls.length) return;

  const divs = validUrls.map((url, idx) => {
    const d = document.createElement('div');
    d.style.cssText = baseCSS + `background-image:url(${url});opacity:${idx===0?1:0};`;
    document.body.appendChild(d);
    return d;
  });
  if (divs.length < 2) return;
let curr = 0;
setInterval(() => {
  const next = (curr + 1) % divs.length;
  const dur = animateNext(divs[next], validUrls[next]);

  const prev = curr;
  setTimeout(() => {
    divs[prev].style.opacity = '0';
  }, dur);

  curr = next;
}, intervalTime);
}

// —— 注入特效 keyframes（若有矩阵雨/霓虹等） —— 
function injectKeyframes() {
  const style = document.createElement('style');
style.textContent = `
    @keyframes matrixRain {
      0% { background-position: 0 0; opacity: 0; }
      50% { opacity: 1; }
      100% { background-position: 0 200%; opacity: 0; }
    }
    @keyframes neonPulse {
      0% { box-shadow: 0 0 20px rgba(0,255,255,0.5); opacity: 0.6; }
      50% { box-shadow: 0 0 40px rgba(0,255,255,1); opacity: 1; }
      100% { box-shadow: 0 0 20px rgba(0,255,255,0.5); opacity: 0.6; }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  injectKeyframes();
  setBackgroundImages();
});
