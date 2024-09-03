class utils {
    constructor() {
        this._seed = Date.now();
    }
    months(config) {
        var cfg = config || {};
        var count = cfg.count || 12;
        var section = cfg.section;
        var values = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = MONTHS[Math.ceil(i) % 12];
            values.push(value.substring(0, section));
        }

        return values;
    }
    startOfToday() {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    }
    isoDayOfWeek(dt) {
        let wd = dt.getDay(); // 0..6, from sunday
        wd = (wd + 6) % 7 + 1; // 1..7 from monday
        return '' + wd; // string so it gets parsed
    }
    numbers(config) {
        var cfg = config || {};
        var min = cfg.min || 0;
        var max = cfg.max || 100;
        var from = cfg.from || [];
        var count = cfg.count || 8;
        var decimals = cfg.decimals || 8;
        var continuity = cfg.continuity || 1;
        var dfactor = Math.pow(10, decimals) || 0;
        var data = [];
        var i, value;

        for (i = 0; i < count; ++i) {
            value = (from[i] || 0) + this.rand(min, max);
            if (this.rand() <= continuity) {
                data.push(Math.round(dfactor * value) / dfactor);
            } else {
                data.push(null);
            }
        }
        return data;
    }
    srand(seed) {
        this._seed = seed;
    }
    rand(min, max) {
        min = min || 0;
        max = max || 0;
        this._seed = (this._seed * 9301 + 49297) % 233280;
        return min + (this._seed / 233280) * (max - min);
    }
    genColors(num) {
        var arr = new Array(num).fill(1).map((e, n) => n + 1);
        arr = arr.map((e, n) => (n / (num - 1)) * 100);
        var colors = [
            {//red
                r: 255, g: 0, b: 0
            },
            {//orange
                r: 255, g: 127, b: 0
            },
            {//yellow
                r: 255, g: 255, b: 0
            },
            {//green
                r: 0, g: 255, b: 0
            },
            {//blue
                r: 0, g: 0, b: 255
            },
            {//purple
                r: 75, g: 0, b: 130
            }
        ];
        return arr.map(p => rgbGradient(p, colors));
    }
    objTree(obj, key) {
        if (typeof obj !== "object") {
            return createElement("ul").add(
                createElement("li", {
                    innerHTML: key + ": " + createElement("code", {
                        innerHTML: obj
                    }).outerHTML
                })
            );
        }
        var details = createElement("details", {
            style: {
                display: "inline-block"
            },
            classList: "detailsTree"
        });
        var summary = createElement("summary", {
            innerHTML: key,
            classList: "detailsTree"
        });
        details.add(summary);
        Object.keys(obj).forEach(e => {
            details.add(objTree(obj[e], e));
        });
        return details;
    }

}
var Utils = new utils();

function shuffleArr(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}