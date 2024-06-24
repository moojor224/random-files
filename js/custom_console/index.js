import { createElement, extend, jst_CSSRule as CSSRule, jst_CSSStyleSheet as CSSStyleSheet } from "../synced/jstools.js";

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

warn: rgb(66, 56, 31)
error: rgb(75, 47, 54)

border color
       dark gray        light gray
log: rgb(56, 56, 61) rgb(215, 215, 219)
warn: rgb(86, 86, 46)
error: rgb(116, 62, 76)


vertical indent bar: object blue

text color

group title: bold rgb(177, 177, 179)
object blue: rgb(117, 191, 255)
string pink: rgb(255, 125, 233)
number/bool green: rgb(134, 222, 116)
undefined gray: rgb(147, 147, 149)

empty strings are replaced by <empty string> in italics
functions: function  <name>()
*/
let styleSheet = new CSSStyleSheet();
let mainContainerRule = new CSSRule(".custom-console-container", {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "30px 1fr",
    fontFamily: "monospace",
    fontSize: "16px",
    zIndex: "9999",
    resize: "both",
    top: "10px",
    left: "10px",
    position: "absolute",
    backgroundColor: "#232327",
    width: "500px",
    height: "200px",
    overflow: "auto",
    minHeight: "60px",
    minWidth: "100px",
});
let headerRule = new CSSRule(".custom-console-header", {
    display: "grid",
    gridTemplateColumns: "30px 1fr",
});
let logsRule = new CSSRule(".custom-console-logs", {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    overflow: "auto",
    color: "rgb(215, 215, 219)",
    border: "1px solid rgb(215, 215, 219)",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
});
let messageRule = new CSSRule(".custom-console-message", {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderWidth: "0 0 1px 0",
    boxSizing: "border-box",
});
let messageChildrenRule = new CSSRule(".custom-console-message>*", {
    padding: "5px",
});
let indentRule = new CSSRule(".custom-console-group-indent", {
    width: "20px",
    height: "100%",
    borderRight: "1px solid rgb(117, 191, 255)",
});

styleSheet.addRules(
    mainContainerRule,
    headerRule,
    logsRule,
    messageRule,
    messageChildrenRule,
    indentRule
);
styleSheet.inject();

function timestamp() {
    let date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${(date.getMilliseconds() + "").padStart(3, "0")}`
}
function jsonmltoHTML(jsonml) {
    if (Array.isArray(jsonml)) {

    } else if (typeof jsonml == "string") {
        document.createTextNode(jsonml)
    } else if (typeof jsonml == "number") {
        return createElement("span", {
            innerHMTL: jsonml, lang,
            style: {
                color: "",
            }
        })
    }
    return document.createTextNode(jsonml);

}
function parseLog(arg) {
    return "" + arg;
}
export class CustomConsole {
    config = {}
    groups = [];
    constructor(parent, config = {}) {
        if (!styleSheet.injected)
            extend(this.config, config);
        this.el = createElement("div", { classList: "custom-console-logs" });
        parent.add(createElement("div", { classList: "custom-console-container" }).add(
            createElement("div", { classList: "custom-console-header" }),
            this.el
        ));
        this.x = 10;
        this.y = 10;
    }
    renderAsGroup(parent) {
        this.el = parent;
    }
    move(x = this.x, y = this.y) {
        this.el.style.left = x + "px";
        this.el.style.top = y + "px";
    }
    _message({ backgroundColor, color, borderColor, icon }, ...args) {
        this.el.add(createElement("div", {
            classList: "custom-console-message",
            style: {
                backgroundColor: backgroundColor,
                color: color,
                borderColor: borderColor,
                borderStyle: "solid",
            }
        }).add(
            createElement("div", { classList: "custom-console-timestamp", innerHTML: timestamp() }),
            createElement("div", { classList: `custom-console-icon ${icon}` }),
            createElement("div", { classList: "custom-console-message-contents" }).add(...args.map(parseLog)),
        ));
    }
    log(...args) {
        let target = this;
        while (target.groups.length > 0) {
            target = target.groups[target.groups.length - 1];
        }
        target._message({
            backgroundColor: "#232327",
            color: "rgb(215, 215, 219)",
            icon: "",
            borderColor: "#38383d",
        }, ...args);
    }
    _group(args, collapsed) {
        let target = this;
        while (target.groups.length > 0) {
            target = target.groups[target.groups.length - 1];
        }
        let logger = new CustomConsole(createElement("div"));
        let groupDetails = createElement("details").add(createElement("summary", {
            style: {
                fontWeight: 700,
            }
        }).add(...args.map(parseLog)));
        if (!collapsed) {
            groupDetails.setAttribute("open", "");
        }
        let groupTitle = createElement("div", {
            classList: "custom-console-message",
            style: {
                backgroundColor: "#232327",
                color: "rgb(215, 215, 219)",
                borderColor: "#38383d",
                borderStyle: "solid",
            }
        }).add(
            createElement("div", { classList: "custom-console-timestamp", innerHTML: timestamp() }),
            createElement("div", { classList: `custom-console-icon ${"icon"}` }),
            createElement("div", { classList: "custom-console-message-contents" }).add(groupDetails),
        );
        logger.renderAsGroup(groupDetails);
        target.groups.push(logger);
        target.el.add(groupTitle);
    }
    group(...args) {
        this._group(args, false);
    }
    groupCollapsed(...args) {
        this._group(args, true);
    }
    groupEnd() {
        this.groups.pop();
    }
}

const defaultFormatter = {
    hasBody: function (obj) {
        return obj instanceof Object;
    },
    header: function (obj) { // placeholder
        return ["div", {
            style: "color: blue; font-weight: bold;"
        }, obj.constructor.name + "{  }"];
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

let custom_console = new CustomConsole(document.body);
custom_console.log("Hello, world!");
custom_console.log("Hello, world!");
custom_console.log("Hello, world!");
custom_console.group("Hello, world!");
custom_console.log("Hello, world!");
custom_console.log("Hello, world!");
custom_console.groupCollapsed("Hello, world!");
custom_console.log("Hello, world!");
custom_console.log("Hello, world!");
custom_console.groupEnd();
custom_console.log("Hello, world!");
custom_console.log("Hello, world!");
custom_console.groupEnd();
custom_console.log("Hello, world!");