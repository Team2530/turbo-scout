import { AppShell, Burger, Group, UnstyledButton, Text, Stack, ActionIcon, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IconShare2, IconTrash } from '@tabler/icons-react';
import { TurboContext } from "./lib/context";
import React from "react";
import { exportData } from "./lib/server";
import { modals } from '@mantine/modals';
import LogoComponent from "@/components/Logo";
import ColorChangeButton from "@/components/ColorChangeButton";

export function ContentLayout(props: { children: React.ReactNode }) {
    const { username } = React.useContext(TurboContext);
    const [opened, { close, toggle }] = useDisclosure();

    const clickExportButton = useExportState(close);
    const deleteEverything = () => modals.openConfirmModal({
        title: 'Are you sure you want to delete everything?',
        children: (
            <Text size="sm">
                You will need internet access afterwards.
            </Text>
        ),
        labels: { confirm: 'Yes', cancel: 'No' },
        onCancel: () => { },
        onConfirm: () => {
            localStorage.clear();
            location.reload();
        },
    });
    const closeIfOnMobile = () => {
        if (window.innerWidth < 430) close();
    };

    return (

        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 200, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group h="100%">
                        <Burger opened={opened} onClick={toggle} size="sm" />
                        <LogoComponent />
                        <Text>Turbo Scout</Text>
                    </Group>
                    <Group h="100%">
                        <ActionIcon variant="default" size="md" onClick={deleteEverything}>
                            <IconTrash />
                        </ActionIcon>
                        <ColorChangeButton />
                        <ActionIcon variant="default" size="md" onClick={clickExportButton}>
                            <IconShare2 />
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack align="left" justify="space-between" style={{ height: '100%' }}>
                    <Stack align="left">
                        <NavButton destination='/' onClick={() => closeIfOnMobile()}>Home</NavButton>
                        <NavButton destination='/pit' onClick={() => closeIfOnMobile()}>Pit Scouting</NavButton>
                        <NavButton destination='/match' onClick={() => closeIfOnMobile()}>Match Scouting</NavButton>
                        <NavButton destination='/note' onClick={() => closeIfOnMobile()}>Notes</NavButton>
                    </Stack>
                    <Center>Welcome, {username}!</Center>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                {props.children}
            </AppShell.Main>
        </AppShell >
    );
}

function useExportState(close: Function) {
    const [clickedButton, setClickedButton] = React.useState<boolean>(false);
    const { sendQueue, clearSendQueue } = React.useContext(TurboContext);

    React.useEffect(() => {
        if (!clickedButton) return;

        setClickedButton(false);

        exportData(sendQueue, clearSendQueue);

    }, [clickedButton, setClickedButton, sendQueue, clearSendQueue]);

    return () => setClickedButton(true);
}

function NavButton(props: {
    children: React.ReactNode,
    destination: string,
    onClick: Function
}) {

    return <UnstyledButton
        style={{
            display: 'block',
            padding: '20px'
        }}
        component={Link}
        href={props.destination}
        onClick={() => props.onClick()}>
        {props.children}
    </UnstyledButton>;
}