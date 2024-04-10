"use client";
import React from "react";
import { Fieldset, NumberInput, Select, Space, Stack, Stepper, Button } from "@mantine/core";
import { TurboContext } from "../lib/context";
import { FormComponent } from "../lib/forms";
import SEASON_CONFIG from "../match_season_config.json";


function MatchScoutingForm() {
    const [matchNumber, setMatchNumber] = React.useState(0);
    const [teamNumber, setTeamNumber] = React.useState<string | null | undefined>(undefined);
    const [currentStep, setCurrentStep] = React.useState(0);

    const { teams, addToSendQueue, username, currentEvent } = React.useContext(TurboContext);
    const [collectedData, setCollectedData]: any = React.useState({});

    const questionGetter: Function = (category: string, question: any) => {
        if(collectedData == undefined) return undefined;
        if(collectedData[category] == undefined) return undefined;
        if(collectedData[category][question.name] == undefined) return undefined;
    
        return collectedData[category][question.name];
      }

    const questionSetter: Function = (category: string, question: any, value: any) => {
        if (value == undefined || value == null) return;
        const partial: any = {};
        partial[category] = { ...collectedData[category] };
        partial[category][question.name] = value;

        setCollectedData({
            ...collectedData,
            ...partial
        });
    };

    const advanceButton: Function = () => {
        setCurrentStep((current) => (current < (Object.keys(SEASON_CONFIG).length) ? current + 1 : current));
        if (currentStep >= (Object.keys(SEASON_CONFIG).length - 1)) {
          // Add the data to the send queue for future sending
          addToSendQueue!(deepClone({
            type: "match",
            user: username!,
            team: teamNumber,
            matchNumber: matchNumber,
            event: currentEvent,
            timestamp: new Date().toISOString(),
            data: collectedData
          }));
    
          // Clear data
          setMatchNumber(0);
          setCollectedData({});
          setTeamNumber(null);
          setCurrentStep(0);
        }
    };

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
                            return <FormComponent title={question['name']} type={question['type']} key={categoryName + "." + question['name']} options={question} getterFunction={() => questionGetter(categoryName, question)} setterFunction={(v: any) => questionSetter(categoryName, question, v)} />
                        })}
                        <Button onClick={() => advanceButton()}>
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

function deepClone(object: any) {
    return JSON.parse(JSON.stringify(object));
}
