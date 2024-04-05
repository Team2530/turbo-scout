import { Stack, Table, Image, Container } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MD5 } from "crypto-js";
import { TurboImage } from "./turbo-image";

export function EntryTab(props: { data: any[] }) {

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
                return <Table.Tr onClick={() => viewEntry(dataEntry)} key={dataEntry['timestamp'] + dataEntry['user'] + dataEntry['type'] + MD5(dataEntry['data']).toString()}>
                    {Object.values(tableFormat).map((v: string) => {
                        return <Table.Td key={dataEntry['timestamp'] + "." + v}>{dataEntry[v]}</Table.Td>
                    })}
                </Table.Tr>
            })}
        </Table.Tbody>
    </Table>;
}

function EntryViewer(props: { entry: any }) {

    const entry = props.entry;

    if (entry['type'] == 'note') {
        return <Stack>
            <p>Scouter: {entry['user']}</p>
            <p>Event: {entry['event']}</p>
            <p>Timestamp: {entry['timestamp']}</p>
            <Container>
                {entry['data']['text']}
            </Container>
        </Stack>
    }

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
                                {value.map((image: string) => <TurboImage src={image} key={MD5(image).toString()} />)}
                            </li>
                        }

                        return <li key={key}>{key}: {JSON.stringify(value)}</li>
                    })}
                </ul>
            </Stack>;
        })}
    </Stack>
}