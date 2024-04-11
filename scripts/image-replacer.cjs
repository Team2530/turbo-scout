// import { writeFileSync, existsSync, mkdirSync } from "fs";
// import { readFile, readdir } from "fs/promises";
// import { MD5 } from "crypto-js";

const { readdir, readFile } = require('fs/promises');
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const { MD5 } = require("crypto-js");

async function getAllEntries(dataDir) {
    return await readdir(dataDir, {}).then(async (files) => {
        return ((await Promise.all(files.map(async (filePath) => {
            let json = JSON.parse(await readFile(dataDir + filePath, { encoding: 'utf8', flag: 'r' }));
            if (json != undefined && json != null
                && Object.keys(json).includes("data")
                && json['data'] != null
                && Object.keys(json['data']).includes('Photos')
                && json['data']['Photos'] != null) {
                json["data"]["Photos"] = undefined;
            }

            return json;
        }))).flat());
    });
}

function uploadImage(content) {
    if (!existsSync("turbo-image")) {
        mkdirSync("turbo-image");
    }

    const fileName = MD5(content).toString();

    writeFileSync("turbo-image/" + fileName, content);

    return fileName;
}

function transformEntryImages(entry) {
    // Excessive checking of nulls and stuff
    if (entry == null || entry == undefined) return entry;
    if (!Object.keys(entry).includes("data")) return entry; //TODO: maybe return some kind of error in this case?
    if (entry['data'] == null || entry['data'] == undefined) return entry;

    if (!Object.keys(entry['data']).includes("Photos")) return entry;

    const photoQuestions = entry['data']['Photos'];

    if (photoQuestions == null || photoQuestions.length == 0 || photoQuestions == undefined) return entry;

    return { ...entry, data: { ...entry['data'], "Photos": fixPhotoQuestions(photoQuestions) } }
}

function fixPhotoQuestions(photoQuestions) {
    let result = {};

    Object.entries(photoQuestions).map(([questionName, photos]) => {
        result[questionName] = photos.map((photo) => uploadImage(photo));
    });

    return result;
}

getAllEntries("./turbo-data-bak/").then(entries => {
    entries.forEach((entry, index) => {
        if (entry['type'] == 'pit') {
            console.log(`Transforming entry for team ${entry['team']} by ${entry['user']} at ${entry['timestamp']}`);
            entry = transformEntryImages(entry);
        }

        writeFileSync(`./turbo-data/entry-${index}.json`, JSON.stringify(entry));
    });
});