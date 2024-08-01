import { AppShell, Burger, Group, Image, MantineStyleProps, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { Link, useLocation, useNavigate, useOutlet } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion'

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    const outlet = useOutlet();

    return <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
        padding="md"
    >
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Group justify="space-between" style={{ flex: 1 }}>
                    <Group onClick={() => navigate("/")}>
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
            <AnimatePresence mode="wait" initial={true}>
                {outlet && React.cloneElement(outlet, { key: location.pathname })}
            </AnimatePresence>
        </AppShell.Main>
    </AppShell>
}

export function BaseLayout(props: { children: React.ReactNode }) {
    return <motion.div initial="hidden"
        animate="enter"
        exit="exit"
        variants={{
            hidden: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 }
        }}
        transition={{ duration: 0.3, type: "easeInOut" }}>
        {props.children}
    </motion.div>
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