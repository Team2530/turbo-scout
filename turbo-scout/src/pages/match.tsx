import { Button, Container, Select, Stack } from "@mantine/core";
import { BaseLayout } from "../layout";
import MATCH_CONFIG from "../config/match.json";
import EVENT_CONFIG from "../config/event.json";
import { FormStore, Question, QuestionComponent, formStoreDefaults } from "../form";
import { create } from "zustand";
import { useTurboStore } from "../state";
import { Configuration } from "./setup";
import { useLocalStorage } from "@mantine/hooks";

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
                    if(team == undefined || team == 0) {
                        alert("You need to pick a team before saving!!!@!!!!!!!@!@!@!@!#!@#!@#@#%#@$%@431723049817203948 712349081702349871023481092347b 092384");
                        return;
                    }
                    addEntry({ ...store, type: "match", user: configuration!.profile, timestamp: new Date() });
                    let match_number = getDataField("match_number") as number;
                    clearAllData();
                    setDataField("match_number", match_number + 1);
                }}>Save</Button>
            </Stack>
        </Container>
    </BaseLayout>
}