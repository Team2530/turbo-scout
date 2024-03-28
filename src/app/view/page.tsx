"use client";

import React from "react";
import { getAllData } from "../lib/server";
import { Table, Tabs, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

function EntryTab(props: { data: any[] }) {

    const tableFormat = {
        "Scouter": "user",
        "Type": "type",
        "Team": "team",
        "Time": "timestamp",
        "Event": "event"
    };

    const openModal = () => modals.openConfirmModal({
        title: 'Are you sure you want to do that?',
        children: (
          <Text size="sm">
            This action is so vitally important that you are required to confirm it with a modal. Please click
            one of these buttons to proceed.
          </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => console.log('Confirmed'),
      });

    return <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
        <Table.Thead>
            <Table.Tr>
                {Object.keys(tableFormat).map((column: string) => {
                    return <Table.Th>{column}</Table.Th>
                })}
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {props.data.map((dataEntry: any) => {
                return <Table.Tr onClick={openModal}>
                    {Object.values(tableFormat).map((v: string) => {
                        return <Table.Td>{dataEntry[v]}</Table.Td>
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
         */
        "Entries": <EntryTab data={data} />
    };

    return <Tabs variant="outline" defaultValue={Object.keys(tabs)[0]}>
        <Tabs.List>
            {Object.keys(tabs).map(label => {
                return <Tabs.Tab value={label}>
                    {label}
                </Tabs.Tab>
            })}

        </Tabs.List>

        {Object.entries(tabs).map(([label, content]) => {
            return <Tabs.Panel value={label}>
                {content}
            </Tabs.Panel>
        })}


    </Tabs>
}