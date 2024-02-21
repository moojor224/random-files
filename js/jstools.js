export const devMode = true;

/**
 * accepts a css selector and a callback function\
 * waits for an element that matches the css selector to load, then calls the callback
 * @param {String} query css selector to wait for
 * @param {Function} callback callback function to run when the element is found
 * @param {Boolean} stopAfterFound whether to stop looking after the element is found
 * @param {Element} [element=document] parent element to look within -  defaults to document
 */
export function waitForKeyElements(query, callback, stopAfterFound, element) {
    let o, r;

    (o = void 0 === element ? $(query) : $(element).contents().find(query)) &&
        o.length > 0
        ? ((r = !0),
            o.each(function () {
                let e = $(this);
                e.data("alreadyFound") ||
                    false ||
                    (callback(e) ? (r = false) : e.data("alreadyFound", true));
            }))
        : (r = false);
    let l = waitForKeyElements.controlObj || {},
        i = query.replace(/[^\w]/g, "_"),
        c = l[i];
    r && stopAfterFound && c
        ? (clearInterval(c), delete l[i])
        : c ||
        ((c = setInterval(function () {
            waitForKeyElements(query, callback, stopAfterFound, element);
        }, 1000)),
            (l[i] = c));
    waitForKeyElements.controlObj = l;
} //wait for key elements

/*
 * takes in a string and object, and returns an HTMLElement with tag "tag" and properties defined by data\
 * OR\
 * takes in an object and merges the properties from data into it
 * @param {(string|object)} tag html tag name, or object to apply properties to
 * @param {object} data object with properties to be applied
 * @returns {HTMLElement}
 * @example
 * createElement("div", {
 *      innerHTML: "Text Here",
 *      style: {
 *          color: red,
 *          fontSize: "20px",
 *          padding: "3px"
 *      },
 *      dataset: {
 *          title: "title"
 *      }
 * });// <div style="color: red; font-size: 20px; padding: 3px;" data-title="title">Text Here</div>
 */
// an unintended benefit of this function is that it can also function similar to jQuery's extend function
// jQuery.extend(target, source1, source2)
// createElement(target, source1); createElement(target, source2);
// however, there may be some cases where it won't work

let createElement = window.createElement;
if (createElement === undefined) { // this is done to allow typescript type definitions in index.d.ts to work
    createElement = function (tag = "span", data = {}) {
        if (typeof tag === "string" && tag.match(/[^a-zA-Z0-9]/g)) { // if tag is a string and string includes non alphanumeric characters, parse as emmet string
            let div = createElement("div"); // create temporary parent node
            if (expandAbbreviation && typeof expandAbbreviation == "function") { // if expandAbbreviation is defined
                div.innerHTML = expandAbbreviation(tag); // expand abbreviation
            } else if (emmet && emmet.expandAbbreviation && typeof emmet.expandAbbreviation == "function") { // if emmet.expandAbbreviation is defined
                div.innerHTML = emmet.expandAbbreviation(tag); // expand abbreviation
            }
            /**
             * @type {HTMLElement[]}
             */
            let arr = Array.from(div.children);
            return arr.length == 1 ? arr[0] : arr; // if only 1 top-level element was generated, return it, else return whole array
        }
        tag = typeof tag === "string" ? document.createElement(tag) : tag; // convert string to HTMLElement
        Object.keys(data).forEach((e) => { // loop through object properties
            if (typeof data[e] === "object") { // if value is object, recurse
                createElement(tag[e] || (tag[e] = {}), data[e]);
            } else {
                if (tag instanceof window.Element) { // if tag is an html element
                    if (e.substring(0, 2) == "on" && typeof data[e] == "function") { // if property is an event listener
                        tag.addEventListener(e.substring(2), data[e]); // add event listener
                    } else {
                        tag[e] = data[e]; // else, set property
                    }
                } else {
                    tag[e] = data[e]; // else, set property
                }
            }
        });
        return tag; // return result
    }
}
export { createElement };

/**
 * appends any number of objects to an HTMLElement
 * @param  {...Element} args an array of objects to be added to the parent element
 * @returns {this}
 * @memberof Element
 * @function external:Element#add
 * @example
 * createElement("table").add(
 *      createElement("tr").add(
 *          createElement("td", {innerHTML: "col 1"}),
 *          createElement("td", {innerHTML: "col 2"}),
 *          createElement("td", {innerHTML: "col 3"})
 *      )
 * );
 * // results in:
 * <table>
 *     <tr>
 *         <td>col 1</td>
 *         <td>col 2</td>
 *         <td>col 3</td>
 *     </tr>
 * </table>
 */
function add(...args) {
    args.forEach(elem => {
        this.append(elem);
    });
    return this;
};
if (window.Element.prototype.add === undefined) {
    window.Element.prototype.add = add;
}

// loop through all HTML...Element prototypes and add the add function
Object.getOwnPropertyNames(window).filter(e => e.startsWith("HTML") && e.endsWith("Element")).forEach(e => {
    if (window[e].prototype.add !== add) {
        window[e].prototype.add = add
    }
});

// window.HTMLSelectElement.prototype.add = add;

/**
 * appends an &lt;error> element to {this}
 * @param {String} text error message
 */
window.Element.prototype.error = function (text = "!") {
    this.clearError(); // remove error element if it exists
    this.add(createElement("error", { innerHTML: text })); // add error element
}

/**
 * clears the error message from {this}
 * @returns {Boolean} whether an element was cleared or not
 */
window.Element.prototype.clearError = function () {
    // this.querySelector("error")?.remove();
    for (let e of this.childNodes) { // loop through child nodes
        if (e.tagName.toLowerCase() == "error") { // if element is an error element
            e.remove(); // remove
            return true; // success
        }
    }
    return false; // fail
}

/**
 * adds a warning message to the specified elements
 * @param {String} str message to display
 * @param  {...any} selectors elements to add warning message to
 */
export function warn(str, ...selectors) {
    clearWarn(...selectors);
    let w = createElement("warn", {
        innerHTML: str
    });
    selectors.forEach(s => {
        let el = s;
        if (typeof s === "string") {
            el = document.querySelector(s);
        }
        el.append(w.cloneNode(true));
    });
}

/**
 * removes the warning message from the given elements
 * @param  {...any} selectors elements to remove the warning message from
 */
export function clearWarn(...selectors) {
    selectors.forEach(s => {
        let el = s;
        if (typeof s === "string") {
            el = document.querySelector(s);
        }
        for (let e of el.children) {
            if (e.tagName.toLowerCase() == "warn") { // only remove warning messages that are children of this element
                e.remove();
            }
        }
    });
}

/**
 * adds an error message to the specified elements
 * @param {String} str message to display
 * @param  {...any} selectors elements to add error message to
 */
export function error(str, ...selectors) {
    clearWarn(...selectors);
    let w = createElement("error", {
        innerHTML: str
    });
    selectors.forEach(s => {
        let el = s;
        if (typeof s === "string") {
            el = document.querySelector(s);
        }
        el.append(w.cloneNode(true));
    });
}

/**
 * removes the error message from the given elements
 * @param  {...any} selectors elements to remove the error message from
 */
export function clearError(...selectors) {
    selectors.forEach(s => {
        let el = s;
        if (typeof s === "string") {
            el = document.querySelector(s);
        }
        for (let e of el.children) {
            if (e.tagName.toLowerCase() == "error") { // only remove error messages that are children of this element
                e.remove();
            }
        }
    });
}


/**
 * hides the given elements
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function hide(...selectors) {
    for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).classList.add("hidden"); // loop through given elements/selectors and add the hidden class
}

/**
 * shows the given elements
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function show(...selectors) {
    for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).classList.remove("hidden"); // loop through given elements/selectors and remove the hidden class
}

/**
 * clears the given elements
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function clear(...selectors) {
    for (let s of selectors) {
        s = typeof s == "string" ? document.querySelector(s) : s; // convert string to queried element
        let arr = flattenChildNodes(s); // get all descendant nodes in order
        if (arr.includes(s)) { // remove element from list if it exists (won't ever run, ideally)
            arr.splice(arr.indexOf(s), 1);
        }
        while (arr.length > 0) { // remove individual elements to deep purge event listeners
            let el = arr.pop(); // get element from end of list
            if (el.remove) { // if element is removeable (not a text node)
                el.remove(); // remove it
            }
        }
        s.innerHTML = ""; // clear out any remaining text nodes
    }
}

/**
 * disables the given elements
 * @param {String} message message to show
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function disable(message, ...selectors) {
    for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).setAttribute("disabled", message);
}

/**
 * reenables the given elements
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function enable(...selectors) {
    for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).removeAttribute("disabled");
}

/**
 * sets the tab's favicon to a square with the specified color
 * @param {string} color color of the square
 */
export function tabColor(color) {
    function isValidCSSColor(color2) { // checks if string is valid css color
        if (["unset", "initial", "inherit"].includes(color2)) { // valid css colors that should return false
            return false;
        }
        const s = document.createElement("div").style; // get style property of temp element
        s.color = color2; // set color property
        return s.color !== ""; // check if color property is still there
    }
    if (!isValidCSSColor(color)) { // check if provided color is valid
        return;
    }
    let c = document.createElement("canvas"); // create dummy canvas
    c.width = 1; // set favicon dimensions
    c.height = 1; // 1x1 is fine since it's a solid color
    let ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 128, 128);
    let link = document.querySelector("link[rel=icon]") || document.createElement("link");
    link.href = c.toDataURL();
    link.rel = "icon";
    document.head.append(link);
}

/**
 * parses cookies into a hashmap
 * @param {string} [cookies=document.cookie] cookies to parse
 * @returns {Map} hashmap of all cookies
 */
export function parseCookies(cookies = document.cookie) {
    console.log(cookies);
    let reading = !1;
    let escaped = !1;
    let quoted = NaN;
    let key = "";
    let value = "";
    let map = new Map();
    cookies.trim().split("").forEach((e) => {
        if (escaped) {
            value += e;
            escaped = false;
        } else if (reading) {
            if (quoted == NaN) {
                quoted = e == '"';
                if (!quoted) {
                    value += e;
                }
            } else if ((e == '"' && quoted) || (e == ";" && !quoted)) {
                quoted = NaN;
                map.set(key.trim(), value);
                reading = false;
                value = "";
                key = "";
            } else {
                value += e;
            }
        } else if (e == "=") {
            reading = true;
        } else {
            key += e;
        }
    });
    if (key != "") {
        map.set(key.trim(), value);
    }
    return map;
}

/**
 * generates a array sort function that sorts an array of objects by a specified property name
 * @param {string} prop name of the property to sort by
 * @returns {function} the sort function
 * @example 
 * ```javascript
 * let People = [
 *     {Name: "Name", Surname: "Surname"},
 *     {Name:"AAA", Surname:"ZZZ"},
 *     {Name: "Name", Surname: "AAA"}
 * ];
 * People.sort(dynamicSort("Name"));
 * People.sort(dynamicSort("Surname"));
 * People.sort(dynamicSort("-Surname"));
 * ```
 */
export function dynamicSort(prop) {
    let sortOrder = 1;
    if (typeof prop === "string" && prop[0] === "-") {
        sortOrder = -1;
        prop = prop.substring(1);
    }
    return function (a, b) {
        let result = a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0;
        return result * sortOrder;
    };
}

/**
 * returns css rgb string based off of a percent value of a gradient
 * @param {number} p number in range from 0-100
 * @param {Object[]} colors array of rgb colors
 * @returns {string}
 */
export function rgbGradient(
    p,
    colors = [
        { r: 0xff, g: 0, b: 0 }, // 0% red
        { r: 0xff, g: 0x7f, b: 0 }, // 20% orange
        { r: 0xff, g: 0xff, b: 0 }, // 40% yellow
        { r: 0, g: 0xff, b: 0 }, // 60% green
        { r: 0, g: 0, b: 0xff }, // 80% blue
        { r: 0xff, g: 0, b: 0xff }, // 100% purple
    ]
) {
    p = typeof p === "string" ? parseInt(p) : p;
    let numChunks = colors.length - 1;
    let chunkSize = 100 / numChunks;
    for (let i = 1; i <= numChunks; i++) {
        if (p <= chunkSize * i) {
            let percent = ((p + (1 - i) * chunkSize) * numChunks) / 100;
            let color1 = colors[i], color2 = colors[i - 1];
            let result = [];

            Object.keys(colors[0]).forEach((e) => {
                result.push(Math.floor((color1[e] * percent + color2[e] * (1 - percent)) * 100) / 100);
            });
            return "rgb(" + result.join(",") + ")";
        }
    }
}

/**
 * proportionately maps a number from an input range to an output range
 * @param {Number} x value
 * @param {Number} inmin input range lower bound
 * @param {Number} inmax input range upper bound
 * @param {Number} outmin output range lower bound
 * @param {Number} outmax output range upper bound
 * @param {Boolean} cmp whether to clamp the input value to the input range
 * @returns {Number}
 */
export function map(x, inmin, inmax, outmin, outmax, cmp = false) {
    return ((cmp ? clamp(x, inmin, inmax) : x) - inmin) * (outmax - outmin) / (inmax - inmin) + outmin;
}

/**
 * generates a gradient of colors from the specified array
 * @param {Number} count number of colors to generate
 * @param {Object[]} colors array of colors in gradient
 * @returns {String[]} array of colors generated
 */
export function gradient(count, colors = [
    { r: 0xff, g: 0, b: 0 }, // 0% red
    { r: 0xff, g: 0x7f, b: 0 }, // 20% orange
    { r: 0xff, g: 0xff, b: 0 }, // 40% yellow
    { r: 0, g: 0xff, b: 0 }, // 60% green
    { r: 0, g: 0, b: 0xff }, // 80% blue
    { r: 0xff, g: 0, b: 0xff }, // 100% purple
]) {
    if (count == 1) {
        let { r, g, b } = colors[0];
        return [`rgb(${r},${g},${b})`];
    }
    let arr = new Array(count).fill("");
    arr = arr.map((e, n) => rgbGradient(map(n, 0, count - 1, 0, 100), colors));
    return arr;
}

/**
 * interleaves arrays
 * @param {Boolean} fill whther to fill arrays with null to match longest array's length
 * @param  {...any} arrays arrays to interleave
 * @returns {any[]} interleaved arrays
 */
export function interleaveArrays(fill, ...arrays) {
    let max = Math.max(...arrays.map(e => e.length));
    if (fill) arrays = arrays.map(arr => [...arr, ...new Array(max - arr.length).fill(null)]);
    let change = true;
    let result = [];
    let count = 0;
    while (change && count < 100) {
        count++;
        change = false;
        arrays.forEach(arr => {
            if (arr.length > 0) {
                change = true;
                result.push(arr.shift());
            }
        });
    }
    return result;
}

/**
 * sets `console.everything` to an array of the console's history\
 * run this before using any console logging functions in order to capture everything
 */
export function captureConsole() {
    if (console.everything === undefined) {
        console.everything = [];
        ["log", "warn", "error", "debug"].forEach(e => {
            let d = "default" + e.split("")[0].toUpperCase() + e.substring(1);
            console[d] = console[e].bind(console);
            console[e] = function (...args) {
                console.everything.push({
                    type: e,
                    datetime: Date().toLocaleString(),
                    value: args
                });
                console[d].apply(console, args);
            }
        });
    }
}

/**
 * takes in an object and returns a flattened array of all it's children
 * @param {object} arr object to flatten
 * @returns {object[]} array of all children
 */
export function flattenChildren(arr) {
    return [arr, ...(arr.children?.flatMap((e) => flattenChildren(e)) || [])];
}

/**
 * takes in an HTMLElement and returns an array of all it's descendants
 * @param {HTMLElement} el element to flatten
 * @returns {HTMLElement[]} array of all children
 */
export function flattenChildNodes(el) {
    return [el, ...([...el.childNodes].flatMap((e) => flattenChildNodes(e)) || [])];
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
 * returns the value of the given css variable name
 * @param {string} varname css variable name
 * @returns {string} value of css variable
 */
export function getColor(varname, ...append) {
    let color = getComputedStyle(document.querySelector(":root")).getPropertyValue(varname);
    if (color.match(/^#[a-zA-Z0-9]{3}$/g)) {
        color = "#" + color.substring(1).split("").map(e => e.padStart(e, 2)).join("") + append.join("");
    }
    return color + append.join("");
}

/**
 * 
 * @param {Function} val function to call
 * @param  {...any} args arguments to pass to function
 * @returns returns an object whose value will automatically 
 */
export function lockValue(val, ...args) {
    return class {
        constructor() { }
        static valueOf() {
            return val(...args);
        }
    }
}

/**
 * logs all colors on the page to console, grouped by text color and background color
 * 
 * show each individual element in each group
 */
export function listAllColorsOnPage() {
    function hexToRgb(color) {
        if (color.match(/#?([a-zA-Z0-9]{8}|[a-zA-Z0-9]{6}|[a-zA-Z0-9]{3,4})/g)?.at(0) === color) {
            color = color.replace("#", "");
            let split, a;
            switch (color.length) {
                case 4:
                    a = true;
                case 3:
                    split = color.split("");
                    break;
                case 8:
                    a = true;
                case 6:
                    split = color.match(/.{1,2}/g);
                    break;
            }
            return `rgb${a ? "a" : ""}(${split.map((e, n) => parseInt(e.padStart(2, e), 16) / (n == 3 ? 255 : 1)).join(", ")})`;
        }
    }

    function rgbToHex(rgb) {
        return "#" + rgb.replaceAll(/[^0-9\.,]/g, "").split(",").map((e, n) => parseInt(e * (n == 3 ? 255 : 1)).toString(16).padStart(2, e)).join("");
    }
    rgbToHex("rgba(255, 255, 255, 0.5)");

    function flattenChildren(item) {
        return [item, ...([...item.children]?.flatMap((e) => flattenChildren(e)) || [])];
    }

    function getColor(rgb) {
        let [r, g, b] = rgb.replaceAll(/[^0-9 ]/g, "").split(" ");
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
    }

    let colorProps = ["backgroundColor", "color"];

    function displayResults(array) {
        array.forEach(e => {
            console.groupCollapsed(`%c${rgbToHex(e.value)} (${(e.varName)})`, `
    color: ${getColor(e.value)};
    background-color: ${e.value};
    padding: 20px;
    line-height: 60px;
    font-size: 20px;
    `);
            colorProps.forEach(prop => {
                if (e[prop].length > 0) {
                    console.groupCollapsed("%c " + prop, "font-size: 20px;");
                    e[prop].forEach(v => {
                        console.log(v[0]);
                    });
                    console.groupEnd();
                }
            })
            console.groupEnd();
        });
    }

    let arr = [...new Array(106).fill(0).map((e, n) => "--color" + (n + 1)), ...new Array(10).fill(1).map((e, n) => "--transparent" + (n + 1))];
    let root = getComputedStyle(document.querySelector(":root"));
    let els = flattenChildren(document.body).map(e => [e, getComputedStyle(e)]);
    arr = arr.map(c => {
        let color = root.getPropertyValue(c);
        color = hexToRgb(color);
        let obj = {
            value: color,
            varName: c
        };
        colorProps.forEach(e => {
            obj[e] = els.filter(r => r[1][e] === color);
        });
        //     console.log(obj);
        return obj;
    }).filter(e => colorProps.map(p => e[p].length > 0).includes(true));

    console.log(arr);
    displayResults(arr);
}

/**
 * clamps a number to a range\
 * \
 * if the number is outside the range, move it to the\
 * closest position inside the range, else do nothing
 * @param {Number} val value
 * @param {Number} min minimum of range
 * @param {Number} max maximum of range
 * @returns {Number} number clamped to range
 */
export function clamp(val, min, max) {
    return (((min > max) ? ([min, max] = [max, min]) : 0), (val < min ? min : val > max ? max : val));
}

/**
 * @param {any | undefined} val 
 * @param {any} def 
 * @returns {any | undefined}
 */
export function getValueOrDefault(val, def) {
    if (val === undefined || val === null) {
        return def;
    }
    return val;
}

export const gvod = getValueOrDefault;

/**
 * puts the properties from source onto target
 * @param {Object} target 
 * @param {Object} source 
 */
function extend(target, source) {
    Object.keys(source).forEach(key => {
        target[key] = source[key];
    });
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

let Settings = window.Settings;
if (Settings === undefined) {
    Settings = class extends EventTarget {
        config = {
            name: "settings"
        };
        sections = [];
        /**
         * creates a new Settings object
         * @param {Object} config config options
         * @param {Section[]} sections array of sections to add to the settings
         */
        constructor(config = {}, sections) {
            super(); // initialize EventTarget object
            extend(this.config, config); // apply config to this
            if (!Array.isArray(sections)) { // turn sections into array if it isn't already
                sections = [sections];
            }
            this.sections = sections.filter(e => e instanceof Section); // filter all non-Section elements out of sections array
            sections.forEach(section => {
                section.settings_obj = this; // set parent object of each section
            });
        }
        render() {
            let div = createElement("div", { // main settings div
                classList: "settings"
            }).add(
                createElement("h2", { innerHTML: this.config.name })
            );
            div.add(...this.sections.map(s => s.render())); // render all subsections and add them to the settings div
            // return div;
        }

        /**
         * 
         * @param {String} id
         * @returns {Section}
         */
        getSection(id) { // returns the section object with the given id
            return this.sections.find(e => e.config.id == id);
        }

        /**
         * converts the settings object to a stringified JSON object cabable of being imported through the Settings.loadJson() method
         * @returns {String}
         */
        export() {
            let data = JSON.parse(JSON.stringify(this, function (key, value) {
                if (key.includes("_obj")) { // exclude parent objects to avoid recursion
                    return undefined;
                }
                return value;
            }));
            data.sections.forEach(sec => {
                sec.options.forEach(e => delete e.input)
            });
            console.log(data);
            return JSON.stringify(data);
        }

        /**
         * dispatches an event on the Settings object
         * @param {Event} event event
         */
        dispatchEvent(event) {
            let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this); // get copy of original dispatchEvent function
            originalDispatch.apply(this, [event]) // call original dispatchEvent function
            return !event.defaultPrevented || !event.cancelable;
        }

        /**
         * listens for an event\
         * wrapper function for addEventListener
         * @param {String} type type of event
         * @param {Function} callback callback function
         */
        on(type, callback) {
            // console.log("on", this.#listeners);
            this.addEventListener(type, callback);
        }

        /**
         * stops the specified callback from listening for the specified event\
         * wrapper function for removeEventListener
         * @param {String} type type of event
         * @param {Function} callback callback function
         */
        off(type, callback) {
            // console.log("off", this.#listeners);
            this.removeEventListener(type, callback);
        }

        /**
         * converts stringified json data into a settings object\
         * json data can be generated from the export method
         * @static
         * @param {String} jsontext stringified json data
         * @returns {Settings}
         */
        static loadJson(jsontext) {
            if (jsontext.length == 0) {
                return null;
            }
            try {
                let json = JSON.parse(jsontext);
                let validate = Joi.object({ // validate object to make sure it's in the correct format
                    config: Joi.object({
                        name: Joi.string().required()
                    }).required(),
                    sections: Joi.array().items(Joi.object({
                        config: Joi.object({
                            name: Joi.string().required(),
                            id: Joi.string().required()
                        }),
                        options: Joi.array().items(Joi.object({
                            config: Joi.object({
                                name: Joi.string().required(),
                                id: Joi.string().required(),
                                type: Joi.string().required(),
                                value: Joi.any(),
                                values: Joi.array()
                            }).required()
                        })).required()
                    })).required()
                }).validate(json);
                if (validate.error) { // object isn't in the correct format
                    console.error("invalid json data");
                    throw new Error(validate.error);
                }
                return new Settings(json.config, json.sections.map(sec => { // parse object into settings, sections, and options
                    return new Section(sec.config, sec.options.map(opt => {
                        return new Option(opt.config);
                    }));
                }));
            } catch (err) {
                console.error(err);
                return err;
            }
        }

        replaceWith(settings) {
            // replaces this settings object with another one by overriding sections array and config.
            // because this object was exported, it can't be assigned in other modules,
            // so a custom function had to be made
            if (!(settings instanceof Settings)) { // only override if provided object is a Setting object
                return;
            }
            this.config = settings.config; // override config
            this.sections = settings.sections; // override sections
        }
    }
}

let Section = window.Section;
if (Section === undefined) {
    Section = class extends EventTarget {
        /**
         * @type {Settings}
         */
        settings_obj = null;
        config = {
            name: "section"
        }
        options = [];

        /**
         * makes a new Section object
         * @param {Object} config config options
         * @param {Options[]} options array of Options to add to the section
         */
        constructor(config, options) {
            super(); // initialize EventTarget
            extend(this.config, config); // apply config to this
            if (!Array.isArray(options)) { // turn options into array if it isn't one already
                options = [options];
            }
            this.options = options.filter(e => e instanceof Option); // remove all non-Option items from array
            options.forEach(option => {
                option.section_obj = this; // set parent object for each option
            });
        }

        /**
         * 
         * @param {String} name
         * @returns {Option}
         */
        getOption(name) { // returns the section object with the given id
            return this.options.find(e => e.config.id == name);
        }

        /**
         * renders the section object as HTML
         * @returns {HTMLElement}
         */
        render() {
            let section = createElement("section").add(
                createElement("h2", { innerHTML: this.config.name }) // section title
            );
            section.add(...this.options.map(o => o.render())); // render all options in this section
            return section;
        }

        /**
         * dispatches an event on the Section object
         * @param {String} type event type
         * @param {Object} config event options/data
         */
        dispatchEvent(event) {
            this.settings_obj.dispatchEvent(event); // bubble event to parent element
            let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this); // get copy of original dispatchEvent function
            originalDispatch.apply(this, [event]); // call original dispatchEvent function
            return !event.defaultPrevented || !event.cancelable;
        }

        /**
         * listens for an event\
         * wrapper for addEventListener
         * @param {String} type type of event
         * @param {Function} callback callback function
         */
        on(type, callback) {
            // console.log("on", this.#listeners);
            this.addEventListener(type, callback);
        }

        /**
         * stops the specified callback from listening for the specified event\
         * wrapper for removeEventListener
         * @param {String} type type of event
         * @param {Function} callback callback function
         */
        off(type, callback) {
            // console.log("off", this.#listeners);
            this.removeEventListener(type, callback);
        }
    }
}

let Option = window.Options;
if (Option === undefined) {
    Option = class extends EventTarget {
        /**
         * @type {HTMLElement}
         */
        input = null;

        /**
         * @type {Section}
         */
        section_obj = null;
        config = {
            name: "option",
            type: "toggle",
            value: false
        }

        /**
         * creates a new Option object
         * @param {Object} config Option options
         */
        constructor(config) {
            super(); // initialize EventTarget object
            extend(this.config, config); // apply config to this
            if (config.value == undefined && config.values) { // if value is not specified, set value to first value in values
                this.config.value = config.values[0];
            }
        }

        get value() {
            return this.config.value;
        }

        set value(val) {
            console.log("set value to", val);
            show("#loadingModal"); // show the loading modal
            let option = this;
            fetch("/Reports/Report/SaveSettings", { // fetch request to server to save user settings
                method: "POST",
                body: this.section_obj.settings_obj.export(),
                headers: {
                    "X-CSRF-TOKEN": Cookies.get("CSRF-TOKEN") // auth token
                }
            }).then(e => {
                e.text().then(t => {
                    if (!t.includes("error")) { // settings could not save
                        this.config.value = val; // revert option change
                    } else {
                        this.input.value = this.config.value; // save option change in option object
                    }
                    option.dispatchEvent(new Event("change")); // forward event from html element to option object
                    hide("#loadingModal"); // hide the loading modal
                });
            });
        }

        /**
         * renders the option object as HTML
         * @returns {HTMLLabelElement}
         */
        render() {
            let label = createElement("label");
            let span = createElement("span", {
                innerHTML: this.config.name
            });
            let input = this.createInput();
            label.add(span, input); // clicking a label will activate the first <input> inside it, so the 'for' attribute isn't required
            return label;
        }

        /**
         * creates the input method specified by the option config
         * @returns {HTMLSelectElement|HTMLInputElement}
         */
        createInput() {
            let input; // initialize variable
            let option = this; // save reference to this
            if (this.config.type == "toggle") { // standard on/off toggle
                input = createElement("input", {
                    type: "checkbox",
                    classList: "slider" // pure css toggle switch
                });
            } else if (this.config.type == "dropdown") {
                input = createElement("select");
                let values = [];
                if (this.config.values || (!["undefined", "null"].includes(typeof this.config.values))) { // if list of values is defined
                    if (!Array.isArray(this.config.values)) { // if values is not an array, make it one
                        this.config.values = [this.config.values];
                    }
                    values.push(...this.config.values); // add defined values to list
                }
                values = Array.from(new Set(values)); // remove duplicates
                input.add(...values.map(v => createElement("option", {
                    innerHTML: v
                })));
                // if specified value is not in the list of predefined values, add it as a placeholder
                if (this.config.value && !this.config.values.includes(this.config.value)) {
                    input.insertAdjacentElement("afterBegin", createElement("option", { // insert option element at beginning of select list
                        innerHTML: this.config.value,
                        value: this.config.value,
                        hidden: true, // visually hide placeholder from dropdown
                        disabled: true // prevent user from selecting it
                    }));
                }
                input.value = this.config.value || this.config.values[0];
            }
            input.addEventListener("input", function () { // when setting is changed, dispatch change event on the potions object
                option.value = input.value;
            });
            return input;
        }

        /**
         * dispatches an event on the Option object
         * @param {String} type event type
         * @param {Object} config event options/data
         */
        dispatchEvent(event) {
            this.section_obj.dispatchEvent(event); // bubble event to parent section
            let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this); // save copy of original dispatchEvent function
            originalDispatch.apply(this, [event]); // call original dispatchEvent function
            return !event.defaultPrevented || !event.cancelable;
        }

        /**
         * listens for an event\
         * wrapper function for addEventListener
         * @param {String} type type of event
         * @param {Function} callback callback function
         */
        on(type, callback) {
            // console.log("option on", this.#listeners);
            this.addEventListener(type, callback);
        }

        /**
         * stops the specified callback from listening for the specified event\
         * wrapper function for removeEventListener
         * @param {String} type type of event
         * @param {Function} callback callback function
         */
        off(type, callback) {
            // console.log("option off", this.#listeners);
            this.removeEventListener(type, callback);
        }
    }
}

export { Settings, Section, Option };


export let settings = new Settings({
    name: "Settings"
}, [
    new Section({
        name: "Billing Report",
        id: "Sites_PlayerSummariesListNew"
    }, [
        new Option({
            name: "Graph Type",
            id: "graph_type",
            type: "dropdown",
            values: ["bar", "line"]
        }),
        new Option({
            name: "Show Composite Graph",
            id: "composite_graph",
            type: "toggle",
            value: false
        }),
        new Option({
            name: "Show Individual Graphs",
            id: "individual_graph",
            type: "toggle",
            value: false
        })
    ]),
    new Section({
        name: "Online Game Report",
        id: "SereneOnlineGameReport"
    }, [
        new Option({
            name: "Graph Type",
            id: "graph_type",
            type: "dropdown",
            values: ["bar", "line"]
        })
    ]),
    new Section({
        name: "Recent Player Count",
        id: "SereneRecentPlayerCount"
    }, [
        new Option({
            name: "Graph Type",
            id: "graph_type",
            type: "dropdown",
            values: ["bar", "line",
                "cal"
            ]
        })
    ])
]);

/**
 * uses JSON.stringify and JSON.parse to copy an object and return the copy\
 * WARNING: do not use on objects that contain recursive references, or an error will be thrown
 * @param {Object} obj object to copy
 * @returns {Object}
 * @example
 * let obj1 = {
 *     a: 1,
 *     b: 2,
 *     c: 3
 * }
 * let obj2 = copyObject(obj1) // {a: 1, b: 2, c: 3}
 * obj1.a = 4;
 * // obj1 == {a: 4, b: 2, c: 3}
 * // obj2 == {a: 1, b: 2, c: 3}
 */
export function copyObject(obj) {
    return clone(obj);
    return JSON.parse(JSON.stringify(obj));
}

function clone(obj) {
    let result = obj;
    var type = {}.toString.call(obj).slice(8, -1);
    if (type == 'Set') {
        return new Set([...obj].map(value => clone(value)));
    }
    if (type == 'Map') {
        return new Map([...obj].map(kv => [clone(kv[0]), clone(kv[1])]));
    }
    if (type == 'Date') {
        return new Date(obj.getTime());
    }
    if (type == 'RegExp') {
        return RegExp(obj.source, getRegExpFlags(obj));
    }
    if (type == 'Array' || type == 'Object') {
        result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            result[key] = clone(obj[key]);
        }
    }
    // primitives and non-supported objects (e.g. functions) land here
    return result;
}

function getRegExpFlags(regExp) {
    if (typeof regExp.source.flags == 'string') {
        return regExp.source.flags;
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
export function parseTrace(trace) {
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
 * converts an entire string to html entities
 * @param {String} str string to convert
 * @returns {String} convertet string
 */
function toHTMLEntities(str) {
    return [...str].split("").map(e => `&#${e.charCodeAt(0)};`).join("");
}

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

    svgToTinyDataUri.toSrcset = function toSrcset(svgString) {
        return svgToTinyDataUri(svgString).replace(/ /g, '%20');
    }
    return svgToTinyDataUri.toSrcset;
})();