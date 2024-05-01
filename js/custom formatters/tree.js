let styles = {
    ".tree,.tree ul,.tree li": "list-style:none;margin:0;padding:0;position:relative;",
    ".tree": "margin:0 0 12px;text-align:center;",
    ".tree,.tree ul": "display:table;",
    ".tree ul": "width:100%;border:1px solid #666;padding:0 10px 10px;border-radius:10px;",
    ".tree li": "display:table-cell;padding:0;vertical-align:top;",
    ".tree li:before": "outline:1px solid #666;position:relative;left:0;width:100%;top:0;height:0px;",

    ".tree li:first-child:before": "margin-left:50%;display:inline-block;height:0px;width:100%;outline:1px solid red;",
    ".tree li:last-child:before": "margin-right:50%;",

    ".tree span": "border:1px solid #666;border-radius:4px;display:inline-block;margin:0 .2em;padding:.2em .5em;position:relative;",
    ".tree ul:before,.tree span:before": "outline:1px solid #666;height:6px;width:0;left:50%;position:relative;display:inline-block;",
    ".tree ul:before": "margin-top:-6px;",
    ".tree span:before": "margin-top:-6.5px;",
    ".tree>li": "margin-top:0;",
}

class Node {
    text = "";
    nodes = [];
    config = {};
    constructor(text, cfg) {
        this.text = text;
        this.config = {
            ...{ style: "" },
            ...cfg
        }
        return this;
    }
    add(...nodes) {
        this.nodes.push(...nodes.filter(e => e instanceof Node));
        return this;
    }
    render(top = true) {
        let a = [
            "li",
            {
                style: styles[".tree li"] + (top ? styles[".tree>li"] : "")
            },
            [
                "span",
                {
                    style: this.config.style || styles[".tree span"]
                },
                this.text
            ]
        ];

        if (this.nodes.length > 0) {
            // a.push(createElement("ul").add(...this.nodes.map(e => e.render(false))));
            a.push([
                "span",
                {
                    style: "display:block;width:0px;margin-left:50%;outline:1px solid #666;height:1em;"
                }
            ], [
                "ul",
                {
                    style: styles[".tree,.tree ul"] + styles[".tree,.tree ul,.tree li"] + styles[".tree ul"]
                },
                ...this.nodes.map(e => e.render(false))
            ]);
        }
        if (top) {
            a.splice(2, 1);
            return ["ul", {
                style: styles[".tree"]
            }, a];
        }
        return ["li", { style: styles[".tree li"] + (top ? styles[".tree>li"] : "") }, ["span", { style: "display:block;width:0px;margin-left:50%;outline:1px solid #666;height:1em;" }], a];
    }
}

function convertObjectToNodeTree(obj, label) {
    console.log("making node", obj, label);
    if (!["string", "boolean", "number"].includes(typeof obj)) {
        let root = new Node(label);
        Object.getOwnPropertyNames(obj).forEach(e => {
            root.add(convertObjectToNodeTree(obj[e], e));
        });
        return root;
    } else {
        return new Node(label).add(
            new Node(obj, {
                style: "color:" + (function () {
                    if (typeof obj == "string") return "white";
                    if (typeof obj == "number") return "green";
                    if (typeof obj == "boolean") return "blue";
                })()
            })
        );
    }
}

/** @type {devtoolsFormatter} */
export let formatter = {
    hasBody: function (obj) {
        return obj.hasOwnProperty("__display_as_tree") && obj.__display_as_tree;
    },
    header: function (obj) {
        if (obj.hasOwnProperty("__display_as_tree") && obj.__display_as_tree) {
            return ["div", {}, "object tree:", ["object", {
                object: (function () {
                    let a = { ...obj };
                    delete a.__display_as_tree;
                    return a;
                })()
            }]];
        }
        return null;
    },
    body: function (obj) {
        if (obj.hasOwnProperty("__display_as_tree") && obj.__display_as_tree) {
            let render = convertObjectToNodeTree((function () {
                let a = { ...obj };
                delete a.__display_as_tree;
                return a;
            })(), "object").render(true);
            console.log("render", render);
            return render;
        }
    },
}
