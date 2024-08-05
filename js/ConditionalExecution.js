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
 * allows "multiplexing" a function based on conditions
 * @param {function} callback code/script to run if conditions are met
 * @param {AutoRunOptions} options conditions for callback to run
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