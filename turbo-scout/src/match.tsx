import { Container } from "@mantine/core";
import { BaseLayout } from "./Layout";
import MATCH_CONFIG from "./config/match.json";
import { QuestionComponent } from "./form";

export default function MatchPage() {
    return <BaseLayout>
        <Container size="xl">
            {MATCH_CONFIG.map(question => <QuestionComponent
                question={question}
                onChange={() => console.log("Not implemented!")}
            />)}
        </Container>
    </BaseLayout>
}