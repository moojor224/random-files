if (typeof window === "undefined") {
    globalThis.window = globalThis;
}
// if (!Array.isArray(window.devtoolsFormatters)) {
window.devtoolsFormatters = [];
// }
function button(obj, func, args = [], label = "button", width = 50, height = width) {
    return { __button: true, obj, func, args, label, width, height };
}
window.devtoolsFormatters.push({ // button formatter
    header: function (obj) {
        if (obj.__button) {
            return ["div", {
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
        if (obj.__button) {
            try { obj.obj[obj.func](...obj.args); } catch (e) { }
            return ["div", {}];
        }
        return null;
    }
});
window.devtoolsFormatters.push({
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
});

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