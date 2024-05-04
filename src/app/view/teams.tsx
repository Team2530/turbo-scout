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
    # pit entries
    # match entries
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
            name: "Max Speaker",
            selector: (team: any) => {
                const getSpeaker = (matchEntry: any) => {
                    const fail = (reason: string) => {
                        console.log("ERROR: Failed to get speaker value for match entry: " + reason);
                        return 0;
                    }
                    if(matchEntry == null) return fail("Match entry is null.");
                    if(!Object.keys(matchEntry).includes("data")) return fail("Match entry has no 'data' key.");
                    if(!Object.keys(matchEntry['data']).includes("During Match")) return fail("Match entry has no data/during match key.");
                    if(!Object.keys(matchEntry['data']['During Match']).includes("How many notes did they score in the speaker during teleop?")) return fail("Match entry does not have speaker value");

                    const result: number = matchEntry['data']['During Match']["How many notes did they score in the speaker during teleop?"] || 0
                    console.log("got: " + result);
                    return result;
                }

                return getSpeaker(data.filter(entry => 'frc' + entry['team'] == team['key'])
                           .filter(entry => entry['type'] == 'match')
                           .sort((a: any, b: any) => getSpeaker(b) - getSpeaker(a))
                           .at(0));
            },
            sortable: true
        },
        {
            name: "# Match entries",
            selector: (team: any) => {
                return data.filter(entry => 'frc' + entry['team'] == team['key'])
                           .filter(entry => entry['type'] == 'match')
                           .length;
            },
            sortable: true
        },
        {
            name: "# Notes",
            selector: (team: any) => {
                return data.filter(entry => 'frc' + entry['team'] == team['key'])
                           .filter(entry => entry['type'] == 'note')
                           .length;
            },
            sortable: true
        },
        {
            name: "Max Amp",
            selector: (row: any) => row['key'],
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