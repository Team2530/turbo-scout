import { BaseLayout } from "./Layout";
import CATEGORIES from "./config/pit.json";
import { Container, Stack, Tabs } from "@mantine/core";

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
    return <BaseLayout>
        <Container size="xl">
            <Tabs defaultValue={CATEGORIES[0].id}>

                <Tabs.List>
                    {CATEGORIES.map(category => <Tabs.Tab key={category.id} value={category.id}>{category.label}</Tabs.Tab>)}
                </Tabs.List>

                {CATEGORIES.map(category => <Tabs.Panel key={category.id} value={category.id}>
                    <Stack>
                        {category.questions.map(question => <QuestionComponent category={category} question={question} />)}
                    </Stack>
                </Tabs.Panel>)}
            </Tabs>
        </Container>
    </BaseLayout>
}

function QuestionComponent(props: { category: Category, question: Question }) {
    return <p>{props.question.label}</p>
}