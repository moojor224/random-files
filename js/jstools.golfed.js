import { devlog } from "./dev-helper.js";
import { Prism } from "./prism.js";
import { js_beautify } from "./beautify.js";
p=e=>typeof e
export function waitForKeyElements(qu,cb,st,el){let o,r;(o=void(0)===el?$(qu):$(el).contents().find(qu))&&o.length>0?((r=!0),o.each(function(){let e=$(this);e.data("alreadyFound")||false||(cb(e)?(r=false):e.data("alreadyFound",true));})):(r=false);let l=waitForKeyElements.controlObj||{},i=qu.replace(/[^\w]/g,"_"),c=l[i];r&&st&&c?(clearInterval(c),delete l[i]):c||((c=setInterval(function(){waitForKeyElements(qu,cb,st,el);},1000)),(l[i]=c));waitForKeyElements.controlObj=l;}
let createElement = window.createElement;
if(createElement===undefined)c="createElement",createElement=(j,d={},t=p(j)[1]=="t"?document[c](j):j)=>(Object.keys(d).map(e=>(p(d[e])[0]=="o")?window[c](t[e]||(t[e]={}),d[e]):(t instanceof Element?((e.startsWith("on")&&p(d[e])[0]=="f")?t.addEventListener(e.substring(2),d[e]):t[e]=d[e]):t[e]=d[e])),t)

if (createElement === undefined) {
    createElement = function (tag, data = {}) {
        if (typeof tag === "string" && tag.match(/[^a-zA-Z0-9]/g)) {
            div=createElement("div");
            if (expandAbbreviation && typeof expandAbbreviation == "function") div.innerHTML = expandAbbreviation(tag);
            else if (emmet && emmet.expandAbbreviation && typeof emmet.expandAbbreviation == "function") div.innerHTML = emmet.expandAbbreviation(tag);
            let arr = Array.from(div.children);
            return arr.length == 1 ? arr[0] : div;
        }
    }
}
export{createElement}

add=(...args)=>(t=this,args.forEach(elem=>t.append(elem)),t)
Element.prototype.add===undefined?Element.prototype.add=add:0;
Object.getOwnPropertyNames(window).filter(e=>e.startsWith("HTML")&&e.endsWith("Element")).forEach(e=>window[e].prototype.add!==add?window[e].prototype.add=add:0);

window.Element.prototype.error=text=>(this.clearError(),this.add(createElement("error",{innerHTML:text||"!"})))
window.Element.prototype.clearError = function () {
    for (let e of this.childNodes)if(e.tagName.toLowerCase()=="error")return(e.remove(),true)
    return false;
}
export function warn(str, ...sels) {
    clearWarn(...sels)
    let w=createElement("warn",{innerHTML: str})
    sels.forEach(s=>{
        el=s;
        if(p(s)==="string")el=document.querySelector(s);
        el.append(w.cloneNode(true));
    });
}
export function clearWarn(...sels) {
    sels.forEach(s => {
        el=s;
        if (p(s)==="string")el=document.querySelector(s);
        for (let e of el.children) {
            if (e.tagName.toLowerCase() == "warn") {
                e.remove();
            }
        }
    });
}
export function error(str, ...selectors) {
    clearWarn(...selectors);
    let w=createElement("error",{innerHTML:str});
    selectors.forEach(s => {
        let el = s;
        if (p(s) === "string") {
            el = document.querySelector(s);
        }
        el.append(w.cloneNode(true));
    });
}
export function clearError(...selectors) {
    selectors.forEach(s => {
        let el = s;
        if (p(s) === "string") {
            el = document.querySelector(s);
        }
        for (let e of el.children) {
            if (e.tagName.toLowerCase() == "error") {
                e.remove();
            }
        }
    });
}
export function hide(...selectors) {
    for (let s of selectors) (p(s) == "string" ? document.querySelector(s) : s).classList.add("hidden");
}

export function show(...selectors) {
    for (let s of selectors) (p(s) == "string" ? document.querySelector(s) : s).classList.remove("hidden");
}

export function clear(...selectors) {
    for(let s of selectors){
        s=p(s)=="string"?document.querySelector(s):s;
        let arr=flattenChildNodes(s);
        if(arr.includes(s))arr.splice(arr.indexOf(s), 1);
        while(arr.length>0) {
            let el=arr.pop();
            if(el.remove)el.remove();
        }
        s.innerHTML="";
    }
}

export function disable(message, ...selectors) {
    for(s of selectors)(p(s)[1]=="t"?document.querySelector(s):s).setAttribute("disabled",message);
}

export function enable(...selectors) {
    for(s of selectors)(p(s)[1]=="t"?document.querySelector(s):s).removeAttribute("disabled");
}

export function tabColor(color) {
    function valid(c) {
        if(["unset","initial","inherit"].includes(c))return false;
        const s=createElement("div").style;
        s.color=c;
        return s.color!=="";
    }
    if(!valid(color))return;
    let c=createElement("canvas",{width:1,height:1}),ctx=c.getContext("2d");
    ctx.fillStyle=color;
    ctx.fillRect(0,0,1,1);
    document.head.append(createElement(document.querySelector("link[rel=icon]")||"link",{href:c.toDataURL(),rel:"icon"}));
}

export function parseCookies(cookies = document.cookie) {
    console.log(cookies);
    let reading=!1,escaped=!1,quoted=NaN,key="",value="",map=new Map();
    cookies.trim().split("").forEach((e) => {
        if (escaped) {
            value += e;
            escaped = false;
        } else if (reading) {
            if(quoted==NaN){
                quoted=e=='"';
                if(!quoted)value+=e;
            }else if((e=='"'&&quoted)||(e==";"&&!quoted))(quoted=NaN,map.set(key.trim(),value),reading=false,value="",key="")
            else value+=e;
            
        }else if(e=="=") {
            reading=true;
        }else{
            key+=e;
        }
    });
    if(key!=""){
        map.set(key.trim(),value);
    }
    return map;
}
dynamicSort=(P)=>(sO=(p(P)[1]=="t"&&P[0]=="-")?(P=P.substring(1),-1):1,(a,b)=>(a[P]<b[P]?-1:a[P]>b[P]?1:0)*sO);
export{dynamicSort}

export function advancedDynamicSort(...P){
    let D=(P,c=(a,b,chain)=>{
            let p=chain[0].trim(),sO=(p[0]=="-"?(p=p.substring(1),-1):1);
            if([a[p],b[p]].includes(undefined)||chain.length==1)return sO*(a[p]<b[p]?-1:a[p]>b[p]?1:0)
            if(chain.length>1)return c(a[p],b[p],chain.slice(1))
        })=>{
        P=P.split(".")
        return(a,b)=>c(a,b,P)
    }
    P=P.map(e=>D(e))
    return(a,b,funcs=[...P],result)=>(r=_=>result=funcs.shift()(a,b),w=_=>(result==0&&funcs.length>0)?w(r()):0,w(r()),result)
}

export function rgbGradient(P,colors=[{r:255,g:0,b:0},{r:255,g:0x7f,b:0},{r:255,g:127,b:0},{r:0,g:255,b:0},{r:0,g:0,b:255},{r:255,g:0,b:255}]){
    let numChunks = colors.length - 1;
    let chunkSize = 100 / numChunks;
    for (let i = 1; i <= numChunks; i++) {
        if (P <= chunkSize * i) {
            let percent = ((P + (1 - i) * chunkSize) * numChunks) / 100;
            let c1 = colors[i], c2 = colors[i - 1];
            let result = [];
            Object.keys(colors[0]).forEach((e) => {
                result.push(Math.floor((c1[e] * percent + c2[e] * (1 - percent)) * 100) / 100);
            });
            return "rgb(" + result.join(",") + ")";
        }
    }
}

export function map(x, inmin, inmax, outmin, outmax, cmp = false) {
    return ((cmp ? clamp(x, inmin, inmax) : x) - inmin) * (outmax - outmin) / (inmax - inmin) + outmin;
}

export function gradient(count, colors = [
    { r: 0xff, g: 0, b: 0 },
    { r: 0xff, g: 0x7f, b: 0 },
    { r: 0xff, g: 0xff, b: 0 },
    { r: 0, g: 0xff, b: 0 },
    { r: 0, g: 0, b: 0xff },
    { r: 0xff, g: 0, b: 0xff },
]) {
    if (count == 1) {
        let { r, g, b } = colors[0];
        return [`rgb(${r},${g},${b})`];
    }
    let arr = new Array(count).fill("");
    arr = arr.map((e, n) => rgbGradient(map(n, 0, count - 1, 0, 100), colors));
    return arr;
}

export function interleaveArrays(fill, ...arrays) {
    if (fill) {
        let max = Math.max(...arrays.map(e => e.length));
        arrays = arrays.map(arr => [...arr, ...new Array(max - arr.length).fill(null)]);
    }
    let result = [];
    while (arrays.filter(e => e.length > 0).length > 0) {
        arrays.forEach(arr => {
            if (arr.length > 0) result.push(arr.shift());
        });
    }
    return result;
}

export function captureConsole() {
    if (console.everything === undefined) {
        console.everything = [];
        function TS() {
            return (new Date).toLocaleString("sv", { timeZone: 'UTC' }) + "Z"
        }
        window.onerror = function (error, url, line) {
            console.everything.push({
                type: "exception",
                timeStamp: TS(),
                value: { error, url, line }
            })
            return false;
        }
        window.onunhandledrejection = function (e) {
            console.everything.push({
                type: "promiseRejection",
                timeStamp: TS(),
                value: e.reason
            });
        }
        function hookLogType(logType) {
            const original = console[logType].bind(console);
            return function (...args) {
                console.everything.push({
                    type: logType,
                    timeStamp: TS(),
                    value: Array.from(args)
                });
                original.apply(console, args);
            }
        }

        ['log', 'error', 'warn', 'debug'].forEach(logType => {
            console[logType] = hookLogType(logType)
        });
    }
}

export function flattenChildren(arr) {
    return [arr, ...(arr.children?.flatMap((e) => flattenChildren(e)) || [])];
}

export function flattenChildNodes(el) {
    return [el, ...([...el.childNodes].flatMap((e) => flattenChildNodes(e)) || [])];
}

function convertTime(b) {
    b.setHours(b.getHours() + new Date().getTimezoneOffset() / 60);
    return b.toISOString();
}

export function getColor(varname, ...append) {
    let color = getComputedStyle(document.querySelector(":root")).getPropertyValue(varname);
    if (color.match(/^#[a-zA-Z0-9]{3}$/g)) {
        color = "#" + color.substring(1).split("").map(e => e.padStart(e, 2)).join("") + append.join("");
    }
    return color + append.join("");
}

export function lockValue(callback, ...args) {
    return class {
        constructor(){}
        static valueOf(){
            return callback(...args);
        }
    }
}

export function listAllColorsOnPage() {
    function hexToRgb(color) {
        if (color.match(/#?([a-zA-Z0-9]{8}|[a-zA-Z0-9]{6}|[a-zA-Z0-9]{3,4})/g)?.at(0) === color) {
            color = color.replace("#", "");
            let split, a;
            switch (color.length) {
                case 4:a=true;
                case 3:split=color.split("");break
                case 8:a=true;
                case 6:split=color.match(/.{1,2}/g);break
            }
            return `rgb${a ? "a" : ""}(${split.map((e, n) => parseInt(e.padStart(2, e), 16) / (n == 3 ? 255 : 1)).join(", ")})`;
        }
    }

    rgbToHex=rgb=>"#"+rgb.replaceAll(/[^0-9\.,]/g,"").split(",").map((e,n)=>parseInt(e*(n==3?255:1)).toString(16).padStart(2,e)).join("");

    getColor=rgb=>{
        let [r,g,b] = rgb.replaceAll(/[^0-9 ]/g, "").split(" ");
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
    }

    let colorProps = ["backgroundColor", "color"];

    function displayResults(array) {
        array.forEach(e => {
            console.groupCollapsed(`%c${rgbToHex(e.value)} (${(e.varName)})`, `color:${getColor(e.value)};background-color:${e.value};padding:20px;line-height:60px;font-size:20px`);
            colorProps.forEach(prop=>{
                if (e[prop].length>0) {
                    console.groupCollapsed("%c "+prop,"font-size: 20px;");
                    e[prop].forEach(v=>console.log(v[0]));
                    console.groupEnd();
                }
            })
            console.groupEnd();
        });
    }

    let arr=[...new Array(106).fill(0).map((e, n)=>"--color"+(n + 1)),...new Array(10).fill(1).map((e,n)=>"--transparent"+(n+1))],root=getComputedStyle(document.querySelector(":root")),els=flattenChildren(document.body).map(e=>[e,getComputedStyle(e)]);
    arr=arr.map(c=>{
        let color=root.getPropertyValue(c);
        color=hexToRgb(color);
        let obj={value:color,varName:c};
        colorProps.forEach(e=>obj[e]=els.filter(r=>r[1][e]===color));
        return obj;
    }).filter(e=>colorProps.map(p=>e[p].length>0).includes(true));
    console.log(arr);
    displayResults(arr);
}

export let clamp=(v,n,x)=>(((n>x)?([n,x]=[x,n]):0),(v<n?n:v>x?x:v));
export let getValueOrDefault=(val,def)=>(val===undefined||val===null)?def:val;
export let extend=(t,s)=>(Object.keys(s).forEach(k=>{t[k]=s[k]}),t);

function convertBase(str, fromBase, toBase) {
    const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    function add(x, y, base) {
        let z = [];
        const n = Math.max(x.length, y.length);
        let carry = 0;
        let i = 0;
        while (i < n || carry) {
            const xi = i < x.length ? x[i] : 0;
            const yi = i < y.length ? y[i] : 0;
            const zi = carry + xi + yi;
            z.push(zi % base);
            carry = Math.floor(zi / base);
            i++;
        }
        return z;
    }

    function multiplyByNumber(num, x, base) {
        if (num < 0) return null;
        if (num == 0) return [];

        let result = [];
        let power = x;
        while (true) {
            num & 1 && (result = add(result, power, base));
            num = num >> 1;
            if (num === 0) break;
            power = add(power, power, base);
        }

        return result;
    }

    function parseToDigitsArray(str, base) {
        const digits = str.split('');
        let arr = [];
        for (let i = digits.length - 1; i >= 0; i--) {
            const n = DIGITS.indexOf(digits[i])
            if (n == -1) return null;
            arr.push(n);
        }
        return arr;
    }

    const digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    let outArray = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
        digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
        power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let i = outArray.length - 1; i >= 0; i--)
        out += DIGITS[outArray[i]];

    return out;
}

let Settings = window.Settings;
if (Settings === undefined) {
    Settings = class extends EventTarget {
        config = {
            name: "settings"
        };
        sections = [];
        constructor(config = {}, sections) {
            super();
            extend(this.config, config);
            if (!Array.isArray(sections)) {
                sections = [sections];
            }
            this.sections = sections.filter(e => e instanceof Section);
            sections.forEach(section => {
                section.settings_obj = this;
            });
        }

        render() {
            devlog("render settings");
            let div = createElement("div", {
                classList: "settings"
            }).add(
                createElement("h2", { innerHTML: this.config.name })
            );
            div.add(...this.sections.map(s => s.render()));
            return div;
        }
        getSection(id) {
            return this.sections.find(e => e.config.id == id);
        }
        export() {
            let data = JSON.parse(JSON.stringify(this, function (key, value) {
                if (key.includes("_obj")) {
                    return undefined;
                }
                return value;
            }));
            data.sections.forEach(sec => {
                sec.options.forEach(e => delete e.input)
            });
            console.log(data);
            return JSON.stringify(data);
        }
        dispatchEvent(event) {
            let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this);
            originalDispatch.apply(this, [event])
            return !event.defaultPrevented || !event.cancelable;
        }
        on(type, callback) {
            this.addEventListener(type, callback);
        }
        off(type, callback) {
            this.removeEventListener(type, callback);
        }
        static fromJson(jsontext) {
            if (jsontext.length == 0) {
                return null;
            }
            try {
                let json = JSON.parse(jsontext);
                let validate = Joi.object({
                    config: Joi.object({
                        name: Joi.string().required()
                    }).required(),
                    sections: Joi.array().items(Joi.object({
                        config: Joi.object({
                            name: Joi.string().required(),
                            id: Joi.string().required()
                        }),
                        options: Joi.array().items(Joi.object({
                            config: Joi.object({
                                name: Joi.string().required(),
                                id: Joi.string().required(),
                                type: Joi.string().required(),
                                value: Joi.any(),
                                values: Joi.array()
                            }).required()
                        })).required()
                    })).required()
                }).validate(json);
                if (validate.error) {
                    console.error("invalid json data");
                    throw new Error(validate.error);
                }
                return new Settings(json.config, json.sections.map(sec => {
                    return new Section(sec.config, sec.options.map(opt => {
                        return new Option(opt.config);
                    }));
                }));
            } catch (err) {
                console.error(err);
                return err;
            }
        }

        replaceWith(settings) {
            devlog("replacing", Object.assign({}, this), "with", Object.assign({}, settings));
            if (!(settings instanceof Settings)) {
                devlog("settings object is not an instance of the Settings class", settings);
                return;
            }
            this.config = settings.config;
            this.sections = settings.sections;
        }
    }
}

let Section = window.Section;
if (Section === undefined) {
    Section = class extends EventTarget {
        settings_obj = null;
        config = {
            name: "section"
        }
        options = [];
        constructor(config, options) {
            super();
            extend(this.config, config);
            if (!Array.isArray(options)) {
                options = [options];
            }
            this.options = options.filter(e => e instanceof Option);
            options.forEach(option => {
                option.section_obj = this;
            });
        }
        getOption(name) {
            return this.options.find(e => e.config.id == name);
        }
        render() {
            devlog("render section");
            let section = createElement("section").add(
                createElement("h2", { innerHTML: this.config.name })
            );
            section.add(...this.options.map(o => o.render()));
            return section;
        }
        dispatchEvent(event) {
            this.settings_obj.dispatchEvent(event);
            let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this);
            originalDispatch.apply(this, [event]);
            return !event.defaultPrevented || !event.cancelable;
        }
        on(type, callback) {
            this.addEventListener(type, callback);
        }
        off(type, callback) {
            this.removeEventListener(type, callback);
        }
    }
}

let Option = window.Options;
if (Option === undefined) {
    Option = class extends EventTarget {
        input = null;
        section_obj = null;
        config = {
            name: "option",
            type: "toggle",
            value: false
        }
        constructor(config) {
            super();
            extend(this.config, config);
            if (config.value == undefined && config.values) {
                this.config.value = config.values[0];
            }
        }

        get value() {
            return this.config.value;
        }

        set value(val) {
            devlog("set value to", val);
            show("#loadingModal");
            let option = this;
            let previousVal = this.config.value;
            this.config.value = val;
            fetch("/Reports/Report/SaveSettings", {
                method: "POST",
                body: this.section_obj.settings_obj.export(),
                headers: {
                    "X-CSRF-TOKEN": Cookies.get("CSRF-TOKEN")
                }
            }).then(e => {
                e.text().then(t => {
                    if (t.includes("error")) {
                        devlog("error saving settings");
                        this.config.value = previousVal;
                        if (this.input.checked != undefined) {
                            this.input.checked = previousVal;
                        } else {
                            this.input = previousVal;
                        }
                    } else {
                        devlog("successfully saved settings");
                    }
                    option.dispatchEvent(new Event("change"));
                    hide("#loadingModal");
                });
            });
        }
        render() {
            devlog("render option");
            let label = createElement("label");
            let span = createElement("span", {
                innerHTML: this.config.name
            });
            let input = this.createInput();
            label.add(span, input);
            return label;
        }
        createInput() {
            let input;
            let option = this;
            if (this.config.type == "toggle") {
                input = createElement("input", {
                    type: "checkbox",
                    classList: "slider",
                    checked: option.config.value
                });
            } else if (this.config.type == "dropdown") {
                input = createElement("select");
                let values = [];
                if (this.config.values || (!["undefined", "null"].includes(typeof this.config.values))) {
                    if (!Array.isArray(this.config.values)) {
                        this.config.values = [this.config.values];
                    }
                    values.push(...this.config.values);
                }
                values = Array.from(new Set(values));
                input.add(...values.map(v => createElement("option", {
                    innerHTML: v
                })));
                if (this.config.value && !this.config.values.includes(this.config.value)) {
                    input.insertAdjacentElement("afterBegin", createElement("option", {
                        innerHTML: this.config.value,
                        value: this.config.value,
                        hidden: true,
                        disabled: true
                    }));
                }
                input.value = this.config.value || this.config.values[0];
            }
            input.addEventListener("input", function () {
                if (input.checked != undefined) {
                    option.value = input.checked;
                } else {
                    option.value = input.value;
                }
            });
            return input;
        }
        dispatchEvent(event) {
            this.section_obj.dispatchEvent(event);
            let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this);
            originalDispatch.apply(this, [event]);
            return !event.defaultPrevented || !event.cancelable;
        }
        on(type, callback) {
            this.addEventListener(type, callback);
        }
        off(type, callback) {
            this.removeEventListener(type, callback);
        }
    }
}

export { Settings, Section, Option };


export let settings = new Settings({
    name: "Settings"
}, [
    new Section({
        name: "Billing Report",
        id: "Sites_PlayerSummariesListNew"
    }, [
        new Option({
            name: "Graph Type",
            id: "graph_type",
            type: "dropdown",
            values: ["bar", "line"]
        }),
        new Option({
            name: "Show Composite Graph",
            id: "composite_graph",
            type: "toggle",
            value: false
        }),
        new Option({
            name: "Show Individual Graphs",
            id: "individual_graph",
            type: "toggle",
            value: false
        })
    ]),
    new Section({
        name: "Online Game Report",
        id: "SereneOnlineGameReport"
    }, [
        new Option({
            name: "Graph Type",
            id: "graph_type",
            type: "dropdown",
            values: ["bar", "line"]
        })
    ]),
    new Section({
        name: "Recent Player Count",
        id: "SereneRecentPlayerCount"
    }, [
        new Option({
            name: "Graph Type",
            id: "graph_type",
            type: "dropdown",
            values: ["bar", "line",
                "cal"
            ]
        })
    ])
]);

export function copyObject(obj) {
    return clone(obj);
}

function clone(obj) {
    let result = obj;
    var type = {}.toString.call(obj).slice(8, -1);
    if (type == 'Set') {
        return new Set([...obj].map(value => clone(value)));
    }
    if (type == 'Map') {
        return new Map([...obj].map(kv => [clone(kv[0]), clone(kv[1])]));
    }
    if (type == 'Date') {
        return new Date(obj.getTime());
    }
    if (type == 'RegExp') {
        return RegExp(obj.source, getRegExpFlags(obj));
    }
    if (type == 'Array' || type == 'Object') {
        result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            result[key] = clone(obj[key]);
        }
    }
    return result;
}

function getRegExpFlags(regExp) {
    if (typeof regExp.source.flags == 'string') {
        return regExp.source.flags;
    } else if (regExp.flags) {
        return regExp.flags;
    } else {
        var flags = [];
        regExp.global && flags.push('g');
        regExp.ignoreCase && flags.push('i');
        regExp.multiline && flags.push('m');
        regExp.sticky && flags.push('y');
        regExp.unicode && flags.push('u');
        return flags.join('');
    }
}

function parseTrace(trace) {
    let paths = trace.trim().split("\n").map(p => {
        const a = p.split("@");
        const locs = a.pop().split(":");
        return {
            func: a.join("@"),
            char: parseInt(locs.pop()),
            line: parseInt(locs.pop()),
            location: locs.join(":"),
        }
    });
    return paths;
}

function toHTMLEntities(str) {
    return [...str].split("").map(e => `&#${e.charCodeAt(0)};`).join("");
}

let svgToDataUri = (function () {
    const shorterNames = {
        aqua: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
        azure: /#f0ffff(ff)?(?!\w)/gi,
        beige: /#f5f5dc(ff)?(?!\w)/gi,
        bisque: /#ffe4c4(ff)?(?!\w)/gi,
        black: /#000000(ff)?(?!\w)|#000(f)?(?!\w)/gi,
        blue: /#0000ff(ff)?(?!\w)|#00f(f)?(?!\w)/gi,
        brown: /#a52a2a(ff)?(?!\w)/gi,
        coral: /#ff7f50(ff)?(?!\w)/gi,
        cornsilk: /#fff8dc(ff)?(?!\w)/gi,
        crimson: /#dc143c(ff)?(?!\w)/gi,
        cyan: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
        darkblue: /#00008b(ff)?(?!\w)/gi,
        darkcyan: /#008b8b(ff)?(?!\w)/gi,
        darkgrey: /#a9a9a9(ff)?(?!\w)/gi,
        darkred: /#8b0000(ff)?(?!\w)/gi,
        deeppink: /#ff1493(ff)?(?!\w)/gi,
        dimgrey: /#696969(ff)?(?!\w)/gi,
        gold: /#ffd700(ff)?(?!\w)/gi,
        green: /#008000(ff)?(?!\w)/gi,
        grey: /#808080(ff)?(?!\w)/gi,
        honeydew: /#f0fff0(ff)?(?!\w)/gi,
        hotpink: /#ff69b4(ff)?(?!\w)/gi,
        indigo: /#4b0082(ff)?(?!\w)/gi,
        ivory: /#fffff0(ff)?(?!\w)/gi,
        khaki: /#f0e68c(ff)?(?!\w)/gi,
        lavender: /#e6e6fa(ff)?(?!\w)/gi,
        lime: /#00ff00(ff)?(?!\w)|#0f0(f)?(?!\w)/gi,
        linen: /#faf0e6(ff)?(?!\w)/gi,
        maroon: /#800000(ff)?(?!\w)/gi,
        moccasin: /#ffe4b5(ff)?(?!\w)/gi,
        navy: /#000080(ff)?(?!\w)/gi,
        oldlace: /#fdf5e6(ff)?(?!\w)/gi,
        olive: /#808000(ff)?(?!\w)/gi,
        orange: /#ffa500(ff)?(?!\w)/gi,
        orchid: /#da70d6(ff)?(?!\w)/gi,
        peru: /#cd853f(ff)?(?!\w)/gi,
        pink: /#ffc0cb(ff)?(?!\w)/gi,
        plum: /#dda0dd(ff)?(?!\w)/gi,
        purple: /#800080(ff)?(?!\w)/gi,
        red: /#ff0000(ff)?(?!\w)|#f00(f)?(?!\w)/gi,
        salmon: /#fa8072(ff)?(?!\w)/gi,
        seagreen: /#2e8b57(ff)?(?!\w)/gi,
        seashell: /#fff5ee(ff)?(?!\w)/gi,
        sienna: /#a0522d(ff)?(?!\w)/gi,
        silver: /#c0c0c0(ff)?(?!\w)/gi,
        skyblue: /#87ceeb(ff)?(?!\w)/gi,
        snow: /#fffafa(ff)?(?!\w)/gi,
        tan: /#d2b48c(ff)?(?!\w)/gi,
        teal: /#008080(ff)?(?!\w)/gi,
        thistle: /#d8bfd8(ff)?(?!\w)/gi,
        tomato: /#ff6347(ff)?(?!\w)/gi,
        violet: /#ee82ee(ff)?(?!\w)/gi,
        wheat: /#f5deb3(ff)?(?!\w)/gi,
        white: /#ffffff(ff)?(?!\w)|#fff(f)?(?!\w)/gi,
    };
    const REGEX = {
        whitespace: /\s+/g,
        urlHexPairs: /%[\dA-F]{2}/g,
        quotes: /"/g,
    }

    function collapseWhitespace(str) {
        return str.trim().replace(REGEX.whitespace, ' ');
    }

    function dataURIPayload(string) {
        return encodeURIComponent(string)
            .replace(REGEX.urlHexPairs, specialHexEncode);
    }

    // `#` gets converted to `%23`, so quite a few CSS named colors are shorter than
    // their equivalent URL-encoded hex codes.
    function colorCodeToShorterNames(string) {
        Object.keys(shorterNames).forEach(function (key) {
            if (shorterNames[key].test(string)) {
                string = string.replace(shorterNames[key], key);
            }
        });

        return string;
    }

    function specialHexEncode(match) {
        switch (match) { // Browsers tolerate these characters, and they're frequent
            case '%20': return ' ';
            case '%3D': return '=';
            case '%3A': return ':';
            case '%2F': return '/';
            default: return match.toLowerCase(); // compresses better
        }
    }

    function svgToTinyDataUri(svgString) {
        if (typeof svgString !== 'string') {
            throw new TypeError('Expected a string, but received ' + typeof svgString);
        }
        // Strip the Byte-Order Mark if the SVG has one
        if (svgString.charCodeAt(0) === 0xfeff) { svgString = svgString.slice(1) }

        var body = colorCodeToShorterNames(collapseWhitespace(svgString))
            .replace(REGEX.quotes, "'");
        return 'data:image/svg+xml,' + dataURIPayload(body);
    }

    svgToTinyDataUri.toSrcset = function toSrcset(svgString) {
        return svgToTinyDataUri(svgString).replace(/ /g, '%20');
    }
    return svgToTinyDataUri.toSrcset;
})();

export function logFormatted(object, options = {}) {
    let { embedObjects, raw, collapsed, maxDepth, label } = (function () {
        let defaults = {
            embedObjects: false, // embed the objects within the console message
            raw: false, // return the raw result without logging it to the console
            collapsed: false, // log the message inside a collapsed console group  (increases performace for larger objects)
            maxDepth: Infinity, // maximum depth to stringify
            label: "formatted log", // label for collapsed console group
        }
        let opt = extend(defaults, options); // replace the default values with user-specified options
        return opt;
    })();
    let objects = []; // array that holds list of all objects
    let indentAmount = 1; // number of spaces to indent the stringified object by
    let depth = 0; // current depth
    let embedIndex = 0; // how many characters have been stringified
    let indexes = []; // array of indexes where objects should be embedded
    /**
     * alternative to JSON.stringify that auto-formats the result and supports functions
     * @param {any} obj object to stringify
     * @returns {String}
     */
    function stringify(obj) {
        if (depth > maxDepth) { // prevent stringifying objects deeper than the max depth
            let str = "'<max depth reached>'";
            embedIndex += str.length
            return str;
        }
        const type = typeof obj; // store type of object
        let pad = " ".repeat(indentAmount * 4); // calulate number of spaces to indent
        if (type == "number" || type == "boolean") { // primitives
            let str = "" + obj; // convert to string
            embedIndex += str.length; // add string length to total characters stringified
            return obj;
        } else if (type == "function") {
            objects.push(obj); // add to list of objects
            let beautified = js_beautify(obj.toString().replaceAll("\r", "")); // beautify function to make tabs equal
            let splitFunc = beautified.split("\n"); // split formatted function by lines
            while (splitFunc[1].length == 0) {
                splitFunc.splice(1, 1);// remove first line of function body if it's blank (optional)
            }
            let padded = splitFunc.map((e, n) => (n > 0 ? pad.substring(4) + e : e + " "));
            embedIndex += padded[0].length;
            indexes.push(embedIndex);
            embedIndex += (padded.slice(1).join("\n").length + 1);
            return padded.join("\n");
        } else if (type == "string") {
            let quote;
            if (!obj.includes('"')) {
                quote = '"';
            } else if (!obj.includes("'")) {
                quote = "'";
            } else {
                quote = '"';
            }
            [
                ["\n", "\\n"],
                ["\r", "\\r"],
                ["\t", "\\t"],
                (quote == '"') ? ['"', '\\"'] : ["'", "\\'"],
            ].forEach(e => {
                obj = obj.replaceAll(e[0], e[1]);
            });
            let str = `${quote}${obj}${quote}`;
            embedIndex += str.length;
            return str;
        } else if (type == "object") {
            if (objects.includes(obj)) {
                let str = "<already stringified (recursion prevention)>";
                embedIndex += str.length;
                indexes.push(embedIndex);
                return str;
            }
            objects.push(obj);
            let arr = [];
            indentAmount++;
            depth++;

            embedIndex += 2;
            indexes.push(embedIndex);
            embedIndex += (1 +
                pad.length);

            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    let str = stringify(item);
                    arr.push(str);
                    if (index < obj.length - 1) {
                        embedIndex += 2 +
                            pad.length;
                    }
                });
                indentAmount--;
                depth--;
                embedIndex += (1 +
                    (pad.length - 4) +
                    1);
                return `[ \n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}]`;
            } else {
                if (!obj) {
                    embedIndex += 4;
                    return "null";
                }
                let entries = Object.entries(obj);
                entries.forEach(function (kvp, index) {
                    let [key, value] = kvp;
                    embedIndex += key.length +
                        2;
                    let str = stringify(value);
                    str = `${key}: ${str}`;
                    arr.push(str);
                    if (index < entries.length - 1) {
                        embedIndex += 2 +
                            pad.length;
                    }
                });
                indentAmount--;
                depth--;
                let returnVal = `{ \n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}}`;
                embedIndex += 1 +
                    (pad.length - 4) +
                    1;
                return returnVal;
            }
        } else {
            let str = "" + obj;
            embedIndex += str.length;
            return str;
        }
    }

    let element = createElement("div", { innerHTML: Prism.highlight(stringify(object), Prism.languages.javascript).replaceAll("%", "%%") });

    const regex = /(?<!%)(%%)*%[co]/g;
    const PRISM_CLASSES = [
        [["cdata", "comment", "doctype", "prolog"], "#6a9955"],
        [["boolean", "constant", "number", "property", "symbol", "tag"], "#4fc1ff"],
        [["attr-name", "builtin", "char", "inserted", "selector", "string"], "#ce9178"],
        [["entity", "url", "variable"], "#f4b73d"],
        [["atrule", "attr-value", "keyword"], "#569cd6"],
        [["important", "regex"], "#ee9900"],
        [["deleted"], "#ff0000"],
        [["function"], "#dcdcaa"],
        [["parameter"], "#9cdcfe"],
        [["template-punctuation"], "#ce9178"],
        [["interpolation-punctuation"], "#ff8800"],
        [["class-name"], "#4ec9b0"]
    ];

    function calcStyle(element) {
        if (!element.style) return;
        let classList = [...element.classList];
        classList.forEach(clss => {
            PRISM_CLASSES.forEach(pclass => {
                if (pclass[0].includes(clss)) element.style.color = pclass[1];
            });
        });
    }

    let logs = [];
    let styles = [];
    const flattened = flattenChildNodes(element);
    flattened.forEach(calcStyle);
    if (embedObjects) {
        let index = 0;
        let lastPercent = false;
        function count(node) {
            let text = "";
            node.textContent.split("").forEach(function (char) {
                if (char == "\r") return;
                if (index == indexes[0]) {
                    indexes.shift();
                    text += "%o";
                }
                if (char == "%" && !lastPercent) lastPercent = true;
                else if (lastPercent) {
                    lastPercent = false;
                    index++;
                } else index++;
                text += char;
            });
            node.textContent = text;
        }
        flattened.forEach(e => {
            if (e.nodeName.includes("text")) count(e);
        });
    }

    flattened.forEach(e => {
        if (e.nodeName != "#text") return;
        logs.push(`%c${e.textContent}`);
        let color = "";
        if (e.parentNode.style.color) color = `color:${e.parentNode.style.color};`;
        styles.push(color);
    });
    logs = logs.join("");

    function regexSplit(string) {
        let str = [], reg = [], match, lastindex = 0, index;
        while (match = regex.exec(string)) {
            index = match.index;
            let kind = match[0], mod = 0;
            if (kind.length > 2) {
                str[str.length - 1] += kind.substring(0, kind.length - 2);
                mod = kind.length - 2;
                kind = kind.substring(kind.length - 2);
            }
            str.push(string.substring(((lastindex + 2) > index ? index : (lastindex + 2)), index));
            lastindex = index + mod;
            reg.push(kind);
        }
        str.push(string.substring(lastindex + 2));
        return { split: str, matches: reg, };
    }

    let { matches, split } = regexSplit(logs), final = [], finalStyles = [];
    while (matches.length > 0) {
        let type = matches.shift();
        final.push(split.shift() || "");
        final.push(type);
        if (type == "%o") finalStyles.push(objects.shift() || "");
        else finalStyles.push(styles.shift() || "");
    }
    while (split.length > 0) final.push(split.shift());
    while (embedObjects && objects.length > 0) finalStyles.push(objects.shift());
    while (styles.length > 0) finalStyles.push(styles.shift());

    final = final.join("");
    if(raw)return{logs:final,styles:finalStyles,html:element.outerHTML}
    else{
        if(collapsed){
            console.groupCollapsed(label);
            console.log(final,...finalStyles);
            console.groupEnd();
        }else console.log(final,...finalStyles);
    }
}

window.logFormatted = logFormatted;

(function () {
    const MIN = 32, MAX = 126;
    const SIMPLE = { false: '![]', true: '!![]', undefined: '[][[]]', NaN: '+[![]]', Infinity: '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])' };
    const CONSTRUCTORS = { Array: '[]', Number: '(+[])', String: '([]+[])', Boolean: '(![])', Function: '[]["flat"]', RegExp: 'Function("return/"+false+"/")()', Object: '[]["entries"]()' };
    const MAPPING = {
        'a': '(false+"")[1]',
        'b': '([]["entries"]()+"")[2]',
        'c': '([]["flat"]+"")[3]',
        'd': '(undefined+"")[2]',
        'e': '(true+"")[3]',
        'f': '(false+"")[0]',
        'g': '(false+[0]+String)[20]',
        'h': '(+(101))["to"+String["name"]](21)[1]',
        'i': '([false]+undefined)[10]',
        'j': '([]["entries"]()+"")[3]',
        'k': '(+(20))["to"+String["name"]](21)',
        'l': '(false+"")[2]',
        'm': '(Number+"")[11]',
        'n': '(undefined+"")[1]',
        'o': '(true+[]["flat"])[10]',
        'p': '(+(211))["to"+String["name"]](31)[1]',
        'q': '("")["fontcolor"]([0]+false+")[20]',
        'r': '(true+"")[1]',
        's': '(false+"")[3]',
        't': '(true+"")[0]',
        'u': '(undefined+"")[0]',
        'v': '(+(31))["to"+String["name"]](32)',
        'w': '(+(32))["to"+String["name"]](33)',
        'x': '(+(101))["to"+String["name"]](34)[1]',
        'y': '(NaN+[Infinity])[10]',
        'z': '(+(35))["to"+String["name"]](36)',
        'A': '(NaN+[]["entries"]())[11]',
        'B': '(+[]+Boolean)[10]',
        'C': 'Function("return escape")()(("")["italics"]())[2]',
        'D': 'Function("return escape")()([]["flat"])["slice"]("-1")',
        'E': '(RegExp+"")[12]',
        'F': '(+[]+Function)[10]',
        'G': '(false+Function("return Date")()())[30]',
        'H': null,
        'I': '(Infinity+"")[0]',
        'J': null,
        'K': null,
        'L': null,
        'M': '(true+Function("return Date")()())[30]',
        'N': '(NaN+"")[0]',
        'O': '(+[]+Object)[10]',
        'P': null,
        'Q': null,
        'R': '(+[]+RegExp)[10]',
        'S': '(+[]+String)[10]',
        'T': '(NaN+Function("return Date")()())[30]',
        'U': '(NaN+Object()["to"+String["name"]]["call"]())[11]',
        'V': null,
        'W': null,
        'X': null,
        'Y': null,
        'Z': null,
        ' ': '(NaN+[]["flat"])[11]',
        '!': null,
        '"': '("")["fontcolor"]()[12]',
        '#': null,
        '$': null,
        '%': 'Function("return escape")()([]["flat"])[21]',
        '&': '("")["fontcolor"](")[13]',
        '\'': null,
        '(': '([]["flat"]+"")[13]',
        ')': '([0]+false+[]["flat"])[20]',
        '*': null,
        '+': '(+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]])+[])[2]',
        ',': '[[]]["concat"]([[]])+""',
        '-': '(+(.+[0000001])+"")[2]',
        '.': '(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]',
        '/': '(false+[0])["italics"]()[10]',
        ':': '(RegExp()+"")[3]',
        ';': '("")["fontcolor"](NaN+")[21]',
        '<': '("")["italics"]()[0]',
        '=': '("")["fontcolor"]()[11]',
        '>': '("")["italics"]()[2]',
        '?': '(RegExp()+"")[2]',
        '@': null,
        '[': '([]["entries"]()+"")[0]',
        '\\': '(RegExp("/")+"")[1]',
        ']': '([]["entries"]()+"")[22]',
        '^': null,
        '_': null,
        '`': null,
        '{': '(true+[]["flat"])[20]',
        '|': null,
        '}': '([]["flat"]+"")["slice"]("-1")',
        '~': null
    };
    const GLOBAL = 'Function("return this")()';
    function fillMissingDigits() {
        let output;
        for (let number = 0; number < 10; number++) {
            output = "+[]";
            if (number > 0) output = "+!" + output;
            for (let i = 1; i < number; i++) output = "+!+[]" + output;
            if (number > 1) output = output.substring(1);
            MAPPING[number] = "[" + output + "]";
        }
    }
    function replaceMap() {
        let character = "", value, i, key;
        let replace = (pattern, replacement) => value = value.replace(new RegExp(pattern, "gi"), replacement);
        let digitReplacer = (_, x) => MAPPING[x];
        function numberReplacer(_, y) {
            let values = y.split("");
            let head = +(values.shift());
            let output = "+[]";
            if (head > 0) output = "+!" + output;
            for (i = 1; i < head; i++) output = "+!+[]" + output;
            if (head > 1) output = output.substring(1);
            return [output].concat(values).join("+").replace(/(\d)/g, digitReplacer);
        }

        for (i = MIN; i <= MAX; i++) {
            character = String.fromCharCode(i);
            value = MAPPING[character];
            if (!value) continue;
            for (key in CONSTRUCTORS) replace("\\b" + key, CONSTRUCTORS[key] + '["constructor"]');
            for (key in SIMPLE) replace(key, SIMPLE[key]);
            replace('(\\d\\d+)', numberReplacer);
            replace('\\((\\d)\\)', digitReplacer);
            replace('\\[(\\d)\\]', digitReplacer);
            replace("GLOBAL", GLOBAL);
            replace('\\+""', "+[]");
            replace('""', "[]+[]");
            MAPPING[character] = value;
        }
    }
    function replaceStrings() {
        let regEx = /[^\[\]\(\)\!\+]{1}/g, all, value, missing, count = MAX - MIN;
        function findMissing() {
            let all, value, done = false;
            missing = {};
            for (all in MAPPING) {
                value = MAPPING[all];
                if (value && value.match(regEx)) {
                    missing[all] = value;
                    done = true;
                }
            }
            return done;
        }
        let mappingReplacer = (a, b) => b.split("").join("+");
        let valueReplacer = c => missing[c] ? c : MAPPING[c];
        for (all in MAPPING) if (MAPPING[all]) MAPPING[all] = MAPPING[all].replace(/\"([^\"]+)\"/gi, mappingReplacer);
        while (findMissing()) {
            for (all in missing) {
                value = MAPPING[all];
                value = value.replace(regEx, valueReplacer);
                MAPPING[all] = value;
                missing[all] = value;
            }
            if (count-- === 0) console.error("Could not compile the following chars:", missing);
        }
    }
    function escapeSequence(c) {
        let cc = c.charCodeAt(0);
        if (cc < 256) return '\\' + cc.toString(8);
        else {
            let cc16 = cc.toString(16);
            return '\\u' + ('0000' + cc16).substring(cc16.length);
        }
    }
    let escapeSequenceForReplace = c => escapeSequence(c).replace('\\', 't');
    function encode(input, wrapWithEval, runInParentScope, unmappped = '', output = [], r = "") {
        if (!input) return "";
        for (let k in MAPPING) if (MAPPING[k]) unmappped += k;
        unmappped = new RegExp('[^' + unmappped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']', 'g');
        let unmappedCharactersCount = (input.match(unmappped) || []).length;
        if (unmappedCharactersCount > 1) input = input.replace(/[^0123456789.adefilnrsuN]/g, escapeSequenceForReplace);
        else if (unmappedCharactersCount > 0) input = input.replace(/["\\]/g, escapeSequence).replace(unmappped, escapeSequence);
        for (let i in SIMPLE) r += i + "|";
        r += ".";
        input.replace(new RegExp(r, 'g'), function (c) {
            let replacement = SIMPLE[c];
            if (replacement) output.push("(" + replacement + "+[])");
            else {
                replacement = MAPPING[c];
                if (replacement) output.push(replacement);
                else throw new Error('Found unmapped character: ' + c);
            }
        });
        output = output.join("+");
        if (/^\d$/.test(input)) output += "+[]";
        if (unmappedCharactersCount > 1) output = `(${output})[${encode("split")}](${encode("t")})[${encode("join")}](${encode("\\")})`;
        if (unmappedCharactersCount > 0) output = `[][${encode("flat")}][${encode("constructor")}](${encode("return\"")}+${output}+${encode("\"")})()`;
        if (wrapWithEval) {
            if (runInParentScope) output = `[][${encode("flat")}][${encode("constructor")}](${encode("return eval")})()(${output})`;
            else output = `[][${encode("flat")}][${encode("constructor")}](${output})()`;
        }
        return output;
    }
    fillMissingDigits();
    replaceMap();
    replaceStrings();
    window.JSFuck = { encode };
})();

function meyerDiff(seq1, seq2) {
    var N = seq1.length, M = seq2.length, X = N + M, furthestReaching = [], D, k, x, y, step, src = [], target = [], stepMap = [], dist = X, a;
    for (; dist--;) {
        stepMap[dist] = [];
    }
    furthestReaching[X + 1] = 0;
    for (D = 0; D <= X && dist === -1; D++) {
        for (k = -D, x, y, step; k <= D && dist === -1; k += 2) {
            if (k === -D || (k !== D && furthestReaching[k - 1 + X] < furthestReaching[k + 1 + X])) {
                x = furthestReaching[k + 1 + X];
                step = 3;
            } else {
                x = furthestReaching[k - 1 + X] + 1;
                step = 2;
            }
            y = x - k;
            stepMap[x][y] = step;
            while (x < N && y < M && seq1[x] === seq2[y]) {
                x++;
                y++;
                stepMap[x][y] = 0;
            }
            furthestReaching[k + X] = x;
            if (x >= N && y >= M) {
                dist = D;
            }
        }
    }
    for (;N||M;) {
        a = stepMap[N][M];
        src.unshift(a > 2 ? -1 : seq1[N - 1]);
        target.unshift(a == 2 ? -1 : seq2[M - 1]);
        a < 3 && N--;
        a != 2 && M--;
    }
    return [src, target]
}
export let logAndReturn=(arg)=>(console.log(arg),arg)
export let timeConversions=(_=>(s=t=>t*1000,m=t=>t*s(60),h=t=>t*m(60),d=t=>t*h(24),w=t=>t*d(7),y=t=>t*d(365),{seconds:s,minutes:m,hours:h,days:d,weeks:w,years:y}))();