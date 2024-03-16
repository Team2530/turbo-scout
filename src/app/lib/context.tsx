"use client";


import React from "react";

export interface TurboState {
    currentEvent?: string | undefined
    setCurrentEvent?: Function

    teams?: any[]
    setTeams?: Function
}

export function getDefaultTurboState(): TurboState {
    const [currentEvent, setCurrentEvent] = React.useState<string | undefined>(undefined);
    const [teams, setTeams] = React.useState<any[] | undefined>(undefined);

    return {
        currentEvent: currentEvent,
        setCurrentEvent: setCurrentEvent,
        teams: teams,
        setTeams: setTeams
    };
}

export const TurboContext = React.createContext<TurboState>({});