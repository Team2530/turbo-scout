"use client";
import { Button, Image, Stack, Title } from "@mantine/core";

import React from "react";
import { TurboContext } from "./lib/context";

export default function Home() {
  const { username } = React.useContext(TurboContext);

  return <>
    Welcome, {username}!
    
    {/* <Image src="pit_map.png" width="xl" alt="pit map for 2024 worlds"/> */}
  </>;
}