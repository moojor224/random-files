# jstools.js documentation

##  list of functions

[waitForKeyElements](#waitForKeyElements)\
[createElement](#createElement)\


[advancedDynamicSort](#advancedDynamicSort)\
[captureConsole](#captureConsole)\
[clamp](#clamp)\
[clear](#clear)\
[clearError](#clearError)\
[clearWarn](#clearWarn)\
[copyObject](#copyObject)\
[disable](#disable)\
[dynamicSort](#dynamicSort)\
[enable](#enable)\
[error](#error)\
[flattenChildNodes](#flattenChildNodes)\
[flattenChildren](#flattenChildren)\
[getColor](#getColor)\
[getValueOrDefault](#getValueOrDefault)\
[gradient](#gradient)\
[hide](#hide)\
[interleaveArrays](#interleaveArrays)\
[listAllColorsOnPage](#listAllColorsOnPage)\
[lockValue](#lockValue)\
[logAndReturn](#logAndReturn)\
[logFormatted](#logFormatted)\
[map](#map)\
[Option](#Option)\
[parseCookies](#parseCookies)\
[parseTrace](#parseTrace)\
[rgbGradient](#rgbGradient)\
[Section](#Section)\
[settings](#settings)\
[Settings](#Settings)\
[show](#show)\
[tabColor](#tabColor)\
[timeConversions](#timeConversions)\
[warn](#warn)

## detailed breakdown

listed below are all the functions provided by jstools.js and detailed descriptions of what they do

<style>h3{display:inline}</style>
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
