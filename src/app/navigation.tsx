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
            navbar={{ width: 200, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} size="sm" />
                    <Image src="/turbo-scout/logos/white.png" w={30} alt="Inconceivable logo" />
                    <Text>Turbo Scout</Text>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <Stack align="left" justify="space-between" style={{height: '100%'}}>
                    <Stack align="left">
                        <NavButton destination='/'>Home</NavButton>
                        <NavButton destination='/pit'>Pit Scouting</NavButton>
                        <NavButton destination='/match'>Match Scouting</NavButton>
                        <NavButton destination='/error'>Data Download</NavButton>
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