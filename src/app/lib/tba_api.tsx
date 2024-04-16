import { useLocalStorage } from "@mantine/hooks";
import React from "react";
import { TurboContext } from "./context";

export const TBA_BASE: string = "https://www.thebluealliance.com/api/v3";
export const TBA_KEY: string = "KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw";
export const TBA_OPTS: any = {
    headers: {
        "X-TBA-Auth-Key": TBA_KEY
    }
};

export function useTBA() {
    const [events, setEvents] = useLocalStorage({ key: "tba_events", defaultValue: [] });
    const [teams, setTeams] = useLocalStorage({ key: "tba_teams", defaultValue: [] });

    const { currentEvent } = React.useContext(TurboContext);

    // Fetch events
    React.useEffect(() => {
        if (events.length != 0) return;

        fetch(`${TBA_BASE}/events/2024`, TBA_OPTS)
            .then(resp => resp.json())
            .then(data => {
                setEvents(data);
            });
    }, [events, setEvents]);

    // Fetch teams
    React.useEffect(() => {
        if (currentEvent == undefined) return;

        fetch(`${TBA_BASE}/event/${currentEvent}/teams`, TBA_OPTS)
            .then(resp => resp.json()).then(data => {
                setTeams!(data);
            });
    }, [currentEvent, setTeams]);

    return {
        events: events,
        teams: teams
    };
}

interface ExtendedTBAData {
    insights: any;
    oprs: any;
    rankings: any;
    matches: any;
}

export function useExtendedTBA() {
    const [tbaData, setTbaData] = React.useState<ExtendedTBAData>();
    const { currentEvent } = React.useContext(TurboContext);

    React.useEffect(() => {
        if (currentEvent == undefined) return;

        const kv_pairs = {
            "oprs": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/oprs`,
            "rankings": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/rankings`,
            "matches": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/matches`
        };

        let resultant: any = {};

        Object.entries(kv_pairs).forEach(async ([key, url]) => {
            fetch(url, TBA_OPTS).then(r => r.json()).then((data: any) => {
                resultant[key] = data;

                if (Object.values(resultant).length == Object.values(kv_pairs).length) {
                    setTbaData(resultant);
                    console.log("Done loading extended TBA data!");
                }
            });
        });

    }, [currentEvent, setTbaData]);

    return tbaData;
}