import { useTurboScoutData } from "../lib/server";

export function DebugTab() {
    const data = useTurboScoutData();

    return <p>There are {data.length} total entries!</p>
}