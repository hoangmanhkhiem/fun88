(function(a) {
    function b(a, b) {
        var c = (a & 65535) + (b & 65535);
        return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535
    }

    function c(a, c, d, e, f, g) {
        a = b(b(c, a), b(e, g));
        return b(a << f | a >>> 32 - f, d)
    }

    function d(a, b, d, e, f, g, h) {
        return c(b & d | ~b & e, a, b, f, g, h)
    }

    function e(a, b, d, e, f, g, h) {
        return c(b & e | d & ~e, a, b, f, g, h)
    }

    function f(a, b, d, e, f, g, h) {
        return c(d ^ (b | ~e), a, b, f, g, h)
    }

    function g(a, g) {
        a[g >> 5] |= 128 << g % 32;
        a[(g + 64 >>> 9 << 4) + 14] = g;
        var h, k, m, n, p, r = 1732584193,
            w = -271733879,
            C = -1732584194,
            B = 271733878;
        for (h = 0; h < a.length; h += 16) k = r, m = w, n = C, p = B, r = d(r,
            w, C, B, a[h], 7, -680876936), B = d(B, r, w, C, a[h + 1], 12, -389564586), C = d(C, B, r, w, a[h + 2], 17, 606105819), w = d(w, C, B, r, a[h + 3], 22, -1044525330), r = d(r, w, C, B, a[h + 4], 7, -176418897), B = d(B, r, w, C, a[h + 5], 12, 1200080426), C = d(C, B, r, w, a[h + 6], 17, -1473231341), w = d(w, C, B, r, a[h + 7], 22, -45705983), r = d(r, w, C, B, a[h + 8], 7, 1770035416), B = d(B, r, w, C, a[h + 9], 12, -1958414417), C = d(C, B, r, w, a[h + 10], 17, -42063), w = d(w, C, B, r, a[h + 11], 22, -1990404162), r = d(r, w, C, B, a[h + 12], 7, 1804603682), B = d(B, r, w, C, a[h + 13], 12, -40341101), C = d(C, B, r, w, a[h + 14], 17, -1502002290),
            w = d(w, C, B, r, a[h + 15], 22, 1236535329), r = e(r, w, C, B, a[h + 1], 5, -165796510), B = e(B, r, w, C, a[h + 6], 9, -1069501632), C = e(C, B, r, w, a[h + 11], 14, 643717713), w = e(w, C, B, r, a[h], 20, -373897302), r = e(r, w, C, B, a[h + 5], 5, -701558691), B = e(B, r, w, C, a[h + 10], 9, 38016083), C = e(C, B, r, w, a[h + 15], 14, -660478335), w = e(w, C, B, r, a[h + 4], 20, -405537848), r = e(r, w, C, B, a[h + 9], 5, 568446438), B = e(B, r, w, C, a[h + 14], 9, -1019803690), C = e(C, B, r, w, a[h + 3], 14, -187363961), w = e(w, C, B, r, a[h + 8], 20, 1163531501), r = e(r, w, C, B, a[h + 13], 5, -1444681467), B = e(B, r, w, C, a[h + 2], 9, -51403784),
            C = e(C, B, r, w, a[h + 7], 14, 1735328473), w = e(w, C, B, r, a[h + 12], 20, -1926607734), r = c(w ^ C ^ B, r, w, a[h + 5], 4, -378558), B = c(r ^ w ^ C, B, r, a[h + 8], 11, -2022574463), C = c(B ^ r ^ w, C, B, a[h + 11], 16, 1839030562), w = c(C ^ B ^ r, w, C, a[h + 14], 23, -35309556), r = c(w ^ C ^ B, r, w, a[h + 1], 4, -1530992060), B = c(r ^ w ^ C, B, r, a[h + 4], 11, 1272893353), C = c(B ^ r ^ w, C, B, a[h + 7], 16, -155497632), w = c(C ^ B ^ r, w, C, a[h + 10], 23, -1094730640), r = c(w ^ C ^ B, r, w, a[h + 13], 4, 681279174), B = c(r ^ w ^ C, B, r, a[h], 11, -358537222), C = c(B ^ r ^ w, C, B, a[h + 3], 16, -722521979), w = c(C ^ B ^ r, w, C, a[h + 6], 23, 76029189), r = c(w ^
            C ^ B, r, w, a[h + 9], 4, -640364487), B = c(r ^ w ^ C, B, r, a[h + 12], 11, -421815835), C = c(B ^ r ^ w, C, B, a[h + 15], 16, 530742520), w = c(C ^ B ^ r, w, C, a[h + 2], 23, -995338651), r = f(r, w, C, B, a[h], 6, -198630844), B = f(B, r, w, C, a[h + 7], 10, 1126891415), C = f(C, B, r, w, a[h + 14], 15, -1416354905), w = f(w, C, B, r, a[h + 5], 21, -57434055), r = f(r, w, C, B, a[h + 12], 6, 1700485571), B = f(B, r, w, C, a[h + 3], 10, -1894986606), C = f(C, B, r, w, a[h + 10], 15, -1051523), w = f(w, C, B, r, a[h + 1], 21, -2054922799), r = f(r, w, C, B, a[h + 8], 6, 1873313359), B = f(B, r, w, C, a[h + 15], 10, -30611744), C = f(C, B, r, w, a[h + 6], 15, -1560198380),
            w = f(w, C, B, r, a[h + 13], 21, 1309151649), r = f(r, w, C, B, a[h + 4], 6, -145523070), B = f(B, r, w, C, a[h + 11], 10, -1120210379), C = f(C, B, r, w, a[h + 2], 15, 718787259), w = f(w, C, B, r, a[h + 9], 21, -343485551), r = b(r, k), w = b(w, m), C = b(C, n), B = b(B, p);
        return [r, w, C, B]
    }

    function h(a) {
        var b, c = "",
            d = 32 * a.length;
        for (b = 0; b < d; b += 8) c += String.fromCharCode(a[b >> 5] >>> b % 32 & 255);
        return c
    }

    function k(a) {
        var b, c = [];
        c[(a.length >> 2) - 1] = void 0;
        for (b = 0; b < c.length; b += 1) c[b] = 0;
        var d = 8 * a.length;
        for (b = 0; b < d; b += 8) c[b >> 5] |= (a.charCodeAt(b / 8) & 255) << b % 32;
        return c
    }

    function m(a) {
        return h(g(k(a),
            8 * a.length))
    }

    function n(a, b) {
        var c, d = k(a),
            e = [],
            f = [];
        e[15] = f[15] = void 0;
        16 < d.length && (d = g(d, 8 * a.length));
        for (c = 0; 16 > c; c += 1) e[c] = d[c] ^ 909522486, f[c] = d[c] ^ 1549556828;
        c = g(e.concat(k(b)), 512 + 8 * b.length);
        return h(g(f.concat(c), 640))
    }

    function p(a) {
        var b = "",
            c, d;
        for (d = 0; d < a.length; d += 1) c = a.charCodeAt(d), b += "0123456789abcdef".charAt(c >>> 4 & 15) + "0123456789abcdef".charAt(c & 15);
        return b
    }

    function r(a, b, c) {
        b ? c ? a = n(unescape(encodeURIComponent(b)), unescape(encodeURIComponent(a))) : (a = n(unescape(encodeURIComponent(b)),
            unescape(encodeURIComponent(a))), a = p(a)) : a = c ? m(unescape(encodeURIComponent(a))) : p(m(unescape(encodeURIComponent(a))));
        return a
    }
    "function" === typeof define && define.amd ? define(function() {
        return r
    }) : "object" === typeof module && module.exports ? module.exports = r : a.md5 = r
})(this);