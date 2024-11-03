import { Excalidraw } from "@excalidraw/excalidraw";
import { Container } from "@mantine/core";
import { BaseLayout } from "../layout";

export default function StrategyPage() {
    return <BaseLayout>
        <Container size="xl" style={{height: "70vh"}}>
            <Excalidraw theme="dark" />
        </Container>
    </BaseLayout>
}