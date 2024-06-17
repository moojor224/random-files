// these functions are ones that aren't used in the current version of jstools, but are kept for reference

// JSF*ck
// library that converts javascript to code that only uses the following characters: []()!+

(function () {
    if (globalThis.jstools_defined) return;
    const MIN = 32, MAX = 126;
    const SIMPLE = { false: '![]', true: '!![]', undefined: '[][[]]', NaN: '+[![]]', Infinity: '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])'/* +"1e1000" */ };
    const CONSTRUCTORS = { Array: '[]', Number: '(+[])', String: '([]+[])', Boolean: '(![])', Function: '[]["flat"]', RegExp: 'Function("return/"+false+"/")()', Object: '[]["entries"]()' };
    const MAPPING = {
        'a': '(false+"")[1]',
        'b': '([]["entries"]()+"")[2]',
        'c': '([]["flat"]+"")[3]',
        'd': '(undefined+"")[2]',
        'e': '(true+"")[3]',
        'f': '(false+"")[0]',
        'g': '(false+[0]+String)[20]',
        'h': '(+(101))["to"+String["name"]](21)[1]',
        'i': '([false]+undefined)[10]',
        'j': '([]["entries"]()+"")[3]',
        'k': '(+(20))["to"+String["name"]](21)',
        'l': '(false+"")[2]',
        'm': '(Number+"")[11]',
        'n': '(undefined+"")[1]',
        'o': '(true+[]["flat"])[10]',
        'p': '(+(211))["to"+String["name"]](31)[1]',
        'q': '("")["fontcolor"]([0]+false+")[20]',
        'r': '(true+"")[1]',
        's': '(false+"")[3]',
        't': '(true+"")[0]',
        'u': '(undefined+"")[0]',
        'v': '(+(31))["to"+String["name"]](32)',
        'w': '(+(32))["to"+String["name"]](33)',
        'x': '(+(101))["to"+String["name"]](34)[1]',
        'y': '(NaN+[Infinity])[10]',
        'z': '(+(35))["to"+String["name"]](36)',
        'A': '(NaN+[]["entries"]())[11]',
        'B': '(+[]+Boolean)[10]',
        'C': 'Function("return escape")()(("")["italics"]())[2]',
        'D': 'Function("return escape")()([]["flat"])["slice"]("-1")',
        'E': '(RegExp+"")[12]',
        'F': '(+[]+Function)[10]',
        'G': '(false+Function("return Date")()())[30]',
        'H': null,
        'I': '(Infinity+"")[0]',
        'J': null,
        'K': null,
        'L': null,
        'M': '(true+Function("return Date")()())[30]',
        'N': '(NaN+"")[0]',
        'O': '(+[]+Object)[10]',
        'P': null,
        'Q': null,
        'R': '(+[]+RegExp)[10]',
        'S': '(+[]+String)[10]',
        'T': '(NaN+Function("return Date")()())[30]',
        'U': '(NaN+Object()["to"+String["name"]]["call"]())[11]',
        'V': null,
        'W': null,
        'X': null,
        'Y': null,
        'Z': null,
        ' ': '(NaN+[]["flat"])[11]',
        '!': null,
        '"': '("")["fontcolor"]()[12]',
        '#': null,
        '$': null,
        '%': 'Function("return escape")()([]["flat"])[21]',
        '&': '("")["fontcolor"](")[13]',
        '\'': null,
        '(': '([]["flat"]+"")[13]',
        ')': '([0]+false+[]["flat"])[20]',
        '*': null,
        '+': '(+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]])+[])[2]',
        ',': '[[]]["concat"]([[]])+""',
        '-': '(+(.+[0000001])+"")[2]',
        '.': '(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]',
        '/': '(false+[0])["italics"]()[10]',
        ':': '(RegExp()+"")[3]',
        ';': '("")["fontcolor"](NaN+")[21]',
        '<': '("")["italics"]()[0]',
        '=': '("")["fontcolor"]()[11]',
        '>': '("")["italics"]()[2]',
        '?': '(RegExp()+"")[2]',
        '@': null,
        '[': '([]["entries"]()+"")[0]',
        '\\': '(RegExp("/")+"")[1]',
        ']': '([]["entries"]()+"")[22]',
        '^': null,
        '_': null,
        '`': null,
        '{': '(true+[]["flat"])[20]',
        '|': null,
        '}': '([]["flat"]+"")["slice"]("-1")',
        '~': null
    };
    const GLOBAL = 'Function("return this")()';
    function fillMissingDigits() {
        let output;
        for (let number = 0; number < 10; number++) {
            output = "+[]";
            if (number > 0) output = "+!" + output;
            for (let i = 1; i < number; i++) output = "+!+[]" + output;
            if (number > 1) output = output.substring(1);
            MAPPING[number] = "[" + output + "]";
        }
    }
    function replaceMap() {
        let character = "", value, i, key;
        let replace = (pattern, replacement) => value = value.replace(new RegExp(pattern, "gi"), replacement);
        let digitReplacer = (_, x) => MAPPING[x];
        function numberReplacer(_, y) {
            let values = y.split("");
            let head = +(values.shift());
            let output = "+[]";
            if (head > 0) output = "+!" + output;
            for (i = 1; i < head; i++) output = "+!+[]" + output;
            if (head > 1) output = output.substring(1);
            return [output].concat(values).join("+").replace(/(\d)/g, digitReplacer);
        }

        for (i = MIN; i <= MAX; i++) {
            character = String.fromCharCode(i);
            value = MAPPING[character];
            if (!value) continue;
            for (key in CONSTRUCTORS) replace("\\b" + key, CONSTRUCTORS[key] + '["constructor"]');
            for (key in SIMPLE) replace(key, SIMPLE[key]);
            replace('(\\d\\d+)', numberReplacer);
            replace('\\((\\d)\\)', digitReplacer);
            replace('\\[(\\d)\\]', digitReplacer);
            replace("GLOBAL", GLOBAL);
            replace('\\+""', "+[]");
            replace('""', "[]+[]");
            MAPPING[character] = value;
        }
    }
    function replaceStrings() {
        let regEx = /[^\[\]\(\)\!\+]{1}/g, all, value, missing, count = MAX - MIN;
        function findMissing() {
            let all, value, done = false;
            missing = {};
            for (all in MAPPING) {
                value = MAPPING[all];
                if (value && value.match(regEx)) {
                    missing[all] = value;
                    done = true;
                }
            }
            return done;
        }
        let mappingReplacer = (a, b) => b.split("").join("+");
        let valueReplacer = c => missing[c] ? c : MAPPING[c];
        for (all in MAPPING) if (MAPPING[all]) MAPPING[all] = MAPPING[all].replace(/\"([^\"]+)\"/gi, mappingReplacer);
        while (findMissing()) {
            for (all in missing) {
                value = MAPPING[all];
                value = value.replace(regEx, valueReplacer);
                MAPPING[all] = value;
                missing[all] = value;
            }
            if (count-- === 0) console.error("Could not compile the following chars:", missing);
        }
    }
    function escapeSequence(c) {
        let cc = c.charCodeAt(0);
        if (cc < 256) return '\\' + cc.toString(8);
        else {
            let cc16 = cc.toString(16);
            return '\\u' + ('0000' + cc16).substring(cc16.length);
        }
    }
    let escapeSequenceForReplace = c => escapeSequence(c).replace('\\', 't');
    function encode(input, wrapWithEval, runInParentScope, unmappped = '', output = [], r = "") {
        if (!input) return "";
        for (let k in MAPPING) if (MAPPING[k]) unmappped += k;
        unmappped = new RegExp('[^' + unmappped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']', 'g');
        let unmappedCharactersCount = (input.match(unmappped) || []).length;
        if (unmappedCharactersCount > 1) input = input.replace(/[^0123456789.adefilnrsuN]/g, escapeSequenceForReplace);
        else if (unmappedCharactersCount > 0) input = input.replace(/["\\]/g, escapeSequence).replace(unmappped, escapeSequence);
        for (let i in SIMPLE) r += i + "|";
        r += ".";
        input.replace(new RegExp(r, 'g'), function (c) {
            let replacement = SIMPLE[c];
            if (replacement) output.push("(" + replacement + "+[])");
            else {
                replacement = MAPPING[c];
                if (replacement) output.push(replacement);
                else throw new Error('Found unmapped character: ' + c);
            }
        });
        output = output.join("+");
        if (/^\d$/.test(input)) output += "+[]";
        if (unmappedCharactersCount > 1) output = `(${output})[${encode("split")}](${encode("t")})[${encode("join")}](${encode("\\")})`;
        if (unmappedCharactersCount > 0) output = `[][${encode("flat")}][${encode("constructor")}](${encode("return\"")}+${output}+${encode("\"")})()`;
        if (wrapWithEval) {
            if (runInParentScope) output = `[][${encode("flat")}][${encode("constructor")}](${encode("return eval")})()(${output})`;
            else output = `[][${encode("flat")}][${encode("constructor")}](${output})()`;
        }
        return output;
    }
    fillMissingDigits();
    replaceMap();
    replaceStrings();
    window.JSFuck = { encode };
})();

/**
 * diffs the two strings
 * @param {String|String[]} seq1 version 1 of file
 * @param {String|String[]} seq2 version 2 of file
 * @returns {Object[]}
 */
function meyerDiff(seq1, seq2) {
    var N = seq1.length, M = seq2.length, MAX = N + M, furthestReaching = [], D, k, x, y, step, src = [], target = [], stepMap = [], dist = MAX, a;
    for (; dist--;) {
        stepMap[dist] = [];
    }
    furthestReaching[MAX + 1] = 0;
    for (D = 0; D <= MAX && dist === -1; D++) {
        for (k = -D, x, y, step; k <= D && dist === -1; k += 2) {
            if (k === -D || (k !== D && furthestReaching[k - 1 + MAX] < furthestReaching[k + 1 + MAX])) {
                x = furthestReaching[k + 1 + MAX];
                step = 3;
            } else {
                x = furthestReaching[k - 1 + MAX] + 1;
                step = 2;
            }
            y = x - k;
            stepMap[x][y] = step;
            while (x < N && y < M && seq1[x] === seq2[y]) {
                x++;
                y++;
                stepMap[x][y] = 0;
            }
            furthestReaching[k + MAX] = x;
            if (x >= N && y >= M) {
                dist = D;
            }
        }
    }
    for (; N || M;) {
        a = stepMap[N][M];
        src.unshift(a > 2 ? -1 : seq1[N - 1]);
        target.unshift(a == 2 ? -1 : seq2[M - 1]);
        a < 3 && N--; // this functions like a ternary operator with no false case
        a != 2 && M--; // if a==2, logic short-circuits and does not continue to second half
        /* ternary equivalent
        a < 3 ? N-- : 0;
        a != 2 ? M-- : 0;
        */
    }
    return [src, target]
}