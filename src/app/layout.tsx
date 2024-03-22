"use client";

import '@mantine/core/styles.css';

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

        <meta name="application-name" content="turbo-scoute" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="turbo-scout" />
        <meta name="description" content="scoute the turbo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#56ea16" />

        <link rel="apple-touch-icon" href="/turbo-scout/icons/120x120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/turbo-scout/icons/152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/turbo-scout/icons/180x180.png" />

        <link rel="manifest" href="/turbo-scout/manifest.json" />
        <link rel="shortcut icon" href="/src/app/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="turbo-scout" />
        <meta name="twitter:description" content="scoute the turbo" />
        <meta name="twitter:image" content="/turbo-scout/icons/192x192.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="turbo-scout" />
        <meta property="og:description" content="scoute the turbo" />
        <meta property="og:site_name" content="turbo-scout" />
        <meta property="og:image" content="/turbo-scout/icons/120x120.png" />

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