"use client";
import { Button, Image, Stack, Title} from "@mantine/core";

import React from "react";
import { TurboContext } from "./lib/context";

export default function Home() {
  const { username } = React.useContext(TurboContext);


  return <>
  <p>
    Welcome, {username}!
  </p>

  <Stack align="center" gap="sm">
        <Title order={2}>2530 Presents</Title>
        <Image src="inconceivable.gif" w={350} alt="inconceivable" />
        <Title order={3}>Turbo Scout!</Title>
  </Stack>

  
  </>;
}