operator >>= left 3 = (left, right) => {
    return #`${left}.chain(${right})`;
}
class IdMonad {
    constructor(value) {
        this.value = value;
    }
    chain(f) {
        return f(this.value);
    }
}

function Id(value) {
    return new IdMonad(value);
}

let result = Id(1) >>= v => Id(v + 1) >>= v => Id(v * 10);