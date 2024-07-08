import * as everything from "./jstools/index.js";

let url = new URL(import.meta.url);
let params = new URLSearchParams(url.search);
let filteredJstools = everything;
function parseExports(...exports) {
    exports.forEach(e => {
        filteredJstools[e] = everything[e];
    });
}
if (params.modules) {
    filteredJstools = {};
    let modules = params.modules.toLowerCase().split(",");
    if (modules.includes("all") || modules.includes("*")) {
        modules = [
            "core",
            "settings",
            "elements",
            "math",
            "objects",
            "color",
            "array",
            "console",
            "values",
            "css",
            "utility",
            "other",
        ];
    }
    modules.forEach(e => {
        switch (e) {
            case "core": parseExports("createElement", "extend"); break;
            case "settings": parseExports("Settings", "Section", "Option"); break;
            case "elements": parseExports("warn", "error", "clearWarn", "clearError", "clear", "show", "hide", "disable", "enable", "CUSTOM_ELEMENTS", "flattenChildNodes"); break;
            case "math": parseExports("map", "clamp", "roundf"); break;
            case "objects": parseExports("cobyObject", "stringify", "logFormatted", "extend"); break;
            case "color": parseExports("CSSColors", "Color", "rgbMix", "getColor", "getContrastColor", "gradient", "listAllColorsOnPage", "tabColor"); break;
            case "array": parseExports("interleaveArrays", "advancedDynamicSort", "dynamicSort", "flattenChildren", "rectangle", "reshape"); break;
            case "console": parseExports("captureConsole", "consoleButton", "logAndReturn"); break;
            case "values": parseExports("getValueOrDefault", "lockValue"); break;
            case "css": parseExports("jst_CSSRule", "jst_CSSStyleSheet"); break;
            case "utility": parseExports("BULK_OPERATIONS", "isAsync", "makeTemplate", "waitForKeyElements"); break;
            case "other": parseExports("timeConversions", "toHTMLEntities"); break;
        }
    });
}

export default filteredJstools;