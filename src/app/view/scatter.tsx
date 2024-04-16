import { ScatterChart } from "@mantine/charts";
import { useExtendedTBA, useTBA } from "../lib/tba_api";

export function ScatterTab() {
    const { teams } = useTBA();
    const tbaData = useExtendedTBA();


    const getTeamRank = (team: any) => {
        if (tbaData == undefined || tbaData['rankings'] == undefined) return 0;
        const rankings: Array<any> = tbaData['rankings']['rankings'];
        if (rankings == undefined) return 0;
        if (rankings.length == 0) return 0;

        return rankings.find(entry => entry['team_key'] == team['key'])['rank'] || 0;
    }

    const getWinCount = (team: any) => {
        if (tbaData == undefined || tbaData['rankings'] == undefined) return 0;
        const rankings: Array<any> = tbaData['rankings']['rankings'];
        if (rankings == undefined) return 0;
        if (rankings.length == 0) return 0;

        return rankings.find(entry => entry['team_key'] == team['key'])['record']['wins'] || 0;
    }

    //TODO: display team number alongside the chosen stats

    /*
    TODO:

        teleop
        auto
        endgame
        losses
        win / loss ratio
        ccwms, oprs, etc.
        Total ranking points
        rank inverted
    */

    const data = teams.map((team: any, index: number) => {
        return {
            "Team Number": parseInt(team['key'].substring(3)),
            "Rank": getTeamRank(team),
            "Wins": getWinCount(team)
        }
    });

    const wrapper = [
        {
            color: 'blue.5',
            name: 'Teams',
            data: data
        }
    ];

    return <ScatterChart
        h={350}
        data={wrapper}
        dataKey={{ x: 'Rank', y: 'Wins' }}
        xAxisLabel="Rank"
        yAxisLabel="Wins"
    />
}