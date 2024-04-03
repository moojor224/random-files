class Grid {
    cursor = { x: 0, y: 0 };
    #x = 0;
    #y = 0;
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
        Object.defineProperty(this, "moveUp", { get: () => this.#move(-1, 0) });
        Object.defineProperty(this, "moveDown", { get: () => this.#move(1, 0) });
        Object.defineProperty(this, "moveLeft", { get: () => this.#move(0, -1) });
        Object.defineProperty(this, "moveRight", { get: () => this.#move(0, 1) });
        this.log();
    }
    subtract(val) {
        return Math.abs(val) / val;
    }
    get moveUp() { return this.#move(-1, 0) }
    get moveDown() { return this.#move(1, 0) }
    get moveLeft() { return this.#move(0, -1) }
    get moveRight() { return this.#move(0, 1) }
    #move(x, y) {
        console.log(x, y);
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
        this.log();
        return null;
    }
    log() {
        this.grid = new Array(this.#x).fill(0).map(e => new Array(this.#y).fill("0"));
        this.grid[this.cursor.x][this.cursor.y] = "x";
        let t = this;
        console.clear();
        console.log(t.grid.map(e => e.join("")).join("\n"));
        console.log(t);
        var process = process; // keep this as var
        let is_node = process?.versions?.node;
        if (is_node)  debugger; // debugger call is needed for nodejs to not exit the program after logging the game
    }
}
new Grid(7, 10);