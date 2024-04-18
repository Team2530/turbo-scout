import { AppShell, Burger, Group, UnstyledButton, Image, Text, Stack, ActionIcon, useMantineColorScheme, Center, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IconSun, IconMoon, IconShare2, IconTrash } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import { TurboContext } from "./lib/context";
import React from "react";
import { exportData } from "./lib/server";
import { modals } from '@mantine/modals';

export function ContentLayout(props: { children: React.ReactNode }) {
    const { username, sendQueue, clearSendQueue } = React.useContext(TurboContext);
    const [opened, { open, close, toggle }] = useDisclosure();

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
                        <ActionIcon variant="default" size="lg" onClick={deleteEverything}>
                            <IconTrash />
                        </ActionIcon>
                        <ColorChangeButton />
                        <ActionIcon variant="default" size="lg" onClick={clickExportButton}>
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
                        <NavButton destination='/view' onClick={() => closeIfOnMobile()}>Data Viewer</NavButton>
                        <NavButton destination="/clear" onClick={() => closeIfOnMobile()}>Clear Data</NavButton>
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

function ColorChangeButton() {
    const { setColorScheme, colorScheme } = useMantineColorScheme();

    return <ActionIcon onClick={() => {
        switch (colorScheme) {
            case "dark":
                setColorScheme("light");
                break;
            case "light":
                setColorScheme("dark");
                break;
            default:
                setColorScheme("light");
                break;
        }
    }}
        variant="default"
        aria-label="Theme Toggle"
        size="lg"
    >
        {(colorScheme && colorScheme == 'dark') ? (<IconSun />) : (<IconMoon />)}
    </ActionIcon>
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
    children: any,
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

function LogoComponent() {
    const { colorScheme } = useMantineColorScheme();

    return <Image
        src={`logos/${(colorScheme == "dark") ? "white" : "black"}.png`}
        w={30}
        alt="Inconceivable logo" />
}