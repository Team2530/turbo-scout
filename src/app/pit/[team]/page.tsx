"use client";

import { TurboContext } from "@/app/lib/context";
import { Badge, Checkbox, Fieldset, FileInput, Group, NumberInput, Rating, SegmentedControl, Select, Stack, Stepper, TagsInput, TextInput, Textarea, Title } from "@mantine/core";
import React from "react";
import SEASON_CONFIG from "../../season_config.json";

function PitQuestion(props: {question: any}) {
    const question: any = props.question;

    switch(question.type) {
        case "boolean":
            //TODO: Make the text bold so that it matches the other question types
            return <Checkbox label={question.name} />
        case "paragraph":
            return <Textarea label={question.name} />
        case "text":
            return <TextInput label={question.name} />
        case "number":
            //TODO: units
            return <NumberInput label={question.name} />
        case "select":
            return <Select label={question.name} data={question.choices}/>
        default:
            //TODO: photo input
            return <p>Not supported: {question.type}</p>
    }
}

function PitScoutingMenu(props: { team: any }) {

    const [currentStep, setCurrentStep] = React.useState(1);

    return <Stepper active={currentStep} onStepClick={setCurrentStep} orientation="vertical">
        {Object.entries(SEASON_CONFIG).map(([category, questions]) => <Stepper.Step label={category}>
            <Stack>
                {questions.map(question => <PitQuestion question={question}/>)}
            </Stack>
        </Stepper.Step>)}
    </Stepper>
}

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
            <PitScoutingMenu team={team} />
        </Fieldset>


    </Stack>;
}