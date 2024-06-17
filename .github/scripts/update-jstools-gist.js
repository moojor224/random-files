// node .\.github\scripts\update-jstools-gist.js {{ jstools_gist_key }}
try {
    (async function () {
        const fs = await import("fs");
        const path = await import("path");
        const { Octokit } = await import("octokit");
        const key = await (async function () {
            if (process.argv[2]) {
                return process.argv[2];
            }
            try {
                return require("../../auth.js").jstools_gist_key;
            } catch (e) {
                console.error(e);
            }
            return process.argv[2];
        })();

        const octokit = new Octokit({ auth: key });
        const API_VER = "2022-11-28";

        let jst_src = fs.readFileSync(path.resolve(__dirname, "../../js/synced/jstools.js"), "utf8");
        let exported_vars = jst_src.match(/export\s+((const|let)\s+([a-zA-Z0-9_]+)\s*=|(function|class)\s+([a-zA-Z0-9_]+)\s*)/g);
        exported_vars = exported_vars.map(x => x.match(/export\s+((const|let|class|function)\s+([a-zA-Z0-9_]+)\s*=?)/)[3]);
        jst_src = jst_src.replaceAll(/\nexport\s?/g, "");
        jst_src = jst_src.replaceAll(/\nconst \{ [a-zA-Z0-9_]+ \} = await tryImport\("[a-zA-Z0-9_\.\/]+\.js"\);/g, "");
        jst_src = `export const jst = (async function(){${jst_src}\nreturn { ${exported_vars.map(e => `${e}`).join(", ")} }\n})();`.toString("base64");
        let jst_imported = await import("data:text/javascript;base64," + Buffer.from(jst_src).toString('base64'));
        await jst_imported.jst;
        jst_imported = await jst_imported.jst;
        const jstools = { ...jst_imported };
        let { data: gist_files } = await octokit.request("PATCH /gists/{gist_id}", {
            gist_id: "c1d8199c6c90a17cdbfec1b18efa3ee4",
            headers: {
                "X-GitHub-Api-Version": API_VER
            }
        });
        let data = {};
        for (let key in jstools) {
            let stringified = jstools.stringify(jstools[key])
            if (typeof jstools[key] == "object") {
                stringified = `let ${key} = ${stringified}`;
            }
            if (gist_files.files[key + ".js"]?.content != stringified) {
                data[key + ".js"] = {
                    content: stringified
                };
            }
        }
        if (Object.keys(data).length > 0) {
            console.log("updating files:", (data));
            await octokit.request("PATCH /gists/{gist_id}", {
                gist_id: "c1d8199c6c90a17cdbfec1b18efa3ee4",
                headers: { "X-GitHub-Api-Version": API_VER },
                files: {
                    "0_jstools functions.md": { content: `this gist contains all of the functions exported by jstools.js` },
                    ...data
                }
            });
        } else {
            console.log("no files to update");
        }
    })()
} catch (err) {
    console.log(err);
}