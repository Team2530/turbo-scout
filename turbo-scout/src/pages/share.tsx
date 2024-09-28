import React from "react";

import { BaseLayout } from "../layout";
import DISCORD_CONFIG from "../config/discord.json";

import { Accordion, Button, Card, Center, Container, Group, Stack, Textarea, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconBrandDiscordFilled, IconDownload, IconQrcode } from "@tabler/icons-react";
import { TurboStore, md5, useTurboStore } from "../state";
import download from "downloadjs";
import { modals } from "@mantine/modals";
import QRCode from "react-qr-code";
import { notifications } from "@mantine/notifications";

interface ShareMethod {
    name: string;

    icon: React.ReactNode;

    sendData: (state: TurboStore) => void;
}

const methods: ShareMethod[] = [
    {
        name: "Discord",
        icon: <IconBrandDiscordFilled style={{ width: "70%", height: "70%" }} />,
        sendData: (state: TurboStore) => {
            const formData = new FormData();
            formData.append("file", new File(
                [JSON.stringify(state)],
                `data-${new Date().toISOString()}.json`,
            ));
            const xhr = new XMLHttpRequest();
            xhr.open("POST", DISCORD_CONFIG.webhook);
            xhr.send(formData);

            notifications.show({
                title: 'Discord',
                message: 'Sending your data to discord! You should get a notification in a few seconds!',
            });
        }
    },
    {
        name: "Files",
        icon: <IconDownload style={{ width: "70%", height: "70%" }} />,
        sendData: (state: TurboStore) => download(
            JSON.stringify(state),
            `turbo-data-${new Date().toISOString()}.json`,
            "application/json"
        )
    },
    {
        name: "QR Code",
        icon: <IconQrcode style={{ width: "70%", height: "70%" }} />,
        sendData: (state: TurboStore) => {

            const content: string = JSON.stringify(state);

            modals.open({
                title: "QR Code",
                centered: true,
                children: <Stack>
                    <Center style={{ background: 'white', padding: '25px' }}>
                        <QRCode value={content} />
                    </Center>
                    <pre>
                        Hash = {md5(content)}
                    </pre>
                </Stack>
            });
        }
    }
];

export default function SharePage() {

    const state = useTurboStore();

    return <BaseLayout>
        <Container size="md">
            <pre>
                {/* TODO: display this in a better format */}
                <EntryDisplayList entries={state.entries} />
            </pre>
            <Center>
                <Group>
                    {methods.map(method => <MethodButton method={method} state={state} key={method.name} />)}
                </Group>
            </Center>
            <br/>
            <Button onClick={state.clearAll}>Clear all data (DANGER)</Button>
        </Container>
    </BaseLayout>
}

function EntryDisplayList(props: { entries: any[] }) {
    if (props.entries.length == 0) return <p>No entries to display.</p>
    return <Accordion>
        {props.entries.map(entry => <EntryDisplay entry={entry} />)}
    </Accordion>
}

function EntryDisplay(props: { entry: any }) {
    const { entry } = props;
    const hash = md5(JSON.stringify(entry));

    return <Accordion.Item key={hash} value={`${entry['type']} entry for team ${entry['team']}`}>
        <Accordion.Control>{`${entry['type']} entry for team ${entry['team']}`}</Accordion.Control>
        <Accordion.Panel>
            <Textarea readOnly resize="vertical">
                {JSON.stringify(entry, undefined, "\t")}
            </Textarea>
        </Accordion.Panel>
    </Accordion.Item>
}

function MethodButton(props: { method: ShareMethod, state: TurboStore }) {
    return <UnstyledButton onClick={() => props.method.sendData(props.state)}>
        <Card>
            <Stack align="center">
                <ThemeIcon variant="transparent" size="7em" color="gray">
                    {props.method.icon}
                </ThemeIcon>
                {props.method.name}
            </Stack>
        </Card>
    </UnstyledButton>
}