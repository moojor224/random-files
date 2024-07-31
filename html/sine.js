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
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(0, canvas.height / 2);
    for (let i = 0; i < canvas.width; i += 1) {
        let y = 0;
        for (let note of notes) {
            y += Math.sin(i * note / (micros_in_second / Math.PI / 2)) / notes.length;
        }
        ctx.lineTo(i, canvas.height / 2 - (y * 100));
    }
    ctx.stroke();
}

wave(note("A", 3), note("A", 4));
// wave(10, 30);
// wave(10);
// wave(30);
wave(0);
// wave("blue", note("A", 3));