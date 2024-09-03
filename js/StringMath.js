let constants = {
    baseValues: [..."0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`{|}~!\"#$%&'()*+,-./:;<=>?@"]
}

let StringMath = {
    log: function (op, a, sym, b) {
        console.log(op, a, sym, b, "=", eval(`${parseInt(a)} ${sym} ${parseInt(b)}`));
    },
    add: function (a, b) {
        StringMath.log("add:", a, "+", b);
        var negative = false;
        if (a[0] === "-" && b[0] !== "-") {
            return this.subtract(b, ((a) => {
                a = a.split("");
                a.shift();
                a = a.join("");
                return a;
            })(a));
        }
        if (a[0] !== "-" && b[0] === "-") {
            return this.subtract(a, ((b) => {
                b = b.split("");
                b.shift();
                b = b.join("");
                return b;
            })(b));
        }
        if (a[0] === "-" && b[0] === "-") {
            a = a.split("");
            a.shift();
            a = a.join("");

            b = b.split("");
            b.shift();
            b = b.join("");
            negative = true;
        }
        function arrSort(arr, descending = false) {
            descending = descending ? -1 : 1;
            return arr.sort((a, b) => (
                (a.length > b.length) ?
                    (1 * descending) :
                    (
                        b.length > a.length ?
                            (-1 * descending) :
                            0
                    )
            ));
        }

        function rollThrough(arr) {
            var change = true;
            var count = 0;
            while (change) {
                change = false;
                for (var i = 0; i < arr.length; i++, count++) {
                    if (arr[i].length > 1) {
                        var add = arr[i].substring(0, arr[i].length - 1);
                        arr[i] = arr[i][arr[i].length - 1];
                        if (i + 2 > arr.length) {
                            arr.push(add);
                        } else {
                            arr[i + 1] = `${parseInt(add) + parseInt(arr[i + 1])}`;
                        }
                        change = true;
                    }
                }
            }
            return arr;
        }
        var args = arrSort([a, b].map(e => e.split("").reverse()), true);

        var total = args.shift();
        args.forEach(a => {
            a.forEach((e, n) => {
                total[n] = `${parseInt(parseInt(total[n]) + parseInt(e))}`
            });
        });

        args = rollThrough(total).reverse().join("");
        // console.log(args, args.reduce((accumulator, currentValue) => {
        //     return accumulator + parseInt(currentValue)
        // }, 0));
        return (negative ? "-" : "") + args;
    },
    multiply: function (a, b) {
        StringMath.log("multiply:", a, "*", b);
        let negative = false;

        if (a[0] === "-") {
            a = a.split("");
            a.shift();
            a = a.join("");
            negative = !negative;
        }
        if (b[0] === "-") {
            b = b.split("");
            b.shift();
            b = b.join("");
            negative = !negative;
        }
        a = a.split("").reverse();
        b = b.split("").reverse();

        var [min, max] = a.length < b.length ? [a, b] : [b, a];

        var intermediate = new Array(min.length).fill("");
        intermediate = intermediate.map(e => []);

        var carry = 0;

        min.forEach((n, x) => {
            max.forEach((e, y) => {
                product = `${(parseInt(n) * parseInt(e)) + carry}`.split("").reverse();

                intermediate[x].push(product.shift());
                carry = parseInt(product.shift()) || 0;
            });
            intermediate[x].push(carry);
            carry = 0;
            intermediate[x].unshift(...new Array(x).fill("0"));
            intermediate[x] = intermediate[x].reverse().join("");
        });


        intermediate = intermediate.reduce((a, b) => {
            return StringMath.add(a, b);
        }, "0").split("");

        while (intermediate[0] === "0") {
            intermediate.shift();
        }
        return (negative ? "-" : "") + intermediate.join("");
    },
    subtract: function (a, b) {
        StringMath.log("subtract:", a, "-", b);

        var min, max;
        var negative = false;
        if (a[0] !== "-" && b[0] === "-") {
            b = b.split("");
            b.shift();
            b = b.join("");
            return StringMath.add(a, b);
        } else if (a[0] === "-" && b[0] !== "-") {
            b = "-" + b;
            return StringMath.add(a, b);
        } else if (a[0] === "-" && b[0] === "-") {
            [a, b] = [a, b].map(e => {
                e = e.split("");
                e.shift();
                return e.join("");
            });
            return StringMath.subtract(b, a);
        } else if (a[0] !== "-" && b[0] !== "-") {
            // prepare numbers for subtraction
            if (a.length > b.length) {
                [min, max] = [b, a];
            } else if (b.length > a.length) {
                [min, max] = [a, b];
                negative = true;
            } else {
                for (let i = 0; i < a.length; i++) {
                    if (parseInt(a[i]) > parseInt(b[i])) {
                        [min, max] = [b, a];
                        break;
                    } else if (parseInt(b[i]) > parseInt(a[i])) {
                        [min, max] = [a, b];
                        negative = true;
                        break;
                    }
                }
                if (!max) {
                    max = a, min = b;
                    return "0";
                }
                return "unfinished code";
            }
            max = max.split("").reverse();
            min = min.split("").reverse();
        }

    },
    greaterThan: function (a, b) {
        let flip = 1;
        if (a[0] === "-" && b[0] !== "-") {
            return false;
        } else if (a[0] !== "-" && b[0] === "-") {
            return true;
        } else if (a[0] === "-") {
            [a, b] = [a, b].map(e => {
                e = e.split("");
                e.shift();
                return e.join("");
            });
        }
    }
}
let arrSort = function (arr, descending = false) {
    descending = descending ? -1 : 1;
    arr.sort((a, b) => (
        (a.length > b.length) ?
            (1 * descending) :
            (
                b.length > a.length ?
                    (-1 * descending) :
                    0
            )
    )).map(e => e.join(""));
}
// function compress(text) {
//     console.log(text);
//     text = text.split("").map(e => `${e.charCodeAt(0)}`.padStart(3, 0));
//     console.log(text);
//     return parseInt(text.join(""));
// }

// function decompress(text) {
//     text = parseInt(text, 36);
//     text = text.toString(10);
//     console.log(text);
// // 	while(text.length %)
// }
// var baseValues = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`{|}~!\"#$%&'()*+,-./:;<=>?@";
// function convert(num, inBase, outBase){
//     num = `${num}`.split("").reverse();
//     var vals = num.map((e, n)=>{
//         return {
//             place: n,
//             val:
//         }
//     })
//     new BigInt()
// }

// var text = "abcdefghijklmnopqrstuvwxyz";
// console.log(compress(text) + "\n" + btoa(text));
// decompress(compress(text));
