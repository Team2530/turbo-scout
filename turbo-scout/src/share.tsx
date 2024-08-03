import { Button, Card, Center, Container, Group, SimpleGrid, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { BaseLayout } from "./Layout";
import React from "react";
import { IconBluetooth, IconDownload, IconQrcode, IconShare, IconWifi } from "@tabler/icons-react";

interface ShareMethod {
    name: string;

    icon: React.ReactNode;

    sendData: () => void;
}

export default function SharePage() {

    const methods: ShareMethod[] = [
        {
            name: "Server",
            icon: <IconWifi style={{ width: "70%", height: "70%" }} />,
            sendData: () => alert("sending to wifi")
        },
        {
            name: "Bluetooth",
            icon: <IconBluetooth style={{ width: "70%", height: "70%" }} />,
            sendData: () => alert("Sending to bluetooth")
        },
        {
            name: "Files",
            icon: <IconDownload style={{ width: "70%", height: "70%" }} />,
            sendData: () => alert("Downloading to device")
        },
        {
            name: "Apple Share",
            icon: <IconShare style={{ width: "70%", height: "70%" }} />,
            sendData: () => alert("using built in OS share feature")
        },
        {
            name: "QR Code",
            icon: <IconQrcode style={{ width: "70%", height: "70%" }} />,
            sendData: () => alert("generating qr code")
        }
    ];

    return <BaseLayout>
        <Container size="md">
            <Center>
                <Group>
                    {methods.map(method => <MethodButton method={method} />)}
                </Group>
            </Center>
        </Container>
    </BaseLayout>
}

function MethodButton(props: { method: ShareMethod }) {
    return <UnstyledButton onClick={props.method.sendData}>
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