import React from "react";
import { TurboContext } from "../lib/context";
import { useMantineColorScheme } from "@mantine/core";
import { TeamViewer } from "./team";
import { modals } from "@mantine/modals";
import DataTable from 'react-data-table-component';

export function TeamsTab(props: { data: any[], tbaData: any }) {

    const { teams } = React.useContext(TurboContext);
    const tbaData: any = props.tbaData;

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
                if (props.tbaData == undefined || props.tbaData['rankings'] == undefined || props.tbaData['rankings']['rankings'] == undefined) return 0;
                const rankings: Array<any> = props.tbaData['rankings']['rankings'];

                if (rankings == undefined || rankings.length == 0) return 0;

                return rankings.find(entry => entry['team_key'] == team['key'])['rank'] || 0
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
            }
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
            children: <TeamViewer data={props.data} tbaData={tbaData} team={team} />,
            size: window.innerWidth
        })}
    />
}