import { useForm } from "@mantine/form";
import { BaseLayout } from "../layout";
import CATEGORIES from "../config/pit.json";
import { Button, Container, Stack, Tabs } from "@mantine/core";
import React from "react";
import { Question, QuestionComponent } from "../form";
import { useTurboStore } from "../state";

export interface Category {
    id: string;
    label: string;
    questions: Question[];
}

export default function PitPage() {

    const [currentTab, setCurrentTab] = React.useState<string>(CATEGORIES[0].id);

    const form = useForm({ mode: 'uncontrolled' });

    const addEntry = useTurboStore((state) => state.addEntry);

    const save = () => {
        addEntry("Example entry - " + JSON.stringify(form.getValues()));
    };

    const nextPage = () => setCurrentTab(CATEGORIES[CATEGORIES.findIndex(x => x.id === currentTab) + 1].id)

    return <BaseLayout>
        <Container size="xl">
            <Tabs value={currentTab} onChange={(v) => setCurrentTab(v!)}>

                <Tabs.List>
                    {CATEGORIES.map(category => <Tabs.Tab key={category.id} value={category.id}>{category.label}</Tabs.Tab>)}
                </Tabs.List>

                {CATEGORIES.map(category => <Tabs.Panel key={category.id} value={category.id}>
                    <Stack>
                        {category.questions.map(question => <QuestionComponent
                            key={question.id}
                            category={category}
                            question={question}
                            {...form.getInputProps(`${category.id}.${question.id}`)}
                        />)}

                        {currentTab == CATEGORIES[CATEGORIES.length - 1].id ?
                            <Button onClick={save}>Save</Button> :
                            <Button onClick={nextPage}>Next</Button>
                        }
                    </Stack>
                </Tabs.Panel>)}
            </Tabs>
        </Container>
    </BaseLayout>
}