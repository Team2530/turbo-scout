import { Button, Checkbox, Container, Group, Modal, Stack, Table, Text, Title } from "@mantine/core";
import { BaseLayout } from "../layout";
import EVENT_CONFIG from "../config/event.json";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

export default function ChecklistPage() {

    const [scanModalOpened, scanModal ] = useDisclosure(false);
    const [confirmModalOpened, confirmModal ] = useDisclosure(false);
    function onScan(scans: IDetectedBarcode[]) {
        try {
            var { assignments }: { "assignments": number[] } = JSON.parse(scans[0].rawValue)
            setChecklist(Object.fromEntries(
                Object.keys(checklist).map((team) => [
                    +team,
                    {
                        assigned: assignments.includes(+team),
                        scouted: checklist[+team].scouted
                    }
                ])
            ))
            close()
        } catch(error) {
            alert(
                `Failed to load assignment:
                ${error}`
            )
        }
    }

    const [ checklist, setChecklist ] = useLocalStorage<{
        [key: number]: {assigned: boolean, scouted: boolean}
    }>({
        key: "checklist",
        defaultValue: Object.fromEntries(
            EVENT_CONFIG.teams.map((team) => [
                team.team_number,
                {
                    assigned: false,
                    scouted: false
                }
            ])
        )
    })

    function setAssigned(team: number, value: boolean) {
        setChecklist({
            ...checklist,
            [team]: {
                ...checklist[team],
                assigned: value
            }
        })
    }
    
    function setScouted(team: number, value: boolean) {
        setChecklist({
            ...checklist,
            [team]: {
                ...checklist[team],
                scouted: value
            }
        })
    }

    function clearChecklist() {
        setChecklist(Object.fromEntries(
            EVENT_CONFIG.teams.map((team) => [
                team.team_number,
                {
                    assigned: false,
                    scouted: false
                }
            ])
        ))
    }


    function rowItem(team: number){
            return <Table.Tr>
                <Table.Td>
                    <Checkbox
                        checked={checklist[team].assigned}
                        onChange={(event) => setAssigned(team, event.currentTarget.checked)}
                    />
                </Table.Td>
                <Table.Td>{team}</Table.Td>
                <Table.Td>
                    <Checkbox
                        checked={checklist[team].scouted}
                        onChange={(event) => setScouted(team, event.currentTarget.checked)}
                    />
                </Table.Td>
            </Table.Tr>
    }

    return <BaseLayout>

        <Modal 
            opened={scanModalOpened} 
            onClose={scanModal.close} 
            title="Scan assignments"
            fullScreen
        >
            <Scanner 
                onScan={onScan}
                components={{ 
                    finder: false, 
                    audio: false   
                }}
                allowMultiple={false}
            >
                
            </Scanner> 
        </Modal>

        <Modal
            opened={confirmModalOpened}
            onClose={confirmModal.close}
            title="Confirm"
        >
            <Stack>
                <Text>
                    This will clear ALL data from your checklist. Are you sure you want to do this?
                </Text>
                <Group justify="space-between">
                    <Button
                        variant="filled"
                        color="red"
                        onClick={() => {
                            confirmModal.close()
                            clearChecklist() 
                        }} 
                    >
                        Yes
                    </Button>
                    <Button
                        variant="filled"
                        onClick={confirmModal.close} 
                    >
                        No
                    </Button>
                </Group>
            </Stack>
        </Modal>

        <Container size="xl">
            <Stack>
                <Group justify="space-between">
                    <Title order={2}>Assigned</Title>
                    <Button 
                        variant="filled"
                        onClick={scanModal.open}
                    >
                        Import Assignment
                    </Button>
                </Group>

                <Table 
                    striped
                    withTableBorder 
                >
                    <Table.Tr>
                        <Table.Th />
                        <Table.Th>Team Number</Table.Th>
                        <Table.Th>Scouted</Table.Th>
                    </Table.Tr>

                    {Object.keys(checklist).map(team => (
                        checklist[+team].assigned
                            ? rowItem(+team)
                            : null
                    ))}
                </Table>   
            
                <Title order={2}>Unassigned</Title>
                <Text>Do these if you've finished</Text>
                <Table 
                    striped
                    withTableBorder 
                >
                    <Table.Tr>
                        <Table.Th />
                        <Table.Th>Team Number</Table.Th>
                        <Table.Th>Scouted</Table.Th>
                    </Table.Tr>

                    {Object.keys(checklist).map(team => (
                        checklist[+team].assigned
                            ? null 
                            : rowItem(+team)
                    ))}
                </Table>

                <Group justify="flex-end">
                    <Button
                        variant="filled" 
                        onClick={confirmModal.open}
                    >
                        Clear Checklist
                    </Button>
                </Group>
            </Stack>
        </Container> 
    </BaseLayout>
}