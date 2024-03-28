import { AppShell, Burger, Group, UnstyledButton, Image, Text, Stack, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IconSun, IconMoon, IconShare2 } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import { TurboContext } from "./lib/context";
import React from "react";
import { exportData } from "./lib/server";

function NavButton(props: {
    children: any,
    destination: string
}) {
    return <UnstyledButton
        style={{
            display: 'block',
            padding: '20px'
        }}
        component={Link}
        href={props.destination}>
        {props.children}
    </UnstyledButton>;
}

function LogoComponent(props: { theme: string, clickAction: Function }) {
    return <Image
        src={`/turbo-scout/logos/${(props.theme == "dark") ? "white" : "black"}.png`}
        w={30}
        alt="Inconceivable logo" onClick={() => props.clickAction()} />
}

export function ContentLayout(props: { children: React.ReactNode }) {
    const { username, sendQueue, clearSendQueue } = React.useContext(TurboContext);
    const [opened, { toggle }] = useDisclosure();
    const router = useRouter();
    const { setColorScheme, colorScheme } = useMantineColorScheme({
        keepTransitions: true
    });
    const [clickedButton, setClickedButton] = React.useState<boolean>(false);

    React.useEffect(() => {
        if(!clickedButton) return;

        setClickedButton(false);

        exportData(sendQueue, clearSendQueue);

    }, [clickedButton, setClickedButton]);

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
                        <LogoComponent theme={colorScheme} clickAction={() => router.push('/')} />
                        <Text>Turbo Scout</Text>
                    </Group>
                    <Group h="100%">
                        <ActionIcon onClick={() => {
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
                            {(colorScheme == 'dark') ? <IconSun /> : <IconMoon />}
                        </ActionIcon>
                        <ActionIcon variant="default" size="lg" onClick={() => setClickedButton(true)}>
                            <IconShare2 />
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack align="left" justify="space-between" style={{ height: '100%' }}>
                    <Stack align="left">
                        <NavButton destination='/'>Home</NavButton>
                        <NavButton destination='/pit'>Pit Scouting</NavButton>
                        <NavButton destination='/match'>Match Scouting</NavButton>
                        <NavButton destination='/view'>Data Viewer</NavButton>
                    </Stack>
                    <center>Welcome, {username}!</center>
                </Stack>

            </AppShell.Navbar>

            <AppShell.Main>
                {props.children}
            </AppShell.Main>
        </AppShell >
    );
}