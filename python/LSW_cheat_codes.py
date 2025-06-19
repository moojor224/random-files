import time
import os

control_mode = (
    1 if os.name == "nt" else 0
)  # 0 for Linux (uinput), 1 for Windows (pynput)


def get_controls(mode: int):
    if mode == 0:
        import uinput

        key_up = uinput.KEY_W
        key_down = uinput.KEY_S
        key_left = uinput.KEY_A
        key_right = uinput.KEY_D
        key_submit = uinput.KEY_ENTER
        return (key_up, key_down, key_left, key_right, key_submit)
    elif mode == 1:
        from pynput.keyboard import Key, KeyCode

        key_up = KeyCode.from_char("w")
        key_down = KeyCode.from_char("s")
        key_left = KeyCode.from_char("a")
        key_right = KeyCode.from_char("d")
        key_submit = Key.enter
        return (key_up, key_down, key_left, key_right, key_submit)


controls = get_controls(control_mode)


class Controller:
    def __init__(self, mode=0):
        if mode == 0:
            import uinput

            key_up = uinput.KEY_W
            key_down = uinput.KEY_S
            key_left = uinput.KEY_A
            key_right = uinput.KEY_D
            key_submit = uinput.KEY_ENTER
            controller = uinput.Device(
                [
                    key_up,
                    key_down,
                    key_left,
                    key_right,
                    key_submit,
                ]
            )
            # fmt: off
            def up(): controller.emit(key_up)
            def down(): controller.emit(key_down)
            def left(): controller.emit(key_left)
            def right(): controller.emit(key_right)
            def submit(): controller.emit(key_submit)
            # fmt: on

            self.up = up
            self.down = down
            self.left = left
            self.right = right
            self.submit = submit
        elif mode == 1:
            from pynput.keyboard import Controller, Key, KeyCode

            key_up = KeyCode.from_char("w")
            key_down = KeyCode.from_char("s")
            key_left = KeyCode.from_char("a")
            key_right = KeyCode.from_char("d")
            key_submit = Key.enter
            keyboard = Controller()

            # fmt: off
            def up(): keyboard.tap(key_up)
            def down(): keyboard.tap(key_down)
            def left(): keyboard.tap(key_left)
            def right(): keyboard.tap(key_right)
            def submit(): keyboard.tap(key_submit)
            # fmt: on

            self.up = up
            self.down = down
            self.left = left
            self.right = right
            self.submit = submit
        else:
            self.up = lambda: None
            self.down = lambda: None
            self.left = lambda: None
            self.right = lambda: None
            self.submit = lambda: None


class CharInput:
    def __init__(self, starting_character=0):
        self.value = starting_character

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, new_value: int):
        print("Setting value to:", new_value, "Current value:", characters[new_value])
        self._value = new_value

    def down(self):
        new_val = self.value + 1
        self.value = new_val % length

    def up(self):
        new_val = self.value - 1
        self.value = (new_val + length) if new_val < 0 else new_val


num_characters = 6  # Length of each cheat code
characters = list(
    "abcdefghijklmnopqrstuvwxyz0123456789"
)  # Characters used in the cheat codes
length = len(characters)

cheats = [
    "6mz5ch",
    "2d7jns",
    "gchp7s",
]
inputs = [CharInput() for _ in range(num_characters)]

debounce = 10  # milliseconds between simulated keypresses

controller = Controller(control_mode)


def get_shortest_direction(list: list, current, target):
    print("Current:", current, "Target:", target)

    def idx(item):
        return list.index(item) if item in list else -1

    cur_idx = idx(current)
    offset_cur_idx = (cur_idx + length / 2) % length
    tar_idx = idx(target)
    offset_tar_idx = (tar_idx + length / 2) % length
    distance = abs(cur_idx - tar_idx)  # distance directly between characters
    distance2 = abs(offset_cur_idx - offset_tar_idx)  # distance wrapping around
    dir = 0
    dist = min(distance, distance2)
    if dist == distance and tar_idx > cur_idx:
        dir = 1
    elif dist == distance2 and tar_idx < cur_idx:
        dir = 1
    print("Direction:", dir, "Distance:", dist)
    return (dir, int(dist))


def input_cheat(cheat: str):
    if len(cheat) != num_characters:
        raise ValueError(
            "Cheat code must be exactly {} characters long".format(num_characters)
        )

    for i, char in enumerate(cheat):
        input = inputs[i]
        current_char = characters[inputs[i].value]
        target_char = char.lower()
        direction, distance = get_shortest_direction(
            characters, current_char, target_char
        )
        for _ in range(distance):
            if direction == 0:
                input.up()
                controller.up()
            else:
                input.down()
                controller.down()
            time.sleep(debounce / 1000.0)
        controller.right()  # move to next character. ends up back at start after last character
        time.sleep(debounce / 1000.0)
        print()
        pass
    controller.submit()  # submit the cheat code
    print("Cheat code entered:", cheat)
    print("======================================")


for i in range(10, 0, -1):
    print(i)
    time.sleep(0.5)
# input_cheat("6mz5ch")
for cheat in cheats:
    input_cheat(cheat)
    time.sleep(debounce / 1000.0)  # wait a second before entering the next cheat code

"""

ssssdssssssssssssdsssssssssssdsssssdssdsssssssd
ssssssssssdsssdssssdssssssssdsssssssssdwwwwwwwwwwwwwd
ssdsdssssdssssssssssdssssdssssssssssssssssssd




"""
