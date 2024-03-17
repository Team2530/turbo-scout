"use client";

import { TurboContext } from "@/app/lib/context";
import { Badge, Checkbox, Fieldset, FileInput, Group, NumberInput, Rating, SegmentedControl, Stack, TagsInput, TextInput, Textarea, Title } from "@mantine/core";
import React from "react";

export default function TeamPitScouting({ params }: { params: { team: string } }) {
    //TODO: validate team param

    const { teams } = React.useContext(TurboContext);
    const team = teams?.find(team => team['key'] == `frc${params.team}`);

    if (team == undefined) {
        return <p>This team is not loaded!</p>;
    }

    return <Stack align='center'>
        <Group>
            <Title order={2}>{team['key'].substring(3)}: {team['nickname']}</Title>

            {/* TODO: There has to be a more proper way of doing this... */}
            {team['rookie_year'] >= new Date().getFullYear() - 1 ? <Badge color="orange">Rookie</Badge> : (<div></div>)}
        </Group>

        <Fieldset legend="Pit Scouting">
            <Checkbox
                defaultChecked
                label="Checkbox field"
            />
            <FileInput
                label="File field"
                description="Description I guess"
                placeholder="Input placeholder"
            />
            <NumberInput 
                label="Number field (A)"
                description="This is a number"
            />
            <Rating />
            <SegmentedControl data={["Option A", "Option B", "Option C"]}/>
            <Textarea 
                label="Paragraph field"
                description="loooooooooong text"
            />
            <TextInput 
                label="Text field"
                description="shorter text"
            />
            <TagsInput label="Tag Input"/>
            <p>Also have ComboBox [multi and single]</p>
        </Fieldset>


    </Stack>;
}