from pytools import interleaveArrays

print(
    interleaveArrays(
        None,
        [0, 1, 2, 3, 4, 5],
        [10, 11, 12, 13],
        ["a", "b", "c", "d", "e"],
    )
)

