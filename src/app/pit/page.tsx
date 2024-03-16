"use client";
import React from "react"
import { TurboContext } from "../lib/context"

export default function PitDisplay(){
    const { currentEvent } = React.useContext(TurboContext);

    return <p>Event: {currentEvent}</p>;
}