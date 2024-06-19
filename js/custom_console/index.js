import { extend } from "../synced/jstools.js";

const escapeMap = {
    "c": "", // custom css
    "o": "", // object
    "O": "", // object
    "s": "", // string
    "d": "", // integer
    "i": "", // integer
    "f": "", // float. supports formatting: %.2f

}
/*
background color
log: rgb(35, 35, 39)
warn: rgb(66, 56, 31)
error: rgb(75, 47, 54)

border color
       dark gray        light gray
log: rgb(56, 56, 61) rgb(215, 215, 219)
warn: rgb(86, 86, 46)
error: rgb(116, 62, 76)


vertical indent bar: object blue

text color
default: rgb(215, 215, 219)
group title: bold rgb(177, 177, 179)
object blue: rgb(117, 191, 255)
string pink: rgb(255, 125, 233)
number/bool green: rgb(134, 222, 116)
undefined gray: rgb(147, 147, 149)

empty strings are replaced by <empty string> in italics
functions: function  <name>()
*/

export class CustomConsole {
    config = {}
    constructor(parent, config) {
        this.parent = parent;
        extend(this.config, config);
    }
    log(...args) {
        this.logLine = {
            icon: "none",
            backgroundColor: ""
        }

    }
}

const defaultFormatter = {
    hasBody: function (obj) {
        return obj instanceof Object;
    },
    header: function (obj) { // placeholder
        return ["div", {
            style: "color: blue; font-weight: bold;"
        }, obj.constructor.name];
    },
    body: function (obj) { // placeholder
        return ["div", {
            style: "color: black; font-weight: normal;"
        }, JSON.stringify(obj)];
    }
}

function checkCustomFormatters(obj) {
    if (!window.customFormatters || !Array.isArray(window.customFormatters)) {
        window.customFormatters = [];
        return false;
    }
    let formatter = window.customFormatters.find(formatter => {
        if (typeof formatter.hasBody == "function") {
            return formatter.hasBody(obj);
        }
    });
}