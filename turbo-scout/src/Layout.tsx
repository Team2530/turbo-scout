import { AppShell, Burger, Group, Image, MantineStyleProps, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();

    return <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
        padding="md"
    >
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Group justify="space-between" style={{ flex: 1 }}>
                    <Group>
                        <Image src="/logo.svg" w={30} />
                        <Text>Turbo Scout</Text>
                    </Group>
                    <Group ml="xl" gap={0} visibleFrom="sm">
                        <NavButtons />
                    </Group>
                </Group>
            </Group>
        </AppShell.Header>

        <AppShell.Navbar py="md" px={4}>
            <NavButtons mt="md" />
        </AppShell.Navbar>

        <AppShell.Main>
            <Outlet />
        </AppShell.Main>
    </AppShell>
}

interface NavButtonProps extends MantineStyleProps {
    children: React.ReactNode
    href: string
}

function NavButtons(props: Partial<NavButtonProps>) {
    return <>
        <NavButton {...props} href="/">Home</NavButton>
        <NavButton {...props} href="/pit">Pit</NavButton>
        <NavButton {...props} href="/match">Match</NavButton>
        <NavButton {...props} href="/share">Share</NavButton>
    </>
}

function NavButton(props: NavButtonProps) {
    return <UnstyledButton ml="md" component={Link} {...props} to={props.href}>
        {props.children}
    </UnstyledButton>
}