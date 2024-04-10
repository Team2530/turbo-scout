import { useLocalStorage } from "@mantine/hooks";
import React from "react";
import { TurboContext } from "./context";

export const TBA_KEY: string = "KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw";

export function useTBA() {
    const [events, setEvents] = useLocalStorage({key: "tba_events", defaultValue: []});
    const [teams, setTeams] = useLocalStorage({key: "tba_teams", defaultValue: []});
    
    const { currentEvent } = React.useContext(TurboContext);
    
    // Fetch events
    React.useEffect(() => {
        if (events.length != 0) return;

        fetch("https://www.thebluealliance.com/api/v3/events/2024", {
            headers: {
                "X-TBA-Auth-Key": TBA_KEY
            }
        })
            .then(resp => resp.json())
            .then(data => {
                setEvents(data);
            });
    }, [events, setEvents]);

    // Fetch teams
    React.useEffect(() => {
        if (currentEvent == undefined) return;

        fetch(`https://www.thebluealliance.com/api/v3/event/${currentEvent}/teams`, {
            headers: {
                "X-TBA-Auth-Key": TBA_KEY
            }
        }).then(resp => resp.json()).then(data => {
            setTeams!(data);
        });
    }, [currentEvent, setTeams]);

    return {
        events: events,
        teams: teams
    }
}