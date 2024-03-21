"use client";

import React from "react";
import { Fieldset, Group, Stack, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconJson } from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';

export default function ViewDataPage() {
    const [loadedData, setLoadedData] = React.useState<any>(undefined);

    if (loadedData == undefined) {
        return <Dropzone onDrop={async (files) => {
            const file = files[0];
            setLoadedData(JSON.parse(await file.text()));
        }}>
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconJson
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Drag JSON file here to view
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        This menu is only for until we get the server thing figured out and can use that to load data.
                    </Text>
                </div>
            </Group>
        </Dropzone>;
    } else {
        return <Stack>
            {Object.entries(loadedData).map(([category, questions]) => {
                return <Fieldset legend={category}>
                    
                </Fieldset>
            })}
        </Stack>;
    }
}