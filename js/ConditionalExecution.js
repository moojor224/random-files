import { extend } from "./synced/jstools/index.js";

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
    "when.elements": function (opt) {
        if (Array.isArray(opt)) {
            opt = opt.join(",");
        }
        let els = document.querySelectorAll(opt);
        return els.length > 0 ? Array.from(els) : false;
    },
    "when.urlparams": function(arg){
        let url = new URL(window.location.href);
        let params = url.searchParams;
        return arg(params);
    },
    "when.urlparams.*": function(key, arg){
        let url = new URL(window.location.href);
        let params = url.searchParams;
        let vals = params.getAll(key);
        return vals.includes(arg);
    }
};
/**
 * intended for "multiplexing" a greasemonkey script based on certain conditions
 * @param {function} callback script to run
 * @param {AutoRunOptions} options conditions for script to run
 */
export function autoRun(callback, options) {
    /* @type {AutoRunOptions} */
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
        let { when: {
            elements
        }, interval: time } = defaults;
        let interval = setInterval(function () {
            if (false) {
                clearInterval(interval);
                callback();
            }
        }, time);
    }
}

autoRun(function () {
    console.log("Hello World!");
}, {

})