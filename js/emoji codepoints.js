(async function () {
    let data = await fetch("https://www.unicode.org/Public/emoji/15.1/emoji-sequences.txt").then(e => e.text());
    data = data.split("\n");
    data = data.filter(e => e.length > 0).filter(e => !e.trim().startsWith("#"));
    data = data.map(e => e.split(";")[0].trim());
    data = data.map(t => {
        if (t.includes("..")) {
            let arr = t.split("..");
            let res = [];
            for (let i = parseInt(arr[0], 16); i <= parseInt(arr[1], 16); i++) {
                res.push(String.fromCodePoint(i));
            }
            return res;
        }
        return t.split(" ").map(e => String.fromCodePoint(parseInt(e, 16))).join("");
    });
    console.log([...new Set(data.flat(Infinity))].join(""));
})();