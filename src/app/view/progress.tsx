import React from "react";
import { TurboContext } from "../lib/context";
import { DonutChart } from "@mantine/charts";
import { Stack, Table } from "@mantine/core";

export function ProgressTab(props: { data: any[], tbaData: any }) {

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

    const getTeamRank = (team: any) => {
        if (props.tbaData == undefined || props.tbaData['rankings'] == undefined) return 0;
        const rankings: Array<any> = props.tbaData['rankings']['rankings'];
        if (rankings == undefined) return 0;
        if (rankings.length == 0) return 0;

        return rankings.find(entry => entry['team_key'] == team['key'])['rank'] || 0;
    }

    // key.ss(3), nickname, state_prov + ", " + country
    const pitUnscoutedList = <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Team Number</Table.Th>
                <Table.Th>Team Name</Table.Th>
                <Table.Th>Team Location</Table.Th>
                <Table.Th>Rank</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {teamsNotPitScouted?.map(team => {
                return <Table.Tr key={team['key']}>
                    <Table.Td>{team['key'].substring(3)}</Table.Td>
                    <Table.Td>{team['nickname']}</Table.Td>
                    <Table.Td>{team['state_prov']}, {team['country']}</Table.Td>
                    <Table.Td>{getTeamRank(team)}</Table.Td>
                </Table.Tr>
            })}
        </Table.Tbody>
    </Table>

    return <Stack align="center">
        {pitCompletionChart}
        {pitUnscoutedList}
    </Stack>;
}