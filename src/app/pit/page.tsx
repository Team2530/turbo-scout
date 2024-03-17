"use client";

import React from "react"
import { TurboContext } from "../lib/context"
import { Checkbox, Table } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PitDisplay() {
    const { teams } = React.useContext(TurboContext);

    const router = useRouter();

    const {checkboxState, setCheckboxState} = React.useContext(TurboContext);

    const isCheckboxSelected = (key: string) => checkboxState!.includes(key);
    const toggleCheckbox = (key: string) => {
        checkboxState!.includes(key)
            ? setCheckboxState!((current: string[]) => current.filter(team => team != key))
            : setCheckboxState!((current: string[]) => [...current, key])
    };

    return <Table stickyHeader stickyHeaderOffset={60} withColumnBorders striped>
        <Table.Thead>
            <Table.Tr>
                <Table.Tr></Table.Tr>
                <Table.Td>####</Table.Td>
                <Table.Td>Name</Table.Td>
                <Table.Td>Rookie Year</Table.Td>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {teams?.map(team => <Table.Tr>
                <Table.Td><Checkbox checked={isCheckboxSelected(team['key'])} onChange={() => toggleCheckbox(team['key'])} /></Table.Td>
                <Table.Td onClick={() => router.push(`/pit/${team['key'].substring(3)}`)}>{team['key'].substring(3)}</Table.Td>
                <Table.Td onClick={() => router.push(`/pit/${team['key'].substring(3)}`)}>{team['nickname']}</Table.Td>
                <Table.Td>{team['rookie_year']}</Table.Td>
            </Table.Tr>)}
        </Table.Tbody>
    </Table>;
}