"use client";
import React from "react"
import { TurboContext } from "../lib/context"
import { Stack } from "@mantine/core";
import Link from "next/link";

export default function PitDisplay(){
    const { teams } = React.useContext(TurboContext);

    return <Stack gap="xs" align="center">
        {teams?.map(team => <Link href={`/pit/${team['key'].substring(3)}`}>{team['nickname']}</Link>)}
    </Stack>;
}