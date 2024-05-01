type defaultValues = {
    "inherit": any
    "initial": any
    "revert": any
    "revert-layer": any
    "unset": any
}

// type devtoolsFormatterStyle = {
//     alignContent: "baseline" | "center" | "end" | "first baseline" | "flex-end" | "flex-start" | "last baseline" | "normal" | "safe center" | "space-around" | "space-between" | "space-evenly" | "start" | "stretch" | "unsafe center" | keyof defaultValues
//     alignItems: "baseline" | "center" | "end" | "first baseline" | "flex-end" | "flex-start" | "last baseline" | "normal" | "safe center" | "self-end" | "self-start" | "start" | "stretch" | "unsafe center" | keyof defaultValues
//     alignSelf: "auto" | "baseline" | "center" | "end" | "first baseline" | "flex-end" | "flex-start" | "last baseline" | "normal" | "safe center" | "self-end" | "self-start" | "start" | "stretch" | "unsafe center" | keyof defaultValues
//     background: CSSStyleDeclaration["background"]
// }

/*
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
height
justify*
line*
margin*
max-height
max-width
min-height
min-width
outline*
padding*
position (only the values static and relative are accepted)
text*
transition*
vertical-align
white-space
width
word*
writing*
*/

type devtoolsFormatterElement = ([
    "span" | "div" | "ol" | "ul" | "li" | "table" | "tr" | "td",
    {
        style: ElementCSSInlineStyle;
    },
    ...devtoolsFormatterElement[]
] | [
    "object",
    {
        object: Object;
        config: Object;
    }
]);

type devtoolsFormatter = {
    /**
     * Returns a JsonML array or `null`. If `null` is returned, the default format is used to display the object. The `config` parameter is optional. This parameter can be passed using the special `object` template
     */
    hasBody: (obj: Object, config?: Object) => Boolean;
    /**
     * Returns a boolean indicating whether the object can be expanded to show more details. The `config` parameter is optional. This parameter can be passed using the special `object` template
     */
    header: (obj: Object, config?: Object) => devtoolsFormatterElement;
    /**
     * Returns a JsonML array or `null`. If `null` is returned, the default format is used to display the object. The `config` parameter is optional. This parameter can be passed using the special `object` template
     */
    body: (obj: Object, config?: Object) => devtoolsFormatterElement;
}

declare interface window {
    devtoolsFormatters: devtoolsFormatter[];
}

