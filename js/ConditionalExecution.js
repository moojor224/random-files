// this might be janky?, idk, it kinda works
import { extend, interleaveArrays } from "./synced/jstools/index.js";

/**
 * @typedef AutoRunWhen
 * @prop {HTMLElement[]?} elements any of the elements in the array exist
 */
/**
 * @typedef AutoRunOptions
 * @prop {number?} interval interval in milliseconds to check conditions
 * @prop {AutoRunWhen} when conditions to check
 */
let data = {}; // this object is for storing any internal data used in the hows functions
let hows = {
    "elements": function (key, arg) {
        if (Array.isArray(arg)) {
            arg = arg.join(",");
        }
        let els = document.querySelectorAll(arg);
        return els.length > 0 ? Array.from(els) : false;
    },
    "urlparams": function (key, arg) {
        let url = new URL(window.location.href);
        let params = url.searchParams;
        return arg(params);
    },
    "urlparams.*": function (key, arg) {
        let url = new URL(window.location.href);
        let params = url.searchParams;
        let vals = params.getAll(key);
        return vals.includes(arg);
    }
};
Object.keys(hows).forEach(function (key) {
    let val = hows[key];
    delete hows[key];
    key = key.replaceAll(".", "\\.").replaceAll("*", "[a-zA-Z_$][a-zA-Z_$0-9]*");
    hows[key] = val;
});
function watcher(interval, callback) {
    let int = setInterval(function () {
        try {
            console.log("checking");
            let result = interval();
            if (result) {
                clearInterval(int);
                callback(result);
            }
        } catch (err) {
            clearInterval(int);
        }
    }, 100);
    return int;
}
/**
 * intended for "multiplexing" a greasemonkey script based on certain conditions
 * @param {function} callback script to run
 * @param {AutoRunOptions} options conditions for script to run
 */
export function autoRun(callback, options) {
    let defaults = extend({
        when: {
            elements: []
        },
        interval: 100,
    }, options);
    if (typeof defaults.when === "function") {
        let interval = setInterval(function () {
            if (defaults.when()) {
                clearInterval(interval);
                callback();
            }
        }, defaults.interval);
    } else {
        function flattenKeys(obj) {
            let k = Object.keys(obj);
            let keys = [], values = []
            for (let key of k) {
                if (typeof obj[key] == "object") {
                    let [subKeys, subValues] = flattenKeys(obj[key]);
                    keys = keys.concat(subKeys.map(subKey => `${key}.${subKey}`));
                    values = values.concat(subValues);
                } else {
                    keys.push(key);
                    values.push(obj[key]);
                }
            }
            return [keys, values];
        }
        let flat = flattenKeys(defaults.when);
        let leaved = interleaveArrays(false, flat[0], flat[1]);
        console.log(leaved);

        let keyPaths = Object.fromEntries((function () {
            let arr = []
            while (leaved.length) {
                arr.push(leaved.splice(0, 2));
            }
            return arr;
        })());
        console.log(keyPaths);
        let intervals = [];
        Object.entries(keyPaths).forEach(function ([key, value]) {
            Object.entries(hows).forEach(function ([howkey, howfunc]) {
                // console.log(key, howkey, value);
                if (new RegExp(howkey).exec(key)) {
                    console.log("watching", key, value);
                    let int = watcher(() => {
                        return howfunc(key.split(".").pop(), value);
                    }, function (result) {
                        intervals.forEach(clearInterval);
                        callback(result);
                    });
                    intervals.push(int);
                }
            });
        });
    }
}

// autoRun(function (...foundConditions) {
//     console.log("run is true", foundConditions);
// }, {
//     when: {
//         // urlparams: {
//         //     run: "true",
//         //     test: 1,
//         // },
//         elements: "body"
//     }
// });