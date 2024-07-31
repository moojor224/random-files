import { createElement } from "../js/synced/jstools/index.js";
let canvas = createElement("canvas");
let ctx = canvas.getContext("2d");
const micros_in_second = 1e6 / 100; // divide by 100 because canvas is too big
canvas.width = micros_in_second;
canvas.height = 500;
document.body.add(canvas);

function note(letter, octave, acc) {
    let notes = {
        "C": 0,
        "D": 2,
        "E": 4,
        "F": 5,
        "G": 7,
        "A": 9,
        "B": 11
    };
    let note = notes[letter];
    if (acc == "#") note++;
    if (acc == "b") note--;
    return 440 * 2 ** ((octave * 12 + note - 57) / 12);
}
// ctx.fillRect(360, 0, 2, canvas.height);
function wave(...notes) {
    console.log(notes);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(0, canvas.height / 2);
    let last_y = 0;
    let intersects = 1;
    let mid = canvas.height / 2;
    for (let i = 0; i < canvas.width; i += 1) {
        // return a function that mimics this code block and pass it the current timer value (cur - start)
        // make sure to remove intersects counter and draw functions
        // sec > ms > us > ns > ps > fs > as > zs > ys
        // _ > milli > micro > nano > pico > femto > atto > zepto > yocto
        // ^ just for fun
        let y = 0;
        for (let note of notes) {
            y += Math.sin(i * note / (micros_in_second / Math.PI / 2)) / notes.length;
        }
        y = mid - (y * 100);
        if (y > mid && last_y < mid || y < mid && last_y > mid) {
            intersects++;
        }
        ctx.lineTo(i, y);
        last_y = y;
    }
    ctx.stroke();
    console.log("total number of intersects", intersects);
}

wave(note("A", 4));
// wave(10, 30);
// wave(10);
// wave(30);
wave(0);
// wave("blue", note("A", 3));