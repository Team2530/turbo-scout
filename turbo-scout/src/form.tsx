import { ActionIcon, Checkbox, NumberInput, Select, MultiSelect, Slider, TextInput, Textarea, Text, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import EVENT_CONFIG from "./config/event.json";
import React from "react";

export interface Question {
    id: string;
    label: string;
    type: string;


    details?: string;
    options?: string[]; // for questions of type 'select'
}

export interface QuestionComponentProps {
    // category?: Category;
    question: Question;

    getter: (id: string) => any,
    setter: (id: string, obj: any) => void,

    /* eslint-disable @typescript-eslint/no-explicit-any */
    value?: any;
    defaultValue?: any;
    checked?: any;
    error?: any;
    onFocus?: any;
    onBlur?: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export interface FormStore {
    team: number | undefined,
    data: {},
    setDataField: (id: string, obj: any) => void,
    getDataField: (id: string) => any,
    setTeam: (team: number | undefined) => void,
    clearAllData: () => void
}

export const formStoreDefaults = (set: any, get: any) => ({
    team: undefined,
    data: {},
    getDataField: (id: string) => get().data[id] || null,
    setDataField: (id: string, obj: any) => {
        set((state: any) => {

            let tmp = state.data;
            tmp[id] = obj || null;

            return ({
                ...state,
                data: tmp
            })
        })
    },
    setTeam: (team: number | undefined) => set((state: any) => ({ ...state, team: team })),
    clearAllData: () => set((_state: any) => ({ team: null, data: {} }))
});

const marks = [
  { value: 0, label: '0' },
  { value: 10, label: '1' },
  { value: 20, label: '2' },
  { value: 30, label: '3' },
  { value: 40, label: '4' },
  { value: 50, label: '5' },
  { value: 60, label: '6' },
  { value: 70, label: '7' },
  { value: 80, label: '8' },
  { value: 90, label: '9' },
  { value: 100, label: '10' },
];

function MutiselectInput(props: QuestionComponentProps) {
    const { question } = props;

    const [state, setState] = React.useState<string | undefined>(undefined);

    let r = <MultiSelect 
        label={question.label}
        onChange={(value) => setState(JSON.stringify(value))}
        data={question.options}
        value={state && JSON.parse(state)} />
    return <Stack>
        {r}
        <p>{(state)}</p>
    </Stack>
}

export function QuestionComponent(props: QuestionComponentProps) {
    const { question } = props;

    const id: string = question.id;

    switch (question.type) {
        case "label":
            return <Text>{question.label}</Text>
        case "short_text":
            return <TextInput label={question.label} value={(props.getter(id) as string)?.length > 0 ? props.getter(id) : ""} onChange={(v) => props.setter(id, v.currentTarget.value)} />
        case "paragraph":
            return <Textarea label={question.label} value={(props.getter(id) as string)?.length > 0 ? props.getter(id) : ""} onChange={(v) => props.setter(id, v.currentTarget.value)} />
        case "strategy_text":
            return <Textarea label={question.label} value={(props.getter(id) as string)?.length > 0 ? props.getter(id) : ""} onChange={(v) => props.setter(id, v.currentTarget.value)} autosize minRows={4} />
        case "boolean":
            return <Checkbox label={question.label} onChange={(v) => props.setter(id, v.currentTarget.checked)} checked={props.getter(id)} />
        case "select":
            return <Select label={question.label} onChange={(v) => props.setter(id, v)} data={question.options} value={props.getter(id)} />
        case "multiselect":
            return <MutiselectInput {...props} />
            //return <MultiSelect label={question.label} onChange={(v) => props.setter(id, JSON.stringify(v))} data={question.options} placeholder="Select all that apply" value={JSON.parse(props.getter(id))} />
        case "integer":
            return <NumberInput label={question.label} onChange={(v) => props.setter(id, v)} value={props.getter(id) as number || ''} allowDecimal={false} rightSection={<ActionIcon onClick={() => props.setter(id, (props.getter(id) || 0) + 1)}><IconPlus /></ActionIcon>} />
        case "slider":
            return <Slider
                defaultValue={50}
                label={""}
                step={5}
                marks={marks}
                styles={{ markLabel: { display: question.label } }}
            />
        default:
            throw new Error(`Unimplemented question type '${question.type}'!`);
    }
}

export function TeamSelect(props: {team: number | undefined, setTeam: (team: number | undefined) => void}) {
    return <Select label="Team" placeholder="Select a team" searchable data={EVENT_CONFIG.teams.map(team => ({
        value: team.team_number.toString(),
        label: `${team.team_number}: ${team.nickname}`
    }))} value={props.team?.toString() || null} onChange={(v) => props.setTeam(parseInt(v!))} />
}
