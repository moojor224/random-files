function getPath(o) {
    const path = [];
    while (o) {
        path.push(o);
        // if (typeof o == "object") path.push(o.constructor);
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

class Rest {
    type = null;
    constructor(type) {
        this.type = type;
    }
}

class Overload extends Function {
    constructor(defaultCallback) {
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

    addOverload(options, ...types) {
        if (typeof options == "function") {
            options = {
                callback: options
            };
        }
        let callback = options.callback;
        delete options.callback;
        this.overloads.push({
            options,
            callback,
            types
        });
    }

    call(...args) {
        // console.group("finding suitable overload for: ", args);
        function hasRest(c) {
            return c.types[c.types.length - 1] instanceof Rest;
        }
        function compareType(x, y, o) {
            let ancestor = getCommonAncestor(x, y);
            // debugger;

            // console.log((
            //     x instanceof y && (
            //         o.options.allowObject && y == Object ||
            //         !o.options.allowObject && y != Object
            //     ) && (
            //         typeof x == "function" && y == Function ||
            //         typeof x != "function" && y != Function
            //     )
            // ),
            //     // (typeof x == y.constructor.name.toLowerCase()),
            //     (typeof x == y.name.toLowerCase()),
            //     (o.options.allowObject && ancestor == Object.getPrototypeOf({})),
            //     (!o.options.allowObject && ancestor != Object.getPrototypeOf({}) && ancestor));
            return !!(
                (
                    x instanceof y && (
                        o.options.allowObject && y == Object ||
                        !o.options.allowObject && y != Object
                    ) && (
                        typeof x == "function" && y == Function ||
                        typeof x != "function" && y != Function
                    )
                ) ||
                // (typeof x == y.constructor.name.toLowerCase()) ||
                (typeof x == y.name.toLowerCase()) ||
                (o.options.allowObject && ancestor == Object.getPrototypeOf({})) ||
                (!o.options.allowObject && ancestor != Object.getPrototypeOf({}) && ancestor)
            )
        }
        let candidates = this.overloads.filter(o => {
            if (args.length == o.types.length && !hasRest(o)) { // types list is defined length
                // debugger
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
                // console.log(args.map(e => compareType(e, rest.type, o)));
                return !(args.map(e => compareType(e, rest.type, o)).includes(false));
            }

        });
        let funcToCall;
        if (funcToCall = candidates.find(e => !hasRest(e))) { }
        else if (funcToCall = candidates.find(hasRest)) { }
        else { funcToCall = { callback: this.defaultCallback }; }

        console.groupEnd();
        return funcToCall.callback(...args);
    }
}

let loaded = new Overload((...args) => console.log("no suitable callback for:", args));

loaded.addOverload(function (el, count) {
    return new Array(count).fill(el);
}, Element, Number); // accepts an Element and a Number

loaded.addOverload({
    callback: (...args) => {
        console.log("many numbers", ...args);
        return args.reduce((a, b) => a + b, 0);
    },
    allowObject: false
}, new Rest(Number)); // Accepts any amount of numbers

loaded.addOverload({
    callback: (...args) => {
        console.log("one number", ...args);
    },
    allowObject: false
}, Number); // accepts one number

loaded.addOverload({
    callback: (...args) => {
        console.log("string:", ...args);
    },
    allowObject: false
}, String); // accepts one string

loaded.addOverload({
    callback: (...args) => {
        console.log("two numbers", ...args);
    },
    allowObject: false
}, Number, Number); /// accepts 2 numbers

loaded.addOverload({
    callback: (...args) => {
        console.log("rest:", ...args);
    },
    allowObject: false
}, Rest); // accepts one instance of the class "Rest"

loaded.addOverload({
    callback: (...args) => {
        console.log("object:", ...args);
    },
    allowObject: true
}, Object); // accepts one object

loaded.addOverload({
    callback: (...args) => {
        console.log("function:", ...args);
    },
    allowObject: false
}, Function); // accepts one object

console.log(loaded(document.body, 3));
loaded(3);
loaded({ a: 1, b: 2 });
loaded("hello world");
loaded(console.log);
console.log("sum:", loaded(...new Array(20).fill(0).map(e => Math.floor(Math.random() * 10)))); // array of 20 random numbers