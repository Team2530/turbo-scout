"use client";
import React from "react";
import { TurboContext } from "./lib/context";

export default function Home() {
  const { username } = React.useContext(TurboContext);

  return <>
    Welcome, {username}!
  </>;
}