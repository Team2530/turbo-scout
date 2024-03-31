"use client";

import React from "react";
import { getAllData } from "../lib/server";
import { SimpleGrid, Stack, Table, Tabs, Image, Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { type } from "os";
import { MD5 } from "crypto-js";
import download from "downloadjs";

import SEASON_MATCH_CONFIG from "../match_season_config.json";
import SEASON_PIT_CONFIG from "../pit_season_config.json";

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
        children: <Stack gap="xs">
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
                                    {value.map((image: string) => <Image src={image} key={MD5(image).toString()} />)}
                                </li>
                            }

                            return <li key={key}>{key}: {JSON.stringify(value)}</li>
                        })}
                    </ul>
                </Stack>;
            })}
        </Stack>
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

export default function ViewDataPage() {

    const [data, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        getAllData(setData);
    }, []);

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
        "Entries": <EntryTab data={data} />,
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