import React from "react"
import { TurboContext } from "../lib/context"

export default function PitDisplay(){
    const { current_event } = React.useContext(TurboContext);

    return <p>Event: {current_event}</p>
}