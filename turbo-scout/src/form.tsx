import { Checkbox, Select, TextInput, Textarea } from "@mantine/core";

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

    /* eslint-disable @typescript-eslint/no-explicit-any */
    onChange: any;
    value?: any;
    defaultValue?: any;
    checked?: any;
    error?: any;
    onFocus?: any;
    onBlur?: any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
}

export function QuestionComponent(props: QuestionComponentProps) {
    const { question } = props;

    switch (question.type) {
        case "short_text":
            return <TextInput label={question.label} {...props} />
        case "paragraph":
            return <Textarea label={question.label} {...props} />
        case "boolean":
            return <Checkbox label={question.label} {...props} />
        case "select":
            return <Select label={question.label} {...props} data={question.options} />
        default:
            throw new Error(`Unknown question type '${question.type}'!`);
    }
}
