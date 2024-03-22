import { Image, Stack, Title } from "@mantine/core";

export default function ErrorPage() {
    return <Stack align="center" gap="sm">
        <Title order={2}>Page not found! Oh no!</Title>
        <Image src="/turbo-scout/rous.gif" w={350} alt="ROUS" />
        <Title order={3}>The scouting app got eaten by a ROUS!</Title>
    </Stack>;
}