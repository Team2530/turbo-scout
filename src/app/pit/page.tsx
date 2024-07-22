"use client";

import React, { Suspense } from "react"
import { TurboContext } from "../lib/context"
import { Checkbox, Table } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Fieldset, Group, NumberInput, Select, Stack, Stepper, TextInput, Textarea, Title, MultiSelect } from "@mantine/core";
import SEASON_CONFIG from "../../config/pit.json";
import { FormComponent } from "../../components/FormComponent";
import { useTBA } from "../lib/tba_api";
import { notifications } from "@mantine/notifications";

function PitQuestion(props: { category: string, question: any, questionGetter: Function, questionSetter: Function }) {
  const question: any = props.question;

  return <FormComponent
    title={question.name}
    type={question.type}
    options={question}
    getterFunction={() => props.questionGetter(props.category, question)}
    setterFunction={(value: any) => props.questionSetter(props.category, question, value)}
  />
}

function PitScoutingMenu(props: { team: any, setTeam: React.Dispatch<React.SetStateAction<string | undefined>> }) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [collectedData, setCollectedData]: any = React.useState({});
  const { addToSendQueue, username, currentEvent } = React.useContext(TurboContext);

  const questionGetter: Function = (category: string, question: any) => {
    if (collectedData == undefined) return undefined;
    if (collectedData[category] == undefined) return undefined;
    if (collectedData[category][question.name] == undefined) return undefined;

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
      addToSendQueue!({
        type: "pit",
        user: username!,
        team: props.team['key'].substring(3),
        event: currentEvent,
        timestamp: new Date().toISOString(),
        data: collectedData
      });

      props.setTeam(undefined);

      notifications.show({
        title: "Saved!",
        message: "Your data has been saved! Click the upload button in the top right to send it when you have internet access."
      });
    }
  };

  return <Stepper active={currentStep} onStepClick={setCurrentStep} orientation="horizontal">
    {Object.entries(SEASON_CONFIG).map(([category, questions]) => <Stepper.Step label={category} key={category}>
      <Stack>
        {questions.map(question => <PitQuestion
          category={category}
          question={question}
          key={question.name}
          questionGetter={questionGetter}
          questionSetter={questionSetter}
        />)}
        <Button onClick={() => advanceButton()}>
          {currentStep != Object.keys(SEASON_CONFIG).length - 1 ? 'Next' : 'Save'}
        </Button>
      </Stack>
    </Stepper.Step>)}

  </Stepper>
}

function TeamPitScouting(props: { teams: any, team: string, setTeam: React.Dispatch<React.SetStateAction<string | undefined>> }) {
  const team = props.teams?.find((team: any) => team['key'] == `frc${props.team}`);

  if (props.teams == undefined || props.teams == null || team == undefined || team == null) {
    return <p>This team is not loaded!</p>;
  }

  return <Stack align='center'>
    <Title order={2}>{team['key'].substring(3)}: {team['nickname']}</Title>

    <Fieldset legend="Pit Scouting">
      <PitScoutingMenu team={team} setTeam={props.setTeam} />
    </Fieldset>

    {/* TODO: if possible, maybe add photos of the robot being scouted to help the scouter. */}
  </Stack>;
}

function PitDisplay() {
  const { teams } = useTBA();

  const [team, setTeam] = React.useState<string | undefined>(undefined);

  if (team) {
    return <TeamPitScouting teams={teams} team={team} setTeam={setTeam} />
  }

  if (teams == undefined || teams.length == 0) {
    return <p>No teams loaded! Something went wrong!</p>;
  }

  return <Table stickyHeader stickyHeaderOffset={60} withColumnBorders striped highlightOnHover>
    <Table.Thead>
      <Table.Tr>
        <Table.Td>####</Table.Td>
        <Table.Td>Name</Table.Td>
        <Table.Td>Rookie Year</Table.Td>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {teams?.map((team: any) => <Table.Tr key={team['key']} className="pit-team-row">
        <Table.Td onClick={() => setTeam(team['key'].substring(3))}>{team['key'].substring(3)}</Table.Td>
        <Table.Td onClick={() => setTeam(team['key'].substring(3))}>{team['nickname']}</Table.Td>
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