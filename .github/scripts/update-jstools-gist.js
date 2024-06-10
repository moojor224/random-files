// node .\.github\scripts\update-jstools-gist.mjs {{ jstools_gist_key }}
(async function () {
    const { Octokit } = await import("octokit");
    const key = await (async function () {
        try {
            return require("../../auth.js").jstools_gist_key;
        } catch (e) {
            console.error(e);
        }
        return process.argv[2];
    })();

    const octokit = new Octokit({ auth: key });
    const API_VER = "2022-11-28";

    const jst = await import("../../js/synced/jstools.js");
    const jstools = { ...jst };
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
        console.log("updating files:", Object.keys(data));
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