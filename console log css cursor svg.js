var style = "font-size: 1.5em; font-weight: bolder; background-color: #42381f; margin: 0px; padding: 3px; color: #fce2a1; cursor: url(\"data:image/svg+xml,%3csvg width='32' height='32' transform='rotate(90%2c 0%2c 0)' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3e %3cpath d='M2 0 0 2 1 2 1 3 3 3 3 2 4 2 2 0' fill='%23000000'/%3e %3c/svg%3e\") 16 16, crosshair;";
console.info("%cconflicting globals! please verify code.\ns\ns\ns\ns", style);
console.warn("conflicting globals! please verify code. ");
let svgToTinyDataUri = (function () {
    let shorterNames = {
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
    let REGEX = {
        whitespace: /\s+/g,
        urlHexPairs: /%[\dA-F]{2}/g,
        quotes: /"/g,
    }

    function collapseWhitespace(str) {
        return str.trim().replace(REGEX.whitespace, ' ');
    }

    function dataURIPayload(string) {
        return encodeURIComponent(string).replace(REGEX.urlHexPairs, specialHexEncode);
    }

    function colorCodeToShorterNames(string) {
        Object.keys(shorterNames).forEach(function (key) {
            if (shorterNames[key].test(string)) {
                string = string.replace(shorterNames[key], function (str) {
                    return str.length > key ? key : str;
                });
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

        let body = colorCodeToShorterNames(collapseWhitespace(svgString)).replace(REGEX.quotes, "'");
        return 'data:image/svg+xml,' + dataURIPayload(body);
    }

    svgToTinyDataUri.toSrcset = function toSrcset(svgString) {
        return svgToTinyDataUri(svgString).replace(/ /g, '%20');
    }

    return svgToTinyDataUri;
})();
