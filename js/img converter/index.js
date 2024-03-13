function createElement(tag, data = {}) {
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
function add(...args) {
    args.forEach(elem => {
        this.append(elem);
    });
    return this;
};
if (window.Element.prototype.add === undefined) {
    window.Element.prototype.add = add;
}

const COLORS = [
    "#362944", // dark blue
    "#c45d9f", // magenta
    "#e39aac", // pink
    "#f0dab1", // yellow
    "#6461c2", // blue
    "#2ba9b4", // turquoise
    "#93d4b5", // green
    "#f0f6e8", // tan
].map(e => e.substring(1).match(/.{2}/g).map(e => parseInt(e, 16)));

function findNearestColor(hexArr) {
    // source colors
    let source = hexArr.map(e => parseInt(e, 16));
    let diffs = COLORS.map(c => {
        let [tr, tg, tb] = c;
        let diff = c.map((e, n) => Math.abs(e - source[n]));
        return diff.reduce((a, b) => a + b, 0);
    });
    let targetColor = diffs.indexOf(Math.min(...diffs));
    return /* "#" + */[...COLORS[targetColor], 255]; //.map(e => e.toString(16)).join("") + "ff";
}

function getBase64(file, resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        resolve(reader.result);
    };
    reader.onerror = function (error) {
        reject(error);
    };
}

let scale = document.getElementById("scale");
document.getElementById("scaleSubtract").onclick = function () {
    if (parseInt(scale.value) > parseInt(scale.min)) {
        scale.value = parseInt(scale.value) - parseInt(scale.step);
    }
    scale.oninput();
}
document.getElementById("scaleAdd").onclick = function () {
    if (parseInt(scale.value) < parseInt(scale.max)) {
        scale.value = parseInt(scale.value) + parseInt(scale.step);
    }
    scale.oninput();
}
let c = 100, s = 0.75;
scale.oninput = _ => {
    document.getElementById("scaleDisplay").innerHTML = scale.value;
    c = 100;
}
scale.oninput();
window.setInterval(_ => c ? (c--, !c ? preview() : 0) : 0, s * 10);

let colors, canvas, width, height;
async function preview() {
    let file = document.querySelector('#input').files[0];
    let base64 = await new Promise(function (resolve, reject) {
        getBase64(file, resolve, reject);
    });
    /**
     * @type {HTMLCanvasElement}
     */
    canvas = await new Promise(function (resolve, reject) {
        let scaleSize = (typeof scale.value == "number" ? scale.value : parseInt(scale.value)) / 100;
        let img = new Image();
        img.onload = function () {
            let canvas = document.getElementById("preview");
            width = Math.floor(img.width * scaleSize);
            height = Math.floor(img.height * scaleSize);
            document.getElementById("width").innerHTML = width;
            document.getElementById("height").innerHTML = height;
            document.getElementById("cWidth").innerHTML = Math.ceil(width / 12);
            document.getElementById("cHeight").innerHTML = Math.ceil(height / 12);
            document.getElementById("cTotal").innerHTML = Math.ceil(width / 12) * Math.ceil(height / 12);
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d");
            ctx.scale(scaleSize, scaleSize);
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        }
        img.src = base64;
    });
    let ctx = canvas.getContext("2d");
    colors = ctx.getImageData(0, 0, width, height);
    let rows = imageDataToArray(colors);
    let convertedColors = rows.map(row => row.map(c => findNearestColor((c.pop(), c)))).flat(Infinity)
    // console.log(convertedColors);
    colors.data.set(convertedColors);
    let output = document.getElementById("output");
    let outputCtx = output.getContext("2d");
    output.height = height;
    output.width = width;
    outputCtx.putImageData(colors, 0, 0);
}
document.querySelector("#runButton").addEventListener("click", render);
document.querySelector("input[type=file]").addEventListener("change", preview);

async function render() {
    imageDataToGrid(colors);
}

function imageDataToArray(imageData) {
    let pixels = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
        pixels.push([...imageData.data.slice(i, i + 4)].map(e => e.toString(16)));
    }
    let rows = [];
    for (let i = 0; i < pixels.length; i += width) {
        rows.push(pixels.slice(i, i + width));
    }
    return rows;
}

function chunk2DArray(array, size) {
    let chunks = [];
    while (array.length % size > 0) {
        array.push([]);
    }
    let maxLength = Math.max(...array.map(e => e.length));
    array.forEach(row => {
        while (row.length % size > 0 || row.length < maxLength) {
            row.push(COLORS[0].map(e => e.toString(16)));
        }
    });
    for (let y = 0; y < array.length; y += size) {
        for (let x = 0; x < array[0].length; x += size) {
            for (let dy = y; dy < y + size; dy++) {
                for (let dx = x; dx < x + size; dx++) {
                    if (!Array.isArray(chunks[y / size])) chunks[y / size] = [];
                    if (!Array.isArray(chunks[y / size][x / size])) chunks[y / size][x / size] = [];
                    chunks[y / size][x / size].push(array[dy][dx]);
                }
            }
            let wrapped = [];
            for (let i = 0; i < chunks[y / size][x / size].length; i += size) {
                wrapped.push(chunks[y / size][x / size].slice(i, i + size));
            }
            chunks[y / size][x / size] = wrapped;
        }
    }
    return chunks;
}

function imageDataToGrid(imageData) {
    let style = "border-collapse:collapse;padding:0";
    let arr = imageDataToArray(imageData);
    let grid = chunk2DArray(arr, 12);
    document.getElementById("outTables").innerHTML = createElement("div", { classList: "outputTables" }).add(
        ...grid.map(gr => createElement("div", {
            style: {
                height: "calc(var(--grid-size) * 12)"
            }
        }).add(
            ...gr.map(gc => {
                return createElement("table", { // these tables are made from the arrays that represent each individual canvas tile
                    style: "display:inline-table;" + style
                }).add(
                    ...gc.map(r => createElement("tr", { style }).add(
                        ...r.map(c => createElement("td", { style }).add(
                            createElement("div", {
                                style: {
                                    backgroundColor: "#" + c.join(""),
                                    width: "var(--grid-size)",
                                    height: "var(--grid-size)",
                                }
                            })
                        ))
                    ))
                );
            })
        ))
    ).outerHTML;
}