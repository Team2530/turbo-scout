import { Button, Container, Group, Select, Text } from "@mantine/core";
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

            <br/><br/><br/>

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

            <br/><br/>

            <QuestionComponent
                question={{ id: "summary", label: "Summary", type: "paragraph", details: "Give us a summary of everything" }}
                key={"summary"}

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