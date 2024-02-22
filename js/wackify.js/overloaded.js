const Overload = (function () {
    function getPath(o) {
        const path = [];
        while (o) {
            path.push(o);
            o = Object.getPrototypeOf(o);
        }
        return path.reverse();
    }

    function getCommonAncestor(x, y) {
        const xPath = getPath(x);
        const yPath = getPath(y);
        const steps = Math.min(xPath.length, yPath.length);

        for (let i = 0; i < steps; i++) {
            if (xPath[i] !== yPath[i]) return (xPath[i - 1]?.prototype || xPath[i - 1]);
        }
    }

    class Overload extends Function {

        static Rest = class{
            type = null;
            constructor(type) {
                this.type = type;
            }
        }
        /**
         * creates a new Overloaded function
         * @param {Function} defaultCallback callback function
         * @returns {this}
         */
        constructor(defaultCallback = (...args) => console.log("no suitable callback for arguments:", args)) {
            super("...args", "return this.__self__.call(...args);");
            let self = this.bind(this);
            this.__self__ = self;
            if (defaultCallback === undefined) {
                defaultCallback = function (...args) {
                    console.log("no suitable overload found for arguments:", args);
                }
            }
            self.defaultCallback = defaultCallback;
            self.overloads = [];
            return self;
        }

        /**
         * 
         * @param {Function} callback overload function to call if arguments match types
         * @param  {...any} types types to overload
         */
        addOverload(callback, ...types) {
            types = types.flat(Infinity);
            let options = {};
            if (types.includes(Object)) {
                options.allowObject = true;
            }
            this.overloads.push({
                options,
                callback,
                types
            });
        }

        call(...args) {
            function hasRest(c) {
                return c.types[c.types.length - 1] instanceof Overload.Rest;
            }
            function compareType(x, y, o) {
                let ancestor = getCommonAncestor(x, y);
                var a;
                return !!(
                    (
                        (x instanceof y) && (
                            (o.options.allowObject && (y == Object)) ||
                            (!o.options.allowObject && (y != Object))
                        ) && (
                            ((typeof x == "function") && (y == Function)) ||
                            ((typeof x != "function") && (y != Function))
                        )
                    ) ||
                    (typeof x == y.name.toLowerCase()) ||
                    (o.options.allowObject && (ancestor === Object.getPrototypeOf({}))) ||
                    (
                        (typeof (a = (!o.options.allowObject && (ancestor != Object.getPrototypeOf({})) && ancestor)) === "boolean") &&
                        a == true
                    ) ||
                    (
                        typeof y == "string" &&
                        typeof x == y.toLowerCase().trim()
                    )
                );
            }
            const candidates = this.overloads.filter(o => {
                if (args.length == o.types.length && !hasRest(o)) { // types list is defined length
                    let arr = o.types.map((t, n) => compareType(args[n], t, o));
                    return !(arr.includes(false));
                } else if (hasRest(o)) {
                    // has rest parameter
                    let types = Object.assign([], o.types);
                    let rest = types.pop();
                    let unrestArgs = args.splice(0, types.length);
                    let unrestMatch = types.map((t, n) => compareType(unrestArgs[n], t, o));
                    if (unrestMatch.includes(false)) {
                        return false;
                    }
                    return !(args.map(e => compareType(e, rest.type, o)).includes(false));
                }

            });
            let funcToCall;
            // console.log("candidates", candidates);
            if (funcToCall = candidates.find(e => !hasRest(e))) { }
            else if (funcToCall = candidates.find(hasRest)) { }
            else { funcToCall = { callback: this.defaultCallback }; }

            return funcToCall.callback(...args);
        }
    }
    return Overload;
})();

let loaded = new Overload((...args) => console.log("no suitable callback for arguments:", args));

loaded.addOverload(
    function (el, count) {
        console.log("repeat the element " + count + " times:", new Array(count).fill(el));
    },
    Element, Number
); // accepts an Element and a Number

loaded.addOverload(
    function (...args) {
        console.log("many numbers:", ...args);
        return args.reduce((a, b) => a + b, 0);
    },
    new Overload.Rest(Number)
); // Accepts any amount of numbers

loaded.addOverload(
    function (...args) {
        console.log("one number:", ...args);
    },
    Number
); // accepts one number

loaded.addOverload(
    function (...args) {
        console.log("string:", ...args);
    },
    String
); // accepts one string

loaded.addOverload(
    function (...args) {
        console.log("two numbers:", ...args);
    },
    Number, Number
); /// accepts 2 numbers

loaded.addOverload(
    function (...args) {
        console.log("rest:", ...args);
    },
    Overload.Rest
); // accepts one instance of the class "Rest"

loaded.addOverload(
    function (...args) {
        console.log("object:", ...args);
    },
    Object
); // accepts one object

loaded.addOverload(
    function (...args) {
        console.log("function:", ...args);
    },
    Function
); // accepts one function

loaded(document.body, 7);
loaded(3);
loaded({ a: 1, b: 2 });
loaded("hello world");
loaded(console.log);
loaded(new Overload.Rest(Number));
console.log("sum:", loaded(...new Array(20).fill(0).map(e => Math.floor(Math.random() * 10)))); // array of 20 random numbers


console.log("%c↓ points ↓", "font-size: 20px;");
(function () { // faked "overloading" using valueOf
    class StringBuilder {
        data = "";
        constructor() {
            // console.log("constructor");
        }
        valueOf() {
            // console.log("valueOf sb");
            StringBuilder.current = this;
        }
        toString() {
            // console.log("toString");
            return this.data;
        }
    }

    class Point {
        static operands = [];
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        valueOf() {
            Point.operands.push(this);
            return 3;
        }
        set _(value) {
            var ops = Point.operands;
            var operator;
            if (ops.length === 2 && value === 0) { // 3 - 3
                operator = this.setSubtract;
            } else if (ops.length === 2 && value === 1) { // 3 / 3
                operator = this.setDivide;
            } else if (ops.length >= 2 && (value === 3 * ops.length)) { // 3 + 3 + 3
                operator = this.setAdd;
            } else if (ops.length >= 2 && (value === Math.pow(3, ops.length))) { // 3 * 3
                operator = this.setMultiply;
            } else {
                throw new Error("Unsupported operation (code " + value + ")");
            }
            Point.operands = []; // reset
            return operator.apply(this, ops);
        }
        get _() {
            return this.toString();
        }
        setSubtract(l, r) {
            this.x = l.x - r.x;
            this.y = l.y - r.y;
            return this;
        }
        setDivide(l, r) {
            this.x = l.x / r.x;
            this.y = l.y / r.y;
            return this;
        }
        setAdd(first) {
            this.x = first.x;
            this.y = first.y;
            [].slice.call(arguments, 1).forEach(function (op) {
                this.x += op.x;
                this.y += op.y;
            }, this);
            return this;
        }
        setMultiply(first) {
            this.x = first.x;
            this.y = first.y;
            [].slice.call(arguments, 1).forEach(function (op) {
                this.x *= op.x;
                this.y *= op.y;
            }, this);
            return this;
        }
        toString() {
            return "Point(" + this.x + ", " + this.y + ")";
        }
        equals(other) {
            return this.x === other.x && this.y === other.y;
        }
    }

    function add(value) { // function parameters
        return {
            valueOf: _ => { // function body
                StringBuilder.current.data += value
            }
        }
    }
    let sb = new StringBuilder();
    sb << add("abc") << add("def") << add("ghi") << add("jkl") << add("mno") << add("pqr") << add("stu") << add("vwx") << add("yz");
    console.log(sb.toString()); // abcdefghijklmnopqr

    let p = new Point();
    p._ = new Point(1, 2) + new Point(3, 4) + new Point(5, 6);
    console.log(p.toString()); // Point(9, 12)
})();