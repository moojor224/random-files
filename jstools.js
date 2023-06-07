// ==UserScript==
// @name         jstools
// @version      1
// @description  description
// @author       mojordaq
// @match        http://fcresearch-na.aka.amazon.com/IAH1/results?s=csXPFQSF3QM
// @require      https://drive-render.corp.amazon.com/view/mojordaq@/js%20src%20files/jquery-3.6.0.js
// @require      https://drive-render.corp.amazon.com/view/mojordaq@/js%20src%20files/jstools.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      *
// ==/UserScript==

/*eslint-env jquery*/


/**
 * @name createOptions - creates an options tab in the sidebar in FCResearch
 * @author - mojordaq
 * @param {array} options - array of the options' names in camelCase
 * @param {function} callback - function to run when a switch is toggled. gets 2 parameters: setting name, setting value
 * @param {element} elem - element to append the settings to
 */
// function createOptions(options, callback = () => {}, elem) {
//     var styles = [];
//     styles.push(`.tm-options-${e}-true{display: unset;}`);
//     styles.push(`.tm-options-${e}-false{display: none;}`);
//     window.setInterval(() => {
//         options.forEach(e => {
//             (document.getElementById(e) || { checked: false }).checked = GM_getValue(e, (document.getElementById(e) || { checked: false }).checked);
//             Array.from(document.querySelectorAll(`.tm-options-${e}-${!GM_getValue(e)}`)).forEach(a => {
//                 var a = !!GM_getValue(e);
//                 Array.from(document.querySelectorAll(`.tm-options-${e}-${!a}`)).forEach(r=>{
                    
//                 })
//             });
//         });
//     }, 1000)

//     function addOptions(options) {
//         var span = createElement("div", {
//             style: {
//                 border: "1px black solid",
//             }
//         }).add(
//             createElement("div", {
//                 style: {
//                     border: "1px white solid",
//                     padding: "5px",
//                 }
//             }).add(
//                 createElement("h4", {
//                     innerHTML: GM_info.script.name,
//                 })
//             ).add(
//                 createElement("br")
//             ).add(
//                 createElement("table", { style: { width: "100%" } })
//             )
//         );

//         options.forEach(e => {
//             span.querySelector("table").add(
//                 createElement("tr").add(
//                     createElement("td", {
//                         innerHTML: e.replaceAll(/[A-Z]/g, (r) => (" " + r.toLowerCase())).trim(),
//                     })
//                 ).add(
//                     createElement("td", {
//                         style: {
//                             float: "right",
//                             height: e ? "" : "25px",
//                             display: e ? "" : "block",
//                         }
//                     }).add(
//                         createElement("label", {
//                             classList: "switch",
//                             style: {
//                                 float: "right",
//                                 display: e ? "" : "none",
//                                 height: e ? "" : "20px",
//                             }
//                         }).add(
//                             createElement("input", {
//                                 type: "checkbox",
//                                 id: e,
//                                 checked: GM_getValue(e, false),
//                                 onclick: function() {
//                                     GM_setValue(e, this.checked);
//                                     callback(e, this.checked);
//                                 }
//                             })
//                         ).add(
//                             createElement("span", {
//                                 classList: "slider round"
//                             })
//                         )
//                     )
//                 )
//             )
//         });
//         document.getElementById("TM_optionsPane").append(span);
//     }
//     var sidebar = document.getElementById("side-bar") || createElement("span", { id: "asdasdasd" });
//     if ((arr => {
//             for (var i = 0; i < arr.length; i++) {
//                 if (arr[i].querySelector("h6").innerHTML.includes("Tampermonkey Options")) {
//                     addOptions(options);
//                     return true;
//                 }
//             }
//             return false;
//         })(Array.from(sidebar.children))) {
//         return;
//     } else {
//         document.head.append(createElement("style", { innerHTML: `.switch {
//   position: relative;
//   display: inline-block;
//   width: 30px;
//   height: 17px;
// }

// /* Hide default HTML checkbox */
// .switch input {
//   opacity: 0;
//   width: 0;
//   height: 0;
// }

// /* The slider */
// .slider {
//   position: absolute;
//   cursor: pointer;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: #ccc;
//   -webkit-transition: .2s;
//   transition: .2s;
// }

// .slider:before {
//   position: absolute;
//   content: "";
//   height: 13px;
//   width: 13px;
//   left: 2px;
//   bottom: 2px;
//   background-color: white;
//   -webkit-transition: .2s;
//   transition: .2s;
// }

// input:checked + .slider {
//   background-color: #2196F3;
// }

// input:focus + .slider {
//   box-shadow: 0 0 1px #2196F3;
// }

// input:checked + .slider:before {
//   -webkit-transform: translateX(13px);
//   -ms-transform: translateX(13px);
//   transform: translateX(13px);
// }

// /* Rounded sliders */
// .slider.round {
//   border-radius: 17px;
// }

// .slider.round:before {
//   border-radius: 50%;
// }` }));
//         var pane = createElement("div", {
//             classList: "a-row a-expander-container a-expander-section-container sidebar-expander a-section-expander-container"
//         }).add(
//             createElement("a", {
//                 href: "javascript:void(0)",
//                 "data-a-expander-toggle": `{"expand_prompt":"", "collapse_prompt":"}`,
//                 dataset: {
//                     action: "a-expander-toggle",
//                 },
//                 classList: "a-declarative a-link-section-expander"


//             }).add(
//                 createElement("i", {
//                     classList: "a-icon a-icon-section-collapse"
//                 })
//             ).add(
//                 createElement("span", {
//                     classList: "a-expander-prompt",
//                 }).add(
//                     createElement("h6", {
//                         innerHTML: "Tampermonkey Options"
//                     })
//                 )
//             )
//         ).add(
//             createElement("div", {
//                 "aria-expanded": true,
//                 classList: "a-expander-content a-expander-section-content a-section-expander-inner a-expander-content-expanded",
//                 id: "TM_optionsPane",
//                 style: {
//                     display: "none",
//                     // "z-index":-1,
//                     // position:"relative",
//                 }
//             })
//         );
//         sidebar.prepend(pane);

//         sidebar.style.overflow = "scroll";
//         if (sidebar.id !== "side-bar") {
//             (elem || document.body).append(sidebar);
//             sidebar.style.overflow = "";
//             sidebar.querySelector("a").onclick = (() => {
//                 document.getElementById("TM_optionsPane").style.display = (document.getElementById("TM_optionsPane").style.display === "none" ? "block" : "none");
//             })
//         }
//         addOptions(options);
//     }

// }

/**
 * @name waitForKeyElements - wait until the css selected element exists then passes it to a callback function
 * @author - mojordaq
 * @param {string} query - jquery selector for element to find
 * @param {function} callback - function that the found element is passed to
 * @param {boolean} stopAfterFound - whether to stop after finding the element
 * @param {element} element - element to query instead of document
 */
function waitForKeyElements(query, callback, stopAfterFound, element) {
    currentlyWorking = true;
    var o, r;

    (o = (void(0) === element) ? $(query) : $(element).contents().find(query)) && o.length > 0 ? (r = !0, o.each(function() {
            var e = $(this);
            e.data("alreadyFound") || false || (callback(e) ? r = false : e.data("alreadyFound", true))
        })) :
        r = false;
    var l = waitForKeyElements.controlObj || {},
        i = query.replace(/[^\w]/g, "_"),
        c = l[i];
    r && stopAfterFound && c ? (
        clearInterval(c),
        delete l[i]
    ) : c || (
        c = setInterval(
            function() {
                waitForKeyElements(query, callback, stopAfterFound, element);
            },
            1000
        ),
        l[i] = c
    );
    waitForKeyElements.controlObj = l;
} //wait for key elements

/**
 * @name createElement - creates an HTML element
 * @author - mojordaq
 * @param {string} tag - HTML element tag to create, defaults to "span"
 * @param {object} data - object with data tags to set in the element, defaults to an empty Object ({})
 */
// function createElement(tag = "span", data = {}) {
//     var elem = document.createElement(tag);
//     Object.keys(data).forEach(e => {
//         if (typeof data[e] === "object") {
//             Object.assign(elem[e], data[e]);
//         } else {
//             elem[e] = data[e];
//         }
//     });
//     return elem;
// }

function createElement(tag = "span", data = {}) {
    tag = typeof(tag) === "string" ? document.createElement(tag) : tag;
    Object.keys(data).forEach(e => {
        if (typeof data[e] === "object") {
            createElement(tag[e] || (tag[e] = {}), data[e]);
        } else {
            tag[e] = data[e];
        }
    });
    return tag;
}

window.Element.prototype.add = function() {
    Array.from(arguments).forEach(elem => {
        this.append(elem);
    })
    return this;
}




/**
 * @name getCookie - gets a cookie with a given name
 * @author - mojordaq
 * @param {string} str - cookie name to get
 */
function getCookie(str) {
    var map = new Map();
    document.cookie.split(";").forEach(e => {
        e = e.trim();
        map.set(e.substring(0, e.indexOf("=")), e.substring(e.indexOf("=") + 1));
        // console.log(e.substring(0,e.indexOf("=")));
    });
    return map.get(str);
} //get cookie





/**
 * @name checkForScriptUpdate - checks for a script update and opens page if one is available
 * @author - mojordaq
 */
function checkForScriptUpdate() {
    var updateURL = GM_info.scriptMetaStr.split("@updateURL")[1].split("\n")[0].trim();
    GM_xmlhttpRequest({
        method: "GET",
        url: updateURL,
        onload: function(response) {
            var script = response.responseText.split('@version')[1].split('\r')[0].trim();
            if (script !== GM_info.script.version) {
                window.open(updateURL, '_blank');
            }
        }
    });
} //check for script update


/**
 * @name tabColor - changes the favicon for the tab to any valid CSS color
 * @author - mojordaq
 * @param {string} color - CSS color
 */
function tabColor(color) {
    function isValidCSSColor(color2) {
        if (["unset", "initial", "inherit"].includes(color2)) {
            return false;
        }
        const s = new Option().style;
        s.color = color2;
        return s.color !== '';
    }
    if (!isValidCSSColor(color)) {
        return;
    }
    var c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    var zne = c.getContext("2d");
    zne.fillStyle = color;
    zne.fillRect(0, 0, 128, 128);
    var b = document.querySelector("link[rel=icon]") || createElement("link");
    b.href = c.toDataURL();
    b.rel = "icon";
    document.head.append(b);
} //set tab color