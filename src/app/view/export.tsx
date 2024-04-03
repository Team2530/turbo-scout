import { Button, Stack } from "@mantine/core";
import SEASON_MATCH_CONFIG from "../match_season_config.json";
import download from "downloadjs";


function exportToNormalCSV(data: any[]) {
    const matchDataEntries: any[] = data.filter(entry => entry && entry['type'] == 'match');

    let result = "";

    result += "Match Number,Team,";

    Object.entries(SEASON_MATCH_CONFIG).forEach(([_, questions]: [string, any[]]) => {
        questions.forEach((question: any) => {
            result += question['name'].replaceAll(",", "") + ",";
        });
    });

    result += "\n";

    for (let entry of matchDataEntries) {
        if (!entry['data']) continue;

        console.log("adding entry from " + entry['timestamp']);
        result += entry['matchNumber'] + "," + entry['team'] + ',';

        Object.entries(SEASON_MATCH_CONFIG).forEach(([category, questions]: [string, any[]]) => {



            if (!(Object.keys(entry['data']).includes(category))) {
                questions.forEach(_ => result += ",");
                return;
            }

            questions.forEach((question: any) => {
                const questionName = question['name'];

                if (!(Object.keys(entry['data'][category]).includes(questionName))) {
                    result += ",";
                    return;
                }

                result += JSON.stringify(
                    entry['data'][category][questionName])
                    .replaceAll(",", ";")
                    .replaceAll('"', "")
                    .replaceAll("[", "")
                    .replaceAll("]", "")
                    + ",";
            });
        });

        result += '\n';
    }

    download(result, "match-data-export.csv", "text/csv");
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

function exportToRobocatCSV(data: any[]) {
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
            result += JSON.stringify(field.extract(matchEntry)).replaceAll(",", "").replaceAll('"', "");
            result += ",";
        }
        result += "\n";
    }

    // Remove trailing newline
    result = result.substring(0, result.length - 1);

    download(result, "robocats-data-export.csv", "text/csv");
}

export function ExportTab(props: { data: Array<any> }) {
    return <Stack>
        <Button onClick={() => exportToNormalCSV(props.data)}>Export Match Data CSV</Button>
        <Button onClick={() => exportToRobocatCSV(props.data)}>Export Match Data CSV [Robocats edition]</Button>
    </Stack>;
}