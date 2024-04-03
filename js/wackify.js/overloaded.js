const Overload = (function () {
    /*
    this library is kinda janky, so it may not work in all cases
    I'm adding more and more conditionals to adjust for edge cases
    */
    function getPath(o) { // make array of object's prototypes all the way up to Object.prototype
        const path = [];
        while (o) {
            path.unshift(o);
            o = Object.getPrototypeOf(o);
        }
        return path;
    }

    function getCommonAncestor(x, y) { // check if two objects have any common prototypes in their prototype tree
        const xPath = getPath(x);
        const yPath = getPath(y);
        const steps = Math.min(xPath.length, yPath.length);

        for (let i = 0; i < steps; i++) {
            if (xPath[i] !== yPath[i]) return (xPath[i - 1]?.prototype || xPath[i - 1]);
        }
    }

    class Overload extends Function {
        static Rest = class {
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
                    ( // spaghetti
                        (x instanceof (y instanceof Overload.Rest ? y.type : y)) && ( //  if x instance of (if y is rest, y.type, else y)
                            (o.options.allowObject && (y == Object)) || // if allowObject and y in Object
                            (!o.options.allowObject && (y != Object)) // if !allowObject and y is not Object
                        ) && (
                            ((typeof x == "function") && (y == Function)) || // both x and y are functions
                            ((typeof x != "function") && (y != Function)) // both x and y are not functions
                        )
                    ) ||
                    (typeof x == (y instanceof Overload.Rest ? y.type : y).name.toLowerCase()) || // typeof x is equal to y.name.toLowerCase()
                    (o.options.allowObject && (ancestor === Object.getPrototypeOf({}))) || // if allowObject and common ancestor prototype is Object.prototype
                    (
                        (typeof (a = (!o.options.allowObject && (ancestor != Object.getPrototypeOf({})) && ancestor)) === "boolean") && // if type is Boolean and a is true (this edge case is only needed if the argument to check is true, not false)
                        a == true
                    ) ||
                    (
                        typeof y == "string" && // if the type is a string
                        typeof x == y.toLowerCase().trim() // and typeof x is equal to that string
                    )
                ); // regret
            }
            const candidates = this.overloads.filter(overload => {
                if (args.length == overload.types.length && !hasRest(overload)) { // types array is static in length, and number of argments matches length of types array
                    let arr = overload.types.map((type, index) => compareType(args[index], type, overload));
                    return !arr.includes(false); // if array is entirely true, return true, else return false
                } else if (hasRest(overload)) { // types list can be any length >= given length
                    // has Rest parameter
                    let types = Object.assign([], overload.types); // copy array of types
                    let rest = types.pop(); // get rest parameter
                    let unrestArgs = args.splice(0, types.length); // remove all arguments up to rest parameter
                    let unrestMatch = types.map((t, n) => compareType(unrestArgs[n], t, overload)); // check if unrest args match with unrest types
                    if (unrestMatch.includes(false)) { // if any don't match, return false
                        return false;
                    }
                    return !(args.map(e => compareType(e, rest.type, overload)).includes(false)); // check if the remaining arguments match the rest parameter type
                }
                return false;
            });
            let funcToCall;
            // console.log("candidates", candidates);
            if (funcToCall = candidates.find(e => !hasRest(e))) { } // find an overload that doesn't use rest parameters (exact parameter list match)
            else if (funcToCall = candidates.find(hasRest)) { } // find the first overload that uses a rest parameter
            else { funcToCall = { callback: this.defaultCallback }; } // no valid overloads found (no exact matches for non-rest overloads, and no valid rest overloads)

            return funcToCall.callback(...args); // call the overloaded function
        }
    }
    return Overload;
})();

let loaded = new Overload(); //  make new overloaded function

loaded.addOverload( // add an overload
    function (el, count) {
        console.log(`repeat the element ${count} times:`, new Array(count).fill(el));
    },
    Element, Number
); // accepts an Element and a Number

loaded.addOverload( // add an overload
    function (...args) {
        console.log("many numbers:", ...args);
        return args.reduce((a, b) => a + b, 0);
    },
    new Overload.Rest(Number)
); // Accepts any amount of numbers

loaded.addOverload( // add an overload
    function (...args) {
        console.log("one number:", ...args);
    },
    Number
); // accepts one number

loaded.addOverload( // add an overload
    function (...args) {
        console.log("string:", ...args);
    },
    String
); // accepts one string

loaded.addOverload( // and so on...
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

// call the overloaded function with various types of arguments
loaded(document.body, 7);
loaded(3);
loaded({ a: 1, b: 2 });
loaded("hello world");
loaded(console.log);
loaded(new Overload.Rest(Number));
console.log("sum:", loaded(...new Array(20).fill(0).map(e => Math.floor(Math.random() * 10)))); // array of 20 random numbers


(function () { // manipulating valueOf to do chained operations
    // easier to make a .add().add().add() function, but whatever, it's kinda cool
    console.log("%c↓ points ↓", "font-size: 20px;");
    class StringBuilder {
        data = "";
        constructor() { }
        valueOf() {
            StringBuilder.current = this;
        }
        toString() {
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
            if (ops.length === 2 && value === 0) operator = this.setSubtract; // 3 - 3
            else if (ops.length === 2 && value === 1) operator = this.setDivide; // 3 / 3
            else if (ops.length >= 2 && (value === 3 * ops.length)) operator = this.setAdd; // 3 + 3 + 3
            else if (ops.length >= 2 && (value === Math.pow(3, ops.length))) operator = this.setMultiply; // 3 * 3
            else throw new Error("Unsupported operation (code " + value + ")");
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
            return `Point(${this.x}, ${this.y})`;
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
    console.log(sb.toString()); // abcdefghijklmnopqrstuvwxyz

    let p = new Point();
    p._ = new Point(1, 2) + new Point(3, 4) + new Point(5, 6);
    console.log(p.toString()); // Point(9, 12)
})();