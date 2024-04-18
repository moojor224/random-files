class SomeClass {
    constructor() {
        this._data = [1, 2, 3, 4];
    }

    [Symbol.iterator]() {
        var index = -1;
        var data = this._data;

        return {
            next: () => ({
                value: data[++index],
                done: !(index in data)
            })
        };
    };
};
[...new SomeClass()]; // [1, 2, 3, 4];