"use client";
import { Center, Checkbox, Fieldset, NumberInput, Rating, Select, Space, Stack, MultiSelect, TextInput } from "@mantine/core";
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
        {SEASON_CONFIG.map((item: any) => {
            switch(item['type']) {
                case "number":
                    return <NumberInput label={item['name']} />;
                case "boolean":
                    return <Checkbox label={item['name']} style={{ fontWeight: '500' }} labelPosition="left" />;
                case "select":
                    return <Select label={item['name']} data={item['choices']}/>
                case "checkbox":
                    return <Checkbox label={item['name']} />
                case "rating":
                    return <Center><Rating size="lg" /></Center>;
                case "text":
                    return <TextInput label={item['name']} />;
                case "multiselect":
                    return <MultiSelect label={item['name']} data={item['choices']}/>;
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