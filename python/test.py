from pytools import interleaveArrays, PrintStyles as S
import re

d = {"a": {"b": "b"}}
print(isinstance(d, dict))
print(isinstance(d["a"], dict))

warning = S.YELLOW + S.ITALIC
error = S.RED + S.BOLD

(S.BLUE + S.BOLD - S.BLUE)("bold")
(S.BLUE)("blue")
(S.BLUE + S.BOLD)("bold blue", d)
err_type = "exception"
(S.RED + S.BOLD)("ERROR", err_type, end=":\n\t")
(S.ITALIC)("message")

with open("out.txt", mode="w") as f:
    print("message", file=f)
    warning("warning", file=f)
    error("error", file=f)


from math import sin, pi
import time
from asynctasklist import ParallelTask, Task, TaskList

millis_in_second = 1e3
micros_in_second = 1e6
nano_in_second = 1e9


def decide_time_unit():  # find smallest unit of time

    def set_func(f):
        global time_func
        time_func = f
        print(f)
        return True

    if (
        (hasattr(time, "ticks_ns") and set_func(time.ticks_ns))
        or (hasattr(time, "time_ns") and set_func(time.time_ns))
        or (hasattr(time, "time_ns") and set_func(time.time_ns))
        or (hasattr(time, "monotonic_ns") and set_func(time.monotonic_ns))
    ):
        return nano_in_second
    if (
        (hasattr(time, "ticks_us") and set_func(time.ticks_us))
        or (hasattr(time, "monotonic_us") and set_func(time.monotonic_us))
        or (hasattr(time, "time_us") and set_func(time.time_us))
    ):
        return micros_in_second
    if (
        (hasattr(time, "ticks_ms") and set_func(time.ticks_ms))
        or (hasattr(time, "monotonic_ms") and set_func(time.monotonic_ms))
        or (hasattr(time, "time_ms") and set_func(time.time_ms))
    ):
        return micros_in_second
    raise Exception("No time unit found")


time_func = None
time_unit = decide_time_unit()


def note(letter: str, octave: int, acc: str):
    notes = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    note = notes[letter.upper()]
    if acc == "#":
        note += 1
    if acc == "b":
        note -= 1
    hz = int(440 * pow(2, ((octave * 12 + note - 57) / 12)))

    def func(x):
        return abs(sin(x * hz / time_unit * (pi * 2))) * 100

    return func


def makeNote(no: str):
    m = re.match(note_regex, no)
    if m is None:
        raise ValueError(f"Invalid note: {note}")
    return note(
        m.group(2),
        int(m.group(4)),
        m.group(3) if m.group(3) is not None else "",
    )


def chord(*notes: int):
    def func(x):
        y = 0
        for n in notes:
            y += n(x) / len(notes)
            pass
        return y

    return func


while True:
    break
    pass
notes = {}

for l in ("C", "D", "E", "F", "G", "A", "B", "c", "d", "e", "f", "g", "a", "b"):
    for a in ("", "#", "b"):
        for o in range(10):
            notes[l + a + str(o)] = note(l, o, a)

note_regex = "(\d+)([A-G])(#|b)?([0-9]|10)"
chord_regex = f"{note_regex}(\\+{note_regex})*"
song_regex = f"^{chord_regex}(,{chord_regex})*$"
print(note_regex)
print(chord_regex)
print(song_regex)


def clamp(x, a, b):
    return min(max(x, a), b)


def map(x, a, b, c, d):
    return (x - a) / (b - a) * (d - c) + c


def play(song: str):
    if not re.match(song_regex, song):
        raise ValueError("Invalid song")
    tl = TaskList()
    for c in song.split(","):
        func = chord(*c.split("+"))
        pass
    pass


play("1C4")
