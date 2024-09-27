import { Button, Center, Image, Stack, Title, Text } from "@mantine/core";
import { BaseLayout } from "../layout";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {

    const navigate = useNavigate();

    return <BaseLayout>
        <Center h={"100vh"}>
            <Stack align="center">
                <Title order={2}>Oh no!</Title>
                <Text>You have been bitten by a rodent of unusual size!</Text>

                <Image src="/rous.gif" width={"50%"} />

                <Button onClick={() => navigate("/")}>Leave the fire swamp</Button>
            </Stack>
        </Center>
    </BaseLayout>
}