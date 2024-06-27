from pytools import interleaveArrays, PrintStyles as S
import re

d = {"a": {"b": "b"}}
print(isinstance(d, dict))
print(isinstance(d["a"], dict))

(S.BLUE + S.BOLD - S.BLUE)("bold")
(S.BLUE)("blue")
(S.BLUE + S.BOLD)("bold blue")
