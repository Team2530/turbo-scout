import { TurboContext } from "@/app/lib/context";
import { useTBA } from "@/app/lib/tba_api";
import { Select } from "@mantine/core";
import React from "react";

/**
 * A select box for the current regional.
 * 
 * TODO: make a way to add regionals that are not on this list.
 * TODO: Have it only change the event in context when the user clicks the finish button.
 * @returns 
 */
 export default function RegionalSelect() {
    const { events } = useTBA();
    const { currentEvent, setCurrentEvent } = React.useContext(TurboContext);

    return <Select
        label="Regional"
        description="Choose the event/regional that you are currently at."
        searchable
        data={events.length == 0 ? [{value: "", label: "Loading events..."}] : events.map(event => ({ value: event['key'], label: event['name'] }))}
        value={currentEvent}
        onChange={(v) => setCurrentEvent!(v)}
    />;
}