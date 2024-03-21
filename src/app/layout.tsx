"use client";

import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import React from "react";
import { TurboContext, TurboState, useDefaultTurboState } from './lib/context';
import { SetupModal } from './lib/setup';
import { MANTINE_THEME } from './lib/style';
import { ContentLayout } from './navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const appState: TurboState = useDefaultTurboState();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <title>turbo-scout</title>
      </head>
      <body>
        <MantineProvider theme={MANTINE_THEME} defaultColorScheme="dark">
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