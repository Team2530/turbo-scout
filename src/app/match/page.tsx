"use client";
import { Center, Checkbox, Fieldset, NumberInput, Rating, Select, Space, Stack } from "@mantine/core";
import React from "react";
import { TurboContext } from "../lib/context";
import SEASON_CONFIG from "../match_season_config.json";

function MatchScoutingForm() {
    const [matchNumber, setMatchNumber] = React.useState(0);
    const [teamNumber, setTeamNumber] = React.useState<string | null | undefined>(undefined);

    const { teams } = React.useContext(TurboContext);

    return <Fieldset legend="Match Scouting">
        <NumberInput label="Match Number" value={matchNumber} onChange={(v: string | number) => setMatchNumber(Number(v))}/>
        <Select 
            label="Team" 
            data={teams?.map(team => ({value: team['key'].substring(3), label: `${team['key'].substring(3)}: ${team['nickname']}`}))} 
            value={teamNumber}
            onChange={(v) => setTeamNumber(v)}
            searchable
        />
        <Space h="xl"/>
        {SEASON_CONFIG.map(item => {
            switch(item['type']) {
                case "number":
                    return <NumberInput label={item['name']} />;
                case "checkbox":
                    return <Checkbox label={item['name']} />
                case "rating":
                    return <Center><Rating size="lg" /></Center>;
                default:
                    return <p>Not supported: {item['name']}</p>;
            }
        })}
    </Fieldset>
}

export default function MatchScoutingPage() {
    return <Stack>
        <MatchScoutingForm />
    </Stack>;
}