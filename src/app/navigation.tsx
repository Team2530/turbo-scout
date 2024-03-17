import { AppShell, Burger, Group, UnstyledButton, Image, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

function NavButton(props: {
    children: any,
    destination: string,
    closeModal: Function | undefined
}) {
    return <UnstyledButton
        style={{
            display: 'block',
            padding: '20px'
        }}
        component={Link}
        href={props.destination}
        onClick={() => props.closeModal!()}>
        {props.children}
    </UnstyledButton>;
}

export function ContentLayout(props: { children: React.ReactNode }) {
    const [opened, { close, toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} size="sm" />
                    <Image src="/logos/black.png" w={30} />
                    <Text>Turbo Scout</Text>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <NavButton destination='/' closeModal={close}>Home</NavButton>
                <NavButton destination='/pit' closeModal={close}>Pit Scouting</NavButton>
                <NavButton destination='/match' closeModal={close}>Match Scouting</NavButton>
                <NavButton destination='/error' closeModal={close}>Data Download</NavButton>
            </AppShell.Navbar>

            <AppShell.Main>
                {props.children}
            </AppShell.Main>
        </AppShell>
    );
}