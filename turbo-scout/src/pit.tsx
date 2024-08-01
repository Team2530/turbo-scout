import { useForm } from "@mantine/form";
import { BaseLayout } from "./Layout";
import CATEGORIES from "./config/pit.json";
import { Container, Tabs } from "@mantine/core";

export default function PitPage() {
    return <BaseLayout>
        <Container size="xl">
            <Tabs defaultValue={CATEGORIES[0].id}>

                <Tabs.List>
                    {CATEGORIES.map(category => <Tabs.Tab key={category.id} value={category.id}>{category.label}</Tabs.Tab>)}
                </Tabs.List>

                {CATEGORIES.map(category => <Tabs.Panel key={category.id} value={category.id}>
                    Content here
                </Tabs.Panel>)}
            </Tabs>
        </Container>
    </BaseLayout>
}