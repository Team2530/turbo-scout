"use client";

import { Button, Modal, Space, Stack, TextInput } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import React, { useContext } from 'react';
import { TurboContext } from '../app/lib/context';
import { useTBA } from '../app/lib/tba_api';
import { notifications } from '@mantine/notifications';
import RegionalSelect from '@/components/RegionalSelect';

/**
 * A simple function for validating usernames. This should be improved, or maye even replaced with a dropdown if possible.
 * @param username The username
 * @returns true if it is valid and false if it is not
 */
function validateUsername(username: string) {
    return username.trim().length > 0 && !username.includes("<") && username.trim().length < 100;
}

export function SetupModal() {
    const { setUsername, setCurrentEvent } = useContext(TurboContext);
    const { teams } = useTBA();
    const [isOpen, setOpen] = useLocalStorage({ key: "is_setup_modal_open", defaultValue: true });

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            regional: undefined,
            username: ''
        },
        validate: {
            regional: (value) => (value == null || value == undefined) ? "You must choose a regional." : null,
            username: (value) => validateUsername(value) ? null : "Invalid username!"
        }
    });

    const handleSubmit = (values: any) => {
        console.log("Got: " + values);
        const { regional, username } = values;

        if (!regional) {
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

        setCurrentEvent!(regional);
        setUsername!(username);

        setOpen(false);
    };

    return <Modal opened={isOpen} onClose={() => { }} title="Setup turbo-scout" centered withCloseButton={false} size="sm" overlayProps={{ blur: 1 }} transitionProps={{ transition: 'scale-y' }}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="sm">

                <RegionalSelect {...form.getInputProps("regional")} />
                <TextInput
                    label="What is your name?"
                    {...form.getInputProps("username")}
                />
                <Button type="submit" mt="lg">Finish Setup</Button>
            </Stack>
        </form>
    </Modal>;
}
