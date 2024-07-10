import { Button, Stack } from "@mantine/core";
import SEASON_MATCH_CONFIG from "../../config/match.json";
import download from "downloadjs";
import { useTurboScoutData } from "../lib/server";


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

export function ExportTab() {
    const data = useTurboScoutData();

    return <Stack>
        <Button onClick={() => exportToNormalCSV(data)}>Export Match Data CSV</Button>
    </Stack>;
}