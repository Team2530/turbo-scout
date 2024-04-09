import { Container, Group, SimpleGrid, Stack } from "@mantine/core";
import { TeamsTab } from "./teams";

export function AllianceSplitTab(props: { data: any[], tbaData: any }) {
    return <Container fluid>
        <Group grow>
            <TeamsTab data={props.data} tbaData={props.tbaData} />
            <TeamsTab data={props.data} tbaData={props.tbaData} />
            <TeamsTab data={props.data} tbaData={props.tbaData} />
        </Group>
        <Group grow>
            <TeamsTab data={props.data} tbaData={props.tbaData} />
            <TeamsTab data={props.data} tbaData={props.tbaData} />
            <TeamsTab data={props.data} tbaData={props.tbaData} />
        </Group>
    </Container>
}