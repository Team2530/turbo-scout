import { ActionIcon, Checkbox, NumberInput, Select, TextInput, Textarea } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

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
    setTeam: (team: number) => void,
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
    setTeam: (team: number) => set((state: any) => ({ ...state, team: team })),
    clearAllData: () => set((_state: any) => ({ team: null, data: {} }))
});

export function QuestionComponent(props: QuestionComponentProps) {
    const { question } = props;

    const id: string = question.id;

    switch (question.type) {
        case "short_text":
            return <TextInput label={question.label} onChange={(v) => props.setter(id, v.currentTarget.value)} value={props.getter(id)} />
        case "paragraph":
            return <Textarea label={question.label} onChange={(v) => props.setter(id, v.currentTarget.value)} value={props.getter(id)} />
        case "boolean":
            return <Checkbox label={question.label} onChange={(v) => props.setter(id, v.currentTarget.checked)} checked={props.getter(id)} />
        case "select":
            return <Select label={question.label} onChange={(v) => props.setter(id, v)} data={question.options} value={props.getter(id)} />
        case "integer":
            return <NumberInput label={question.label} onChange={(v) => props.setter(id, v)} value={props.getter(id)} allowDecimal={false} rightSection={<ActionIcon onClick={() => props.setter(id, (props.getter(id) || 0) + 1)}><IconPlus /></ActionIcon>} />
        default:
            throw new Error(`Unimplemented question type '${question.type}'!`);
    }
}
