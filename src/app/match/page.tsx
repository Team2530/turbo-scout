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
                    return <><br></br><NumberInput label={item['name']} /></>;
                case "boolean":
                    return <><br></br><Checkbox label={item['name']} style={{ fontWeight: '500' }} labelPosition="left" /></>;
                case "select":
                    return <><br></br><Select label={item['name']} data={item['choices']}/></>
                case "checkbox":
                    return <><br></br><Checkbox label={item['name']}/></>
                case "rating":
                    return <><div><br></br><center>{item['name']}</center></div><Center><Rating size="lg" color="rgba(125, 200, 52, 1)"/></Center></>;
                case "text":
                    return <><br></br><TextInput label={item['name']} /></>;
                case "multiselect":
                    return <><br></br><MultiSelect label={item['name']} data={item['choices']}/></>;
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