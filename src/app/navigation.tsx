import { AppShell, Burger, Group, UnstyledButton, Image, Text, Stack, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useRouter } from "next/navigation";
import { TurboContext } from "./lib/context";
import React from "react";

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

export function ContentLayout(props: { children: React.ReactNode }) {
    const {username} = React.useContext(TurboContext);
    const [opened, { toggle }] = useDisclosure();
    const router = useRouter();
    const { setColorScheme, colorScheme } = useMantineColorScheme({
        keepTransitions: true
    });

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 200, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} size="sm" />
                        <Image src={`/turbo-scout/logos/${(colorScheme == "dark") ? "white" : "black"}.png`} w={30} alt="Inconceivable logo" onClick={() => router.push(`/`)} />
                        <Text>Turbo Scout</Text>    
                    </Group>
                    <ActionIcon onClick={() => {
                        switch(colorScheme) {
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
                    >
                        {(colorScheme == 'dark') ? <IconSun /> : <IconMoon />}
                    </ActionIcon>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack align="left" justify="space-between" style={{height: '100%'}}>
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
        </AppShell>
    );
}