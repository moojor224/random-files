import * as _z from "./zod.js";
// import "../webpack_dayjs.js";
import "../dayjs/index.js";

let validator = zod.object({
    schedules: zod.array(zod.object({
        start: zod.string().datetime({ offset: true }),
        end: zod.string().datetime({ offset: true }),
        date: zod.string().datetime({ offset: true }),
    }))
});
let day_size = 60;
let styles = {
    "div.calendar div.title": "height:30px;width:100%;margin:auto;text-align:center;color:black;font-size:24px;", // 3-column grid with buttons --> div (text-centered)
    "div.calendar div.day": `height:${day_size}px;width:${day_size}px;display:inline-block;border:1px solid black;box-sizing:border-box;padding:3px;`,
    "div.calendar div.day.today": "outline:2px solid red;outline-offset:-2px;",
    "div.calendar div.week": `display:flex;width:width:${day_size * 7};border-left:1px solid black;border-right:1px solid black;`,
};

function generateRanges(schedules) {
    let canvas = document.createElement("canvas");
    canvas.width = (day_size * 4) - 2;
    canvas.height = (day_size * 4) - 2;
    let ctx = canvas.getContext("2d");
    // ctx.fillStyle = "#fff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00f3";
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 4;
    schedules.forEach(e => {
        let start_time = e.start.get("hour");
        let end_time = e.end.get("hour");
        ctx.fillRect(0, (start_time / 24) * day_size * 4, day_size * 4 - 2, ((end_time - start_time) / 24) * day_size * 4);
        ctx.strokeRect(0, (start_time / 24) * day_size * 4, day_size * 4 - 2, ((end_time - start_time) / 24) * day_size * 4);
    });
    return `background-image:url(${canvas.toDataURL()});background-size:cover;`;
}

function week(start, month) {
    let curDate = start;
    let arr = new Array(7).fill(0).map((d, n) => {
        let date = curDate.clone().add(n, "day");
        return [
            "div",
            { style: styles["div.calendar div.day"] + generateRanges(schedules.filter(e => e.date.clone().startOf("day").isSame(date.clone().startOf("day")))) + (date.clone().startOf("day").isSame(dayjs().startOf("day")) ? styles["div.calendar div.day.today"] : "") },
            ["span", {
                style: (function () {
                    if (date.get("month") != month.clone().get("month")) {
                        return "color:#aaa;";
                    }
                    return "color:#000;";
                })()
            }, date.get("date")],
        ];
    });
    return ["div", { style: styles["div.calendar div.week"] }, ...arr];
}

let schedules;

/** @param {require(".date./dayjs.min.js").dayjs} date */
function calendar(s, month = dayjs()) {
    schedules = s.map(e => ({
        start: dayjs(e.start),
        end: dayjs(e.end),
        date: dayjs(e.date),
    }));
    let arr = [];
    let firstWeekStart = month.clone().startOf("month").startOf("week");
    let lastWeekEnd = month.clone().endOf("month").endOf("week");
    let count = 0;
    let curDate = firstWeekStart;
    while (curDate.isBefore(lastWeekEnd)) {
        arr.push(curDate);
        curDate = curDate.add(1, "week");
        count++;
    }
    arr = arr.map(e => week(e, month.clone()));
    arr[0][1].style += "border-top:1px solid black;";
    arr[arr.length - 1][1].style += "border-bottom:1px solid black;";
    return [
        "div",
        { style: "padding:20px;background-color:white;border-radius:20px;" },
        ["div", { style: styles["div.calendar div.title"] }, month.clone().format("MMM")],
        ...arr
    ];
}

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
            return ["div", {}, `user schedule${obj.schedules.length - 1 ? "s" : ""}:
${(obj.month || dayjs()).clone().format("MMM")}
${obj.schedules.length} entr${obj.schedules.length - 1 ? "ies" : "y"}`];
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
            return ["div", {}, calendar(schedules, dayjs())];
        } catch (err) {
            console.log(err);
        }
        return null;
    }
};