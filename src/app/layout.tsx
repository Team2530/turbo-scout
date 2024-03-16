"use client";

import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineColorsTuple, MantineProvider, createTheme } from '@mantine/core';
import { AppShell, Burger, Group, Image, UnstyledButton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from "react";
import Link from 'next/link';
import { TurboContext, TurboState, getDefaultTurboState } from './lib/context';
import { SetupModal } from './lib/setup';

const color: MantineColorsTuple = [
  "#effee7",
  "#e0f8d4",
  "#c2efab",
  "#a2e67e",
  "#87de57",
  "#75d940",
  "#6bd731",
  "#59be23",
  "#4da91b",
  "#3d920c"
];

const mantineColorTheme = createTheme({
  colors: {
    blue: color
  }
});

function NavButton(props: {
  children: any,
  destination: string
}) {
  return <Link href={props.destination} style={{ textDecoration: 'none', color: 'inherit' }}>
    <UnstyledButton style={{
      display: 'block',
      padding: '20px'
    }}>
      {props.children}
    </UnstyledButton>
  </Link>;
}

/**
 * This component contains the application shell [navbar, burger menu, title]
 */
export function ContentLayout(props: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Image src="/logos/black.png" w={30} />
            <Text>Turbo Scout</Text>
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
        {props.children}
      </AppShell.Main>
    </AppShell>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const appState: TurboState = getDefaultTurboState();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <title>turbo-scout</title>
      </head>
      <body>
        <MantineProvider theme={mantineColorTheme}>
          <TurboContext.Provider value={appState}>
            <SetupModal />
            <ContentLayout>
              {children}
            </ContentLayout>
          </TurboContext.Provider>
        </MantineProvider>
      </body>
    </html>
  );
}