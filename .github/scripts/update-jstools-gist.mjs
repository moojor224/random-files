// node --experimental-network-imports .\.github\scripts\update-jstools-gist.mjs
// import { Octokit, App } from "octokit";
// const key = process.argv[2];


// const octokit = new Octokit({ auth: key });
// const user = "moojor224";
// const API_VER = "2022-11-28";

// await octokit.request("PATCH /gists/{gist_id}", {
//     gist_id: "c1d8199c6c90a17cdbfec1b18efa3ee4",
//     files: {
//         "octokit.html": {
//             content: "test"
//         }
//     }
// });
// console.log(jstools);
// import { extend } from "https://raw.githubusercontent.com/moojor224/random-files/main/js/synced/jstools.js";
// import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@8.3.2/wrapper.mjs';
// console.log(uuidv4());
import https from "https";
import http from "http";
import vm from "vm";
import concat from "concat-stream";
import fs from "fs"; // read file to string and override response data

['https://raw.githubusercontent.com/moojor224/random-files/main/js/synced/jstools.js'].forEach(url => {
    https.get(url, res => {
        console.log(res.headers['content-type']);
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { rawData += chunk; });
        res.on('end', async () => {
            console.log("end", rawData.split("\n").slice(0, 20).join("\n"));
            vm.runInThisContext(`(async ()=>{${rawData}})()`, url);
            // console.log(extend);
        });
    });
});