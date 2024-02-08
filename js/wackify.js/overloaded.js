class Overload {
    /**
     * @typedef {Object} OverloadFunc
     * @prop {Function} callback
     * @prop {Class[]} types
     */
    constructor(defaultCallback) {
        if (defaultCallback === undefined) {
            defaultCallback = function (...args) {
                console.log("no suitable overload found for arguments:", args);
            }
        }
        this.defaultCallback = defaultCallback;
    }
    /**
     * @type {OverloadFunc[]}
     */
    overloads = [];
    addOverload(callback, ...types) {
        console.log("adding overload", callback, "for types", types);
        // for (let t of types) {
        //     if (!(Object.getPrototypeOf(t) instanceof Function)) {
        //         console.log("invalid type", t);
        //         return new Error("invalid type provided at index: " + types.indexOf(t) + ". " + types[types.indexOf(t)].prototype?.constructor?.name || types[types.indexOf(t)]);
        //     }
        // }
        this.overloads.push({
            callback,
            types
        });
    }

    call(...args) {
        console.log("finding suitable overload for: ", args);
        let funcToCall = this.overloads.find(o => {
            console.log(o);
            if (args.length !== o.types.length) return false;
            return !o.types.map((t, n) => (
                (args[n] instanceof t) ||
                typeof args[n] == t.constructor.name.toLowerCase() ||
                typeof args[n] == t.name.toLowerCase()
            )).includes(false);
        });
        console.log(funcToCall);
        (funcToCall?.callback || this.defaultCallback)(...args);
    }
}
let ovld = new Overload();
console.log(ovld);
ovld.addOverload(console.log, Element, Number);
ovld.addOverload((...args) => console.log(args.reduce((a, b) => a + b, 0)), Number, Number);
ovld.call(document.body, 2);
ovld.call(4, 2);