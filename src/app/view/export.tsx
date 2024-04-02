import { Button, Stack } from "@mantine/core";
import SEASON_MATCH_CONFIG from "../match_season_config.json";
import download from "downloadjs";

export function ExportTab(props: { data: Array<any> }) {

    const exportMatchDataCSV = () => {
        const matchDataEntries: Array<any> = props.data.filter(entry => entry['type'] == 'match');

        let result = "";

        result += "Match Number,Team,";

        Object.entries(SEASON_MATCH_CONFIG).forEach(([_, questions]: [string, any[]]) => {
            questions.forEach((question: any) => {
                result += question['name'].replaceAll(",", "") + ",";
            });
        });

        result += "\n";

        for (let entry of matchDataEntries) {
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
    };

    //TODO: PDF Export

    return <Stack>
        <Button onClick={exportMatchDataCSV}>Export Match Data CSV</Button>
    </Stack>;
}