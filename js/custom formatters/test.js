/** @type {devtoolsFormatter} */
export let formatter = {
    hasBody: function (obj) {
        return obj instanceof immutable.Seq;
    },
    header: function (obj) {
        if (obj instanceof immutable.Seq) {
            return ["div", {}, "immutable Seq"];
        }
        return null;
    },
    body: function (obj) {
        if (obj instanceof immutable.Seq) {
            return ["object", {
                object: obj._array || obj._object
            }];
        }
        return null;
    },
}