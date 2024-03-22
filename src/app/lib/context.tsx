"use client";

import React from "react";

export interface TurboState {
    /**
     * Store the current event key, e.g. '2024mnmi'
     */
    currentEvent?: string | undefined
    setCurrentEvent?: Function

    /**
     * Store the username of the current scouter.
     * 
     * To be used for possible leaderboards.
     */
    username?: string | undefined
    setUsername?: Function

    /**
     * The checkboxes scouters can use to select which teams they plan to scout.
     */
    checkboxState?: string[]
    setCheckboxState?: Function

    /**
     * The TBA-provided list of teams at the current regional.
     */
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