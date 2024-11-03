import { Excalidraw, exportToCanvas } from "@excalidraw/excalidraw";
import { Button, Container, Select } from "@mantine/core";
import { BaseLayout } from "../layout";
import EVENT_CONFIG from "../config/event.json";
import React from "react";
import { FormStore, formStoreDefaults } from "../form";
import { create } from "zustand";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useTurboStore } from "../state";
import { Configuration } from "./setup";
import { useLocalStorage } from "@mantine/hooks";

const useStrategyStore = create<FormStore>(formStoreDefaults);

export default function StrategyPage() {
    const store = useStrategyStore();
    const { setDataField, setTeam, clearAllData } = store;

    const addEntry = useTurboStore(s => s.addEntry);

    const [configuration, _] = useLocalStorage<Configuration | undefined>({ key: "config", defaultValue: undefined });

    const [excalidrawAPI, setExcalidrawAPI] = React.useState<ExcalidrawImperativeAPI | null>(null);

    return <BaseLayout>
        <Container size="xl" style={{ height: "70vh" }}>
            <Excalidraw theme="dark" excalidrawAPI={(api) => setExcalidrawAPI(api)} />

            <Select label="Team" placeholder="Select a team" searchable data={EVENT_CONFIG.teams.map(team => ({
                value: team.team_number.toString(),
                label: `${team.team_number}: ${team.nickname}`
            }))} onChange={(v) => setTeam(parseInt(v!))} />

            <Button onClick={async () => {
                const { width, height, zoom } = excalidrawAPI!.getAppState();

                const canvas = await exportToCanvas({
                    elements: excalidrawAPI!.getSceneElements(),
                    files: excalidrawAPI!.getFiles(),
                    appState: excalidrawAPI!.getAppState(),
                    getDimensions: () => ({
                        width: width / zoom.value,
                        height: height / zoom.value
                    })
                });

                setDataField("image", canvas.toDataURL("image/png"));

                addEntry({ ...store, type: "strategy", user: configuration!.profile, timestamp: new Date() });
                clearAllData();
                excalidrawAPI?.updateScene({}); //TODO: this does not work properly
            }}>Save</Button>
        </Container>
    </BaseLayout>
}