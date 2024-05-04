import { useTurboScoutData } from "../lib/server";

export function DebugPage() {
    const data = useTurboScoutData();

    return <p>There are {data.length} total entries!</p>
}