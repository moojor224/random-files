import * as _z from "./zod.js";

let validator = zod.object({
    schedules: zod.array(zod.object({
        start: zod.string().datetime({ offset: true }),
        end: zod.string().datetime({ offset: true }),
        date: zod.string().datetime({ offset: true }),
    }))
});

let styles = {
    "div.calendar": "border:1px solid black;display:inline-block;width:calc(var(--day-width) * 7 + 2px);box-sizing:border-box;background-color:white;",
    "div.calendar div.title": "height:var(--month-height);width:100%;margin:auto;", // 3-column grid with buttons  --> div (text-centered)
    "div.calendar div.day": "height:  var(--day-height);width:var(--day-width);display:inline-block;border:1px solid black;box-sizing:border-box;padding:3px;",
    "div.calendar div.day.today": "outline:2px solid red;outline-offset:-2px;",
    "div.calendar div.day div.range": " top: calc(100% * (var(--start-time) / 24));bottom: calc(100% * ((24 - var(--end-time)) / 24));width:100%;border:2px solid #0007;box-sizing:border-box;position:relative;display: block;display: block;border-radius: 5px;",
};

/** @type {devtoolsFormatter} */
export let formatter = {
    hasBody: function (obj) {
        try {
            validator.parse(obj);
            return true;
        } catch (err) {
            console.log(err);
        }
        return null;
    },
    header: function (obj) {
        try {
            validator.parse(obj);
            return ["div", {}, `user schedule: ${obj.schedules.length} entr${obj.schedules.length - 1 ? "ies" : "y"}`];
        } catch (err) { }
        return null;
    },
    body: function (obj) {
        try {
            validator.parse(obj);
            let schedules = obj.schedules.map(e => ({
                start: dayjs(e.start),
                end: dayjs(e.end),
                date: dayjs(e.date)
            }));
            return ["div", {}, "user schedule goes here"];
        } catch (err) { }
        return null;
    }
};