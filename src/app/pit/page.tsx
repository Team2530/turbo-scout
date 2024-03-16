"use client";
import React from "react"
import { TurboContext } from "../lib/context"
import { Stack } from "@mantine/core";

export default function PitDisplay(){
    const { teams } = React.useContext(TurboContext);

    return <Stack gap="xs" align="center">
        {teams?.map(team => <p>{team['nickname']}</p>)}
    </Stack>;
}