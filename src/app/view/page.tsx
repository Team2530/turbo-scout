"use client";

import React from "react";
import { getAllData } from "../lib/server";
import { SimpleGrid, Stack, Table, Tabs, Image, Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { type } from "os";
import { MD5 } from "crypto-js";
import download from "downloadjs";
import { DonutChart } from '@mantine/charts';

import SEASON_MATCH_CONFIG from "../match_season_config.json";
import SEASON_PIT_CONFIG from "../pit_season_config.json";
import { TurboContext } from "../lib/context";
import { TBA_KEY } from "../lib/tba_api";

function ProgressTab(props: { data: any[] }) {

    //TODO: pit map display

    const { teams, currentEvent } = React.useContext(TurboContext);
    const pitData: any[] = props.data.filter(entry => entry['event'] == currentEvent).filter(entry => entry['type'] == 'pit');
    const teamsNotPitScouted: any[] | undefined = teams?.filter(team => pitData.find(entry => entry['team'] == team['key'].substring(3)) == undefined);

    const pitCompletionChart = <DonutChart data={[
        { name: "Scouted Teams", value: (teams?.length || 1) - (teamsNotPitScouted?.length || 0), color: 'green' },
        { name: "Uncouted Teams", value: (teamsNotPitScouted?.length || 0), color: 'red' },
    ]}
        size={200}
        thickness={40} />

    // key.ss(3), nickname, state_prov + ", " + country
    const pitUnscoutedList = <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Team Number</Table.Th>
                <Table.Th>Team Name</Table.Th>
                <Table.Th>Team Location</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {teamsNotPitScouted?.map(team => {
                return <Table.Tr key={team['key']}>
                    <Table.Td>{team['key'].substring(3)}</Table.Td>
                    <Table.Td>{team['nickname']}</Table.Td>
                    <Table.Td>{team['state_prov']}, {team['country']}</Table.Td>
                </Table.Tr>
            })}
        </Table.Tbody>
    </Table>

    return <Stack align="center">
        {pitCompletionChart}
        {pitUnscoutedList}
    </Stack>;
}

function EntryTab(props: { data: any[] }) {

    const tableFormat = {
        "Scouter": "user",
        "Type": "type",
        "Team": "team",
        "Time": "timestamp",
        "Event": "event"
    };

    const viewEntry = (entry: any) => modals.open({
        title: "Entry viewer: " + entry['type'] + " entry for team " + entry['team'],
        children: <EntryViewer entry={entry} />
    });

    return <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
        <Table.Thead>
            <Table.Tr>
                {Object.keys(tableFormat).map((column: string) => {
                    return <Table.Th key={column}>{column}</Table.Th>
                })}
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {props.data.map((dataEntry: any) => {
                return <Table.Tr onClick={() => viewEntry(dataEntry)} key={dataEntry['timestamp']}>
                    {Object.values(tableFormat).map((v: string) => {
                        return <Table.Td key={dataEntry['timestamp'] + "." + v}>{dataEntry[v]}</Table.Td>
                    })}
                </Table.Tr>
            })}
        </Table.Tbody>
    </Table>;
}

function ExportTab(props: { data: Array<any> }) {

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

    return <Stack>
        <Button onClick={exportMatchDataCSV}>Export Match Data CSV</Button>
    </Stack>;
}

function TeamsTab(props: { data: any[], tbaData: any[] }) {
    return <Table>
        <Table.Thead>
            <Table.Th>Team #</Table.Th>
            <Table.Th>Team Name</Table.Th>
            <Table.Th>EPA</Table.Th>
            <Table.Th>OPR</Table.Th>
            <Table.Th>DPR</Table.Th>
            <Table.Th>CCWM</Table.Th>
        </Table.Thead>
        {/* TODO */}
    </Table>
}

function TeamViewer(props: { data: any[], tbaData: any[], team: any }) {
    return <p>Team viewer for team: {props.team['key'] + props.team['nickname']}</p>
}

function EntryViewer(props: { entry: any }) {

    const entry = props.entry;

    return <Stack gap="xs">
        <p>Scouter: {entry['user']}</p>
        <p>Event: {entry['event']}</p>
        <p>Timestamp: {entry['timestamp']}</p>
        {entry['matchNumber'] && <p>Match Number: {entry['matchNumber']}</p>}
        {Object.entries(entry['data']).map(([category, values]: any) => {
            return <Stack key={category} gap="xs">
                <p>{category}</p>
                <ul>
                    {Object.entries(values).map(([key, value]: any) => {
                        // Handle images
                        if (category == "Photos") {
                            return <li key={key}>
                                <p>{key}</p>
                                {value.map((image: string) => <Image src={image} key={MD5(image).toString()} alt="" />)}
                            </li>
                        }

                        return <li key={key}>{key}: {JSON.stringify(value)}</li>
                    })}
                </ul>
            </Stack>;
        })}
    </Stack>
}

export default function ViewDataPage() {

    const { currentEvent } = React.useContext(TurboContext);
    const [data, setData] = React.useState<any[]>([]);
    const [tbaData, setTbaData] = React.useState<any[]>([]);

    React.useEffect(() => {
        getAllData(setData);
    }, []);

    React.useEffect(() => {
        if(currentEvent == undefined) return;

        const kv_pairs = {
            "insights": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/insights`,
            "oprs": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/oprs`,
            "rankings": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/rankings`,
            "matches": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/matches`
        };

        let resultant: any = {};

        Object.entries(kv_pairs).forEach(async ([key, url]) => {
            console.log(`${key} <-- ${url}`);

            fetch(url, {headers: {"X-TBA-Auth-Key": TBA_KEY}}).then(r => r.json()).then((data: any) => {
                resultant[key] = data;

                if(Object.values(resultant).length == Object.values(kv_pairs).length) {
                    setTbaData(resultant);
                    console.log("Done loading TBA data!");
                }
            });
        });

    }, [currentEvent, setTbaData]);

    const tabs = {
        /**
         * Ideas:
         *  Entry table
         *  Progress overview - what teams still need to be scouted
         *  Visual pit map display
         *  Charts and stuff
         *  Individual team
         *  Match
         *  Alliance view?
         *  Export as CSV/XLSX
         */
        "Pit Progress": <ProgressTab data={data} />,
        "Entries": <EntryTab data={data} />,
        "Teams": <TeamsTab data={data} tbaData={tbaData} />,
        "Export": <ExportTab data={data} />
    };

    return <Tabs variant="outline" defaultValue={Object.keys(tabs)[0]}>
        <Tabs.List>
            {Object.keys(tabs).map(label => {
                return <Tabs.Tab value={label} key={label}>
                    {label}
                </Tabs.Tab>
            })}

        </Tabs.List>

        {Object.entries(tabs).map(([label, content]) => {
            return <Tabs.Panel value={label} key={label}>
                {content}
            </Tabs.Panel>
        })}


    </Tabs>
}