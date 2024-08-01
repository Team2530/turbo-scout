import { Container, Fieldset, Select, Stack, Text } from "@mantine/core";
import { BaseLayout } from "./Layout";
import { IconUserCircle } from '@tabler/icons-react';
import EVENT from "./config/event.json";

export default function SetupPage() {

    const scouters: string[] = EVENT.scouters;

    return <BaseLayout>
        <Container>
            <Stack>
                <Text ta="center">Turbo-Scout Setup</Text>

                {/* TODO: scout groups */}
                <Select
                    label="Select Profile"
                    leftSection={<IconUserCircle />}
                    data={scouters}
                />
            </Stack>
        </Container>
    </BaseLayout>
}