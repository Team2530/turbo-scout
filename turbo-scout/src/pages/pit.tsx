import { Container } from "@mantine/core";
import { BaseLayout } from "../layout";
import PIT_CONFIG from "../config/pit.json";
import { Question, QuestionComponent } from "../form";
import { useForm } from "@mantine/form";

export default function PitPage() {

    const form = useForm({mode: 'controlled'});

    return <BaseLayout>
        <Container size="xl">

            <pre>
                {JSON.stringify(form.getValues())}
            </pre>

            {PIT_CONFIG.map(category => {
                return category.questions.map(question => <QuestionComponent 
                    question={question as Question}
                    key={question.id}
                    {...form.getInputProps(`${category.id}.${question.id}`)}
                />)
            })}
        </Container>
    </BaseLayout>
}