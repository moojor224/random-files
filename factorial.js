var fact = x => (x <= 1) ? x : (x * fact(x - 1));

var factorial = x => (x < 1) ? (factorial(x + 1) / (x + 1)) : fact(x);


function run(x) {
    console.log(fact(x), factorial(x));
    try {
        console.time("fact");
        for (let i = 0; i < x; i++) {
            fact(x);
        }
        console.timeEnd("fact");
    } catch (err) {}
    try {
        console.time("factorial");
        for (let i = 0; i < x; i++) {
            factorial(x);
        }
        console.timeEnd("factorial");

    } catch (err) {}
}
run(1531);
