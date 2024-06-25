/**
 * restores deprecated methods to fit within current html/javascript standards
 */
(function () {
    function addProperties(obj, props) {
        for (let i in props) {
            if (typeof props[i] === "object") {
                obj[i] = { ...obj[i] };
                addProperties(obj[i], props[i]);
            } else {
                obj[i] = props[i];
            }
        }
    }

    addProperties(String.prototype, {
        anchor: function (id = "") {
            return `<a id="${id.replaceAll('"', '\\"')}">${this}</a>`;
        },
        big: function () {
            return `<span style="font-size:1.2em">${this}</span>`;
        },
        bold: function () {
            return `<b>${this}</b>`;
        },
        fixed: function () {
            return `<span style="font-face:monospace">${this}</span>`;
        },
        fontcolor: function (color = "") {
            return `<span style="color:${color}">${this}</span>`;
        },
        fontsize: function (size = 1) {
            return `<span style="font-size:${size}em">${this}</span>`;
        },
        italics: function () {
            return `<i>${this}</i>`;
        },
        link: function (url = "") {
            return `<a href="${url}">${this}</a>`;
        },
        small: function () {
            return `<span style="font-size:0.7em">${this}</span>`;
        },
        substr: function (start, length = this.length) {
            return this.substring(start, start + length);
        },
    })
})();