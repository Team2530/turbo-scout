"use client";

import React, { Suspense } from "react"
import { TurboContext } from "../lib/context"
import { Checkbox, SegmentedControl, Table } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Fieldset, Group, NumberInput, Select, Stack, Stepper, TextInput, Textarea, Title, MultiSelect } from "@mantine/core";
import SEASON_CONFIG from "../pit_season_config.json";
import { FormComponent } from "../lib/forms";

function PitQuestion(props: { category: string, question: any, questionSetter: Function }) {
  const question: any = props.question;

  return <FormComponent
    title={question.name}
    type={question.type}
    options={question}
    setterFunction={(value: any) => props.questionSetter(props.category, question, value)}
  />
}

function PitScoutingMenu(props: { team: any }) {

  const [currentStep, setCurrentStep] = React.useState(0);
  const [collectedData, setCollectedData]: any = React.useState({});
  const {addToSendQueue, username, currentEvent} = React.useContext(TurboContext)


  const questionSetter: Function = (category: string, question: any, value: any) => {
    if (value == undefined || value == null) return;
    const partial: any = {};
    partial[category] = { ...collectedData[category] };
    partial[category][question.name] = value;

    //const questionName: string = question.name;
    setCollectedData({
      ...collectedData,
      ...partial
    });
  };

  const advanceButton: Function = () => {
    setCurrentStep((current) => (current < (Object.keys(SEASON_CONFIG).length) ? current + 1 : current));

    if(currentStep >= (Object.keys(SEASON_CONFIG).length-1)) {
      //functionality
      console.log("sending");
      addToSendQueue!({
        "event": currentEvent,
        "username": username,
        "timestamp": new Date().toISOString(),
        "type": "pit",
        "teamNumber": props.team['key'].substring(3),
        "data": collectedData
      })
    }
  };

  return <Stepper active={currentStep} onStepClick={setCurrentStep} orientation="horizontal">
    {Object.entries(SEASON_CONFIG).map(([category, questions]) => <Stepper.Step label={category} key={category}>
      <Stack>
        {questions.map(question => <PitQuestion category={category} question={question} key={question.name} questionSetter={questionSetter} />)}
        <Button onClick={() => advanceButton()}>
          {currentStep != Object.keys(SEASON_CONFIG).length - 1 ? <p>Next</p> : <p>Finish</p>}
        </Button>
      </Stack>
    </Stepper.Step>)}

  </Stepper>
}

function TeamPitScouting(props: { teams: any, team: string | null }) {
  //TODO: validate team param

  const team = props.teams?.find((team: any) => team['key'] == `frc${props.team}`);

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

function PitDisplay() {
  const { teams } = React.useContext(TurboContext);


  const queryParams = useSearchParams();
  const router = useRouter();
  const { checkboxState, setCheckboxState } = React.useContext(TurboContext);

  if (queryParams.has("team")) {
    return <TeamPitScouting teams={teams} team={queryParams.get("team")} />
  }

  const isCheckboxSelected = (key: string) => checkboxState!.includes(key);
  const toggleCheckbox = (key: string) => {
    checkboxState!.includes(key)
      ? setCheckboxState!((current: string[]) => current.filter(team => team != key))
      : setCheckboxState!((current: string[]) => [...current, key])
  };

  if (teams == undefined || teams.length == 0) {
    return <p>No teams loaded! Something went wrong!</p>;
  }

  return <Table stickyHeader stickyHeaderOffset={60} withColumnBorders striped highlightOnHover>
    <Table.Thead>
      <Table.Tr>
        <Table.Tr></Table.Tr>
        <Table.Td>####</Table.Td>
        <Table.Td>Name</Table.Td>
        <Table.Td>Rookie Year</Table.Td>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {teams?.map(team => <Table.Tr key={team['key']} className="pit-team-row">
        <Table.Td><Checkbox checked={isCheckboxSelected(team['key'])} onChange={() => toggleCheckbox(team['key'])} /></Table.Td>
        <Table.Td onClick={() => router.push(`/pit?team=${team['key'].substring(3)}`)}>{team['key'].substring(3)}</Table.Td>
        <Table.Td onClick={() => router.push(`/pit?team=${team['key'].substring(3)}`)}>{team['nickname']}</Table.Td>
        <Table.Td>{team['rookie_year']}</Table.Td>
      </Table.Tr>)}
    </Table.Tbody>
  </Table>;
}

/**
 * https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export default function WrapperElement() {
  return <Suspense><PitDisplay /></Suspense>;
}
