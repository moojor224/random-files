/**
 * 
 * @param {String} query css selector to wait for
 * @param {Function} callback callback function to run when the element is found
 * @param {Boolean} stopAfterFound whether to stop looking after the element is found
 * @param {Element} [element=document] parent element to look within -  defaults to document
 */
export function waitForKeyElements(query, callback, stopAfterFound, element) {
    currentlyWorking = true;
    var o, r;

    (o = void 0 === element ? $(query) : $(element).contents().find(query)) &&
        o.length > 0
        ? ((r = !0),
            o.each(function () {
                var e = $(this);
                e.data("alreadyFound") ||
                    false ||
                    (callback(e) ? (r = false) : e.data("alreadyFound", true));
            }))
        : (r = false);
    var l = waitForKeyElements.controlObj || {},
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



/**
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
// although this may work most of the time, it may not always work
export function createElement(tag = "span", data = {}) {
    if (typeof tag === "string" && tag.match(/[^a-zA-Z0-9]/g)) { // if tag is a string and string includes non alphanumeric characters, parse as emmet string
        let div = createElement("div"); // create temporary parent node
        if (expandAbbreviation && typeof expandAbbreviation == "function") { // if expandAbbreviation is defined
            div.innerHTML = expandAbbreviation(tag); // expand abbreviation
        } else if (emmet && emmet.expandAbbreviation && typeof emmet.expandAbbreviation == "function") { // if emmet.expandAbbreviation is defined
            div.innerHTML = emmet.expandAbbreviation(tag); // expand abbreviation
        }
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

/**
 * @external Element
 */
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
 * //result:
 * /*
 * <table>
 *     <tr>
 *         <td>col 1</td>
 *         <td>col 2</td>
 *         <td>col 3</td>
 *     </tr>
 * </table
 */
function add(...args) {
    args.forEach(elem => {
        this.append(elem);
    });
    return this;
};

window.Element.prototype.add = add;
// loop through all HTML...Element prototypes and add the add function
Object.getOwnPropertyNames(window).filter(e => e.startsWith("HTML") && e.endsWith("Element")).forEach(e => {
    if (window[e].prototype.add !== add) {
        window[e].prototype.add = add
    }
});

// window.HTMLSelectElement.prototype.add = add;

/**
 * Description of the function
 * @name Element.prototype.error
 * @kind function
 * @param {String} text error message
 */

/**
 * appends an &lt;error> element to {this}
 * @param {String} text error message
 */
window.Element.prototype.error = function (text = "!") {
    this.querySelector("error")?.remove(); // remove error element if it exists
    this.add(createElement("error", { innerHTML: text })); // add error element
}

/**
 * clears the error message from {this}
 */
window.Element.prototype.clearError = function () {
    this.querySelector("error")?.remove();
}

/**
 * appends a &lt;warning> element to {this}
 * @param {String} text warning message
 */
window.Element.prototype.warn = function (text = "!") {
    this.querySelector("warn")?.remove(); // remove warn element if it exists
    this.add(createElement("warn", { innerHTML: text })); // add warn element
}

/**
 * clears the warning message from {this}
 */
window.Element.prototype.clearWarn = function (text = "!") {
    this.querySelector("warn")?.remove();
}

window.Element.prototype.clear = function () {
    // while(this.firstChild){
    //     this.firstChild.remove();
    // }
    let arr = flattenChildNodes(this);
    if (arr.includes(this)) {
        arr.splice(arr.indexOf(this), 1);
    }
    while (arr.length > 0) { // remove individual elements in order to purge event listeners
        let el = arr.pop();
        if (el.remove) {
            el.remove();
        }
    }
    this.innerHTML = ""; // clear out any remaining nodes that didn't get removed, like text nodes
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
    var c = document.createElement("canvas"); // create dummy canvas
    c.width = 1; // set favicon dimensions
    c.height = 1; // 1x1 is fine since it's a solid color
    var ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 128, 128);
    var link = document.querySelector("link[rel=icon]") || document.createElement("link");
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
 * var People = [
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
    var sortOrder = 1;
    if (typeof prop === "string" && prop[0] === "-") {
        sortOrder = -1;
        prop = prop.substring(1);
    }
    return function (a, b) {
        var result = a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0;
        return result * sortOrder;
    };
}

/**
 * returns css rgb string based off of a percent value of a gradient
 * @param {number} p number in range from 0-100
 * @param {Array} colors array of rgb colors
 * @returns {string}
 */
export function rgbGradient(
    p,
    colors = [
        { r: 255, g: 0, b: 0 }, // low (0%)
        { r: 255, g: 127, b: 0 },
        { r: 255, g: 255, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 255, g: 0, b: 255 }, // high(100%);
    ]
) {
    p = typeof p === "string" ? parseInt(p) : p;
    var numChunks = colors.length - 1;
    var chunkSize = 100 / numChunks;
    for (var i = 1; i <= numChunks; i++) {
        if (p <= chunkSize * i) {
            var percent = ((p + (1 - i) * chunkSize) * numChunks) / 100;

            var c1 = colors[i],
                c2 = colors[i - 1];

            var a = [];
            Object.keys(colors[0]).forEach((e) => {
                a.push(Math.floor((c1[e] * percent + c2[e] * (1 - percent)) * 100) / 100);
            });
            return "rgb(" + a.join(",") + ")";
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
 * @returns {Number}
 */
export function map(x, inmin, inmax, outmin, outmax) {
    return (x - inmin) * (outmax - outmin) / (inmax - inmin) + outmin;
}

/**
 * generates a gradient of colors from the specified array
 * @param {Number} count number of colors to generate
 * @param {Object[]} colors array of colors in gradient
 * @returns {String[]} array of colors generated
 */
export function gradient(count, colors = [
    { r: 255, g: 0, b: 0 }, // low (0%)
    { r: 255, g: 127, b: 0 },
    { r: 255, g: 255, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 0, b: 255 }, // high(100%);
]) {
    if (count == 1) {
        let { r, g, b } = colors[0];
        return [`rgb(${r},${g},${b})`];
    }
    let arr = new Array(count).fill("");
    arr = arr.map((e, n) => rgbGradient(map(n, 0, count - 1, 0, 100), colors));
    return arr;
    // let half = Math.floor(count / 2);
    // let first = arr.slice(0, half);
    // let second = arr.slice(half, count);
    // return interleaveArrays(false, first, second);
}

function interleaveArrays(fill, ...arrays) {
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

        console.defaultLog = console.log.bind(console);
        console.log = function (...args) {
            console.everything.push({
                type: "log",
                datetime: Date().toLocaleString(),
                value: Array.from(...args)
            });
            console.defaultLog.apply(console, args);
        };
        console.defaultError = console.error.bind(console);
        console.error = function (...args) {
            console.everything.push({
                type: "error",
                datetime: Date().toLocaleString(),
                value: Array.from(...args)
            });
            console.defaultError.apply(console, args);
        };
        console.defaultWarn = console.warn.bind(console);
        console.warn = function (...args) {
            console.everything.push({
                type: "warn",
                datetime: Date().toLocaleString(),
                value: Array.from(...args)
            });
            console.defaultWarn.apply(console, args);
        };
        console.defaultDebug = console.debug.bind(console);
        console.debug = function (...args) {
            console.everything.push({
                type: "debug",
                datetime: Date().toLocaleString(),
                value: Array.from(...args)
            });
            console.defaultDebug.apply(console, args);
        };
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
export function getColor(varname) {
    return getComputedStyle(document.querySelector(":root")).getPropertyValue(varname);
}

/**
 * 
 * @param {Function} val function to call
 * @param  {...any} args arguments to pass to function
 * @returns returns an object whose value will automatically follow the 
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

    var colorProps = ["backgroundColor", "color"];

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

    var arr = [...new Array(106).fill(0).map((e, n) => "--color" + (n + 1)), ...new Array(10).fill(1).map((e, n) => "--transparent" + (n + 1))];
    var root = getComputedStyle(document.querySelector(":root"));
    var els = flattenChildren(document.body).map(e => [e, getComputedStyle(e)]);
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

export class Settings extends EventTarget {
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

    /**
     * renders the settings object as html
     * @returns {HTMLDivElement}
     */
    render() {
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
     * @param {String} name
     * @returns {Section}
     */
    getSection(name) { // returns the section object with the given id
        return this.sections.find(e => e.config.id == name);
    }

    /**
     * converts the settings object to a stringified JSON object cabable of being imported through the Settings.loadJson() method
     * @returns {String}
     */
    export() {
        return JSON.stringify(this, function (key, value) {
            if (key.includes("_obj")) { // exclude parent objects to avoid recursion
                return undefined;
            }
            return value;
        });
    }

    /**
     * dispatches an event on the Settings object
     * @param {String} type event type
     * @param {Object} config event options/data
     */
    dispatchEvent(event) {
        let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this); // get copy of original dispatchEvent function
        originalDispatch.apply(this, [event]) // call original dispatchEvent function
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

    replaceWith(settings) { // replaces this settings object with another one by overriding sections array and config
        // because this object can be imported by other modules, it can't be assigned to a new Settings object
        if (!settings instanceof Settings) { // only override if provided object is a Setting object
            return;
        }
        this.config = settings.config; // override config
        this.sections = settings.sections; // override sections
    }
}

class Section extends EventTarget {
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

class Option extends EventTarget {
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
        // show("#loadingModal"); // show the loading modal
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
                // hide("#loadingModal"); // hide the loading modal
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
            option.dispatchEvent(new Event("change")); // forward event from html element to option object
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
            values: ["bar", "line"]
        })
    ])
]);

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
 */
export function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}