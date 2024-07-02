// see this gist for a list of functions and objects exported by this module: https://gist.github.com/moojor224/c1d8199c6c90a17cdbfec1b18efa3ee4

/**
 * parses cookies into a hashmap\
 * doesn't always work well. just use a library for this
 * @param {string} [cookies=document.cookie] cookies to parse
 * @returns {Map} hashmap of all cookies
 */
function parseCookies(cookies = document.cookie) {
    throw new Error("not implemented");
}

/**
 * internally-used function to convert local times to UTC
 * @param {Date} b 
 * @returns {string}
 */
function convertTime(b) {
    b.setHours(b.getHours() + new Date().getTimezoneOffset() / 60);
    return b.toISOString();
}

/**
 * converts a number stored in string format from into a different base
 * @param {String} str string containing to number to convert
 * @param {Number} fromBase base of the passed string
 * @param {Number} toBase base to convert to
 * @returns {String} string containing the converted number
 */
function convertBase(str, fromBase, toBase) {
    const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    function add(x, y, base) {
        let z = [];
        const n = Math.max(x.length, y.length);
        let carry = 0;
        let i = 0;
        while (i < n || carry) {
            const xi = i < x.length ? x[i] : 0;
            const yi = i < y.length ? y[i] : 0;
            const zi = carry + xi + yi;
            z.push(zi % base);
            carry = Math.floor(zi / base);
            i++;
        }
        return z;
    }

    function multiplyByNumber(num, x, base) {
        if (num < 0) return null;
        if (num == 0) return [];

        let result = [];
        let power = x;
        while (true) {
            num & 1 && (result = add(result, power, base));
            num = num >> 1;
            if (num === 0) break;
            power = add(power, power, base);
        }

        return result;
    }

    function parseToDigitsArray(str, base) {
        const digits = str.split('');
        let arr = [];
        for (let i = digits.length - 1; i >= 0; i--) {
            const n = DIGITS.indexOf(digits[i])
            if (n == -1) return null;
            arr.push(n);
        }
        return arr;
    }

    const digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    let outArray = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
        digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
        power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let i = outArray.length - 1; i >= 0; i--)
        out += DIGITS[outArray[i]];

    return out;
}

// get settings not loading settings
// ^honestly don't know what ths means, but it's funny, so I'm leaving it

function getRegExpFlags(regExp) {
    if (typeof regExp.source.flags == 'string') {
        return regExp.source.flags;
    } else if (regExp.flags) {
        return regExp.flags;
    } else {
        var flags = [];
        regExp.global && flags.push('g');
        regExp.ignoreCase && flags.push('i');
        regExp.multiline && flags.push('m');
        regExp.sticky && flags.push('y');
        regExp.unicode && flags.push('u');
        return flags.join('');
    }
}

/**
 * parses a stack trace string into an array of objects
 * @param {String} trace stack trace
 * @returns {Object[]}
 */
function parseTrace(trace) {
    let paths = trace.trim().split("\n").map(p => {
        const a = p.split("@");
        const locs = a.pop().split(":");
        return {
            func: a.join("@"),
            char: parseInt(locs.pop()),
            line: parseInt(locs.pop()),
            location: locs.join(":"),
        }
    });
    return paths;
}

/**
 * converts an svg string to a data-uri conpatible string
 * @param {String} svg svg string
 */
let svgToDataUri = (function () {
    const shorterNames = {
        aqua: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
        azure: /#f0ffff(ff)?(?!\w)/gi,
        beige: /#f5f5dc(ff)?(?!\w)/gi,
        bisque: /#ffe4c4(ff)?(?!\w)/gi,
        black: /#000000(ff)?(?!\w)|#000(f)?(?!\w)/gi,
        blue: /#0000ff(ff)?(?!\w)|#00f(f)?(?!\w)/gi,
        brown: /#a52a2a(ff)?(?!\w)/gi,
        coral: /#ff7f50(ff)?(?!\w)/gi,
        cornsilk: /#fff8dc(ff)?(?!\w)/gi,
        crimson: /#dc143c(ff)?(?!\w)/gi,
        cyan: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
        darkblue: /#00008b(ff)?(?!\w)/gi,
        darkcyan: /#008b8b(ff)?(?!\w)/gi,
        darkgrey: /#a9a9a9(ff)?(?!\w)/gi,
        darkred: /#8b0000(ff)?(?!\w)/gi,
        deeppink: /#ff1493(ff)?(?!\w)/gi,
        dimgrey: /#696969(ff)?(?!\w)/gi,
        gold: /#ffd700(ff)?(?!\w)/gi,
        green: /#008000(ff)?(?!\w)/gi,
        grey: /#808080(ff)?(?!\w)/gi,
        honeydew: /#f0fff0(ff)?(?!\w)/gi,
        hotpink: /#ff69b4(ff)?(?!\w)/gi,
        indigo: /#4b0082(ff)?(?!\w)/gi,
        ivory: /#fffff0(ff)?(?!\w)/gi,
        khaki: /#f0e68c(ff)?(?!\w)/gi,
        lavender: /#e6e6fa(ff)?(?!\w)/gi,
        lime: /#00ff00(ff)?(?!\w)|#0f0(f)?(?!\w)/gi,
        linen: /#faf0e6(ff)?(?!\w)/gi,
        maroon: /#800000(ff)?(?!\w)/gi,
        moccasin: /#ffe4b5(ff)?(?!\w)/gi,
        navy: /#000080(ff)?(?!\w)/gi,
        oldlace: /#fdf5e6(ff)?(?!\w)/gi,
        olive: /#808000(ff)?(?!\w)/gi,
        orange: /#ffa500(ff)?(?!\w)/gi,
        orchid: /#da70d6(ff)?(?!\w)/gi,
        peru: /#cd853f(ff)?(?!\w)/gi,
        pink: /#ffc0cb(ff)?(?!\w)/gi,
        plum: /#dda0dd(ff)?(?!\w)/gi,
        purple: /#800080(ff)?(?!\w)/gi,
        red: /#ff0000(ff)?(?!\w)|#f00(f)?(?!\w)/gi,
        salmon: /#fa8072(ff)?(?!\w)/gi,
        seagreen: /#2e8b57(ff)?(?!\w)/gi,
        seashell: /#fff5ee(ff)?(?!\w)/gi,
        sienna: /#a0522d(ff)?(?!\w)/gi,
        silver: /#c0c0c0(ff)?(?!\w)/gi,
        skyblue: /#87ceeb(ff)?(?!\w)/gi,
        snow: /#fffafa(ff)?(?!\w)/gi,
        tan: /#d2b48c(ff)?(?!\w)/gi,
        teal: /#008080(ff)?(?!\w)/gi,
        thistle: /#d8bfd8(ff)?(?!\w)/gi,
        tomato: /#ff6347(ff)?(?!\w)/gi,
        violet: /#ee82ee(ff)?(?!\w)/gi,
        wheat: /#f5deb3(ff)?(?!\w)/gi,
        white: /#ffffff(ff)?(?!\w)|#fff(f)?(?!\w)/gi,
    };
    const REGEX = {
        whitespace: /\s+/g,
        urlHexPairs: /%[\dA-F]{2}/g,
        quotes: /"/g,
    }

    function collapseWhitespace(str) {
        return str.trim().replace(REGEX.whitespace, ' ');
    }

    function dataURIPayload(string) {
        return encodeURIComponent(string)
            .replace(REGEX.urlHexPairs, specialHexEncode);
    }

    // `#` gets converted to `%23`, so quite a few CSS named colors are shorter than
    // their equivalent URL-encoded hex codes.
    function colorCodeToShorterNames(string) {
        Object.keys(shorterNames).forEach(function (key) {
            if (shorterNames[key].test(string)) {
                string = string.replace(shorterNames[key], key);
            }
        });

        return string;
    }

    function specialHexEncode(match) {
        switch (match) { // Browsers tolerate these characters, and they're frequent
            case '%20': return ' ';
            case '%3D': return '=';
            case '%3A': return ':';
            case '%2F': return '/';
            default: return match.toLowerCase(); // compresses better
        }
    }

    function svgToTinyDataUri(svgString) {
        if (typeof svgString !== 'string') {
            throw new TypeError('Expected a string, but received ' + typeof svgString);
        }
        // Strip the Byte-Order Mark if the SVG has one
        if (svgString.charCodeAt(0) === 0xfeff) { svgString = svgString.slice(1) }

        var body = colorCodeToShorterNames(collapseWhitespace(svgString))
            .replace(REGEX.quotes, "'");
        return 'data:image/svg+xml,' + dataURIPayload(body);
    }

    return function (svgString) {
        return svgToTinyDataUri(svgString).replace(/ /g, '%20');
    };
})();

globalThis.logFormatted = logFormatted; // make function globally available

let WIP = (function () {
    var byteLength = 16;

    function encode(str) {
        let bits = str.split("").map(char => char.codePointAt(0).toString(2).padStart(8, 0));
        let bytes = bits.join("").match(new RegExp(`.{1,${byteLength}}`, "g"));
        let ints = bytes.map(e => parseInt(e, 2));
        let lastLength = bytes[bytes.length - 1].length;
        return String.fromCodePoint(lastLength) + ints.map(e => String.fromCodePoint(e)).join("");
    }

    function decode(str) {
        let split = str.split("");
        let lastLength = split.shift().codePointAt(0);
        let points = split.map(e => e.codePointAt(0));
        console.log("points", points);
        let longBytes = points.map((e, n) => e.toString(2).padStart(n == points.length - 1 ? lastLength : byteLength, 0));
        let bytes = longBytes.join("").match(/.{1,8}/g);
        let chars = bytes.map(e => String.fromCodePoint(parseInt(e, 2) + 0));
        return chars.join("");
    }

    var tobe = "abcdefghijklmnopqrstuvqxyz[]\",";
    var encoded = encode(tobe);
    var decoded = decode(encoded);

    console.log(tobe);
    console.log(encoded);
    console.log(decoded);
    console.log("ratio:", encoded.length / tobe.length);
    console.log(tobe == decoded);
});
