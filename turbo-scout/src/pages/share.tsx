import React from "react";

import { BaseLayout } from "../layout";

import { Card, Center, Container, Group, Stack, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconBrandDiscordFilled, IconDownload, IconQrcode } from "@tabler/icons-react";
import { TurboStore, md5, useTurboStore } from "../state";
import download from "downloadjs";
import { modals } from "@mantine/modals";
import QRCode from "react-qr-code";

interface ShareMethod {
    name: string;

    icon: React.ReactNode;

    sendData: (state: TurboStore) => void;
}

const methods: ShareMethod[] = [
    {
        name: "Discord",
        icon: <IconBrandDiscordFilled style={{width: "70%", height: "70%" }} />,
        sendData: (state: TurboStore) => {
            alert("sending data over discord: " + JSON.stringify(state));
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
                {JSON.stringify(state)}
            </pre>
            <Center>
                <Group>
                    {methods.map(method => <MethodButton method={method} state={state} key={method.name} />)}
                </Group>
            </Center>
        </Container>
    </BaseLayout>
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