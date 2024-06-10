function tryImport(url) {
    try {
        return require(url);
    } catch (e) {
        try {
            return import(url).then(e => e);
        } catch (e) {
            return {};
        }
    }
}
const { Prism } = await tryImport("../prism.js");
const { js_beautify } = await tryImport("../beautify.js");
const { bulkElements } = await tryImport("./bulkElements.js");

(function () { // overrides for nodejs
    function proxy() { // create a recursive dummy proxy object
        let t = {};
        return new Proxy(t, {
            get: function (target, prop) {
                if (typeof target[prop] == "undefined") return proxy();
                return target[prop];
            },
            set: function (target, prop, value) {
                target[prop] = value;
                return true;
            }
        });
    }
    if (typeof window === "undefined") {
        globalThis.window = proxy();
    }
    if (typeof HTMLElement === "undefined") {
        globalThis.HTMLElement = proxy();
    }
    if (typeof Element === "undefined") {
        globalThis.Element = proxy();
    }
})();

Math.roundf = (v, t) => Math.round(v * t) / t;

/**
 * accepts a css selector and a callback function\
 * waits for an element that matches the css selector to load, then calls the callback
 * @param {String} query css selector to wait for
 * @param {Function} callback callback function to run when the element is found
 * @param {Boolean} stopAfterFound whether to stop looking after the element is found
 * @param {Element} [element = document] parent element to look within -  defaults to document
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

let createElement = window.createElement;
if (typeof createElement != "function") { // this is done to allow typescript type definitions in index.d.ts to work
    {
        // minified createElement
        // @ts-format-ignore-region
        let createElement = (t,D)=>(p=e=>typeof e,c=(T,d=
        {})=>(T=p(T)[1]=="t"?document.createElement(T):T,
        Object.keys(d).map(e=>(p(d[e])[0]=="o"?c(T[e]||
        (T[e]={}),d[e]):(T instanceof window.Element?(e[s=
        "substring"](0,2)=="on"&&p(d[e])[0]=="f"?T.addEventListener
        (e[s](2),d[e]):T[e]=d[e]):(T[e]=d[e])))),T),c(t,D))
        // @ts-format-ignore-endregion
    }
    createElement = function (tag, data = {}) {
        if (typeof tag === "string" && tag.match(/[^a-zA-Z0-9]/g)) { // if tag is a string and string includes non alphanumeric characters, parse as emmet string
            let div = createElement("div"); // create temporary parent node
            if (expandAbbreviation && typeof expandAbbreviation == "function") { // if expandAbbreviation is defined
                div.innerHTML = expandAbbreviation(tag); // expand abbreviation
            } else if (emmet && emmet.expandAbbreviation && typeof emmet.expandAbbreviation == "function") { // if emmet.expandAbbreviation is defined
                div.innerHTML = emmet.expandAbbreviation(tag); // expand abbreviation
            }
            /** @type {HTMLElement[]} */
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
        if (typeof elem == "string") {
            this.insertAdjacentHTML("beforeend", elem); // insert as raw html (preserves event listeners)
        } else {
            this.append(elem); // append element
        }
    });
    return this;
};

if (window.HTMLElement.prototype.add === undefined) {
    window.HTMLElement.prototype.add = add;
}

// loop through all HTML...Element prototypes and add the add function
Object.getOwnPropertyNames(window).filter(e => e.startsWith("HTML") && e.endsWith("Element")).forEach(e => {
    if (window[e].prototype.add !== add) {
        window[e].prototype.add = add
    }
});

/**
 * HTMLElement.isVisible will return true if the element is currently on screen
 */
Object.defineProperty(HTMLElement.prototype, "isVisible", {
    get: function () {
        if (this === document.documentElement) { // node is the root node
            return true;
        }
        if (!this.parentNode) { // node has no parent (not attached to page)
            return false;
        }
        let style = window.getComputedStyle ? window.getComputedStyle(this) : this.currentStyle; // get current computed style
        return !(
            style.display === "none" || // node is hidden via css
            style.visibility === "hidden" ||
            style.opacity == "0"
        ) &&
            this.parentNode.isVisible && // make sure parent node is visible
            (function () {
                let bounds = this.getBoundingClientRect();  // get position of element
                let html = document.documentElement, body = document.body; // get html and body elements
                let viewport = { // get viewport dimensions and position
                    width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
                    height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
                };
                return bounds.left >= 0 && // check if element is within viewport
                    bounds.top >= 0 &&
                    bounds.right <= viewport.width &&
                    bounds.bottom <= viewport.height;
            }).bind(this)();
    }
});

/**
 * adds a warning message to the specified elements
 * @param {String} str message to display
 * @param  {...any} selectors elements to add warning message to
 */
export function warn(str = "!", ...selectors) {
    clearWarn(...selectors); // clear any existing warnings
    let w = createElement("warn", { // create warning element
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
        for (let e of el.children) { // only remove warning messages that are children of this element
            if (e.tagName.toLowerCase() == "warn") {
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
    clearError(...selectors);
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
        for (let e of el.children) { // only remove error messages that are children of this element
            if (e.tagName.toLowerCase() == "error") {
                e.remove();
            }
        }
    });
}

/**
 * hides the given elements by adding the class "hidden"
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function hide(...selectors) {
    bulkElements(...selectors).classList.add("hidden");
}

/**
 * shows the given elements by removing the class "hidden"
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function show(...selectors) {
    bulkElements(...selectors).classList.remove("hidden");
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
    for (let s of selectors) {
        let el;
        if (typeof s == "string") {
            el = document.querySelector(s);
        } else {
            el = s;
        }
        el.setAttribute("disabled", message);
    }
}

/**
 * reenables the given elements
 * @param  {...(String|Element)} selectors list of css selectors or elements
 */
export function enable(...selectors) {
    for (let s of selectors) {
        let el;
        if (typeof s == "string") { // if s is a string (css selector)
            el = document.querySelector(s);
        } else {
            el = s;
        }
        el.removeAttribute("disabled");
    }
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
    ctx.fillStyle = color; // set color
    ctx.fillRect(0, 0, 128, 128); // fill canvas with color
    let link = document.querySelector("link[rel=icon]") || document.createElement("link"); // find favicon link or create new one
    link.href = c.toDataURL(); // convert to base64
    link.rel = "icon"; // set rel
    document.head.append(link); // append new element
}

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
 * generates a array sort function that sorts an array of objects by a specified property name
 * @param {string} key name of the property to sort by
 * @returns {function} the sort function
 * @example
 * let People = [
 *     {Name: "Name", Surname: "Surname"},
 *     {Name:"AAA", Surname:"ZZZ"},
 *     {Name: "Name", Surname: "AAA"}
 * ];
 * People.sort(dynamicSort("Name"));
 * People.sort(dynamicSort("Surname"));
 * People.sort(dynamicSort("-Surname"));
 */
export function dynamicSort(key) {
    let sortOrder = 1; // normal sort order
    if (typeof key === "string" && key.startsWith("-")) { // if key starts with a -
        sortOrder = -1; // reversed sort order
        key = key.substring(1); // remove minus from key
    }
    return function (a, b) { // use this function in array.sort(func); to sort it by the given key
        let result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;  // run comparison and set result to -1,0,1
        return result * sortOrder; // if sortOrder is reversed, this will return 1,0,-1
    };
}

/**
 * generates an array sort function that can sort by object properties with optional fallback properties if two values have the same property value\
 * each given property can also have period-separated nested property names for advanced sorting\
 * adding a minus before any property name will reverse the sort order for that property
 * @param  {...string} properties list of properties to sort by
 * @returns {function} sort function that can sort an array by the specified properties
 * @example
 * let func = advancedDynamicSort("a", "b");
 * [
 *     {a: 1, b: 2},
 *     {a: 0, b: 3},
 *     {a: 1, b: 1},
 *     {a: 0, b: 1},
 * ].sort(func);
 * result = [
 *     {a: 0, b: 1},
 *     {a: 0, b: 3},
 *     {a: 1, b: 1},
 *     {a: 1, b: 2},
 * ];
 */
export function advancedDynamicSort(...properties) {
    if (properties.length < 1) return;
    // let w = (d, b) => d() ? (b(), w(d, b)) : 0;
    function dSort(property) {
        property = property.split(".");
        function compare(a, b, chain) {
            let p = chain[0].trim(), // remove whitespace from property name
                sortOrder = 1; // ascending sort order
            if (p[0] == "-") { // reverse the sort order
                sortOrder = -1; // descending sort order
                p = p.substring(1); // remove the minus sign
            }
            // if anything is undefined, or no more properties left in the chain
            if (a[p] === undefined || b[p] === undefined || chain.length == 1) return sortOrder * (a[p] < b[p] ? -1 : a[p] > b[p] ? 1 : 0);
            // if there is more than one property left in the chain
            if (chain.length > 1) return compare(a[p], b[p], chain.slice(1));
        }
        return (a, b) => compare(a, b, property); // return callable compare function
    }
    properties = properties.map(e => dSort(e)); // pre-generate top-level compare functions for increased sorting performance
    return function (a, b) { // return callable sort function
        let funcs = [...properties], // get copy of compare functions array
            result; // stores compare function result (-1,0,1)
        // result = funcs.shift()(a, b);
        // w(_ => result == 0 && funcs.length > 0, _ => result = funcs.shift()(a, b));
        do { // loop through each comparison function until one object is found to be different
            result = funcs.shift()(a, b); // get the next available comparison function and call it with both objects
        }
        while (result == 0 && funcs.length > 0);
        return result;
    };
}

/**
 * returns css rgb string based off of a percent value of a gradient
 * @param {number} p number in range from 0-100
 * @param {Object[]} colors array of rgb colors
 * @returns {string}
 */
export function rgbMix(
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
    p = typeof p === "string" ? parseInt(p) : p; // convert p to a number if it is a string
    let numChunks = colors.length - 1; // get number of sub-gradients
    let chunkSize = 100 / numChunks; // get what percent each sub-gradient represents out of the whole gradient
    for (let i = 1; i <= numChunks; i++) { // loop through sub-gradients and find if p is within that gradient
        if (p <= chunkSize * i) {
            let percent = ((p + (1 - i) * chunkSize) * numChunks) / 100; // get percent relative to the sub-gradient
            let color1 = colors[i], color2 = colors[i - 1]; // get left/right colors for sub-gradient
            let result = [];
            Object.keys(colors[0]).forEach((e) => {
                result.push(Math.floor((color1[e] * percent + color2[e] * (1 - percent)) * 100) / 100); // blend colors according to where p is within the sub-gradient
            });
            return "rgb(" + result.join(",") + ")"; // return result
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
    if (count == 1) { // only one color needed, so just return the first color in the gradient range
        let { r, g, b } = colors[0];
        return [`rgb(${r},${g},${b})`];
    }
    let arr = new Array(count).fill(""); // make array of how many colors you need
    arr = arr.map((e, n) => rgbMix(map(n, 0, count - 1, 0, 100), colors)); // fill array with colors
    return arr;
}

/**
 * interleaves arrays
 * @param {Boolean} fill whther to fill arrays with null to match longest array's length
 * @param  {...any} arrays arrays to interleave
 * @returns {any[]} interleaved arrays
 */
export function interleaveArrays(fill, ...arrays) {
    if (fill) {
        let max = Math.max(...arrays.map(e => e.length)); // get max length of all arrays
        arrays = arrays.map(arr => [...arr, ...new Array(max - arr.length).fill(null)]); // fill all arrays with null so that they're all the same length
    }
    let result = [];
    while (arrays.filter(e => e.length > 0).length > 0) { // while at least one array still has at least one item in it
        arrays.forEach(arr => { // loop through each array
            if (arr.length > 0) result.push(arr.shift()); // remove first element from array and add it to result array
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
        let TS = _ => new Date().toLocaleString("sv", { timeZone: 'UTC' }) + "Z"; // timestamp function
        window.onerror = function (error, url, line) { // catches all console errors, includes those not made by console.error
            console.everything.push({ type: "exception", timeStamp: TS(), value: { error, url, line } });
            return false;
        }
        window.onunhandledrejection = function (e) { // catch some other things, idk
            console.everything.push({ type: "promiseRejection", timeStamp: TS(), value: e.reason });
        }
        function hookLogType(logType) {
            const original = console[logType].bind(console); // save orginal function
            console["original" + logType] = original;
            return function (...args) {
                let info = new Error();
                // original.apply(console, [{ info }]);
                console.everything.push({
                    type: logType,
                    timeStamp: TS(),
                    args: Array.from(args),
                    trace: info.stack.trim().split("\n").pop(),
                }); // add object to console.everything
                original.apply(console, args); // log message to console
            }
        }
        ['log', 'error', 'warn', 'debug'].forEach(logType => { // hook  each log type
            console[logType] = hookLogType(logType)
        });
        let states = new Map();
        console.saveState = function saveState(id = 0) {
            let everything = [...console.everything];
            states.set(id, everything);
        }
        console.restore = function restore(id = 0) {
            let everything = states.get(id) || [];
            console.everything = [...everything];
            console.clear();
            // let max = Math.max(...console.everything.map(e => e.trace.length));
            console.everything.forEach(function (log) {
                if (original = console["original" + log.type]) {
                    original.apply(console, [...log.args/* , log.trace.padStart(max + 10, " ") + ", ", log.timeStamp */]);
                } else {
                    console.originalerror.apply(console, [...log.args]);
                }
            });
        }
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
    let color = getComputedStyle(document.querySelector(":root")).getPropertyValue(varname); //  get css variable value
    if (color.match(/^#[a-zA-Z0-9]{3}$/g)) { // check if color is 3-digit hex
        color = "#" + color.substring(1).split("").map(e => e.padStart(e, 2)).join("") + append.join(""); // convert color  to 6-digit hex
    }
    return color + append.join(""); // append is mostly useless
}

/**
 * returns an object whose valueof result will always be synced with the return value of the function
 * @param {Function} callback function to call
 * @param  {...any} args arguments to pass to function
 * @example
 * let val = lockValue(function(){
 *     return Math.floor(Math.random() * 10);
 * });
 * console.log(+val);
 * console.log(+val);
 * console.log(+val);
 * console.log(+val);
 * // logs 4 random numbers
 */
export function lockValue(callback, ...args) {
    return class {
        constructor() { }
        static valueOf() {
            return callback(...args);
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
                case 4: a = true; // short rgba
                case 3: // short rgb
                    split = color.split(""); // get color channels
                    break;
                case 8: a = true; // long rgba
                case 6: // long rgb
                    split = color.match(/.{1,2}/g); // get color channels
                    break;
            }
            return `rgb${a ? "a" : ""}(${split.map((e, n) => parseInt(e.padStart(2, e), 16) / (n == 3 ? 255 : 1)).join(", ")})`; // convert base16 to base10, join with comma and put into rgba()
        }
    }

    function rgbToHex(rgb) {
        return "#" + rgb.replaceAll(/[^0-9\.]/g, " ").replaceAll("  ", " ").trim().split(" ").map((e, n) => parseInt(e * (n == 3 ? 255 : 1)).toString(16).padStart(2, e)).join("");
    }

    function getColor(rgb) {
        let [r, g, b] = rgb.replaceAll(/[^0-9 ]/g, "").split(" ");
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
    }

    let colorProps = ["backgroundColor", "color"]; // which properties to search for colors in

    function displayResults(array) {
        array.forEach(e => {
            console.groupCollapsed(`%c${rgbToHex(e.value)} (${(e.varName)})`, /*STYLE*/`
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
    if (min > max) { // make sure min is less than max
        [min, max] = [max, min];
    }
    return (val < min ? min : val > max ? max : val);
}

/**
 * @param {any | undefined} val 
 * @param {any} def 
 * @returns {any | undefined}
 */
export function getValueOrDefault(val, def) {
    if (val === undefined || val === null) return def;
    return val;
}

/**
 * puts the properties from source onto target
 * @param {Object} target 
 * @param {Object} source 
 */
export function extend(target, source) {
    Object.keys(source).forEach(key => {
        target[key] = source[key];
    });
    return target;
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

// initailize devtools formatters array if it doesn't exist
if (!Array.isArray(window.devtoolsFormatters)) {
    window.devtoolsFormatters = [];
}

let settingsFormatter = {
    label: "settings formatter",
    header: function (obj) {
        if (obj instanceof Settings) { // return header if object is a Settings object
            return ['div', { style: 'font-weight:bold;' }, `Settings: `, ["span", { style: "font-style:italic;" }, obj.config.name]];
        }
        return null;
    },
    hasBody: function (obj) {
        return obj instanceof Settings;
    },
    body: function (obj) {
        if (obj instanceof Settings) {
            return ["div", {}, ...obj.sections.map(section => {
                return [
                    "div",
                    ["object", {
                        object: section // embed section object
                    }]
                ]
            })];
        }
        return null;
    }
};
if (!window.devtoolsFormatters.includes(settingsFormatter)) { // only add one instance of the formatter
    window.devtoolsFormatters.push(settingsFormatter);
}
let Settings = window.Settings;
if (Settings === undefined || !(Settings.prototype instanceof EventTarget)) {
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
                if (section instanceof Section) {
                    section.settings_obj = this; // set parent object of each section
                }
            });
        }

        render() {
            // devlog("render settings");
            let div = createElement("div", { // main settings div
                classList: "settings"
            }).add(
                createElement("h2", { innerHTML: this.config.name })
            );
            div.add(...this.sections.map(s => s.render())); // render all subsections and add them to the settings div
            return div;
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
         * converts the settings object to a stringified JSON object cabable of being imported through the Settings.fromJson() method
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
                sec.options.forEach(e => delete e.input) // remove input element
            });
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
            this.addEventListener(type, callback);
        }

        /**
         * stops the specified callback from listening for the specified event\
         * wrapper function for removeEventListener
         * @param {String} type type of event
         * @param {Function} callback callback function
         */
        off(type, callback) {
            this.removeEventListener(type, callback);
        }

        /**
         * converts stringified json data into a settings object\
         * json data can be generated from the export method
         * @static
         * @param {String} jsontext stringified json data
         * @returns {Settings}
         */
        static fromJson(jsontext) {
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
            console.log("replacing", Object.assign({}, this), "with", Object.assign({}, settings));
            // replaces this settings object with another one by overriding sections array and config.
            // because this object was exported, it can't be assigned in other modules,
            // so a custom function had to be made
            if (!(settings instanceof Settings)) { // only override if provided object is a Setting object
                console.log("settings object is not an instance of the Settings class", settings);
                return;
            }
            this.config = settings.config; // override config
            this.sections = settings.sections; // override sections
        }
    }
}
export { Settings };

let sectionFormatter = {
    label: "section formatter",
    header: function (obj) {
        if (obj instanceof Section) { // return header if object is a Section object
            return ["div", { // main wrapper div
                style: "border:1px solid #000;border-radius:9px;padding-top:10px;background-color:#454d55;width:300px;color:white"
            }, ["div", { style: "padding:0 10px;display: block;font-size:1.5em;font-weight:bold;margin-block-start:.83em;margin-block-end:.83em" }, obj.config.name], // "h2"
                ...obj.options.map(option => { // each option
                    return [
                        "div", // "label"
                        { style: "border-top:1px solid #000;width:100%;display:flex;justify-content:space-between;padding:10px;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;user-select:none;" },
                        ["span", {}, option.config.name],
                        ["div", {}, ["span", { style: "float:right" }, (function () {
                            if (Array.isArray(option.config.values)) {
                                return ["object", {
                                    object: { // dropdown list of values
                                        __expandable: true,
                                        title: option.config.value,
                                        contents: [
                                            ...option.config.values.map(e => ["div", {}, e])
                                        ]
                                    }
                                }];
                            }
                            return option.config.value + "";
                        })()]]
                    ];
                })
            ];
        } else if (obj.__expandable) {
            return ["div", {}, obj.title || "custom object"];
        }
        return null;
    },
    hasBody: function (obj) {
        if (obj.__expandable) {
            return true;
        }
        return false;
    },
    body: function (obj) {
        if (obj.__expandable) {
            return ["div", {}, ...obj.contents]
        }
    }
};
if (!window.devtoolsFormatters.includes(sectionFormatter)) { // only add one instance of the formatter
    window.devtoolsFormatters.push(sectionFormatter);
}

let Section = window.Section;
if (Section === undefined || !(Section.prototype instanceof EventTarget)) {
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
                if (option instanceof Option) {
                    option.section_obj = this; // set parent object for each option
                }
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
            // devlog("render section");
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
export { Section };

let Option = window.Options;
if (Option === undefined || !(Option.prototype instanceof EventTarget)) {
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
            let previousVal = this.config.value;
            this.config.value = val;
            fetch("/Reports/Report/SaveSettings", { // fetch request to server to save user settings
                method: "POST",
                body: this.section_obj.settings_obj.export(),
                headers: {
                    "X-CSRF-TOKEN": Cookies.get("CSRF-TOKEN") // auth token
                }
            }).then(e => {
                e.text().then(t => {
                    if (t.includes("error")) { // settings could not save
                        console.log("error saving settings");
                        this.config.value = previousVal; // revert option change in config object
                        if (this.input.checked != undefined) { // revert option change in input element
                            this.input.checked = previousVal;
                        } else {
                            this.input = previousVal;
                        }
                    } else {
                        console.log("successfully saved settings");
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
            // devlog("render option");
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
                    classList: "slider", // pure css toggle switch
                    checked: option.config.value
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
            input.addEventListener("input", function () { // when setting is changed, dispatch change event on the options object
                if (input.checked != undefined) {
                    option.value = input.checked;
                } else {
                    option.value = input.value;
                }
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
export { Option };

export function consoleButton(obj, func, args = [], label = "button", width = 50, height = width) {
    return { __button: true, obj, func, args, label, width, height };
}

let buttonFormatter = { // button formatter
    header: function (obj) {
        if (obj.__button) {
            return ["div", { // the button itself
                style: `width:${obj.width}px;height:${obj.height}px;border:1px solid red;background-color:white;text-align:center;cursor:pointer;color:black;padding:5px;`
            }, ["span", {}, obj.label]];
        }
        return null;
    },
    hasBody: function (obj) {
        if (obj.__button) return true;
        return null;
    },
    body: function (obj) {
        if (obj.__button) { // call function when button is "clicked" (expanded)
            try { obj.obj[obj.func](...obj.args); } catch (e) { }
            return ["div", {}];
        }
        return null;
    }
}
if (!window.devtoolsFormatters.includes(buttonFormatter)) {
    window.devtoolsFormatters.push(buttonFormatter);
}

/**
 * generates a string template function or smth idk
 * @param {String[]} strings plain-text strings
 * @param  {...String} keys keys to interpolate
 * @returns {Function}
 * 
 * @example
 * const template = makeTemplate`I'm ${"name"}. I'm almost ${"age"} years old.`;
 * template({ name: "MDN", age: 30 }); // "I'm MDN. I'm almost 30 years old."
 */
export function makeTemplate(strings, ...keys) {
    return function (...values) {
        const dict = values[values.length - 1] || {};
        const result = [strings[0]];
        keys.forEach((key, i) => {
            const value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join("");
    };
}

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
    let result = obj;
    var type = {}.toString.call(obj).slice(8, -1);
    if (type == 'Set') return new Set([...obj].map(value => copyObject(value))); // convert list of values to array and copy each value
    if (type == 'Map') return new Map([...obj].map(kv => [copyObject(kv[0]), copyObject(kv[1])])); // convert map to array of key-value pairs and copy each pair
    if (type == 'Date') return new Date(obj.getTime()); // make new date from epoch time
    if (type == 'RegExp') return RegExp(obj.source, getRegExpFlags(obj)); // make new regexp from source pattern and flags
    if (type == 'Array' || type == 'Object') { // arrays are just objects whose keys are entirely numeric
        result = Array.isArray(obj) ? [] : {}; // make new array or object
        for (var key in obj) { // loop through each value or key in the object
            result[key] = copyObject(obj[key]); // copy and apply each value or key to the new object
        }
    }
    // any other data types that make it through are pass-by-value, so they don't need to be copied
    return result; // return copied object
}

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
 * converts an entire string to html entities
 * @param {String} str string to convert
 * @returns {String} converted string
 */
export function toHTMLEntities(str) {
    return [...str].split("").map(e => `&#${e.charCodeAt(0)};`).join("");
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

/**
 * stringifies and syntax highlights almost any javascript object and logs it to the console
 * @param {HTMLElement|String} element element or HTML string to log
 * @param {Boolean} raw whether to return the raw result or just console.log it
 * @returns {Object[]}
 */
export function logFormatted(object, options = {}) {
    let { embedObjects, raw, collapsed, maxDepth, label, extra_logs, enableCustomFormatters } = (function () {
        let defaults = {
            embedObjects: false, // embed the objects within the console message
            raw: false, // return the raw result without logging it to the console
            collapsed: false, // log the message inside a collapsed console group (slightly increases performance before initially logging the object). Will still lag when collapsed group is initially opened
            maxDepth: Infinity, // maximum depth to stringify
            label: "formatted log", // label for collapsed console group,
            extra_logs: [],
            enableCustomFormatters: false,
        }
        let opt = extend(defaults, options); // replace the default values with user-specified options
        return opt;
    })();
    if (enableCustomFormatters) {
        // use custom formatters to make the object interactive
        console.error("custom formatters not implemented yet");
        return logFormatted(object, { embedObjects, raw, collapsed, maxDepth, label, extra_logs, enableCustomFormatters: false });
    } else {
        let objects = []; // array that holds list of all objects
        let indentAmount = 1; // number of spaces to indent the stringified object by
        let depth = 0; // current depth
        let embedIndex = 0; // how many characters have been stringified
        let indexes = []; // array of indexes where objects should be embedded
        /**
         * alternative to JSON.stringify that auto-formats the result and supports functions
         * @param {any} obj object to stringify
         * @returns {String}
         */
        function stringify(obj) {
            if (depth > maxDepth) { // prevent stringifying objects deeper than the max depth
                let str = "'<max depth reached>'";
                embedIndex += str.length
                return str;
            }
            const type = typeof obj; // store type of object
            let pad = " ".repeat(indentAmount * 4); // calulate number of spaces to indent
            if (type == "number" || type == "boolean") { // primitives
                let str = "" + obj; // convert to string
                embedIndex += str.length; // add string length to total characters stringified
                return obj;
            } else if (type == "function") {
                objects.push(obj); // add to list of objects
                let beautified = js_beautify(obj.toString().replaceAll("\r", "")); // beautify function to make tabs equal
                let splitFunc = beautified.split("\n"); // split formatted function by lines
                while (splitFunc[1].length == 0) {
                    splitFunc.splice(1, 1);// remove first line of function body if it's blank (optional)
                }
                let padded = splitFunc.map((e, n) => (n > 0 ? pad.substring(4) + e : e + " ")); // indent all lines after first to match current indent amount and add space to end of first line
                embedIndex += padded[0].length; // length of first line
                indexes.push(embedIndex);
                embedIndex += (padded.slice(1).join("\n").length + 1); // length of all lines after first line + newline between 1st and 2nd line
                return padded.join("\n"); // rejoin function lines and return
            } else if (type == "string") {
                let quote;
                if (!obj.includes('"')) { // if there are no ", wrap with "
                    quote = '"';
                } else if (!obj.includes("'")) { // otherwise, if no ', wrap with '
                    quote = "'";
                } else if (!obj.includes("`")) {
                    quote = '`'; // otherwise, if no `, wrap with `
                } else {
                    quote = '"'; // otherwise, wrap with "
                }
                [
                    ["\n", "\\n"],
                    ["\r", "\\r"],
                    ["\t", "\\t"],
                    [quote, "\\" + quote], // only escape the quotes that are the same as what the string is wrapped with
                ].forEach(e => {
                    obj = obj.replaceAll(e[0], e[1]); // escape quotes and all escape characters
                });
                let str = `${quote}${obj}${quote}`; // wrap string with quotes
                embedIndex += str.length; // add to stringified character count
                return str;
            } else if (type == "object") {
                if (objects.includes(obj)) { // prevent recursion by checking objects that have already been stringified
                    let str = "<already stringified (recursion prevention)>"; // return plain string
                    embedIndex += str.length; // add to character count
                    indexes.push(embedIndex); // save index
                    return str;
                }
                objects.push(obj); // add to list of objects
                let arr = []; // make array that stores all of this object's properties
                indentAmount++; // increment indent amount
                depth++; // increment depth

                embedIndex += 2; // opening brace/bracket+space
                indexes.push(embedIndex); // embed object after opening brace/bracket
                embedIndex += (1 + // newline after opening brace/bracket
                    pad.length); // first line pad

                if (Array.isArray(obj)) { // object is an array
                    obj.forEach((item, index) => { // loop through array items
                        let str = stringify(item);
                        arr.push(str);
                        if (index < obj.length - 1) {
                            embedIndex += 2 + // comma+newline
                                pad.length; // next line pad
                        }
                    });
                    indentAmount--; // decrement indent amount
                    depth--; // decrement depth
                    embedIndex += (1 + // newline before closing bracket
                        (pad.length - 4) + // end pad
                        1); // closing bracket
                    return `[ \n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}]`;
                } else {
                    if (!obj) { // typeof null === "object"
                        embedIndex += 4;
                        return "null";
                    }
                    let entries = Object.entries(obj);
                    entries.forEach(function (kvp, index) {
                        let [key, value] = kvp;
                        embedIndex += key.length + // key length
                            2; // colon+space
                        let str = stringify(value); // convert value to string
                        str = `${key}: ${str}`; // create stringified kvp
                        arr.push(str); // add to array
                        if (index < entries.length - 1) { // only increment for comma/newlines between lines (1 less than the number of entries)
                            embedIndex += 2 + // comma+newline
                                pad.length; // next line pad
                        }
                    });
                    indentAmount--; // decrement indent amount
                    depth--; // decrement depth
                    let returnVal = `{ \n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}}`;
                    embedIndex += 1 + // newline before closing brace
                        (pad.length - 4) +  // end pad
                        1; // closing brace
                    return returnVal;
                }
            } else {
                let str = "" + obj; // convert to string
                embedIndex += str.length; // add string length to character count
                return str;
            }
        }

        let element = createElement("div", { innerHTML: Prism.highlight(stringify(object), Prism.languages.javascript).replaceAll("%", "%%") }); // syntax-highlight stringified code and put the result into a div

        const regex = /(?<!%)(%%)*%[co]/g; // regex for matching [co] with odd number of 5 before it
        const PRISM_CLASSES = [ // list of prism.js classes and their corresponding colors
            [["cdata", "comment", "doctype", "prolog"], "#6a9955"],
            [["constant", "property", "symbol", "tag"], "#4fc1ff"],
            [["number"], "#b5cea8"],
            [["attr-name", "builtin", "char", "inserted", "selector", "string"], "#ce9178"],
            [["entity", "url", "variable"], "#f4b73d"],
            [["atrule", "attr-value", "keyword", "boolean"], "#569cd6"],
            [["important", "regex"], "#ee9900"],
            [["deleted"], "#ff0000"],
            [["function"], "#dcdcaa"],
            [["parameter"], "#9cdcfe"],
            [["template-punctuation"], "#ce9178"],
            [["interpolation-punctuation"], "#ffff00"],// "#ff8800"],
            [["class-name"], "#4ec9b0"]
        ];

        function calcStyle(element) { // get calculated color of a text node based off of the classes it has
            if (!element.style) return; // if element isa text node, return
            let classList = [...element.classList]; // convert class list to array
            classList.forEach(clss => { // loop through element classes
                PRISM_CLASSES.forEach(pclass => { // check against each prism.js class
                    if (pclass[0].includes(clss)) element.style.color = pclass[1];
                });
            });
        }

        let logs = [];
        let styles = [];
        const flattened = flattenChildNodes(element); // get list of all nodes in element
        flattened.forEach(calcStyle); // manually set style.color for each element based off of its classes
        if (embedObjects) { // objects will be embedd into the console.log statement for better inspection
            let index = 0; // current character index
            let lastPercent = false; // whether the last character was a % (functions as an escape character)
            function count(node) { // count through each character of the node's textContent and inject a %o
                let text = ""; // processed text
                node.textContent.split("").forEach(function (char) {
                    if (char == "\r") return; // completely ignore carriage returns
                    if (index == indexes[0]) { // if current character count is where a %o needs to be injected
                        indexes.shift(); // remove the inject index
                        text += "%o"; // inject
                    }
                    if (char == "%" && !lastPercent) lastPercent = true; // next character should be escaped
                    else if (lastPercent) { // if this character should be escaped
                        lastPercent = false; // character has been escaped
                        index++; // increment index
                    } else index++;
                    text += char; // add character to processed text
                });
                node.textContent = text; // set node content to processed text
            }
            flattened.forEach(e => { // loop through all nodes and count through the text nodes
                if (e.nodeName.includes("text")) count(e);
            });
        }

        flattened.forEach(e => { // convert text nodes to console log with interleaved formatting
            if (e.nodeName != "#text") return;
            logs.push(`%c${e.textContent}`); // push formatting tag and textContent
            let color = ""; // set color to default
            if (e.parentNode.style.color) color = `color:${e.parentNode.style.color};`; // if parent node has color, set it
            styles.push(color); // add style to list
        });
        logs = logs.join(""); // join all text nodes into one message

        function regexSplit(string) { // splits a string along REGEX and returns both the matches and split string
            let str = [], reg = [], match, lastindex = 0, index;
            while (match = regex.exec(string)) { // while string has match to the regex
                index = match.index;
                let kind = match[0], mod = 0; // kind is the string that was matched
                if (kind.length > 2) { // if match  has more than one %
                    str[str.length - 1] += kind.substring(0, kind.length - 2); // add extra % to previous split string
                    mod = kind.length - 2; // offset index by amount of extra %
                    kind = kind.substring(kind.length - 2);
                }
                str.push(string.substring(((lastindex + 2) > index ? index : (lastindex + 2)), index)); // push string from (end of last match to beginning of this match) to list
                lastindex = index + mod; // offset index
                reg.push(kind); // push %[oc] to matches list
            }
            str.push(string.substring(lastindex + 2)); // add final chunk of string to list of splits
            return { split: str, matches: reg, };
        }

        let { matches, split } = regexSplit(logs), final = [], finalStyles = [];
        while (matches.length > 0) {
            let type = matches.shift(); // get %[oc] from list
            final.push(split.shift() || ""); // add first split string to list
            final.push(type); // push %[oc] to list
            if (type == "%o") finalStyles.push(objects.shift() || ""); // if %[oc] is %o, push object
            else finalStyles.push(styles.shift() || ""); // else, push style
        }
        while (split.length > 0) final.push(split.shift()); // push all remaining strings
        while (embedObjects && objects.length > 0) finalStyles.push(objects.shift()); // push all remaining objects
        while (styles.length > 0) finalStyles.push(styles.shift()); // push all remaining styles
        function checkExtraLogs() {
            if (extra_logs.length > 0) {
                extra_logs.forEach(e => console.log(e));
            }
        }
        final = final.join(""); // join array into one message
        if (raw) return { logs: final, styles: finalStyles, html: element.outerHTML } // return raw results without logging to console
        else {
            if (collapsed) { // if console log should be inside collapsed console group
                console.groupCollapsed(label); // create collapsed group
                checkExtraLogs(); // log any extra messages
                console.log(final, ...finalStyles); // log formatted message
                console.groupEnd(); // end group
            } else console.log(final, ...finalStyles); // log formatted message
        }
    }
}

window.logFormatted = logFormatted; // make function globally available

/**
 * stringifies an object
 * @param {any} obj the object to  stringify
 * @returns {string} the stringified object
 */
export function stringify(obj) {
    let objects = []; // array that holds list of all objects
    let indentAmount = 1; // number of spaces to indent the stringified object by (don't change this)
    let indentWidth = 4; // width of each indent. change this to change indent width
    let depth = 0; // current depth
    let maxDepth = 100;

    function internal_stringify(obj) {
        if (depth > maxDepth) { // prevent stringifying objects deeper than the max depth
            let str = "'<max depth reached>'";
            return str;
        }
        const type = typeof obj; // store type of object
        let pad = " ".repeat(indentAmount * indentWidth); // calulate number of spaces to indent
        if (type == "number" || type == "boolean") { // primitives
            return "" + obj;
        } else if (type == "function") {
            return obj.toString().replaceAll("\r", "").trim();
        } else if (type == "string") {
            let quote;
            if (!obj.includes('"')) { // if there are no ", wrap with "
                quote = '"';
            } else if (!obj.includes("'")) { // otherwise, if no ', wrap with '
                quote = "'";
            } else if (!obj.includes("`")) { // otherwise, if no `, wrap with `
                quote = '`';
            } else { // otherwise, wrap with "
                quote = '"';
            }
            [
                ["\n", "\\n"],
                ["\r", "\\r"],
                ["\t", "\\t"],
                [quote, "\\" + quote], // only escape the quotes that are the same as what the string is wrapped with
            ].forEach(e => {
                obj = obj.replaceAll(e[0], e[1]); // escape quotes and all escape characters
            });
            let str = `${quote}${obj}${quote}`; // wrap string with quotes
            return str;
        } else if (type == "object") {
            if (!obj) { // typeof null === "object"
                return "null";
            }
            if (objects.includes(obj)) { // prevent recursion by checking objects that have already been stringified
                let str = "<already stringified (recursion prevention)>"; // return plain string
                return str;
            }
            objects.push(obj); // add to list of objects
            let arr = []; // make array that stores all of this object's properties
            indentAmount++; // increment indent amount
            depth++; // increment depth

            if (Array.isArray(obj)) { // object is an array
                obj.forEach((item, index) => { // loop through array items
                    let str = internal_stringify(item);
                    arr.push(str);
                });
                indentAmount--; // decrement indent amount
                depth--; // decrement depth
                return `[ \n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}]`;
            } else {
                let entries = Object.entries(obj);
                entries.forEach(function (kvp, index) {
                    let [key, value] = kvp;
                    let str = internal_stringify(value); // convert value to string
                    str = `${key}: ${str}`; // create stringified kvp
                    arr.push(str); // add to array
                });
                indentAmount--; // decrement indent amount
                depth--; // decrement depth
                return `{\n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}}`;
            }
        } else {
            return "" + obj; // just convert to string and return
        }
    }
    return internal_stringify(obj);
}

// JSF*ck
// library that converts javascript to code that only uses the following characters: []()!+

(function () {
    const MIN = 32, MAX = 126;
    const SIMPLE = { false: '![]', true: '!![]', undefined: '[][[]]', NaN: '+[![]]', Infinity: '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])'/* +"1e1000" */ };
    const CONSTRUCTORS = { Array: '[]', Number: '(+[])', String: '([]+[])', Boolean: '(![])', Function: '[]["flat"]', RegExp: 'Function("return/"+false+"/")()', Object: '[]["entries"]()' };
    const MAPPING = {
        'a': '(false+"")[1]',
        'b': '([]["entries"]()+"")[2]',
        'c': '([]["flat"]+"")[3]',
        'd': '(undefined+"")[2]',
        'e': '(true+"")[3]',
        'f': '(false+"")[0]',
        'g': '(false+[0]+String)[20]',
        'h': '(+(101))["to"+String["name"]](21)[1]',
        'i': '([false]+undefined)[10]',
        'j': '([]["entries"]()+"")[3]',
        'k': '(+(20))["to"+String["name"]](21)',
        'l': '(false+"")[2]',
        'm': '(Number+"")[11]',
        'n': '(undefined+"")[1]',
        'o': '(true+[]["flat"])[10]',
        'p': '(+(211))["to"+String["name"]](31)[1]',
        'q': '("")["fontcolor"]([0]+false+")[20]',
        'r': '(true+"")[1]',
        's': '(false+"")[3]',
        't': '(true+"")[0]',
        'u': '(undefined+"")[0]',
        'v': '(+(31))["to"+String["name"]](32)',
        'w': '(+(32))["to"+String["name"]](33)',
        'x': '(+(101))["to"+String["name"]](34)[1]',
        'y': '(NaN+[Infinity])[10]',
        'z': '(+(35))["to"+String["name"]](36)',
        'A': '(NaN+[]["entries"]())[11]',
        'B': '(+[]+Boolean)[10]',
        'C': 'Function("return escape")()(("")["italics"]())[2]',
        'D': 'Function("return escape")()([]["flat"])["slice"]("-1")',
        'E': '(RegExp+"")[12]',
        'F': '(+[]+Function)[10]',
        'G': '(false+Function("return Date")()())[30]',
        'H': null,
        'I': '(Infinity+"")[0]',
        'J': null,
        'K': null,
        'L': null,
        'M': '(true+Function("return Date")()())[30]',
        'N': '(NaN+"")[0]',
        'O': '(+[]+Object)[10]',
        'P': null,
        'Q': null,
        'R': '(+[]+RegExp)[10]',
        'S': '(+[]+String)[10]',
        'T': '(NaN+Function("return Date")()())[30]',
        'U': '(NaN+Object()["to"+String["name"]]["call"]())[11]',
        'V': null,
        'W': null,
        'X': null,
        'Y': null,
        'Z': null,
        ' ': '(NaN+[]["flat"])[11]',
        '!': null,
        '"': '("")["fontcolor"]()[12]',
        '#': null,
        '$': null,
        '%': 'Function("return escape")()([]["flat"])[21]',
        '&': '("")["fontcolor"](")[13]',
        '\'': null,
        '(': '([]["flat"]+"")[13]',
        ')': '([0]+false+[]["flat"])[20]',
        '*': null,
        '+': '(+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]])+[])[2]',
        ',': '[[]]["concat"]([[]])+""',
        '-': '(+(.+[0000001])+"")[2]',
        '.': '(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]',
        '/': '(false+[0])["italics"]()[10]',
        ':': '(RegExp()+"")[3]',
        ';': '("")["fontcolor"](NaN+")[21]',
        '<': '("")["italics"]()[0]',
        '=': '("")["fontcolor"]()[11]',
        '>': '("")["italics"]()[2]',
        '?': '(RegExp()+"")[2]',
        '@': null,
        '[': '([]["entries"]()+"")[0]',
        '\\': '(RegExp("/")+"")[1]',
        ']': '([]["entries"]()+"")[22]',
        '^': null,
        '_': null,
        '`': null,
        '{': '(true+[]["flat"])[20]',
        '|': null,
        '}': '([]["flat"]+"")["slice"]("-1")',
        '~': null
    };
    const GLOBAL = 'Function("return this")()';
    function fillMissingDigits() {
        let output;
        for (let number = 0; number < 10; number++) {
            output = "+[]";
            if (number > 0) output = "+!" + output;
            for (let i = 1; i < number; i++) output = "+!+[]" + output;
            if (number > 1) output = output.substring(1);
            MAPPING[number] = "[" + output + "]";
        }
    }
    function replaceMap() {
        let character = "", value, i, key;
        let replace = (pattern, replacement) => value = value.replace(new RegExp(pattern, "gi"), replacement);
        let digitReplacer = (_, x) => MAPPING[x];
        function numberReplacer(_, y) {
            let values = y.split("");
            let head = +(values.shift());
            let output = "+[]";
            if (head > 0) output = "+!" + output;
            for (i = 1; i < head; i++) output = "+!+[]" + output;
            if (head > 1) output = output.substring(1);
            return [output].concat(values).join("+").replace(/(\d)/g, digitReplacer);
        }

        for (i = MIN; i <= MAX; i++) {
            character = String.fromCharCode(i);
            value = MAPPING[character];
            if (!value) continue;
            for (key in CONSTRUCTORS) replace("\\b" + key, CONSTRUCTORS[key] + '["constructor"]');
            for (key in SIMPLE) replace(key, SIMPLE[key]);
            replace('(\\d\\d+)', numberReplacer);
            replace('\\((\\d)\\)', digitReplacer);
            replace('\\[(\\d)\\]', digitReplacer);
            replace("GLOBAL", GLOBAL);
            replace('\\+""', "+[]");
            replace('""', "[]+[]");
            MAPPING[character] = value;
        }
    }
    function replaceStrings() {
        let regEx = /[^\[\]\(\)\!\+]{1}/g, all, value, missing, count = MAX - MIN;
        function findMissing() {
            let all, value, done = false;
            missing = {};
            for (all in MAPPING) {
                value = MAPPING[all];
                if (value && value.match(regEx)) {
                    missing[all] = value;
                    done = true;
                }
            }
            return done;
        }
        let mappingReplacer = (a, b) => b.split("").join("+");
        let valueReplacer = c => missing[c] ? c : MAPPING[c];
        for (all in MAPPING) if (MAPPING[all]) MAPPING[all] = MAPPING[all].replace(/\"([^\"]+)\"/gi, mappingReplacer);
        while (findMissing()) {
            for (all in missing) {
                value = MAPPING[all];
                value = value.replace(regEx, valueReplacer);
                MAPPING[all] = value;
                missing[all] = value;
            }
            if (count-- === 0) console.error("Could not compile the following chars:", missing);
        }
    }
    function escapeSequence(c) {
        let cc = c.charCodeAt(0);
        if (cc < 256) return '\\' + cc.toString(8);
        else {
            let cc16 = cc.toString(16);
            return '\\u' + ('0000' + cc16).substring(cc16.length);
        }
    }
    let escapeSequenceForReplace = c => escapeSequence(c).replace('\\', 't');
    function encode(input, wrapWithEval, runInParentScope, unmappped = '', output = [], r = "") {
        if (!input) return "";
        for (let k in MAPPING) if (MAPPING[k]) unmappped += k;
        unmappped = new RegExp('[^' + unmappped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']', 'g');
        let unmappedCharactersCount = (input.match(unmappped) || []).length;
        if (unmappedCharactersCount > 1) input = input.replace(/[^0123456789.adefilnrsuN]/g, escapeSequenceForReplace);
        else if (unmappedCharactersCount > 0) input = input.replace(/["\\]/g, escapeSequence).replace(unmappped, escapeSequence);
        for (let i in SIMPLE) r += i + "|";
        r += ".";
        input.replace(new RegExp(r, 'g'), function (c) {
            let replacement = SIMPLE[c];
            if (replacement) output.push("(" + replacement + "+[])");
            else {
                replacement = MAPPING[c];
                if (replacement) output.push(replacement);
                else throw new Error('Found unmapped character: ' + c);
            }
        });
        output = output.join("+");
        if (/^\d$/.test(input)) output += "+[]";
        if (unmappedCharactersCount > 1) output = `(${output})[${encode("split")}](${encode("t")})[${encode("join")}](${encode("\\")})`;
        if (unmappedCharactersCount > 0) output = `[][${encode("flat")}][${encode("constructor")}](${encode("return\"")}+${output}+${encode("\"")})()`;
        if (wrapWithEval) {
            if (runInParentScope) output = `[][${encode("flat")}][${encode("constructor")}](${encode("return eval")})()(${output})`;
            else output = `[][${encode("flat")}][${encode("constructor")}](${output})()`;
        }
        return output;
    }
    fillMissingDigits();
    replaceMap();
    replaceStrings();
    window.JSFuck = { encode };
})();

/**
 * diffs the two strings
 * @param {String|String[]} seq1 version 1 of file
 * @param {String|String[]} seq2 version 2 of file
 * @returns {Object[]}
 */
function meyerDiff(seq1, seq2) {
    var N = seq1.length, M = seq2.length, MAX = N + M, furthestReaching = [], D, k, x, y, step, src = [], target = [], stepMap = [], dist = MAX, a;
    for (; dist--;) {
        stepMap[dist] = [];
    }
    furthestReaching[MAX + 1] = 0;
    for (D = 0; D <= MAX && dist === -1; D++) {
        for (k = -D, x, y, step; k <= D && dist === -1; k += 2) {
            if (k === -D || (k !== D && furthestReaching[k - 1 + MAX] < furthestReaching[k + 1 + MAX])) {
                x = furthestReaching[k + 1 + MAX];
                step = 3;
            } else {
                x = furthestReaching[k - 1 + MAX] + 1;
                step = 2;
            }
            y = x - k;
            stepMap[x][y] = step;
            while (x < N && y < M && seq1[x] === seq2[y]) {
                x++;
                y++;
                stepMap[x][y] = 0;
            }
            furthestReaching[k + MAX] = x;
            if (x >= N && y >= M) {
                dist = D;
            }
        }
    }
    for (; N || M;) {
        a = stepMap[N][M];
        src.unshift(a > 2 ? -1 : seq1[N - 1]);
        target.unshift(a == 2 ? -1 : seq2[M - 1]);
        a < 3 && N--; // this functions like a ternary operator with no false case
        a != 2 && M--; // if a==2, logic short-circuits and does not continue to second half
        /* ternary equivalent
        a < 3 ? N-- : 0;
        a != 2 ? M-- : 0;
        */
    }
    return [src, target]
}

/**
 * logs and returns an object
 * @param {any} arg
 * @returns {typeof arg}
 */
export function logAndReturn(arg) {
    console.log(arg);
    return arg;
}

/**
 * a set of utility functions to convert times to milliseconds
 */
export let timeConversions = (function () {
    let seconds = t => t * 1000;
    let minutes = t => t * seconds(60);
    let hours = t => t * minutes(60);
    let days = t => t * hours(24);
    let weeks = t => t * days(7);
    let years = t => t * days(365);
    return { seconds, minutes, hours, days, weeks, years };
})();

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

export function rectangle(num) {
    let height = Math.ceil(Math.sqrt(num));
    let width = height;
    while (height * width - width > num) {
        height--;
    }
    let arr = new Array(height).fill(0).map(e => new Array(width));
    return arr;
}

export function reshape(arr, length, width) {
    arr = [...arr]; // clone array
    let result = [];
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < length; y++) {
            if (result[x] == undefined) {
                result[x] = [];
            }
            result[x].push(arr.shift());  // change to pop to rotate array by 180°
        }
    }
    return result;
}

/**
 * checks if a functon is asynchronous
 * @param {Function} func the function to check
 * @returns {Boolean}
 */
export function isAsync(func) {
    const AsyncFunction = (async () => { }).constructor;
    return func instanceof AsyncFunction;
}


/**
 * Adds polyfills for missing browser features.
 */
const polyfills = (function () {
    if (!Element.prototype.computedStyleMap && window.getComputedStyle != undefined) {
        Element.prototype.computedStyleMap = function () {
            return window.getComputedStyle(this);
        }
    }
})();

/**
 * defines some custom elements
 */
export const CUSTOM_ELEMENTS = (function () {
    function slider() { // input toggle slider
        customElements.define("input-slider", class extends HTMLElement {
            static observedAttributes = ["checked"];
            #checked = this.getAttribute("checked") == "true";
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
                const CSS = /*css*/`
                    :host {
                        --scale: 1;
                        --duration: 0.25s;
    
                        --outerline-on: #0f0;
                        --outerline-off: #f00;
    
                        --innerline-on: #0f0;
                        --innerline-off: #f00;
    
                        --inner-shade-on: #0f0;
                        --outer-shade-on: #fff;
    
                        --inner-shade-off: #f00;
                        --outer-shade-off: #fff;
    
                        --show-text: 1;
                        --off-text: "OFF";
                        --on-text: "ON";
    
                        display: inline-block;
                        user-select: none;
                    }
                    
                    div.slider {
                        margin: 0px;
                        position: relative;
                        width: calc(48px * var(--scale));
                        height: calc(28px * var(--scale));
                        display: block;
                        border: calc(2px * var(--scale)) solid var(--outerline-off);
                        box-sizing: border-box;
                        border-radius: calc(14px * var(--scale));
                        transition-duration: var(--duration);
                        background-color: var(--outer-shade-off);
                        transition-property: background-color, border-color;
                        overflow: hidden;
                    }
                    
                    .slider div.dot {
                        position: absolute;
                        /* box-sizing: border-box; */
                        border-radius: calc(10px * var(--scale));
                        width: calc(16px * var(--scale));
                        height: calc(16px * var(--scale));
                        top: calc(2px * var(--scale));
                        left: calc(2px * var(--scale));
                        border: calc(2px * var(--scale)) solid var(--innerline-off);
                        background-color: var(--inner-shade-off);
                        transition-property: left, right, background-color, border-color;
                        transition-duration: var(--duration);
                    }
                    
                    .slider[checked="true"] {
                        border-color: var(--outerline-on);
                        background-color: var(--outer-shade-on);
                    }
    
                    .slider[checked="true"] div.dot {
                        left: calc(22px * var(--scale));
                        border-color: var(--innerline-on);
                        background-color: var(--inner-shade-on);
                    }
    
                    .slider div.off-text,
                    .slider div.on-text{
                        display: flex;
                        height: 100%;
                        align-items: center;
                        position: absolute;
                        font-size: calc(10px * var(--scale) * var(--show-text) / var(--show-text));
                    }
    
                    .slider div.off-text span::before {
                        display: block;
                        content: var(--off-text);
                    }
    
                    .slider div.on-text span::before {
                        display: block;
                        content: var(--on-text);
                    }
    
                    .slider div.on-text {
                        /* left: calc(2px * var(--scale)); */
                        right: calc(4px * var(--scale) + 100%);
                    }
    
                    .slider div.off-text {
                        /* right: calc(2px * var(--scale)); */
                        left: calc(4px * var(--scale) + 100%);
                    }
                `;
                this.shadowRoot.innerHTML = /*html*/`
                    <style>${CSS}</style>
                    <div class="slider" checked="${this.#checked}">
                        <div class="dot">
                            <div class="on-text"><span></span></div>
                            <div class="off-text"><span></span></div>
                        </div>
                    </div>
                `;
                this.addEventListener("click", () => {
                    let newChecked = !(this.shadowRoot.querySelector(".slider").getAttribute("checked") == "true");
                    this.shadowRoot.querySelector(".slider").setAttribute("checked", newChecked);
                    this.checked = newChecked;
                });
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (name == "checked") {
                    this.#checked = newValue.toString() == "true" && !!newValue;
                }
            }
            set checked(value) {
                this.dispatchEvent(new Event("change"));
                this.setAttribute("checked", value);
                this.#checked = !!value;
            }
            get checked() {
                return this.#checked;
            }
        });
    }
    function all() {
        slider();
    }
    return { all, slider };
})();

export class jst_CSSRule {
    static checkValidSelector(selector) {
        selector = selector.trim();
        if (typeof selector != "string") return false;
        if (selector.length == 0) return false;
        try {
            let sheet = new CSSStyleSheet();
            sheet.insertRule(selector + "{}");
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * @param {string} selector
     * @param {Object} styles
     */
    constructor(selector, styles) {
        let validStyles = Object.keys(CSS2Properties.prototype);
        let givenstyles = Object.entries(styles);
        let valid = givenstyles.every(e => validStyles.includes(e[0]));
        if (!valid) {
            console.error("Invalid style properties:", givenstyles.filter(e => !validStyles.includes(e[0])).map(e => e[0]).join(", "));
            return null;
        }
        Object.entries(styles).forEach(e => {
            let newName = e[0].replaceAll(/[A-Z]/g, e => `-${e.toLowerCase()}`);
            if (newName != e[0]) {
                if (!validStyles.includes(newName)) {
                    return;
                }
                styles[newName] = e[1];
                delete styles[e[0]];
            }
        });
        this.properties = styles;
        this.selector = selector;
    }

    /** @param {boolean} minify */
    compile(minify) {
        let join = "\n    ";
        let props = makeTemplate`${0}: ${1};`;
        let whole = makeTemplate`${"selector"} {\n    ${"properties"}\n}`;
        if (minify) {
            join = ";";
            props = makeTemplate`${0}:${1}`;
            whole = makeTemplate`${"selector"}{${"properties"}}`;
        }
        let properties = Object.entries(this.properties).map(e => props(...e)).join(join);
        return whole({ selector: this.selector, properties: properties });
    }
}

export class jst_CSSStyleSheet {
    constructor(rules = []) {
        this.rules = rules.filter(e => e instanceof jst_CSSRule);
    }

    addRule(rule) {
        if (!(rule instanceof jst_CSSRule)) {
            return;
        }
        this.rules.push(rule);
    }

    compile(minify) {
        if (minify) {
            return this.rules.map(e => e.compile(true)).join("");
        }
        return this.rules.map(e => e.compile()).join("\n");
    }
}

export const CSSColors = {
    aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff",
    beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff",
    blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00",
    chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c",
    cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9",
    darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f",
    darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1",
    darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969",
    dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080",
    green: "#008000", greenyellow: "#adff2f", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4",
    indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa",
    lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080",
    lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90",
    lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa",
    lightslategray: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32",
    linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd",
    mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970",
    mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080",
    oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500",
    orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093",
    papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6",
    purple: "#800080", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513",
    salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d",
    silver: "#c0c0c0", silver: "#C0C0C0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090",
    slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080",
    thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff",
    whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32"
};

export class Color {
    static hexRegex = /^#([0-9a-f]{3}){1,2}$/i;
    static hexaRegex = /^#([0-9a-f]{4}){1,2}$/i;
    static rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    static rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d?\.?\d+)\)$/;
    static hslRegex = /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/;
    static hslaRegex = /^hsla\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%,\s*(\d?\.?\d+)\)$/;
    static hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = Color.hueToRgb(p, q, h + 1 / 3);
            g = Color.hueToRgb(p, q, h);
            b = Color.hueToRgb(p, q, h - 1 / 3);
        }
        return [Math.min(Math.floor(r * 256), 255), Math.min(Math.floor(g * 256), 255), Math.min(Math.floor(b * 256), 255)];
    }
    static rgbToHsl(r, g, b) {
        (r /= 255), (g /= 255), (b /= 255);
        const vmax = Math.max(r, g, b), vmin = Math.min(r, g, b);
        let h, s, l = (vmax + vmin) / 2;
        if (vmax === vmin) {
            return [0, 0, l]; // achromatic
        }
        const d = vmax - vmin;
        s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
        if (vmax === r) h = (g - b) / d + (g < b ? 6 : 0);
        if (vmax === g) h = (b - r) / d + 2;
        if (vmax === b) h = (r - g) / d + 4;
        h /= 6;
        return [h, s, l];
    }
    static hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    constructor(color) {
        if (color.match(Color.hexRegex)) {
            this.a = 1;
            if (color.length == 4) {
                this.r = parseInt(color[1] + color[1], 16);
                this.g = parseInt(color[2] + color[2], 16);
                this.b = parseInt(color[3] + color[3], 16);
            } else {
                this.r = parseInt(color[1] + color[2], 16);
                this.g = parseInt(color[3] + color[4], 16);
                this.b = parseInt(color[5] + color[6], 16);
            }
        } else if (color.match(Color.hexaRegex)) {
            if (color.length == 5) {
                this.r = parseInt(color[1] + color[1], 16);
                this.g = parseInt(color[2] + color[2], 16);
                this.b = parseInt(color[3] + color[3], 16);
                this.a = parseInt(color[4] + color[4], 16);
            } else {
                this.r = parseInt(color[1] + color[2], 16);
                this.g = parseInt(color[3] + color[4], 16);
                this.b = parseInt(color[5] + color[6], 16);
                this.a = parseInt(color[7] + color[8], 16);
            }
        } else if (color.match(Color.rgbRegex)) {
            let match = color.match(Color.rgbRegex);
            console.log("rgb match", match);
            this.r = parseInt(match[1]);
            this.g = parseInt(match[2]);
            this.b = parseInt(match[3]);
            this.a = 1;
        } else if (color.match(Color.rgbaRegex)) {
            let match = color.match(Color.rgbaRegex);
            this.r = parseInt(match[1]);
            this.g = parseInt(match[2]);
            this.b = parseInt(match[3]);
            this.a = parseFloat(match[4]);
        } else if (color.match(Color.hslRegex)) {
            let match = color.match(Color.hslRegex);
            let h = parseInt(match[1]);
            let s = parseInt(match[2]);
            let l = parseInt(match[3]);
            let [r, g, b] = Color.hslToRgb(h, s, l);
            extend(this, { r, g, b });
            this.a = 1;
        } else if (color.match(Color.hslaRegex)) {
            let match = color.match(Color.hslaRegex);
            let h = parseInt(match[1]);
            let s = parseInt(match[2]);
            let l = parseInt(match[3]);
            let [r, g, b] = Color.hslToRgb(h, s, l);
            extend(this, { r, g, b });
            this.a = parseFloat(match[4]);
        } else if (CSSColors[color]) {
            let hex = CSSColors[color];
            this.r = parseInt(hex.substring(1, 3), 16);
            this.g = parseInt(hex.substring(3, 5), 16);
            this.b = parseInt(hex.substring(5, 7), 16);
            this.a = 1;
        } else {
            console.error("Invalid color:", color);
        }
    }
    toHex() { return `#${this.r.toString(16).padStart(2, "0")}${this.g.toString(16).padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}`; }
    toHexa() { return `#${this.r.toString(16).padStart(2, "0")}${this.g.toString(16).padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}${this.a.toString(16).padStart(2, "0")}`; }
    toRGB() { return `rgb(${this.r}, ${this.g}, ${this.b})`; }
    toRGBA() { return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`; }
    toHSL() {
        let [h, s, l] = Color.rgbToHsl(this.r, this.g, this.b);
        return `hsl(${h}, ${s}%, ${l}%)`;
    }
    toHSLA() {
        let [h, s, l] = Color.rgbToHsl(this.r, this.g, this.b);
        return `hsla(${h}, ${s}%, ${l}%, ${this.a})`;
    }
}

export const BULK_OPERATIONS = (function () {
    class Numbers {
        constructor(...values) {
            this.values = values;
        }
    }
    let ops = [
        ["divide", (a, b) => a / b],
        ["multiply", (a, b) => a * b],
        ["add", (a, b) => a + b],
        ["subtract", (a, b) => a - b],
        ["pow", (a, b) => a ** b],
        ["mod", (a, b) => a % b],
    ];
    for (let [name, func] of ops) {
        Numbers.prototype[name] = function (val) {
            return new Numbers(...this.values.map(e => func(e, val)));
        };
    }
    class Booleans {
        constructor(...values) {
            this.values = values;
        }
        flip() {
            return new Booleans(...this.bools.map(e => !e));
        }
    }
    function makeNewClass(clss) {
        let newClass = class { constructor(...values) { this.values = values; } }
        let methods = Object.getOwnPropertyNames(clss.prototype).sort();
        methods.forEach(m => {
            newClass.prototype[m] = function (...args) {
                return new newClass(...this.values.map(e => e[m].apply(e, args)));
            }
        });
        return newClass;
    }
    function getTypes(...args) {
        let types = args.map(e => typeof e);
        let unique = [...new Set(types)];
        if (unique.length == 1) {
            return unique[0];
        }
        return "mixed";
    }
    const Strings = makeNewClass(String);
    const Functions = makeNewClass(Function);
    const Objects = makeNewClass(Object);
    function autodetectClass(type) {
        switch (type) {
            case "number": return Numbers;
            case "string": return Strings;
            case "boolean": return Booleans;
            case "object": return Objects;
            case "function": return Functions;
            default: return null;
        }
    }
    return {
        Numbers,
        Strings,
        Booleans,
        Objects,
        Functions,
        autodetect: function (...args) {
            let type = getTypes(...args);
            return autodetectClass(type);
        }
    };
})();
