# jstools.js documentation

##  list of functions

[waitForKeyElements](#waitForKeyElements)\
[createElement](#createElement)\
[HTMLElement.prototype.add](#HTMLElement.prototype.add)\
[HTMLElement.prototype.isVisible](#HTMLElement.prototype.isVisible)\

[warn](#warn)\
[clearWarn](#clearWarn)\
[error](#error)\
[clearError](#clearError)\
[hide](#hide)\
[show](#show)\
[clear](#clear)\
[disable](#disable)\
[enable](#enable)\
[tabColor](#tabColor)\
[parseCookies](#parseCookies)\
[dynamicSort](#dynamicSort)\
[advancedDynamicSort](#advancedDynamicSort)\


[captureConsole](#captureConsole)\
[clamp](#clamp)\
[copyObject](#copyObject)\
[flattenChildNodes](#flattenChildNodes)\
[flattenChildren](#flattenChildren)\
[getColor](#getColor)\
[getValueOrDefault](#getValueOrDefault)\
[gradient](#gradient)\
[interleaveArrays](#interleaveArrays)\
[listAllColorsOnPage](#listAllColorsOnPage)\
[lockValue](#lockValue)\
[logAndReturn](#logAndReturn)\
[logFormatted](#logFormatted)\
[map](#map)\
[Option](#Option)\
[parseTrace](#parseTrace)\
[rgbGradient](#rgbGradient)\
[Section](#Section)\
[settings](#settings)\
[Settings](#Settings)\
[timeConversions](#timeConversions)\

## detailed breakdown

listed below are all the functions provided by jstools.js and detailed descriptions of what they do

<!-- <style>h3{display:inline}</style> -->

<!--
<details>
    <summary><h3>TITLE</h3></summary>
    DESCRIPTION
usage
```js
```
result:
```html
```
</details>
<br>
-->

<details>
    <summary><h3>waitForKeyElements</h3></summary>
    waits for the element specified by the given css selector

usage
```js
waitForKeyElements("bdoy>main#content", function (el) {
    console.log(el);
});
```
result:
```html
<!-- logs the following element to the console whenever it is loaded onto the page -->
<body>
    <main id="content"></main> <--- this one
</body>
```
</details>
<br>

<details>
    <summary><h3>createElement</h3></summary>
    creates an HTML element given a tag and properties

usage
```js
createElement("div", {
    classList: "cls1 cls2 cls3",
    style: {
        color: "red",
        fontSize: "20px"
    },
    dataset: {
        info: "this is some info",
        number: 2
    },
    innerHTML: "Hello World"
});
```
returns the following html element
```html
<div class="cls1 cls2 cls3" style="color: red; font-size: 20px;" data-info="this is some info" data-number="2">Hello World</div>

```
</details>
<br>

<details>
    <summary><h3>HTMLElement.prototype.add</h3></summary>
    appends the given html elements to the element the method was called on. Returns  a reference to <code>this</code>
    
usage
```js
let div1 = document.createElement("div");
let div2 = document.createElement("div");
let span1 = document.createElement("span");
let span2 = document.createElement("span");
let result = document.body.add(
    div1,
    div2,
    span1,
    span2
);
```
result:
```html
<body>
    <div></div>
    <div></div>
    <span></span>
    <span></span>
</body>
```
```js
result === document.body;
```
</details>
<br>

<details>
    <summary><h3>HTMLElement.prototype.isVisible</h3></summary>
    returns true if the element is visible on the screen

usage
```js
document.querySelector("body").isVisible
```
result:
```js
true
// (the html body element is always visible, unless it is hidden through css)
```
</details>
<br>

<details>
    <summary><h3>TITLE</h3></summary>
    DESCRIPTION

usage
```js
```
result:
```html
```
</details>
<br>



