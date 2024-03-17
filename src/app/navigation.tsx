import { AppShell, Burger, Group, UnstyledButton, Image, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
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

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} size="sm" />
                    <Image src="/logos/black.png" w={30} />
                    <Text>Turbo Scout</Text>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack align="center" justify="space-between" style={{height: '100%'}}>
                    <Stack align="center">
                        <NavButton destination='/'>Home</NavButton>
                        <NavButton destination='/pit'>Pit Scouting</NavButton>
                        <NavButton destination='/match'>Match Scouting</NavButton>
                        <NavButton destination='/error'>Data Download</NavButton>
                    </Stack>
                    <p>Welcome, {username}!</p>
                </Stack>

            </AppShell.Navbar>

            <AppShell.Main>
                {props.children}
            </AppShell.Main>
        </AppShell>
    );
}