import { existsSync, writeFileSync } from "fs";
import { readFile, readdir } from "fs/promises";



export async function GET() {

    if (needToRatelimit()) {
        return new Response("ERROR: Too many requests!");
    }

    const dataDir: string = "./turbo-data/";

    let data: any[] = await readdir(dataDir, {}).then(async (files: string[]) => {
        return (await Promise.all(files.map(async (filePath: string) => {
            return JSON.parse(await readFile(dataDir + filePath, { encoding: 'utf8', flag: 'r' }));
        }))).flat();
    });

    const result: string = getRobocatsCSV(data);

    return new Response(result);
}

let lastRequest: number = 0;

function needToRatelimit() {
    // time in seconds
    const currentTime = new Date().getTime() / 1000;

    if (lastRequest == 0) {
        lastRequest = currentTime;
        return false;
    }

    if (currentTime - lastRequest < 60) {
        lastRequest = currentTime;
        return true;
    }

    lastRequest = currentTime;
    return false;
}

function dataExtraction(location: string[]) {
    return (entry: any) => {
        if (entry == undefined || entry == null) return "";
        if (!Object.keys(entry).includes('data') || entry['data'] == undefined || entry['data'] == null) return "";

        let current = entry['data'];

        for (const pathAddition of location) {
            if (current[pathAddition] == undefined) return "";
            current = current[pathAddition];
        }

        return current;
    };
}

function getRobocatsCSV(data: any[]) {
    const matchDataEntries: any[] = data.filter(entry => entry && entry['type'] == 'match');

    const format = [
        { rc_name: "1metadata.1team", extract: (entry: any) => entry['team'] },
        { rc_name: "1metadata.2match", extract: (entry: any) => entry['matchNumber'] },
        { rc_name: "1metadata.absent", extract: (entry: any) => "" },
        { rc_name: "1metadata.location", extract: (entry: any) => "" },
        { rc_name: "1metadata.name", extract: (entry: any) => entry['user'] },
        { rc_name: "abilities.auto-center-line-pick-up", extract: (entry: any) => "" },
        { rc_name: "data.auto-missed-in-amp", extract: (entry: any) => "" },
        { rc_name: "data.auto-missed-in-speaker", extract: (entry: any) => "" },
        { rc_name: "data.auto-scored-in-amp", extract: dataExtraction(["During Match", "How many notes did they score in the amp during auto?"]) },
        { rc_name: "data.auto-scored-in-speaker", extract: dataExtraction(["During Match", "How many notes did they score in the speaker during auto?"]) },
        { rc_name: "data.notes", extract: dataExtraction(["Reflection", "Any other comments?"]) }, //TODO: add more to the notes section, like offensive/defensive
        { rc_name: "data.teleop-missed-in-amp", extract: (entry: any) => "" },
        { rc_name: "data.teleop-missed-in-speaker", extract: (entry: any) => "" },
        { rc_name: "data.teleop-missed-in-trap", extract: (entry: any) => "" },
        { rc_name: "data.teleop-scored-in-amp", extract: dataExtraction(["During Match", "How many notes did they score in the amp during teleop?"]) },
        { rc_name: "data.teleop-scored-in-amplified", extract: (entry: any) => "" }, //TODO
        { rc_name: "data.teleop-scored-in-non-amplified", extract: dataExtraction(["During Match", "How many notes did they score in the speaker during teleop?"]) },
        { rc_name: "data.teleop-scored-in-trap", extract: (entry: any) => (dataExtraction(["During Match", "What did they do in endgame?"])(entry) as string[]).includes("Score trap") ? 1 : 0 },
        { rc_name: "ratings.defense-skill", extract: (entry: any) => "" },
        { rc_name: "ratings.driver-skill", extract: (entry: any) => "" },
        { rc_name: "ratings.intake-consistency", extract: (entry: any) => "" },
        { rc_name: "ratings.overall", extract: (entry: any) => Math.round(dataExtraction(["Reflection", "What is your overall rating of their performance? (for reference, our robot [2530] is probably around 75%)"])(entry) / 20) },
        { rc_name: "ratings.speed", extract: (entry: any) => "" },
        { rc_name: "ratings.stability", extract: (entry: any) => "" }
    ];

    let result = "";

    for (const matchEntry of matchDataEntries) {
        for (const field of format) {
            result += String(field.extract(matchEntry)).replaceAll(",", "").replaceAll('"', "").replaceAll("\n", " - ");
            result += ",";
        }
        result += "\n";
    }

    // Remove trailing newline
    result = result.substring(0, result.length - 1);

    return result;
}

export async function POST() {
    //TODO: do this in a better way
    // The purpose of this function is to prevent NextJS from 
    // taking a look at this file and saying: 'Oh hey, that looks like it can be exported statically because it only *reads* files.'
    if (!existsSync("./README.MD")) {
        writeFileSync("README.MD", "blah");
    }
}
