import { Text, Button, Container, Group, Select, Stack, Title, SimpleGrid, Image } from "@mantine/core";
import { BaseLayout } from "../layout";
import PIT_CONFIG from "../config/pit.json";
import EVENT_CONFIG from "../config/event.json";
import { FormStore, Question, QuestionComponent, TeamSelect, formStoreDefaults } from "../form";
import { create } from "zustand";
import { convertFilesToBase64, md5, useTurboStore } from "../state";
import { useLocalStorage } from "@mantine/hooks";
import { Dropzone, DropzoneAccept, DropzoneIdle, DropzoneReject, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Configuration } from "./setup";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import React from "react";

const usePitStore = create<FormStore>(formStoreDefaults);

export default function PitPage() {

    const store = usePitStore();
    const { getDataField, setDataField, team, setTeam, clearAllData } = store;
    const [configuration, _] = useLocalStorage<Configuration | undefined>({ key: "config", defaultValue: undefined });

    const [images, setImages] = React.useState<string[]>([]);

    const addEntry = useTurboStore(s => s.addEntry);
    const addImage = useTurboStore(s => s.addFile);

    return <BaseLayout>
        <Container size="xl">
            <Stack>
                <TeamSelect team={team} setTeam={setTeam} />
                
                <Dropzone
                    onDrop={(images) => convertFilesToBase64(images).then(i => {
                        setImages(i);
                        setDataField("photos", i.map(i => md5(i)));
                    })}
                    onReject={(files) => alert("ERROR! Images rejected! " + files)}
                    accept={IMAGE_MIME_TYPE}
                >
                    <Group justify="center" gap="xl" mih={220}>
                        <DropzoneAccept>
                            <IconUpload />
                        </DropzoneAccept>
                        <DropzoneReject>
                            <IconX />
                        </DropzoneReject>
                        <DropzoneIdle>
                            <IconPhoto />
                        </DropzoneIdle>

                        <Text size="xl">
                            Robot Photos
                        </Text>

                    </Group>
                </Dropzone>

                <SimpleGrid>
                    {images.map(image => <div id={"#" + images.indexOf(image)}>
                        <Image src={image} w="6rem" />
                    </div>)}
                </SimpleGrid>

                {PIT_CONFIG.map(category => {
                    return <>
                        <Title order={3}>{category.label}</Title>
                        {category.questions.map(question => <QuestionComponent
                            question={question as Question}
                            key={question.id}

                            getter={getDataField}
                            setter={setDataField}
                        />)}
                    </>
                })}

                <Button onClick={() => {
                    if(team == undefined || team == 0) {
                        alert("You need to pick a team before saving!");
                        return;
                    }
                    addEntry({ ...store, type: "pit", user: configuration!.profile, timestamp: new Date() });
                    images.forEach((i, index) => {
                        addImage({ id: md5(i), data: i });
                        setDataField("photos." + index, md5(i));
                    });

                    clearAllData();
                    setImages([]);
                    window.scrollTo({ top: 0 })
                }}>Save</Button>
            </Stack>
        </Container>
    </BaseLayout>
}