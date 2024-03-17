"use client";
import { Button } from "@mantine/core";
import React from "react";
import { TurboContext } from "./lib/context";

export default function Home() {
  const { username } = React.useContext(TurboContext);

  return <p>
    Welcome, {username} to Turbo Scout!
  </p>;
}