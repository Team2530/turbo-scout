import { Button, Container, Group, Select, SimpleGrid, Text } from "@mantine/core";
import { BaseLayout } from "../layout";
import EVENT_CONFIG from "../config/event.json";
import React from "react";
import { FormStore, QuestionComponent, formStoreDefaults } from "../form";
import { create } from "zustand";
import { convertFilesToBase64, useTurboStore } from "../state";
import { Configuration } from "./setup";
import { useLocalStorage } from "@mantine/hooks";
import { md5 } from "../state";
import { Dropzone, DropzoneAccept, DropzoneIdle, DropzoneReject, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";

const useStrategyStore = create<FormStore>(formStoreDefaults);

export default function StrategyPage() {
    const store = useStrategyStore();
    const { getDataField, setDataField, team, setTeam, clearAllData } = store;

    const addEntry = useTurboStore(s => s.addEntry);
    const addFile = useTurboStore(s => s.addFile);

    const [files, setFiles] = React.useState<string[]>([]);

    const [configuration, _] = useLocalStorage<Configuration | undefined>({ key: "config", defaultValue: undefined });

    return <BaseLayout>
        <Container size="xl" style={{ height: "70vh" }}>
            <Select label="Team" placeholder="Select a team" searchable data={EVENT_CONFIG.teams.map(team => ({
                value: team.team_number.toString(),
                label: `${team.team_number}: ${team.nickname}`
            }))} onChange={(v) => setTeam(parseInt(v!))} />

            <br/>
            <QuestionComponent
                question={{ id: "match_number", label: "match_number", type: "integer", details: "Match number" }}
                key={"match_number"}

                getter={getDataField}
                setter={setDataField}
            />
            <br/><br/>
            <Dropzone
                onDrop={(files) => convertFilesToBase64(files).then(i => {
                    setFiles(i);
                    setDataField("files", i.map(i => md5(i)));
                })}
                onReject={(files) => alert("ERROR! Files rejected! " + files)}
                accept={[PDF_MIME_TYPE[0], ...IMAGE_MIME_TYPE]}
            >
                <Group justify="center" gap="xl" mih={220}>
                    <DropzoneAccept>
                        <IconUpload />
                    </DropzoneAccept>
                    <DropzoneReject>
                        <IconX />
                    </DropzoneReject>
                    <DropzoneIdle>
                        <IconFile />
                    </DropzoneIdle>

                    <Text size="xl">
                        Strategy Documents
                    </Text>

                </Group>
            </Dropzone>

            <SimpleGrid>
                    {files.map(file => <div id={"#" + files.indexOf(file)}>
                        {/* <Image src={image} w="6rem" /> */}
                        <p>File upload: {md5(file)}</p>
                    </div>)}
                </SimpleGrid>

            <br/><br/>

            <QuestionComponent
                question={{ id: "auto_summary", label: "Please write a quick summary of their auto (e.g., Center 1L2, Processor 3L4, etc.)", type: "short_text", details: "Endgame notes" }}
                key={"auto_summary"}

                getter={getDataField}
                setter={setDataField}
            />

            <QuestionComponent
                question={{ id: "climb_time", label: "Please estimate their climb time (since passing black tape, or deploying climber) | 0 if no climb", type: "integer", details: "Give us a climb time" }}
                key={"climb_time"}

                getter={getDataField}
                setter={setDataField}
            />
            
            <QuestionComponent
                question={{ id: "endgame_notes", label: "Leave endgame notes", type: "short_text", details: "Give us climb notes" }}
                key={"endgame_notes"}

                getter={getDataField}
                setter={setDataField}
            />
            
            <QuestionComponent
                question={{ id: "defensive_notes", label: "Defensive notes (if applicable)", type: "short_text", details: "Please leave any notes on their defense" }}
                key={"defensive_notes"}

                getter={getDataField}
                setter={setDataField}
            />
            <QuestionComponent
                question={{ id: "strengths", label: "Did you see any specific strengths?", type: "short_text", details: "Notes" }}
                key={"strengths"}

                getter={getDataField}
                setter={setDataField}
            />
            <QuestionComponent
                question={{ id: "weaknesses", label: "Did you see any specific weaknesses?", type: "short_text", details: "Notes" }}
                key={"weaknesses"}

                getter={getDataField}
                setter={setDataField}
            />
            <QuestionComponent
                question={{ id: "other", label: "Other", type: "strategy_text", details: "Other notes" }}
                key={"other"}

                getter={getDataField}
                setter={setDataField}
            />
            <Button onClick={async () => {
                if (team == undefined || team == 0) {
                    alert("You need to pick a team before saving! Zack I know this is you.");
                    return;
                }

                addEntry({ ...store, type: "strategy", user: configuration!.profile, timestamp: new Date() });
                files.forEach((file, index) => {
                    addFile({ id: md5(file), data: file });
                    setDataField("files." + index, md5(file));
                })

                clearAllData();
                setFiles([]);
            }}>Save</Button>
        </Container>
    </BaseLayout>
}