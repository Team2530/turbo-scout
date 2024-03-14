import type { Metadata } from "next";
import { Arvo } from "next/font/google";
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

const arvo = Arvo({weight: "400", subsets: ["latin"]});


export const metadata: Metadata = {
  title: "Team 2530 Scouting Portal",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}