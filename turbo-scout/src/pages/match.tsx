import { Container } from "@mantine/core";
import { BaseLayout } from "../layout";
import MATCH_CONFIG from "../config/match.json";
import { QuestionComponent } from "../form";
import { useForm } from "@mantine/form";

export default function MatchPage() {

    const form = useForm({mode: 'controlled'});

    return <BaseLayout>
        <Container size="xl">

            <pre>
                {JSON.stringify(form.getValues())}
            </pre>

            {MATCH_CONFIG.map(question => <QuestionComponent
                question={question}
                {...form.getInputProps(question.id)}
            />)}
        </Container>
    </BaseLayout>
}