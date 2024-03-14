"use client";
import { AppShell, Burger, Group, Image, UnstyledButton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

function NavButton(props: {
  children: any,
  destination: string
}) {
  return <UnstyledButton style={{ display: 'block', padding: '8px' }} onClick={() => window.location.href = props.destination}>
    {props.children}
  </UnstyledButton>;
}

export default function Home() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">

          <Group justify="space-between" style={{ flex: 1 }}>
            <Group>
              <Image src="/logos/black.png" w={30} />
              <Text>Turbo Scout</Text>
            </Group>

            <Burger opened={opened} onClick={toggle} size="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <NavButton destination='/'>Home</NavButton>
        <NavButton destination='/pit'>Pit Scouting</NavButton>
        <NavButton destination='/match'>Match Scouting</NavButton>
        <NavButton destination='/error'>Data Download</NavButton>
      </AppShell.Navbar>

      <AppShell.Main>
        The core app is not yet finished at this time.
      </AppShell.Main>
    </AppShell>
  );
}