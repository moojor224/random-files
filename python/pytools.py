"""
python implementation of jstools.js
"""


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
# pyt_CSSRule
# pyt_CSSStyleSheet
# BULK_OPERATIONS
