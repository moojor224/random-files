function emojiWidth(...emojis) {
    let map = new Map();
    emojis = emojis.map(e => {
        let width = document.createElement("canvas").getContext("2d").measureText("".padEnd(100, e)).width;
        map.set(width, (map.get(width) || 0) + 1);
        return [e, width];
    });
    console.log(map);
    let size = Array.from(map).sort(function (a, b) {
        return a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0;
    })[0][0];
    console.log(size);
    return emojis.filter(e => e[1] == size).map(e => e[0]);
}
emojiWidth(1, 2, 3);
