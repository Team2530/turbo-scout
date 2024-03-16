"use client";

import React from "react"
import { TurboContext } from "../lib/context"
import { Checkbox, Table } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PitDisplay() {
    const { teams } = React.useContext(TurboContext);

    const router = useRouter();

    //TODO: keep checkbox state after going to another page

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
                <Table.Td><Checkbox /></Table.Td>
                <Table.Td onClick={() => router.push(`/pit/${team['key'].substring(3)}`)}>{team['key'].substring(3)}</Table.Td>
                <Table.Td onClick={() => router.push(`/pit/${team['key'].substring(3)}`)}>{team['nickname']}</Table.Td>
                <Table.Td>{team['rookie_year']}</Table.Td>
            </Table.Tr>)}
        </Table.Tbody>
    </Table>;
}