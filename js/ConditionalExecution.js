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
/**
 * intended for "multiplexing" a greasemonkey script based on certain conditions
 * @param {function} callback script to run
 * @param {AutoRunOptions} options conditions for script to run
 */
function autoRun(callback, options) {
    /* @type {AutoRunOptions} */
    let defaults = extend({
        when: function () { return true; },
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