if (typeof window === "undefined") {
    globalThis.window = globalThis;
}
if (!Array.isArray(window.devtoolsFormatters)) {
    window.devtoolsFormatters = [];
}
function button(obj, func, args = [], label = "button", width = 50, height = width) {
    return { __dom_node: "button", obj, func, args, label, width, height };
}
function details(__label, children) {
    return { __dom_node: "details", __label, children };
}
function convertToDevtools(el) {
    if (!el instanceof HTMLElement) {
        throw new Error("el is not an html element");
    }
    let allowedTags = ["span", "div", "ol", "ul", "li", "table", "tr", "td"];
    let blockedTags = ["script", "link", "meta", "head", "#comment"];
    let customTags = {
        details: function (node) {
            return ["object", {
                object: details(node.querySelector("summary").textContent, [...node.childNodes].filter(e => e.nodeName.toLowerCase() != "summary").map(e => convertToDevtools(e)))
            }];
        },
        button: function (node, style) {
            let clone = node.cloneNode(true);
            clone.style = style;
            return ["object", {
                object: button({
                    f: () => {
                        node.dispatchEvent(new Event("click"));
                    }
                }, "f", [], node.innerHTML, clone.style.width, clone.style.height)
            }];
        }
    };

    if (blockedTags.includes(el.nodeName.toLowerCase())) {
        return "";
    }

    function getStyle(el) {
        let style = {};
        let stylesheets = document.styleSheets;
        [...stylesheets].forEach(sheet => {
            try {
                let rules = sheet.rules;
                for (let i = 0; i < rules.length; i++) {
                    let rule = rules[i];
                    if (el.matches && el.matches(rule.selectorText)) {
                        // console.log("adding style", Object.fromEntries([...rule.style].map(e => [e, rule.style[e]])));
                        style = {
                            ...style,
                            ...Object.fromEntries([...rule.style].map(e => [e, rule.style[e]]))
                        };
                    }
                }
                style = {
                    ...style,
                    ...(Object.fromEntries(Object.entries(el.style||[]).map(e => e[1]).map(e => [e, el.style[e]]) || []) || {})
                }
            } catch (e) {
                console.error(sheet, e);
            }
        });
        // console.log("final rules", style);

        let startsWithProps = [
            "align",
            "background",
            "border",
            "box",
            "font",
            "justify",
            "line",
            "margin",
            "outline",
            "padding",
            "text",
            "transition",
            "word",
            "writing",
        ];
        let exactMatches = [
            "clear",
            "color",
            // "display",
            "float",
            "height",
            "max-height",
            "max-width",
            "min-height",
            "min-width",
            "position",
            "vertical-align",
            "white-space",
            "width",
        ];
        let props = Object.entries(style).map(e => e.join(":")).join(";");
        // console.log("final string", props);
        return props;
    }
    if (Object.keys(customTags).includes(el.nodeName.toLowerCase())) {
        return customTags[el.nodeName.toLowerCase()](el, getStyle(el));
    } else {
        let devtool = [allowedTags.includes(el.nodeName.toLowerCase()) ? el.nodeName.toLowerCase() : "span", {
            style: getStyle(el)
        }];
        let children = [...el.childNodes];
        children.forEach(e => {
            if (e.nodeName.toLowerCase() == "#text") {
                devtool.push(e.textContent);
            } else {
                devtool.push(convertToDevtools(e));
            }
        });
        return devtool;
    }
}

let domNodeFormatter = { // dom node formatter
    header: function (obj) {
        if (obj.__dom_node) {
            if (obj.__dom_node == "button") {
                return ["span", {
                    style: `width:${obj.width}px;height:${obj.height}px;border:1px solid red;background-color:white;text-align:center;cursor:pointer;color:black;padding:5px;`
                }, ["span", {}, obj.label]];
            } else if (obj.__dom_node == "details") {
                return ["div", {}, obj.__label];
            }
        }
        return null;
    },
    hasBody: function (obj) {
        if (["button", "details"].includes(obj.__dom_node)) return true;
        return null;
    },
    body: function (obj) {
        if (obj.__dom_node) {
            if (obj.__dom_node == "button") {
                try { obj.obj[obj.func](...obj.args); } catch (e) { }
                return ["div", {}];
            } else if (obj.__dom_node == "details") {
                return ["div", {}, ...obj.children];
            }
        }
        return null;
    }
};
if (!window.devtoolsFormatters.includes(domNodeFormatter)) {
    window.devtoolsFormatters.push(domNodeFormatter);
}
let domFormatter = { // dom node formatter
    header: function (obj) {
        if (obj.__render_as_dom) {
            return ["div", {}, "dom node"];
        }
        return null;
    },
    hasBody: function (obj) {
        if (obj.__render_as_dom) {
            return true;
        }
        return null;
    },
    body: function (obj) {
        if (obj.__render_as_dom) {
            return ["div", {
                style: "background-color:white;color:black;min-width:300px;"
            }, convertToDevtools(obj.node || document.createElement("div"))];
        }
        return null;
    }
};
if (!window.devtoolsFormatters.includes(domFormatter)) {
    window.devtoolsFormatters.push(domFormatter);
}

let gridFormatter = { // Grid formatter
    header: obj => {
        if (obj instanceof Grid) {
            return [
                "div", {},
                [
                    "table", { style: "border-collapse:collapse;" },
                    ["tr", {}, // top row
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveUpLeft", [], "up left") }]],
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveUp", [], "up") }]],
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveUpRight", [], "up right") }]]
                    ],
                    ["tr", {}, // middle row
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveLeft", [], "left") }]],
                        ["td", { style: "padding:0;margin:0;" }],
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveRight", [], "right") }]]
                    ],
                    ["tr", {}, // bottom row
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveDownLeft", [], "down left") }]],
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveDown", [], "down") }]],
                        ["td", { style: "padding:0;margin:0;" }, ["object", { object: button(obj, "moveDownRight", [], "down right") }]]
                    ]
                ]
            ];
        }
        return null;
    },
    hasBody: function () {
        return null;
    }
};
if (!window.devtoolsFormatters.includes(gridFormatter)) {
    window.devtoolsFormatters.push(gridFormatter);
}

export class Grid {
    cursor = { x: 0, y: 0 };
    #x = 0;
    #y = 0;
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
        this.log();
    }
    moveUp(clear) { return this.#move(-1, 0, clear) }
    moveDown(clear) { return this.#move(1, 0, clear) }
    moveLeft(clear) { return this.#move(0, -1, clear) }
    moveRight(clear) { return this.#move(0, 1, clear) }
    moveUpRight() { this.moveUp(false); this.moveRight(); }
    moveUpLeft() { this.moveUp(false); this.moveLeft(); }
    moveDownRight() { this.moveDown(false); this.moveRight(); }
    moveDownLeft() { this.moveDown(false); this.moveLeft(); }

    #move(x, y, clear) {
        // console.log(x, y);
        let tx = this.cursor.x + x;
        let ty = this.cursor.y + y;
        if (tx >= this.#x) {
            tx = this.#x - 1;
        } else if (tx < 0) {
            tx = 0;
        }
        if (ty >= this.#y) {
            ty = this.#y - 1;
        } else if (ty < 0) {
            ty = 0;
        }
        this.cursor = { x: tx, y: ty };
        this.log(clear);
        return null;
    }

    log(clear = true) {
        this.grid = new Array(this.#x).fill(0).map(e => new Array(this.#y).fill("-"));
        this.grid[this.cursor.x][this.cursor.y] = "x";
        let t = this;
        if (clear) {
            console.clear();
        }
        console.log(t.grid.map(e => e.join(" ")).join("\n"));
        console.dir(t);
        var process = process; // keep this as var
        let is_node = process?.versions?.node;
        if (is_node) debugger; // debugger call is needed for nodejs to not exit the program after logging the game
    }
}
// new Grid(7, 10);