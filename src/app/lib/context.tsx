"use client";

import React from "react";

export interface TurboState {
    currentEvent?: string | undefined
    setCurrentEvent?: Function

    // Checkboxes for pit scouting
    checkboxState?: string[]
    setCheckboxState?: Function

    teams?: any[]
    setTeams?: Function
}

export function getDefaultTurboState(): TurboState {
    const [currentEvent, setCurrentEvent] = React.useState<string | undefined>(undefined);
    const [teams, setTeams] = React.useState<any[] | undefined>(undefined);
    const [checkboxState, setCheckboxState] = React.useState<string[]>([]);

    return {
        currentEvent: currentEvent,
        setCurrentEvent: setCurrentEvent,
        teams: teams,
        setTeams: setTeams,
        checkboxState: checkboxState,
        setCheckboxState: setCheckboxState
    };
}

export const TurboContext = React.createContext<TurboState>({});