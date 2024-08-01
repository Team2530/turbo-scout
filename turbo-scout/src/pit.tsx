import { useForm } from "@mantine/form";
import { BaseLayout } from "./Layout";
import CATEGORIES from "./config/pit.json";
import { Checkbox, Container, Select, Stack, Tabs, TextInput } from "@mantine/core";

interface Category {
    id: string;
    label: string;
    questions: Question[];
}

interface Question {
    id: string;
    label: string;
    type: string;


    details?: string;
    options?: string[]; // for questions of type 'select'
}

export default function PitPage() {

    const form = useForm({ mode: 'controlled' });

    return <BaseLayout>
        <Container size="xl">
            <Tabs defaultValue={CATEGORIES[0].id}>

                <Tabs.List>
                    {CATEGORIES.map(category => <Tabs.Tab key={category.id} value={category.id}>{category.label}</Tabs.Tab>)}
                </Tabs.List>

                {CATEGORIES.map(category => <Tabs.Panel key={category.id} value={category.id}>
                    <Stack>
                        {category.questions.map(question => <QuestionComponent category={category} question={question} {...form.getInputProps(`${category.id}.${question.id}`)} />)}
                    </Stack>
                </Tabs.Panel>)}
            </Tabs>
        </Container>
    </BaseLayout>
}

interface QuestionComponentProps {
    category: Category;
    question: Question;

    onChange: any;
    value?: any;
    defaultValue?: any;
    checked?: any;
    error?: any;
    onFocus?: any;
    onBlur?: any;
}

function QuestionComponent(props: QuestionComponentProps) {
    const { question } = props;

    switch (question.type) {
        case "short_text":
            return <TextInput label={question.label} {...props} />
        case "boolean":
            return <Checkbox label={question.label} {...props} />
        case "select":
            return <Select label={question.label} data={question.options} />
        default:
            throw new Error(`Unknown question type '${question.type}'!`);
    }
}