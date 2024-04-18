import React from "react";
import { TurboContext } from "../lib/context";
import { useMantineColorScheme } from "@mantine/core";
import { TeamViewer } from "./team";
import { modals } from "@mantine/modals";
import DataTable from 'react-data-table-component';
import { useExtendedTBA, useTBA } from "../lib/tba_api";
import { useTurboScoutData } from "../lib/server";

export function TeamsTab() {

    const { teams } = useTBA();
    const data = useTurboScoutData();
    const tbaData: any = useExtendedTBA();

    /*
    match count at regional
    avg coop
    avg match
    avg auto
    avg stage
    matches played
    total ranking points
    avg auto points
    avg teleop points
    endgame points
    fouls
    epa
    */

    const columns = [
        {
            name: "Team Number",
            selector: (row: any) => parseInt(row['key'].substring(3)),
            sortable: true
        },
        {
            name: "Team Name",
            selector: (row: any) => row['nickname'],
            sortable: true
        },
        {
            name: "Rank",
            selector: (team: any) => {
                if (tbaData == undefined || tbaData['rankings'] == undefined || tbaData['rankings']['rankings'] == undefined) return 0;
                const rankings: Array<any> = tbaData['rankings']['rankings'];

                if (rankings == undefined || rankings.length == 0) return 0;

                const ranking_entry = rankings.find(entry => entry['team_key'] == team['key']);

                if(ranking_entry == null || ranking_entry == undefined) return 0;
                if(!Object.keys(ranking_entry).includes("rank")) return 0;

                return ranking_entry['rank'];
            },
            sortable: true
        },
        {
            name: "OPRS",
            selector: (row: any) => {
                if (tbaData == undefined) return 0;
                const oprsSection: any = tbaData['oprs'];
                if (oprsSection == undefined || oprsSection['oprs'] == undefined) return 0;
                return oprsSection['oprs'][row['key']];
            },
            sortable: true
        },
        {
            name: "CCWMS",
            selector: (row: any) => {
                if (tbaData == undefined) return 0;
                const oprsSection: any = tbaData['oprs'];
                if (oprsSection == undefined || oprsSection['ccwms'] == undefined) return 0;
                return oprsSection['ccwms'][row['key']];
            },
            sortable: true
        },
        {
            name: "DPRS",
            selector: (row: any) => {
                if (tbaData == undefined) return 0;
                const oprsSection: any = tbaData['oprs'];
                if (oprsSection == undefined || oprsSection['dprs'] == undefined) return 0;
                return oprsSection['dprs'][row['key']];
            },
            sortable: true
        },
        {
            name: "Rookie Year",
            selector: (row: any) => {
                return row['rookie_year']
            },
            sortable: true
        }
    ];

    return <DataTable
        columns={columns}
        data={teams!}
        fixedHeader
        theme={useMantineColorScheme().colorScheme.replaceAll("light", "default")}
        pointerOnHover
        keyField="key"
        onRowClicked={(team: any, e: any) => modals.open({
            children: <TeamViewer team={team} />,
            size: window.innerWidth
        })}
    />
}