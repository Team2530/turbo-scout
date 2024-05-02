import React from "react";
import { TurboContext } from "../lib/context";
import { DonutChart } from "@mantine/charts";
import { Group, Stack, Table, TextInput } from "@mantine/core";
import { useExtendedTBA, useTBA } from "../lib/tba_api";
import { useTurboScoutData } from "../lib/server";

export function ProgressTab() {

    const data = useTurboScoutData();
    const tbaData = useExtendedTBA();

    const { teams } = useTBA();
    const { currentEvent } = React.useContext(TurboContext);
    const pitData: any[] = data.filter(entry => entry['event'] == currentEvent).filter(entry => entry['type'] == 'pit');
    const teamsNotPitScouted: any[] | undefined = teams?.filter((team: any) => pitData.find(entry => entry['team'] == team['key'].substring(3)) == undefined);

    const pitCompletionChart = <DonutChart data={[
        { name: "Scouted Teams", value: (teams?.length || 1) - (teamsNotPitScouted?.length || 0), color: 'green' },
        { name: "Unscouted Teams", value: (teamsNotPitScouted?.length || 0), color: 'red' },
    ]}
        size={200}
        thickness={40} />

    const getTeamRank = (team: any) => {
        if (tbaData == undefined || tbaData['rankings'] == undefined) return 0;
        const rankings: Array<any> = tbaData['rankings']['rankings'];
        if (rankings == undefined) return 0;
        if (rankings.length == 0) return 0;
        
        const ranking_entry = rankings.find(entry => entry['team_key'] == team['key']);

        if(ranking_entry == undefined || ranking_entry == null) return 0;

        if(!Object.keys(ranking_entry).includes("rank")) return 0;

        return ranking_entry['rank'] || 0;
    }

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
        <Group>
            {pitCompletionChart}
            <p>{Math.round(100 * ((teams?.length || 1) - (teamsNotPitScouted?.length || 0)) / (teams?.length || 1))}% completed</p>
        </Group>

        {pitUnscoutedList}
    </Stack>;
}