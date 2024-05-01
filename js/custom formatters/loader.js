
import { formatter as tree } from "./tree.js";
import { formatter as test } from "./test.js";
import { formatter as schedule } from "./schedule.js";

export function loadFormatters() {
    if (!Array.isArray(window.devtoolsFormatters)) { // ensure that 
        window.devtoolsFormatters = [];
    }
    let formatters = [
        // tree,
        // test,
        schedule,
    ];
    formatters.forEach(f => {
        if (!window.devtoolsFormatters.includes(f)) {
            window.devtoolsFormatters.push(f);
        }
    });
    console.log({ __display_as_tree: true, a: 1, b: 2 });
}