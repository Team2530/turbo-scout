"use client";
import { Center, Checkbox, Fieldset, NumberInput, Rating, Select, Space, Stack, MultiSelect, TextInput } from "@mantine/core";
import React from "react";
import { TurboContext } from "../lib/context";
import SEASON_CONFIG from "../match_season_config.json";
import { FormComponent } from "../lib/forms";

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
            return <FormComponent title={item['name']} type={item['type']} setterFunction={() => {}} options={item} key={item['name']}/>
        })}
    </Fieldset>
}

export default function MatchScoutingPage() {
    return <Stack>
        <MatchScoutingForm />
    </Stack>;
}