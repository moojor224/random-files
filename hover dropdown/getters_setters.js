let obj = ({
    _test: 1,
    set test(arg) {
        console.log(arg);
        this._test = arg;
    },
    get test() {
        return this._test;
    },
});
obj.test = 2; // logs 2 ands sets _test to 2
obj.test; // returns 2