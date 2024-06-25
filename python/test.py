from enum import Enum

from pytools import interleaveArrays

# import itertools
# from typing import Optional, Tuple, Union


# print(
#     interleaveArrays(
#         None,
#         [0, 1, 2, 3, 4, 5],
#         [10, 11, 12, 13],
#         ["a", "b", "c", "d", "e"],
#     )
# )


class Formatter:
    _reset = True

    @staticmethod
    def reset():
        print(Styles.RESET._prefix(), end="")

    def __init__(self, *args):
        if len(args) == 1 and isinstance(args[0], Enum):
            args = args[0]
            self._chain = [args.value]
            return
        _chain = []
        for i in args:
            if isinstance(i, Formatter):
                _chain.extend(i._chain)
        self._chain = _chain
        pass

    def _prefix(self):
        return f"\033[{';'.join(str(p) for p in self._chain)}m"

    def __call__(self, string):
        print(f"{self._prefix()}{string}" if string != "" else string, end="")
        if self._reset:
            Formatter.reset()
        print("")

    def __add__(self, other):
        newFormatter = Formatter()
        newFormatter._chain = self._chain + other._chain
        return newFormatter
    
    def __sub__(self, other):
        myChain = list() + self._chain
        for i in other._chain:
            if i in myChain:
                myChain.remove(i)
        newFormatter = Formatter()
        newFormatter._chain = myChain
        return newFormatter


class Styles(Formatter, Enum):
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

    def __init__(self, value):
        self._value = value
        super().__init__(value)
        self._chain = [value]
        pass


# fancy_printer = Styles.BOLD + Styles.RED + Styles.ON_WHITE
# fancy_printer("Hello, World!")


# (Styles.ITALIC + Styles.GREEN)("Inline styling example")
# Styles.BOLD("Another inline styling example")


# other_fancy_printer = Styles.ITALIC + Styles.BOLD + Styles.RED
# other_fancy_printer._reset = False
# other_fancy_printer("disabled reset")
# print("styles are still applied")
# print("no changes here")
# Formatter.reset()
# print("back to normal")