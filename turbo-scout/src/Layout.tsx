import { AppShell, Burger, Group, Image, MantineStyleProps, PolymorphicComponentProps, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { Outlet } from 'react-router-dom';

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
                        <NavButton>Home</NavButton>
                        <NavButton>Blog</NavButton>
                        <NavButton>Contacts</NavButton>
                        <NavButton>Support</NavButton>
                    </Group>
                </Group>
            </Group>
        </AppShell.Header>

        <AppShell.Navbar py="md" px={4}>
            <NavButton mt="md">Home</NavButton>
            <NavButton mt="md">Blog</NavButton>
            <NavButton mt="md">Contacts</NavButton>
            <NavButton mt="md">Support</NavButton>
        </AppShell.Navbar>

        <AppShell.Main>
            <Outlet />
        </AppShell.Main>
    </AppShell>
}

interface NavButtonProps extends MantineStyleProps {
    children: React.ReactNode
}

function NavButton(props: NavButtonProps) {
    return <UnstyledButton ml="md" {...props}>{props.children}</UnstyledButton>
}