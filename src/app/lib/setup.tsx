"use client";

import { Button, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useContext } from 'react';
import { TurboContext } from './context';
import { TBA_KEY } from './tba_api';


export function RegionalSelect() {
    const [events, setEvents] = React.useState([]);
    const { currentEvent, setCurrentEvent } = React.useContext(TurboContext);

    // Fetch all events
    React.useEffect(() => {
        fetch("https://www.thebluealliance.com/api/v3/events/2024", {
            headers: {
                "X-TBA-Auth-Key": TBA_KEY
            }
        })
            .then(resp => resp.json())
            .then(data => {
                setEvents(data);
            });
    }, []);

    return <Select
        label="Regional"
        description="Choose the event/regional that you are currently at. (likely 2024mnmi)"
        placeholder='2024mnmi'
        searchable
        data={events.length == 0 ? ["Loading events..."] : events.map(event => event['key'])}
        value={currentEvent}
        onChange={(v) => setCurrentEvent!(v)}
    />;
}

function validateUsername(username: string) {
    //TODO
    return username.trim().length > 0;
}

export function SetupModal() {
    const [opened, { close }] = useDisclosure(true);
    const { currentEvent, teams, setTeams, username, setUsername } = useContext(TurboContext);

    const attemptClose = () => {
        if (currentEvent == undefined) {
            alert("You need to select an event first!");
            return;
        }

        if (username == undefined || !validateUsername(username)) {
            alert("You need to choose a username first!");
            return;
        }

        close();
    };

    // Fetch teams
    React.useEffect(() => {
        if (currentEvent == undefined) return;

        fetch(`https://www.thebluealliance.com/api/v3/event/${currentEvent}/teams`, {
            headers: {
                "X-TBA-Auth-Key": TBA_KEY
            }
        }).then(resp => resp.json()).then(data => {
            setTeams!(data);
        });
    }, [currentEvent, setTeams]);

    return <Modal opened={opened} onClose={() => { }} title="Setup turbo-scout" centered withCloseButton={false} size="sm" overlayProps={{ blur: 1 }} transitionProps={{ transition: 'scale-y' }}>
        <Stack gap="sm">
            <RegionalSelect />
            <TextInput
                label="Screen Name"
                description="Choose a screen name for scouting"
                value={username}
                onChange={(v) => setUsername!(v.target.value)}
            />
            {teams ? <p>Fun Fact: There are {teams.length} teams at this regional!</p> : <p>No event selected :(</p>}
            <Button onClick={attemptClose}>Finish Setup</Button>
        </Stack>
    </Modal>;
}