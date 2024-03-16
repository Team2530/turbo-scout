"use client";


import React from "react";

export interface TurboState {
    currentEvent?: string | undefined
    setCurrentEvent?: Function
}

export function getDefaultTurboState(): TurboState {
    const [currentEvent, setCurrentEvent] = React.useState<string | undefined>(undefined);

    return {
        currentEvent: currentEvent,
        setCurrentEvent: setCurrentEvent
    };
}

export const TurboContext = React.createContext<TurboState>({});