
function generateFakeSourceMap(url) {
    return JSON.stringify({
        version: 3,
        file: url,
        sources: [url],
        names: [],
        mappings: "AAAA",
    })
}

/**
 * logs a message to the console with a custom source file link (purely visual, link doesn't work)
 * @param {any[]} args
 * @param {string} link
 */
function log(args, link) {
    const baseKey = "getArgs";
    let key = baseKey;
    let i = 0;
    while (key in window) {
        key = baseKey + i++;
    }
    window[key] = args;
    try {
        const sourceMap = "data:application/json,base64;" + btoa(generateFakeSourceMap(link));
        const script = "data:text/javascript;base64," + btoa(`console.log(window.${key});\n//# sourceURL=[module]\n//# sourceMappingURL=${sourceMap}\n//# sourceURL=${link}`);
        import(script).then(() => {
            delete window[key];
        });
    } catch {
        console.error("Failed to log args:", args, "to link:", link);
        delete window[key]; // clean up in case of error
    }
}