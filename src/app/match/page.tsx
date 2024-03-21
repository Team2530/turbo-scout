"use client";
import { Fieldset, NumberInput, Select, Stack } from "@mantine/core";
import React from "react";
import { TurboContext } from "../lib/context";

function MatchScoutingForm() {
    const [matchNumber, setMatchNumber] = React.useState(0);
    const [teamNumber, setTeamNumber] = React.useState<number | undefined>(0);

    const { teams } = React.useContext(TurboContext);


    return <Fieldset legend="Match Scouting">
        <NumberInput label="Match Number" value={matchNumber} onChange={(v: string | number) => setMatchNumber(Number(v))}/>
        <Select label="Team" data={teams?.map(team => `${team['key'].substring(3)}: ${team['nickname']}`)} searchable/>
    </Fieldset>
}

export default function MatchScoutingPage() {
    return <Stack>
        <MatchScoutingForm />
    </Stack>;
}