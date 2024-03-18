"use client";

import { TurboContext } from "@/app/lib/context";
import { Badge, Button, Checkbox, Fieldset, FileInput, Group, NumberInput, Rating, SegmentedControl, Select, Stack, Stepper, TagsInput, TextInput, Textarea, Title } from "@mantine/core";
import React from "react";
import SEASON_CONFIG from "../../season_config.json";

function PitQuestion(props: {question: any}) {
    const question: any = props.question;

    switch(question.type) {
        case "boolean":
            return <Checkbox label={question.name} style={{fontWeight: '500'}}/>
        case "paragraph":
            return <Textarea label={question.name} />
        case "text":
            return <TextInput label={question.name} />
        case "number":
            if(question.unit) {
                return <NumberInput label={`${question.name} (${question.unit})`} />
            }
            return <NumberInput label={question.name} />
        case "select":
            return <Select label={question.name} data={question.choices}/>
        default:
            //TODO: photo input
            return <p>Not supported: {question.type}</p>
    }
}

function PitScoutingMenu(props: { team: any }) {

    const [currentStep, setCurrentStep] = React.useState(0);

    return <Stepper active={currentStep} onStepClick={setCurrentStep} orientation="horizontal">
        {Object.entries(SEASON_CONFIG).map(([category, questions]) => <Stepper.Step label={category}>
            <Stack>
                {questions.map(question => <PitQuestion question={question}/>)}
                <Button onClick={() => setCurrentStep((current) => (current < (Object.keys(SEASON_CONFIG).length) ? current + 1 : current))}>Next</Button>
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