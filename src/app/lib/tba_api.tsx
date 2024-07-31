import { useLocalStorage } from "@mantine/hooks";
import React from "react";
import { TurboContext } from "./context";

import SEASON_CONFIG from "@/config/season.json";

export const TBA_BASE: string = "https://www.thebluealliance.com/api/v3";
export const TBA_KEY: string = "KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw";
export const TBA_OPTS: RequestInit = {
    headers: {
        "X-TBA-Auth-Key": TBA_KEY
    }
};

/**
 * A hook for accessing essential TBA data. 
 * 
 * TODO: make a fallback way of doing this
 * TODO: do more caching if possible- this method only saves one result at a time.
 * @returns Event details and team list
 */
export function useTBA() {
    const [events, setEvents] = useLocalStorage({ key: "tba_events", defaultValue: [] });
    const [teams, setTeams] = useLocalStorage({ key: "tba_teams", defaultValue: [] });

    const { currentEvent } = React.useContext(TurboContext);

    // Fetch events
    React.useEffect(() => {
        if (events.length != 0) return;

        fetch(`${TBA_BASE}/events/${SEASON_CONFIG.year}`, TBA_OPTS)
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