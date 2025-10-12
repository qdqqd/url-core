//2025-10-06 13:25

const permutationCache = new Map();

self.onmessage = function(e) {
    const { imageData, width, height, mode, key, key2, isEncrypt, count, sx, sy } = e.data;
    
    try {
        let result;
        if (isEncrypt) {
            result = encryptImageMultiple(imageData, width, height, mode, key, key2, count, sx, sy);
        } else {
            result = decryptImageMultiple(imageData, width, height, mode, key, key2, count, sx, sy);
        }
        
        self.postMessage({
            success: true,
            result: result
        });
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message
        });
    }
};

// 完整的MD5实现
var md5 = (function(){
    function MD5(string) {    
        var x = Array();    
        var k, AA, BB, CC, DD, a, b, c, d;    
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;    
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;    
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;    
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;    
        string = Utf8Encode(string);    
        x = ConvertToWordArray(string);    
        a = 0x67452301;    
        b = 0xEFCDAB89;    
        c = 0x98BADCFE;    
        d = 0x10325476;    
        for (k=0; k<x.length; k += 16) {    
            AA = a;    
            BB = b;    
            CC = c;    
            DD = d;
            a = FF(a, b, c, d, x[k+0], S11, 0xD76AA478);    
            d = FF(d, a, b, c, x[k+1], S12, 0xE8C7B756);    
            c = FF(c, d, a, b, x[k+2], S13, 0x242070DB);    
            b = FF(b, c, d, a, x[k+3], S14, 0xC1BDCEEE);    
            a = FF(a, b, c, d, x[k+4], S11, 0xF57C0FAF);    
            d = FF(d, a, b, c, x[k+5], S12, 0x4787C62A);    
            c = FF(c, d, a, b, x[k+6], S13, 0xA8304613);    
            b = FF(b, c, d, a, x[k+7], S14, 0xFD469501);    
            a = FF(a, b, c, d, x[k+8], S11, 0x698098D8);    
            d = FF(d, a, b, c, x[k+9], S12, 0x8B44F7AF);    
            c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);    
            b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);    
            a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);    
            d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);    
            c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);    
            b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k+1], S21, 0xF61E2562);    
            d = GG(d, a, b, c, x[k+6], S22, 0xC040B340);    
            c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);    
            b = GG(b, c, d, a, x[k+0], S24, 0xE9B6C7AA);    
            a = GG(a, b, c, d, x[k+5], S21, 0xD62F105D);    
            d = GG(d, a, b, c, x[k+10], S22, 0x2441453);    
            c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);    
            b = GG(b, c, d, a, x[k+4], S24, 0xE7D3FBC8);    
            a = GG(a, b, c, d, x[k+9], S21, 0x21E1CDE6);    
            d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);    
            c = GG(c, d, a, b, x[k+3], S23, 0xF4D50D87);    
            b = GG(b, c, d, a, x[k+8], S24, 0x455A14ED);    
            a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);    
            d = GG(d, a, b, c, x[k+2], S22, 0xFCEFA3F8);    
            c = GG(c, d, a, b, x[k+7], S23, 0x676F02D9);    
            b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k+5], S31, 0xFFFA3942);    
            d = HH(d, a, b, c, x[k+8], S32, 0x8771F681);    
            c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);    
            b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);    
            a = HH(a, b, c, d, x[k+1], S31, 0xA4BEEA44);    
            d = HH(d, a, b, c, x[k+4], S32, 0x4BDECFA9);    
            c = HH(c, d, a, b, x[k+7], S33, 0xF6BB4B60);    
            b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);    
            a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);    
            d = HH(d, a, b, c, x[k+0], S32, 0xEAA127FA);    
            c = HH(c, d, a, b, x[k+3], S33, 0xD4EF3085);    
            b = HH(b, c, d, a, x[k+6], S34, 0x4881D05);    
            a = HH(a, b, c, d, x[k+9], S31, 0xD9D4D039);    
            d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);    
            c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);    
            b = HH(b, c, d, a, x[k+2], S34, 0xC4AC5665);    
            a = II(a, b, c, d, x[k+0], S41, 0xF4292244);    
            d = II(d, a, b, c, x[k+7], S42, 0x432AFF97);    
            c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);    
            b = II(b, c, d, a, x[k+5], S44, 0xFC93A039);    
            a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);    
            d = II(d, a, b, c, x[k+3], S42, 0x8F0CCC92);    
            c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);    
            b = II(b, c, d, a, x[k+1], S44, 0x85845DD1);    
            a = II(a, b, c, d, x[k+8], S41, 0x6FA87E4F);    
            d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);    
            c = II(c, d, a, b, x[k+6], S43, 0xA3014314);    
            b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);    
            a = II(a, b, c, d, x[k+4], S41, 0xF7537E82);    
            d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);    
            c = II(c, d, a, b, x[k+2], S43, 0x2AD7D2BB);    
            b = II(b, c, d, a, x[k+9], S44, 0xEB86D391);    
            a = AddUnsigned(a, AA);    
            b = AddUnsigned(b, BB);    
            c = AddUnsigned(c, CC);    
            d = AddUnsigned(d, DD);    
        }    
        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);    
        return temp.toUpperCase();    
    }    
    function RotateLeft(lValue, iShiftBits) {    
        return (lValue << iShiftBits) | (lValue >>> (32-iShiftBits));    
    }    
    function AddUnsigned(lX, lY) {    
        var lX4, lY4, lX8, lY8, lResult;    
        lX8 = (lX & 0x80000000);    
        lY8 = (lY & 0x80000000);    
        lX4 = (lX & 0x40000000);    
        lY4 = (lY & 0x40000000);    
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);    
        if (lX4 & lY4) {    
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);    
        }    
        if (lX4 | lY4) {    
            if (lResult & 0x40000000) {    
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);    
            } else {    
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);    
            }    
        } else {    
            return (lResult ^ lX8 ^ lY8);    
        }    
    }    
    function F(x, y, z) {    
        return (x & y) | ((~x) & z);    
    }    
    function G(x, y, z) {    
        return (x & z) | (y & (~z));    
    }    
    function H(x, y, z) {    
        return (x ^ y ^ z);    
    }    
    function I(x, y, z) {    
        return (y ^ (x | (~z)));    
    }    
    function FF(a, b, c, d, x, s, ac) {    
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));    
        return AddUnsigned(RotateLeft(a, s), b);    
    }    
    function GG(a, b, c, d, x, s, ac) {    
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));    
        return AddUnsigned(RotateLeft(a, s), b);    
    }    
    function HH(a, b, c, d, x, s, ac) {    
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));    
        return AddUnsigned(RotateLeft(a, s), b);    
    }    
    function II(a, b, c, d, x, s, ac) {    
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));    
        return AddUnsigned(RotateLeft(a, s), b);    
    }    
    function ConvertToWordArray(string) {    
        var lWordCount;    
        var lMessageLength = string.length;    
        var lNumberOfWords_temp1 = lMessageLength+8;    
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;    
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;    
        var lWordArray = Array(lNumberOfWords-1);    
        var lBytePosition = 0;    
        var lByteCount = 0;    
        while (lByteCount<lMessageLength) {    
            lWordCount = (lByteCount-(lByteCount%4))/4;    
            lBytePosition = (lByteCount%4)*8;    
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));    
            lByteCount++;    
        }    
        lWordCount = (lByteCount-(lByteCount%4))/4;    
        lBytePosition = (lByteCount%4)*8;    
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);    
        lWordArray[lNumberOfWords-2] = lMessageLength << 3;    
        lWordArray[lNumberOfWords-1] = lMessageLength >>> 29;    
        return lWordArray;    
    }    
    function WordToHex(lValue) {    
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;    
        for (lCount=0; lCount<=3; lCount++) {    
            lByte = (lValue >>> (lCount*8)) & 255;    
            WordToHexValue_temp = "0"+lByte.toString(16);    
            WordToHexValue = WordToHexValue+WordToHexValue_temp.substr(WordToHexValue_temp.length-2, 2);    
        }    
        return WordToHexValue;    
    }    
    function Utf8Encode(string) {    
        var utftext = "";    
        for (var n = 0; n<string.length; n++) {    
            var c = string.charCodeAt(n);    
            if (c<128) {    
                utftext += String.fromCharCode(c);    
            } else if ((c>127) && (c<2048)) {    
                utftext += String.fromCharCode((c >> 6) | 192);    
                utftext += String.fromCharCode((c & 63) | 128);    
            } else {    
                utftext += String.fromCharCode((c >> 12) | 224);    
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);    
                utftext += String.fromCharCode((c & 63) | 128);    
            }    
        }    
        return utftext;    
    }
    return MD5;
}());

// 保持所有算法函数不变，仅调整为适合Web Worker的版本

// 添加带缓存的置换生成函数
function buildSinglePermutationWithCache(mode, width, height, key, key2, sx, sy) {
    // 生成缓存键
    const cacheKey = `${mode}_${width}_${height}_${key}_${key2}_${sx}_${sy}`;
    
    // 检查缓存
    if (permutationCache.has(cacheKey)) {
        return permutationCache.get(cacheKey);
    }
    
    // 计算并缓存结果
    const result = buildSinglePermutation(mode, width, height, key, key2, sx, sy);
    permutationCache.set(cacheKey, result);
    
    // 限制缓存大小，避免内存泄漏
    if (permutationCache.size > 100) {
        const firstKey = permutationCache.keys().next().value;
        permutationCache.delete(firstKey);
    }
    
    return result;
}

// 使用对象池模式优化数组创建
const arrayPool = {
    uint8: [],
    uint32: [],
    
    getUint8(size) {
        let arr = this.uint8.pop();
        if (!arr || arr.length < size) {
            arr = new Uint8ClampedArray(size);
        }
        return arr;
    },
    
    getUint32(size) {
        let arr = this.uint32.pop();
        if (!arr || arr.length < size) {
            arr = new Uint32Array(size);
        }
        return arr;
    }
};

function amess(arrlength, ast) {
    var arr = new Array(arrlength);
    for (let i = 0; i < arrlength; i++) arr[i] = i;

    for (let i = arrlength - 1; i > 0; i -= 1) {
        const rand = parseInt(md5(ast + i.toString()).substr(0, 7), 16) % (i + 1);
        [arr[rand], arr[i]] = [arr[i], arr[rand]];
    }
    return arr;
}

function produceLogisticSort(a, b) {
    return a[0] - b[0];
}

function produceLogistic(x1, n) {
    let l = new Array(n);
    let x = x1;
    l[0] = [x, 0];
    for (let i = 1; i < n; i++) {
        x = 3.9999999 * x * (1 - x);
        l[i] = [x, i];
    }
    return l;
}

// B模式 - 块混淆（兼容旧版本）
function encryptB2(imgData, width, height, key, sx, sy) {
    sx = sx || 32;
    sy = sy || 32;

    let wid = width;
    let hit = height;
    
    while (wid % sx > 0) wid++;
    while (hit % sy > 0) hit++;

    const ssx = wid / sx;
    const ssy = hit / sy;

    const xl = amess(sx, key);
    const yl = amess(sy, key);

    const result = new Uint8ClampedArray(wid * hit * 4);
    
    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            let m = i, n = j;
            m = (xl[((n / ssy) | 0) % sx] * ssx + m) % wid;
            m = xl[(m / ssx) | 0] * ssx + m % ssx;
            n = (yl[((m / ssx) | 0) % sy] * ssy + n) % hit;
            n = yl[(n / ssy) | 0] * ssy + n % ssy;

            const srcIdx = 4 * (m + n * wid);
            const destIdx = 4 * (i + j * wid);
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    // 返回与index.html中一致的格式
    return { data: result, width: wid, height: hit };
}

function decryptB2(imgData, width, height, key, sx, sy) {
    sx = sx || 32;
    sy = sy || 32;

    let wid = width;
    let hit = height;
    
    while (wid % sx > 0) wid++;
    while (hit % sy > 0) hit++;

    const ssx = wid / sx;
    const ssy = hit / sy;

    const xl = amess(sx, key);
    const yl = amess(sy, key);

    const result = new Uint8ClampedArray(wid * hit * 4);
    
    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            let m = i, n = j;
            m = (xl[((n / ssy) | 0) % sx] * ssx + m) % wid;
            m = xl[(m / ssx) | 0] * ssx + m % ssx;
            n = (yl[((m / ssx) | 0) % sy] * ssy + n) % hit;
            n = yl[(n / ssy) | 0] * ssy + n % ssy;

            const srcIdx = 4 * (i + j * wid);
            const destIdx = 4 * (m + n * wid);
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    // 返回与index.html中一致的格式
    return { data: result, width: wid, height: hit };
}

// C模式 - 逐像素混淆
function encryptC(imgData, width, height, key) {
    const xl = amess(width, key);
    const yl = amess(height, key);

    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化：提取不变计算
    for (let i = 0; i < width; i++) {
        const iModWidth = i % width;
        for (let j = 0; j < height; j++) {
            const jModHeight = j % height;
            const jModWidth = j % width;
            
            let m = i;
            let n = j;
            m = (xl[jModWidth] + m) % width;
            m = xl[m];
            n = (yl[m % height] + n) % height;
            n = yl[n];
            
            const srcIdx = (m + n * width) << 2; // 位运算替代乘法
            const destIdx = (i + j * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    return { data: result, width: width, height: height };
}

function decryptC(imgData, width, height, key) {
    const xl = amess(width, key);
    const yl = amess(height, key);

    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化：提取不变计算
    for (let i = 0; i < width; i++) {
        const iModWidth = i % width;
        for (let j = 0; j < height; j++) {
            const jModHeight = j % height;
            const jModWidth = j % width;
            
            let m = i;
            let n = j;
            m = (xl[jModWidth] + m) % width;
            m = xl[m];
            n = (yl[m % height] + n) % height;
            n = yl[n];
            
            const srcIdx = (i + j * width) << 2; // 位运算替代乘法
            const destIdx = (m + n * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    return { data: result, width: width, height: height };
}

// C2模式 - 行像素混淆
function encryptC2(imgData, width, height, key) {
    const xl = amess(width, key);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化：提取不变计算
    for (let i = 0; i < width; i++) {
        const iModWidth = i % width;
        for (let j = 0; j < height; j++) {
            const jModWidth = j % width;
            const m = xl[(xl[jModWidth] + i) % width];
            const srcIdx = (m + j * width) << 2; // 位运算替代乘法
            const destIdx = (i + j * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    return { data: result, width: width, height: height };
}

function decryptC2(imgData, width, height, key) {
    const xl = amess(width, key);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化：提取不变计算
    for (let i = 0; i < width; i++) {
        const iModWidth = i % width;
        for (let j = 0; j < height; j++) {
            const jModWidth = j % width;
            const m = xl[(xl[jModWidth] + i) % width];
            const srcIdx = (i + j * width) << 2; // 位运算替代乘法
            const destIdx = (m + j * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    return { data: result, width: width, height: height };
}

// PE1模式 - 行混淆
function encryptPE1(imgData, width, height, key2) {
    const arrayaddress = produceLogistic(key2, width).sort(produceLogisticSort).map(x => x[1]);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化
    for (let i = 0; i < width; i++) {
        const m = arrayaddress[i];
        for (let j = 0; j < height; j++) {
            const srcIdx = (m + j * width) << 2; // 位运算替代乘法
            const destIdx = (i + j * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    return { data: result, width: width, height: height };
}

function decryptPE1(imgData, width, height, key2) {
    const arrayaddress = produceLogistic(key2, width).sort(produceLogisticSort).map(x => x[1]);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化
    for (let i = 0; i < width; i++) {
        const m = arrayaddress[i];
        for (let j = 0; j < height; j++) {
            const srcIdx = (i + j * width) << 2; // 位运算替代乘法
            const destIdx = (m + j * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < result.length) {
                result[destIdx] = imgData[srcIdx];
                result[destIdx + 1] = imgData[srcIdx + 1];
                result[destIdx + 2] = imgData[srcIdx + 2];
                result[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }
    
    return { data: result, width: width, height: height };
}

// PE2模式 - 行+列混淆
function encryptPE2(imgData, width, height, key2) {
    let x = key2;
    const oimgdata = new Uint8ClampedArray(imgData.length);
    const o2imgdata = new Uint8ClampedArray(imgData.length);

    // 行混淆
    for (let j = 0; j < height; j++) {
        const arrayaddress = produceLogistic(x, width);
        x = arrayaddress[width - 1][0];
        const sortedAddresses = arrayaddress.sort(produceLogisticSort).map(a => a[1]);
        
        for (let i = 0; i < width; i++) {
            const m = sortedAddresses[i];
            const srcIdx = (m + j * width) << 2; // 位运算替代乘法
            const destIdx = (i + j * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < oimgdata.length) {
                oimgdata[destIdx] = imgData[srcIdx];
                oimgdata[destIdx + 1] = imgData[srcIdx + 1];
                oimgdata[destIdx + 2] = imgData[srcIdx + 2];
                oimgdata[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }

    // 列混淆
    x = key2;
    for (let i = 0; i < width; i++) {
        const arrayaddress = produceLogistic(x, height);
        x = arrayaddress[height - 1][0];
        const sortedAddresses = arrayaddress.sort(produceLogisticSort).map(a => a[1]);
        
        for (let j = 0; j < height; j++) {
            const n = sortedAddresses[j];
            const srcIdx = (i + n * width) << 2; // 位运算替代乘法
            const destIdx = (i + j * width) << 2; // 位运算替代乘法
            
            if (srcIdx + 3 < oimgdata.length && destIdx + 3 < o2imgdata.length) {
                o2imgdata[destIdx] = oimgdata[srcIdx];
                o2imgdata[destIdx + 1] = oimgdata[srcIdx + 1];
                o2imgdata[destIdx + 2] = oimgdata[srcIdx + 2];
                o2imgdata[destIdx + 3] = oimgdata[srcIdx + 3];
            }
        }
    }

    return { data: o2imgdata, width: width, height: height };
}

function decryptPE2(imgData, width, height, key2) {
    let x = key2;
    const oimgdata = new Uint8ClampedArray(imgData.length);
    const o2imgdata = new Uint8ClampedArray(imgData.length);

    // 逆列混淆
    const colXValues = []; // 保存每列处理后的x值
    let currentX = x;
    for (let i = 0; i < width; i++) {
        colXValues[i] = currentX;
        const arrayaddress = produceLogistic(currentX, height);
        currentX = arrayaddress[height - 1][0];
    }
    
    // 按逆序进行列解密
    for (let i = width - 1; i >= 0; i--) {
        const arrayaddress = produceLogistic(colXValues[i], height);
        const sortedAddresses = arrayaddress.sort(produceLogisticSort).map(a => a[1]);
        
        for (let j = 0; j < height; j++) {
            const n = sortedAddresses[j];
            const srcIdx = (i + j * width) << 2;
            const destIdx = (i + n * width) << 2;
            
            if (srcIdx + 3 < imgData.length && destIdx + 3 < oimgdata.length) {
                oimgdata[destIdx] = imgData[srcIdx];
                oimgdata[destIdx + 1] = imgData[srcIdx + 1];
                oimgdata[destIdx + 2] = imgData[srcIdx + 2];
                oimgdata[destIdx + 3] = imgData[srcIdx + 3];
            }
        }
    }

    // 逆行混淆
    const rowXValues = []; // 保存每行处理后的x值
    currentX = x;
    for (let j = 0; j < height; j++) {
        rowXValues[j] = currentX;
        const arrayaddress = produceLogistic(currentX, width);
        currentX = arrayaddress[width - 1][0];
    }
    
    // 按逆序进行行解密
    for (let j = height - 1; j >= 0; j--) {
        const arrayaddress = produceLogistic(rowXValues[j], width);
        const sortedAddresses = arrayaddress.sort(produceLogisticSort).map(a => a[1]);
        
        for (let i = 0; i < width; i++) {
            const m = sortedAddresses[i];
            const srcIdx = (i + j * width) << 2;
            const destIdx = (m + j * width) << 2;
            
            if (srcIdx + 3 < oimgdata.length && destIdx + 3 < o2imgdata.length) {
                o2imgdata[destIdx] = oimgdata[srcIdx];
                o2imgdata[destIdx + 1] = oimgdata[srcIdx + 1];
                o2imgdata[destIdx + 2] = oimgdata[srcIdx + 2];
                o2imgdata[destIdx + 3] = oimgdata[srcIdx + 3];
            }
        }
    }

    return { data: o2imgdata, width: width, height: height };
}

// 添加PE1模式的多次解密函数
function decryptPE1Multiple(imgData, width, height, key2, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = decryptPE1(resultData, width, height, key2);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

// 添加PE1模式的多次加密函数
function encryptPE1Multiple(imgData, width, height, key2, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = encryptPE1(resultData, width, height, key2);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

// 添加PE2模式的多次解密函数
function decryptPE2Multiple(imgData, width, height, key2, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = decryptPE2(resultData, width, height, key2);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

// 添加PE2模式的多次加密函数
function encryptPE2Multiple(imgData, width, height, key2, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = encryptPE2(resultData, width, height, key2);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

// 生成Gilbert曲线
function generateGilbertCurve(width, height) {
    const coordinates = [];
    function generate(x, y, ax, ay, bx, by) {
        const w = Math.abs(ax + ay);
        const h = Math.abs(bx + by);
        const dax = Math.sign(ax), day = Math.sign(ay);
        const dbx = Math.sign(bx), dby = Math.sign(by);
        if (h === 1) {
            for (let i = 0; i < w; i++) {
                coordinates.push([x, y]);
                x += dax; y += day;
            }
            return;
        }
        if (w === 1) {
            for (let i = 0; i < h; i++) {
                coordinates.push([x, y]);
                x += dbx; y += dby;
            }
            return;
        }
        let ax2 = Math.floor(ax / 2), ay2 = Math.floor(ay / 2);
        let bx2 = Math.floor(bx / 2), by2 = Math.floor(by / 2);
        const w2 = Math.abs(ax2 + ay2);
        const h2 = Math.abs(bx2 + by2);
        if (2 * w > 3 * h) {
            if ((w2 % 2) && (w > 2)) {
                ax2 += dax; ay2 += day;
            }
            generate(x, y, ax2, ay2, bx, by);
            generate(x + ax2, y + ay2, ax - ax2, ay - ay2, bx, by);
        } else {
            if ((h2 % 2) && (h > 2)) {
                bx2 += dbx; by2 += dby;
            }
            generate(x, y, bx2, by2, ax2, ay2);
            generate(x + bx2, y + by2, ax, ay, bx - bx2, by - by2);
            generate(x + (ax - dax) + (bx2 - dbx), y + (ay - day) + (by2 - dby), -bx2, -by2, -(ax - ax2), -(ay - ay2));
        }
    }
    if (width >= height) {
        generate(0, 0, width, 0, 0, height);
    } else {
        generate(0, 0, 0, height, width, 0);
    }
    return coordinates;
}

// 小番茄模式 - 加密
function encryptXiaoFanQie(imgData, width, height) {
    const curve = generateGilbertCurve(width, height);
    const offset = Math.round((Math.sqrt(5) - 1) / 2 * width * height);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化
    for (let i = 0; i < width * height; i++) {
        const [oldX, oldY] = curve[i];
        const [newX, newY] = curve[(i + offset) % (width * height)];
        const oldPos = (oldX + oldY * width) << 2; // 位运算替代乘法
        const newPos = (newX + newY * width) << 2; // 位运算替代乘法
        
        if (oldPos + 3 < imgData.length && newPos + 3 < result.length) {
            result[newPos] = imgData[oldPos];
            result[newPos + 1] = imgData[oldPos + 1];
            result[newPos + 2] = imgData[oldPos + 2];
            result[newPos + 3] = imgData[oldPos + 3];
        }
    }
    
    return { data: result, width: width, height: height };
}

// 小番茄模式 - 解密
function decryptXiaoFanQie(imgData, width, height) {
    const curve = generateGilbertCurve(width, height);
    const offset = Math.round((Math.sqrt(5) - 1) / 2 * width * height);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化
    for (let i = 0; i < width * height; i++) {
        const [oldX, oldY] = curve[i];
        const [newX, newY] = curve[(i + offset) % (width * height)];
        const oldPos = (oldX + oldY * width) << 2; // 位运算替代乘法
        const newPos = (newX + newY * width) << 2; // 位运算替代乘法
        
        if (oldPos + 3 < imgData.length && newPos + 3 < result.length) {
            result[oldPos] = imgData[newPos];
            result[oldPos + 1] = imgData[newPos + 1];
            result[oldPos + 2] = imgData[newPos + 2];
            result[oldPos + 3] = imgData[newPos + 3];
        }
    }
    
    return { data: result, width: width, height: height };
}

// 小番茄模式 - 多次加密
function encryptXiaoFanQieMultiple(imgData, width, height, count) {
    const curve = generateGilbertCurve(width, height);
    const baseOffset = Math.round((Math.sqrt(5) - 1) / 2 * width * height);
    const totalOffset = (baseOffset * count) % (width * height);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化
    for (let i = 0; i < width * height; i++) {
        const [oldX, oldY] = curve[i];
        const [newX, newY] = curve[(i + totalOffset) % (width * height)];
        const oldPos = (oldX + oldY * width) << 2; // 位运算替代乘法
        const newPos = (newX + newY * width) << 2; // 位运算替代乘法
        
        if (oldPos + 3 < imgData.length && newPos + 3 < result.length) {
            result[newPos] = imgData[oldPos];
            result[newPos + 1] = imgData[oldPos + 1];
            result[newPos + 2] = imgData[oldPos + 2];
            result[newPos + 3] = imgData[oldPos + 3];
        }
    }
    
    return { data: result, width: width, height: height };
}

// 小番茄模式 - 多次解密
function decryptXiaoFanQieMultiple(imgData, width, height, count) {
    const curve = generateGilbertCurve(width, height);
    const baseOffset = Math.round((Math.sqrt(5) - 1) / 2 * width * height);
    const totalOffset = (baseOffset * count) % (width * height);
    const result = new Uint8ClampedArray(imgData.length);
    
    // 循环优化
    for (let i = 0; i < width * height; i++) {
        const [oldX, oldY] = curve[i];
        const [newX, newY] = curve[(i + totalOffset) % (width * height)];
        const oldPos = (oldX + oldY * width) << 2; // 位运算替代乘法
        const newPos = (newX + newY * width) << 2; // 位运算替代乘法
        
        if (oldPos + 3 < imgData.length && newPos + 3 < result.length) {
            result[oldPos] = imgData[newPos];
            result[oldPos + 1] = imgData[newPos + 1];
            result[oldPos + 2] = imgData[newPos + 2];
            result[oldPos + 3] = imgData[newPos + 3];
        }
    }
    
    return { data: result, width: width, height: height };
}

// B模式 - 多次加密函数
// 修复：正确处理图像尺寸扩展
function encryptB2Multiple(imgData, width, height, key, count, sx, sy) {
    sx = sx || 32;
    sy = sy || 32;
    
    // 首先计算扩展后的尺寸
    let wid = width;
    let hit = height;
    while (wid % sx > 0) wid++;
    while (hit % sy > 0) hit++;
    
    let resultData = imgData;
    let currentWidth = width;
    let currentHeight = height;
    
    for (let i = 0; i < count; i++) {
        const result = encryptB2(resultData, currentWidth, currentHeight, key, sx, sy);
        resultData = result.data;
        currentWidth = result.width;
        currentHeight = result.height;
    }
    return { data: resultData, width: currentWidth, height: currentHeight };
}

// B模式 - 多次解密函数
// 修复：正确处理图像尺寸扩展
function decryptB2Multiple(imgData, width, height, key, count, sx, sy) {
    sx = sx || 32;
    sy = sy || 32;
    
    // 首先计算扩展后的尺寸
    let wid = width;
    let hit = height;
    while (wid % sx > 0) wid++;
    while (hit % sy > 0) hit++;
    
    let resultData = imgData;
    let currentWidth = width;
    let currentHeight = height;
    
    for (let i = 0; i < count; i++) {
        const result = decryptB2(resultData, currentWidth, currentHeight, key, sx, sy);
        resultData = result.data;
        currentWidth = result.width;
        currentHeight = result.height;
    }
    return { data: resultData, width: currentWidth, height: currentHeight };
}

// C模式 - 多次加密函数
function encryptCMultiple(imgData, width, height, key, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = encryptC(resultData, width, height, key);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

// C模式 - 多次解密函数
function decryptCMultiple(imgData, width, height, key, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = decryptC(resultData, width, height, key);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

// C2模式 - 多次加密函数
function encryptC2Multiple(imgData, width, height, key, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = encryptC2(resultData, width, height, key);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

// C2模式 - 多次解密函数
function decryptC2Multiple(imgData, width, height, key, count) {
    let resultData = imgData;
    for (let i = 0; i < count; i++) {
        const result = decryptC2(resultData, width, height, key);
        resultData = result.data;
    }
    return { data: resultData, width: width, height: height };
}

function buildSinglePermutation(mode, width, height, key, key2, sx, sy) {
    sx = sx || 32; sy = sy || 32;
    let wid = width, hit = height;

    if (mode === "b") {
        while (wid % sx > 0) wid++;
        while (hit % sy > 0) hit++;
    }

    const N = wid * hit;
    const perm = arrayPool.getUint32(N);

    if (mode === "b") {
        const ssx = wid / sx, ssy = hit / sy;
        const xl = amess(sx, key);
        const yl = amess(sy, key);
        for (let i = 0; i < wid; i++) {
            for (let j = 0; j < hit; j++) {
                let m = i, n = j;
                m = (xl[((n / ssy) | 0) % sx] * ssx + m) % wid;
                m = xl[(m / ssx) | 0] * ssx + m % ssx;
                n = (yl[((m / ssx) | 0) % sy] * ssy + n) % hit;
                n = yl[(n / ssy) | 0] * ssy + n % ssy;

                const src = m + n * wid;
                const dest = i + j * wid;
                perm[src] = dest;
            }
        }
    } else if (mode === "c") {
        const xl = amess(width, key);
        const yl = amess(height, key);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let m = i, n = j;
                m = (xl[n % width] + m) % width;
                m = xl[m];
                n = (yl[m % height] + n) % height;
                n = yl[n];

                const src = m + n * width;
                const dest = i + j * width;
                perm[src] = dest;
            }
        }
    } else if (mode === "c2") {
        const xl = amess(width, key);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const m = xl[(xl[j % width] + i) % width];
                const src = m + j * width;
                const dest = i + j * width;
                perm[src] = dest;
            }
        }
    } else if (mode === "pe1") {
        const arrayaddress = produceLogistic(key, width).sort(produceLogisticSort).map(x => x[1]);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const m = arrayaddress[i];
                const src = m + j * width;
                const dest = i + j * width;
                perm[src] = dest;
            }
        }
    } else if (mode === "pe2") {
        const arrayaddress = produceLogistic(key2, width).sort(produceLogisticSort).map(x => x[1]);
        const arrayaddress2 = produceLogistic(key2, height).sort(produceLogisticSort).map(x => x[1]);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const m = arrayaddress[i];
                const n = arrayaddress2[j];
                const src = m + n * width;
                const dest = i + j * width;
                perm[src] = dest;
            }
        }
    } else {
        const xl = amess(width, key);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const m = xl[(xl[j % width] + i) % width];
                const src = m + j * width;
                const dest = i + j * width;
                perm[src] = dest;
            }
        }
    }

    return { perm, width: wid, height: hit };
}

function encryptImageMultiple(imgData, width, height, mode, key, key2, count, sx, sy) {
    sx = sx || 32; sy = sy || 32;
    count = Math.max(1, parseInt(count) || 1);

    if (count === 1) {
        switch (mode) {
            case "b": return encryptB2(imgData, width, height, key, sx, sy);
            case "c": return encryptC(imgData, width, height, key);
            case "pe1": return encryptPE1(imgData, width, height, key2);
            case "pe2": return encryptPE2(imgData, width, height, key2);
            case "xfq": return encryptXiaoFanQie(imgData, width, height);
            default: return encryptC2(imgData, width, height, key);
        }
    }

    // 处理各模式的多次加密
    switch (mode) {
        case "b":
            return encryptB2Multiple(imgData, width, height, key, count, sx, sy);
        case "c":
            return encryptCMultiple(imgData, width, height, key, count);
        case "c2":
            return encryptC2Multiple(imgData, width, height, key, count);
        case "pe1":
            return encryptPE1Multiple(imgData, width, height, key2, count);
        case "pe2":
            return encryptPE2Multiple(imgData, width, height, key2, count);
        case "xfq":
            return encryptXiaoFanQieMultiple(imgData, width, height, count);
        default:
            return encryptC2Multiple(imgData, width, height, key, count);
    }
}

function decryptImageMultiple(imgData, width, height, mode, key, key2, count, sx, sy) {
    sx = sx || 32; sy = sy || 32;
    count = Math.max(1, parseInt(count) || 1);

    if (count === 1) {
        switch (mode) {
            case "b": return decryptB2(imgData, width, height, key, sx, sy);
            case "c": return decryptC(imgData, width, height, key);
            case "pe1": return decryptPE1(imgData, width, height, key2);
            case "pe2": return decryptPE2(imgData, width, height, key2);
            case "xfq": return decryptXiaoFanQie(imgData, width, height);
            default: return decryptC2(imgData, width, height, key);
        }
    }

    // 处理各模式的多次解密
    switch (mode) {
        case "b":
            return decryptB2Multiple(imgData, width, height, key, count, sx, sy);
        case "c":
            return decryptCMultiple(imgData, width, height, key, count);
        case "c2":
            return decryptC2Multiple(imgData, width, height, key, count);
        case "pe1":
            return decryptPE1Multiple(imgData, width, height, key2, count);
        case "pe2":
            return decryptPE2Multiple(imgData, width, height, key2, count);
        case "xfq":
            return decryptXiaoFanQieMultiple(imgData, width, height, count);
        default:
            return decryptC2Multiple(imgData, width, height, key, count);
    }
}
