"use client";

import React from "react";

export interface TurboState {
    currentEvent?: string | undefined
    setCurrentEvent?: Function

    username?: string | undefined
    setUsername?: Function

    // Checkboxes for pit scouting
    checkboxState?: string[]
    setCheckboxState?: Function

    teams?: any[]
    setTeams?: Function
}

export function useDefaultTurboState(): TurboState {
    const [currentEvent, setCurrentEvent] = React.useState<string | undefined>(undefined);
    const [teams, setTeams] = React.useState<any[] | undefined>(undefined);
    const [checkboxState, setCheckboxState] = React.useState<string[]>([]);
    const [username, setUsername] = React.useState<string>("");

    return {
        currentEvent: currentEvent,
        setCurrentEvent: setCurrentEvent,
        teams: teams,
        setTeams: setTeams,
        checkboxState: checkboxState,
        setCheckboxState: setCheckboxState,
        username: username,
        setUsername: setUsername
    };
}

export const TurboContext = React.createContext<TurboState>({});