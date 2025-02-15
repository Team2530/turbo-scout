import { ActionIcon, Button, Checkbox, Container, NumberInput, Select, Stack, Textarea } from "@mantine/core";
import { BaseLayout } from "../layout";
import MATCH_CONFIG from "../config/match.json";
import EVENT_CONFIG from "../config/event.json";
import { FormStore, Question, QuestionComponent, formStoreDefaults } from "../form";
import { create } from "zustand";
import { useTurboStore } from "../state";
import { Configuration } from "./setup";
import { useLocalStorage } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

const useMatchStore = create<FormStore>(formStoreDefaults);

export default function PitPage() {

    const store = useMatchStore();
    const { getDataField, setDataField, team, setTeam, clearAllData } = store;
    const [configuration, _] = useLocalStorage<Configuration | undefined>({ key: "config", defaultValue: undefined });

    const addEntry = useTurboStore(s => s.addEntry);

    return <BaseLayout>
        <Container size="xl">
            <Stack>
                <Select label="Team" placeholder="Select a team" searchable data={EVENT_CONFIG.teams.map(team => ({
                    value: team.team_number.toString(),
                    label: `${team.team_number}: ${team.nickname}`
                }))} value={team?.toString() || null} onChange={(v) => setTeam(parseInt(v!))} />

                {MATCH_CONFIG.map(question => <QuestionComponent
                    question={question as Question}
                    key={question.id}

                    getter={getDataField}
                    setter={setDataField}
                />)}


                <Button onClick={() => {
                    addEntry({ ...store, type: "match", user: configuration!.profile, timestamp: new Date() });
                    let match_number = getDataField("match_number") as number;
                    clearAllData();
                    setDataField("match_number", match_number + 1);
                }}>Save</Button>
            </Stack>
        </Container>
    </BaseLayout>
}