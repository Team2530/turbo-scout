import { Button, Container, Select, Stack, Text } from "@mantine/core";
import { BaseLayout } from "../layout";
import { IconUserCircle } from '@tabler/icons-react';
import EVENT from "../config/event.json";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";

export interface Configuration {
    profile: string;
}

export default function SetupPage() {

    const [configuration, setConfiguration] = useLocalStorage<Configuration | undefined>({ key: "config", defaultValue: undefined });

    const form = useForm({
        mode: "uncontrolled"
    });

    const profileDisplay = configuration && <Stack align="center">
        <Text>Welcome to Turbo Scout, {configuration.profile}</Text>
        <Button onClick={() => setConfiguration(undefined)}>Sign out</Button>
    </Stack>

    const setupForm = <Stack>
        <Text ta="center">Turbo-Scout Setup</Text>

        {/* TODO: scout groups and other configuration options */}
        <Select
            label="Select Profile"
            leftSection={<IconUserCircle />}
            data={EVENT.scouters}
            searchable
            {...form.getInputProps("profile")}
        />

        <Button onClick={() => setConfiguration({ profile: form.getValues()['profile'] })}>Save</Button>
    </Stack>

    return <BaseLayout>
        <Container size="sm">
            {configuration ? profileDisplay : setupForm}
        </Container>
    </BaseLayout>
}