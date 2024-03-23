"use client";
import { Center, Checkbox, Fieldset, NumberInput, Rating, Select, Space, Stack, MultiSelect, TextInput, Stepper, Button } from "@mantine/core";
import { TurboContext } from "../lib/context";
import SEASON_CONFIG from "../match_season_config.json";
import { FormComponent } from "../lib/forms";
import { useId } from "@mantine/hooks";
import React from "react";

function MatchScoutingForm() {
    const [matchNumber, setMatchNumber] = React.useState(0);
    const [teamNumber, setTeamNumber] = React.useState<string | null | undefined>(undefined);
    const [currentStep, setCurrentStep] = React.useState(0);

    const { teams } = React.useContext(TurboContext);

    return <Fieldset legend="Match Scouting">
        <NumberInput label="Match Number" value={matchNumber} onChange={(v: string | number) => setMatchNumber(Number(v))} />
        <Select
            label="Team"
            data={teams?.map(team => ({ value: team['key'].substring(3), label: `${team['key'].substring(3)}: ${team['nickname']}` }))}
            value={teamNumber}
            onChange={(v) => setTeamNumber(v)}
            searchable
        />
        <Space h="xl" />
        <Stepper active={currentStep} onStepClick={setCurrentStep} orientation="vertical">
            {Object.entries(SEASON_CONFIG).map(([categoryName, questions]): any => {
                return <Stepper.Step label={categoryName} key={categoryName}>
                    <Stack>
                        {questions.map((question: any) => {
                            return <FormComponent title={question['name']} type={question['type']} key={categoryName + "." + question['name']} options={question} setterFunction={() => { }} />
                        })}
                        <Button onClick={() => setCurrentStep((current) => (current < Object.keys(SEASON_CONFIG).length ? current + 1 : current))}>
                            {currentStep < Object.keys(SEASON_CONFIG).length - 1 ? "Next" : "Finish"}
                        </Button>
                    </Stack>
                </Stepper.Step>
            })}
        </Stepper>
    </Fieldset>
}

export default function MatchScoutingPage() {
    return <Stack>
        <MatchScoutingForm />
    </Stack>;
}