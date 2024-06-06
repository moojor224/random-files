/**
 * restores deprecated methods to fit within current html/javascript standards
 */
(function () {
    function addProperties(obj, props) {
        for (let i in props) {
            if (typeof props[i] === "object") {
                obj[i] = {};
                addProperties(obj[i], props[i]);
            } else {
                obj[i] = props[i];
            }
        }
    }

    addProperties(String.prototype, {
        /**
         * returns the outerHTML of an HTML anchor element with the innerHTML set to the string
         * @param {string} id id of the <a> element
         * @returns {HTMLAnchorElement}
         */
        anchor: function (id = "") {
            let a = document.createElement("a");
            a.innerHTML = this;
            a.id = id;
            return a.outerHTML;
        },
        big: function () {
            let big = document.createElement("span");
            big.style.fontSize = "1.2em";
            big.innerHTML = this;
            return big.outerHTML;
        },
        bold: function () {
            let bold = document.createElement("b");
            bold.innerHTML = this;
            return bold.outerHTML;
        },
        fixed: function () {
            let tt = document.createElement("span");
            tt.style.fontFace = "monospace";
            tt.innerHTML = this;
            return tt.outerHTML;
        },
        fontcolor: function (color = "") {
            let font = document.createElement("span");
            font.style.color = color;
            font.innerHTML = this;
            return font.outerHTML;
        },
        fontsize: function (size = 1) {
            let font = document.createElement("span");
            font.style.fontSize = size + "em";
            font.innerHTML = this;
            return font.outerHTML;
        },
        italics: function () {
            let i = document.createElement("i");
            i.innerHTML = this;
            return i.outerHTML;
        },
        link: function (url = "") {
            let a = document.createElement("a");
            a.innerHTML = this;
            a.href = url;
            return a.outerHTML;
        },
        small: function () {
            let small = document.createElement("span");
            small.style.fontSize = "0.7em";
            small.innerHTML = this;
            return small.outerHTML;
        },
        substr: function (start, length = this.length) {
            return this.substring(start, start + length);
        },
    })
})();