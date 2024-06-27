"""
python implementation of jstools.js
"""

from enum import Enum
import re


def roundf(val: float, base: float) -> float:
    """rounds val to the nearest multiple of base"""
    return round(val / base) * base


def floor(val):
    return val // 1


def clamp(val, minval, maxval):
    return max(min(val, maxval), minval)


def map(val, inmin, inmax, outmin, outmax):
    return (val - inmin) * (outmax - outmin) / (inmax - inmin) + outmin


def arrMap(arr, callback):
    return [callback(arr[idx], idx, arr) for idx in range(len(arr))]


# def dynamicSort(args)
# def advancedDynamicSort(args)
def rgbMix(
    p,
    colors=[
        [0xFF, 0, 0],
        [0xFF, 0x7F, 0],
        [0xFF, 0xFF, 0],
        [0, 0xFF, 0],
        [0, 0, 0xFF],
        [0xFF, 0, 0xFF],
    ],
):
    p = int(p)
    numChunks = len(colors) - 1
    chunkSize = 100 / numChunks
    for i in range(1, numChunks + 1):
        if p <= chunkSize * i:
            percent = ((p + (1 - i) * chunkSize) * numChunks) / 100
            color1 = colors[i]
            color2 = colors[i - 1]
            result = []
            for e in range(3):
                result.append(
                    str(int((color1[e] * percent + color2[e] * (1 - percent))))
                )
            return "rgb(" + ",".join(result) + ")"


def gradient(
    count,
    colors=[
        [0xFF, 0, 0],
        [0xFF, 0x7F, 0],
        [0xFF, 0xFF, 0],
        [0, 0xFF, 0],
        [0, 0, 0xFF],
        [0xFF, 0, 0xFF],
    ],
):
    """generates a  gradient of `count` colors from the given colors list"""
    if count == 1:
        return "rgb(" + ",".join(colors[0]) + ")"
    arr = []
    for i in range(count):
        arr.append(rgbMix(map(i, 0, count - 1, 0, 100), colors))
    return arr


def interleaveArrays(fill, *arrays):
    """interleaves arrays with an optional hole filler"""
    if fill is not None:
        arrmax = max(arrMap(arrays, lambda s, idx, arr: len(s)))
        arrays = arrMap(
            arrays, lambda i, idx, arr: i + [None for _ in range(arrmax - len(i))]
        )
    result = []
    while True in arrMap(arrays, lambda arr, idx, _: True if len(arr) > 0 else False):
        for arr in arrays:
            if len(arr) > 0:
                result.append(arr.pop(0))
        pass
    return result


def getValueOrDefault(value, default):
    return value if value is not None else default


def getContrastColor(r, g, b):
    return (
        (0x0, 0x0, 0x0)
        if (r * 0.299 + g * 0.587 + b * 0.114) > 186
        else (0xFF, 0xFF, 0xFF)
    )


def logAndReturn(val):
    """
    prints and returns the value passed to it
    used for one-liners
    """
    print(val)
    return val


CSSColors = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkgrey": "#a9a9a9",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "grey": "#808080",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightgrey": "#d3d3d3",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "silver": "#C0C0C0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32",
}


class _formatter:
    _reset = True

    def __init__(self, *args):
        if len(args) == 1 and isinstance(args[0], Enum):
            args = args[0]
            self._chain = [args.value]
            return
        _chain = []
        for i in args:
            if isinstance(i, _formatter):
                _chain.extend(i._chain)
        self._chain = _chain
        pass

    def _prefix(self):
        return f"\033[{';'.join(str(p) for p in self._chain)}m"

    def __call__(self, string):
        print(f"{self._prefix()}{string}" if string != "" else string, end="")
        if self._reset:
            PrintStyles.reset()
        print("")

    def __add__(self, other):
        newFormatter = _formatter()
        newFormatter._chain = self._chain + other._chain
        return newFormatter

    def __sub__(self, other):
        myChain = list(self._chain)
        for i in other._chain:
            if i in myChain:
                myChain.remove(i)
        newFormatter = _formatter()
        newFormatter._chain = myChain
        return newFormatter


class PrintStyles(_formatter, Enum):
    """
    normal usage:
    >>> fancy_printer = Styles.BOLD + Styles.RED + Styles.ON_WHITE
    >>> fancy_printer("Hello, World!")

    styles can be used inline for one-time use:
    >>> (Styles.ITALIC + Styles.GREEN)("Inline styling example")
    >>> Styles.BOLD("Another inline styling example")

    you can also disable the styles resetting if you want to
    >>> other_fancy_printer = Styles.ITALIC + Styles.BOLD + Styles.RED
    >>> other_fancy_printer._reset = False
    >>> other_fancy_printer("disabled reset")
    >>> print("styles are still applied")
    >>> print("no changes here")
    >>> Formatter.reset()
    >>> print("back to normal")

    >>> warning = Styles.BOLD + Styles.YELLOW + Styles.ITALIC
    >>> warning("This is an example warning!")

    >>> error = Styles.BOLD + Styles.ON_RED
    >>> error("This is an example error!")

    it is also possible to subtract styles from an already-compiiled style
    >>> yet_another_fancy_printer = Styles.MAGENTA + Styles.BOLD + Styles.ON_RED
    >>> yet_another_fancy_printer("This is before subtracting")
    >>> yet_another_fancy_printer -= Styles.BOLD
    >>> yet_another_fancy_printer -= Styles.ON_RED
    >>> yet_another_fancy_printer("This is after subtracting")

    """

    # text colors
    BLACK = 30
    RED = 31
    GREEN = 32
    YELLOW = 33
    BLUE = 34
    MAGENTA = 35
    CYAN = 36
    WHITE = 37
    GREY = 90
    BRIGHT_RED = 91
    BRIGHT_GREEN = 92
    BRIGHT_YELLOW = 93
    BRIGHT_BLUE = 94
    BRIGHT_MAGENTA = 95
    BRIGHT_CYAN = 96
    BRIGHT_WHITE = 97
    # background colors
    ON_BLACK = 40
    ON_RED = 41
    ON_GREEN = 42
    ON_YELLOW = 43
    ON_BLUE = 44
    ON_MAGENTA = 45
    ON_CYAN = 46
    ON_WHITE = 47
    ON_GREY = 100
    ON_BRIGHT_RED = 101
    ON_BRIGHT_GREEN = 102
    ON_BRIGHT_YELLOW = 103
    ON_BRIGHT_BLUE = 104
    ON_BRIGHT_MAGENTA = 105
    ON_BRIGHT_CYAN = 106
    ON_BRIGHT_WHITE = 107
    # resets
    RESET = 0
    NO_BOLD = 21
    NO_BOLD_FEINT = 22
    NO_ITALIC_BLACKLETTER = 23
    NO_UNDERLINE = 24
    NO_BLINK = 25
    NO_INVERT = 27
    NO_CONCEAL = 28
    NO_CROSSED = 29
    NO_COLOUR = 39
    NO_BACKGROUND = 49
    NO_PROPORTIONAL_SPACING = 50
    NO_FRAMED_ENCIRCLED = 54
    NO_OVERLINE = 55
    DEFAULT_UNDERLINE_COLOUR = 59
    NO_SUPERSCRIPT_SUBSCRIPT = 75
    # styles
    BOLD = 1
    DIM = 2
    ITALIC = 3
    UNDERLINE = 4
    BLINK = 5
    RAPID_BLINK = 6
    INVERT = 7
    CONCEAL = 8
    CROSSED = 9
    PRIMARY_FONT = 10
    ALT_FONT_1 = 11
    ALT_FONT_2 = 12
    ALT_FONT_3 = 13
    ALT_FONT_4 = 14
    ALT_FONT_5 = 15
    ALT_FONT_6 = 16
    ALT_FONT_7 = 17
    ALT_FONT_8 = 18
    ALT_FONT_9 = 19
    GOTHIC = 20
    PROPORTIONAL_SPACING = 26
    FRAMED = 51
    ENCIRCLED = 52
    OVERLINE = 53
    RIGHT_LINE = 60
    RIGHT_DOUBLE_LINE = 61
    LEFT_LINE = 62
    LEFT_DOUBLE_LINE = 63
    SUPERSCRIPT = 73
    SUBSCRIPT = 74

    @staticmethod
    def reset():
        print(PrintStyles.RESET._prefix(), end="")

    def __init__(self, value):
        self._value = value
        super().__init__(value)
        self._chain = [value]
        pass


# class Proxy: # this doesn't work yet
#     _obj = None
#     _data = {}

#     def __init__(self, obj, methods: dict):
#         def default_set(target, key, value):
#             setattr(target, key, value)

#         def default_get(target, key):
#             return getattr(target, key)

#         if not isinstance(methods, dict):
#             raise Exception("methods must be a dict")
#         keys = methods.keys()
#         if not keys.__contains__("set") and not keys.__contains__("get"):
#             raise Exception("methods must contain a setter or getter method")
#         print("set self._obj")
#         self._obj = obj

#         setattr(self._data, "_get", default_get)
#         if keys.__contains__("get") and callable(methods["get"]):
#             setattr(self._data, "_get", methods["get"])
#         setattr(self._data, "_set", default_set)
#         if keys.__contains__("set") and callable(methods["set"]):
#             setattr(self._data, "_set", methods["set"])

#     def __getattr__(self, name):
#         print("get attr")
#         return self._data._get(self._obj, name)
#         # return self._get(self._obj, name)

#     def __setattr__(self, name, value):
#         print("set attr")
#         if callable(self._set):
#             return self._set(self._obj, name, value)
#         setattr(self._data, name, value)
#         # return self._set(self._obj, name, value)

#         # setattr(self, "__getattr__", __getattr__)
#         # setattr(self, "__setattr__", __setattr__)


from css_rules import rules as _rules


# class pyt_CSSRule: # this class isn't really useful in python
#     validStyles = _rules()

#     @staticmethod
#     def checkValidSelector(self, selector):
#         return True  # not implemented

#     def __init__(self, selector: str, styles: dict):
#         self.stylesheet = None
#         self._style = {}
#         self.selector = selector

#         def getter(target, prop):
#             return target[prop]

#         def setter(target, prop: str, value):
#             newName = re.compile(r"[A-Z]").sub(lambda x: "-" + x.group(0).lower(), prop)
#             if not pyt_CSSRule.validStyles.__contains__(newName):
#                 return
#             # if isinstance(self.stylesheet, pyt_CSSStyleSheet):
#             #     if self.stylesheet.injected:
#             #         self.stylesheet.styleElement.innerHTML = self.stylesheet.compile(True)
#             return True

#         # self.style = Proxy(self._style, {"set": setter, "get": getter})
#         givenstyles = list(zip(styles.keys(), styles.values()))
#         for i in givenstyles:
#             if not i[0] in pyt_CSSRule.validStyles:
#                 raise Exception(f'Invalid style: "{i[0]}"')
#             else:
#                 newname = re.compile(r"[A-Z]").sub(
#                     lambda x: "-" + x.group(0).lower(), i[0]
#                 )
#                 if newname in pyt_CSSRule.validStyles:
#                     self._style[newname] = i[1]
#         pass

#     def compile(self, minify=True):
#         def min_props(*props):
#             return ";".join([f"{i[0]}:{i[1]}" for i in props])

#         def max_props(*props):
#             return "\n    ".join([f"{i[0]}: {i[1]};" for i in props])

#         def min_whole(selector, props):
#             return f"{selector}{{{props}}}"

#         def max_whole(selector, props):
#             return f"{selector} {{\n    {props}\n}}"

#         props = max_props
#         whole = max_whole
#         if minify:
#             props = min_props
#             whole = min_whole
#         return whole(self.selector, props(*self._style.items()))



# flattenChildren
# lockValue
# extend
# convertBase
# Settings
# Section
# Option
# makeTemplate
# copyObject
# rectangle
# pyt_CSSStyleSheet
# BULK_OPERATIONS
