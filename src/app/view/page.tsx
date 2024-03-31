"use client";

import React from "react";
import { getAllData } from "../lib/server";
import { SimpleGrid, Stack, Table, Tabs, Image } from "@mantine/core";
import { modals } from "@mantine/modals";
import { type } from "os";
import { MD5 } from "crypto-js";

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
                            if (Array.isArray(value) && (value[0] as string).startsWith("data:image/png")) {
                                return <li key={key}>
                                    <p>{key}</p>
                                    {value.map(image => <Image src={image} key={MD5(image).toString()} />)}
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
        "Entries": <EntryTab data={data} />
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