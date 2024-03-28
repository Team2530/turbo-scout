"use client";

import { useLocalStorage } from '@mantine/hooks';
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

    /**
     * The sendqueue, responsible for storing things that need to be sent to the server.
     * 
     * Please do not clear the send queue for any reason- other than after it has all been sent.
     * Never use `clearSendQueue` in your code.
     */
    sendQueue?: any[]
    addToSendQueue?: Function
    clearSendQueue?: Function // Do not call this function, otherwise bad things will happen.
}

export function useDefaultTurboState(): TurboState {
    const [currentEvent, setCurrentEvent] = useLocalStorage<string | undefined>({key: "current_event", defaultValue: undefined});
    const [teams, setTeams] = useLocalStorage<any[] | undefined>({key: "teams", defaultValue: undefined});
    const [checkboxState, setCheckboxState] = useLocalStorage<string[]>({key: "pit_checkbox_state", defaultValue: []});
    const [username, setUsername] = useLocalStorage<string>({key: "username", defaultValue: ""});
    const [sendQueue, do_not_call_this] = useLocalStorage<any[]>({key: "sendqueue", defaultValue: []});

    return {
        currentEvent: currentEvent,
        setCurrentEvent: setCurrentEvent,
        teams: teams,
        setTeams: setTeams,
        checkboxState: checkboxState,
        setCheckboxState: setCheckboxState,
        username: username,
        setUsername: setUsername,
        sendQueue: sendQueue,
        addToSendQueue: (item: any) => do_not_call_this([...sendQueue, item]),
        clearSendQueue: (_: any) => do_not_call_this([])
    };
}

export const TurboContext = React.createContext<TurboState>({});