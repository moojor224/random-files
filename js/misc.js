class SomeClass {
    constructor() {
        this._data = [1, 2, 3, 4];
    }

    [Symbol.iterator]() {
        var index = 0;
        var data = this._data;

        return {
            next: () => ({
                done: !(index in data),
                value: data[index++]
            })
        };
    };
};
[...new SomeClass()]; // [1, 2, 3, 4];




/*
element arr = [
    tag, options, ...content
]
content can be any of: string, element arr
*/

window.devtoolsFormatters = [{
    header: obj => {
        if (obj instanceof Date) {
            return [
                'div',
                {
                    style: 'font-weight: bold;'
                },
                `Date: ${obj.toLocaleDateString()} ${obj.toLocaleTimeString()}`
            ];
        }
        return null;
    },
    hasBody: obj => obj instanceof Date,
    body: function (obj) {
        if (obj instanceof Date) {
            let cellStyle = "padding:5px 10px;";
            return ["table", {
                style: "border-collapse:collapse;color:black"
            }, ...[
                "getFullYear",
                "getYear",
                "getMonth",
                "getDate",
                "getDay",
                "getHours",
                "getMinutes",
                "getSeconds",
                "getMilliseconds",
                "getTime",
                "getUTCFullYear",
                "getUTCMonth",
                "getUTCDate",
                "getUTCDay",
                "getUTCHours",
                "getUTCMinutes",
                "getUTCSeconds",
                "getUTCMilliseconds",
                "getTimezoneOffset",
                "toLocaleDateString",
                "toLocaleString",
                "toLocaleTimeString",
                "toTimeString",
                "toDateString",
                "toGMTString",
                "toISOString",
                "toJSON",
                "toString",
                "toUTCString"
            ].map((e, n) => [
                "tr",
                {
                    style: (function () {
                        if (n == 0) return "background-color: gray";
                        else if (n % 2 == 1) return "background: darkgray;";
                        return "background: lightgray;";
                    })()
                },
                ["td", { style: cellStyle }, e],
                ["td", { style: cellStyle }, obj[e]()]
            ])];
        }
        return null;
    }
}];

/*
asterisks are wildcards
ex: font-size, font-family, font-weight, etc

align*
background* (background-image only allows data: URLs)
border*
box*
clear
color
cursor
display
float
font*
justify*
line*
margin*
padding*
position (only the values static and relative are accepted)
text*
transition*
outline*
vertical-align
white-space
word*
writing*
width, min-width, max-width
height, min-height, max-height

*/