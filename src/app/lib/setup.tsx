"use client";

import { Button, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import React, { useContext } from 'react';
import { TurboContext } from './context';
import { useTBA } from './tba_api';
import { notifications } from '@mantine/notifications';

export function RegionalSelect() {
    const { events } = useTBA();
    const { currentEvent, setCurrentEvent } = React.useContext(TurboContext);

    return <Select
        label="Regional"
        description="Choose the event/regional that you are currently at."
        searchable
        data={events.length == 0 ? ["Loading events..."] : events.map(event => ({ value: event['key'], label: event['name'] }))}
        value={currentEvent}
        onChange={(v) => setCurrentEvent!(v)}
    />;
}

function validateUsername(username: string) {
    return username.trim().length > 0 && !username.includes("<") && username.trim().length < 100;
}

export function SetupModal() {
    const { currentEvent, username, setUsername } = useContext(TurboContext);
    const { teams } = useTBA();
    const [isOpen, setOpen] = useLocalStorage({key: "is_setup_modal_open", defaultValue: true});

    const attemptClose = () => {
        if (currentEvent == undefined) {
            notifications.show({
                title: "No regional selected!",
                message: "You need to select a regional before finishing setup!"
            });
            return;
        }

        if (username == undefined || !validateUsername(username)) {
            notifications.show({
                title: "You must choose a username!",
                message: "You need to choose a username. It should be your real name to keep data organized."
            })
            return;
        }

        setOpen(false);
    };

    return <Modal opened={isOpen} onClose={() => { }} title="Setup turbo-scout" centered withCloseButton={false} size="sm" overlayProps={{ blur: 1 }} transitionProps={{ transition: 'scale-y' }}>
        <Stack gap="sm">
            <RegionalSelect />
            <TextInput
                label="What is your name?"
                value={username}
                onChange={(v) => setUsername!(v.target.value)}
            />
            {teams ? <p>Fun Fact: There are {teams.length} teams at this event!</p> : <p>No event selected :(</p>}
            <Button onClick={attemptClose}>Finish Setup</Button>
        </Stack>
    </Modal>;
}
