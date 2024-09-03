function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) return [0, 0, 0].fill(l * 255);
    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);

    return [r * 255, g * 255, b * 255];
}
function hsvToRgb(h, s, v) {
    hprime = h / 60;
    const c = v * s;
    const x = c * (1 - Math.abs(hprime % 2 - 1));
    const m = v - c;
    let r, g, b;
    if (!hprime) { r = 0; g = 0; b = 0; }
    if (hprime >= 0 && hprime < 1) { r = c; g = x; b = 0; }
    if (hprime >= 1 && hprime < 2) { r = x; g = c; b = 0; }
    if (hprime >= 2 && hprime < 3) { r = 0; g = c; b = x; }
    if (hprime >= 3 && hprime < 4) { r = 0; g = x; b = c; }
    if (hprime >= 4 && hprime < 5) { r = x; g = 0; b = c; }
    if (hprime >= 5 && hprime < 6) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b]
}

export class Color {
    /**
     * 
     * @param {String} str 
     */
    constructor(str) {
        str = typeof str === "string" ? str.trim().replaceAll("  ", " ") : (str.toString ? str.toString() : new Error("invalid string passed"));
        if (str instanceof Error) {
            throw str;
        }
        const hexa = /^#[a-f\d]{3}(?:[a-f\d]?|(?:[a-f\d]{3}(?:[a-f\d]{2})?)?)\b$/g;
        const hsla = /^hsla?\((?:(-?\d+(?:deg|g?rad|turn)?),\s*((?:\d{1,2}|100)%),\s*((?:\d{1,2}|100)%)(?:,\s*((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?|(-?\d+(?:deg|g?rad|turn)?)\s+((?:\d{1,2}|100)%)\s+((?:\d{1,2}|100)%)(?:\s+((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?)\)$/g;
        const rgba = /rgba?\((?:(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%),\s*(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%),\s*(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)(?:,\s*((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?|(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)\s+(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)\s+(25[0-5]|2[0-4]\d|1?\d{1,2}|(?:\d{1,2}|100)%)(?:\s+((?:\d{1,2}|100)%|0(?:\.\d+)?|1))?)\)$/g;
        let color;
        if (str.match(hexa)) {
            color = str.substring(1);
            if (color.length % 3 == 0) {
                this.a = 0xff;
            } else {
                let split;
                if (color.length == 8) {
                    split = color.match(/.{1,2}/g);
                } else {
                    split = color.split("");
                }
                let a = split.pop();
                this.a = parseInt(a.padStart(2, a), 16);
                color = split.join("");
            }
            let r = color.substring(0, color.length / 3);
            let g = color.substring(color.length / 3, 2 * color.length / 3);
            let b = color.substring(2 * color.length / 3, color.length);
            this.r = parseInt(r.padStart(2, r), 16);
            this.g = parseInt(g.padStart(2, g), 16);
            this.b = parseInt(b.padStart(2, b), 16);
        } else if (str.match(hsla)) {
        } else if (str.match(rgba)) {
            color = str.replaceAll(/\b\b/g, "").replaceAll(/\(\b+/g, "(").replaceAll(/\)\b+/g, ")").replaceAll(/(?<![0-9])\b/g, "");
        } else {
            throw new Error("invalid color string");
        }
    }

    toHex() {
        return `#${["r", "g", "b", "a"].map(e => this[e].toString(16)).join("")}`;
    }

    toRgb() {
        return `rgba(${["r", "g", "b", "a"].map(e => this[e].toString(16)).join(",")})`;
    }

    toHsl() {
        function rgbToHsl(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, l = (max + min) / 2;
            if (max == min) return [0, 0, l];
            const d = max - min;
            const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            return [h / 6, s, l];
        }
        const { r, g, b, a } = this;
        const [h, s, l] = rgbToHsl(r, g, b);
        return `hsla(${h}, ${s}, ${l}, ${a})`;
    }

    toHsv() {
        function rgbToHsv(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max == 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            } else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return [h, s, v];
        }
    }
}

/**
 * generates a string template function or smth idk
 * @param {String[]} strings plain-text strings
 * @param  {...String} keys keys to interpolate
 * @returns {Function}
 * 
 * @example
 * const template1 = makeTemplate`I'm ${"name"}. I'm almost ${"age"} years old.`;
* template1({ name: "MDN", age: 30 }); // "I'm MDN. I'm almost 30 years old."
* 
* const template2 = makeTemplate`I'm ${0}. I'm almost ${1} years old.`;
* template2("MDN", 30); // "I'm MDN. I'm almost 30 years old."
 */
export function makeTemplate(strings, ...keys) {
    return function (...values) {
        const dict = values[values.length - 1] || {}; // get dict from args
        const result = [strings[0]];
        keys.forEach((key, i) => {
            const value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join("");
    };
}

import chroma from "./chroma";
var chroma = window.chroma;
let c = chroma("#ffffff");
c.hex();