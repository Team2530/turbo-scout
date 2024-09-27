import { Button, Container, Select, Stack } from "@mantine/core";
import { BaseLayout } from "../layout";
import PIT_CONFIG from "../config/pit.json";
import EVENT_CONFIG from "../config/event.json";
import { FormStore, Question, QuestionComponent, formStoreDefaults } from "../form";
import { create } from "zustand";
import { useTurboStore } from "../state";

const usePitStore = create<FormStore>(formStoreDefaults);

export default function PitPage() {

    const store = usePitStore();
    const { getDataField, setDataField, setTeam, clearAllData } = store;

    const addEntry = useTurboStore(s => s.addEntry);

    return <BaseLayout>
        <Container size="xl">
            <Stack>
                <Select label="Team" placeholder="Select a team" searchable data={EVENT_CONFIG.teams.map(team => ({
                    value: team.team_number.toString(),
                    label: `${team.team_number}: ${team.nickname}`
                }))} onChange={(v) => setTeam(parseInt(v!))} />


                {PIT_CONFIG.map(category => {
                    return category.questions.map(question => <QuestionComponent
                        question={question as Question}
                        key={question.id}

                        getter={getDataField}
                        setter={setDataField}
                    />)
                })}

                <Button onClick={() => { 
                    addEntry({...store, type: "pit"}); 
                    clearAllData();
                    window.scrollTo({top: 0})
                }}>Save</Button>
            </Stack>
        </Container>
    </BaseLayout>
}