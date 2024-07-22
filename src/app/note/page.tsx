"use client";

import '@mantine/tiptap/styles.css';
import { Button, Select, Stack } from "@mantine/core";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { TurboContext } from '../lib/context';
import { useTBA } from '../lib/tba_api';
import { notifications } from '@mantine/notifications';
import { ImageUpload } from '../../components/FormComponent';
import BasicRichTextEditor from '@/components/BasicRichTextEditor';

export default function NotesPage() {
    const { teams } = useTBA();

    const { addToSendQueue, username, currentEvent } = React.useContext(TurboContext);
    const [currentTeam, setCurrentTeam] = React.useState<string | undefined>();
    const [images, setImages] = React.useState<string[]>([]);

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
    });

    if (teams == undefined) {
        return <p>Loading teams...</p>;
    }

    const saveData = () => {
        addToSendQueue!({
            type: "note",
            user: username!,
            team: currentTeam,
            event: currentEvent,
            timestamp: new Date().toISOString(),
            data: {
                text: editor?.getText(),
                json: editor?.getJSON(),
                html: editor?.getHTML(),
                photos: JSON.parse(JSON.stringify(images))
            }
        });

        setCurrentTeam(undefined); //TODO: this does not appear to work as intended.
        editor!.commands.clearContent();
        setImages([]);

        notifications.show({
            title: "Saved!",
            message: "Your note has been saved! Click the upload button in the top right to send it when you have internet access."
        });
    };

    //TODO: extract the team select box into its own component and reuse across match, pit and notes
    return <Stack>
        <Select searchable label="Select a team" value={currentTeam} onChange={(v: string | null) => setCurrentTeam((v != null) ? v : undefined)} data={teams!.map((team: any) => {
            return {
                value: team['key'].substring(3),
                label: `${team['key'].substring(3)}: ${team['nickname']}`
            }
        })} />
        <BasicRichTextEditor editor={editor} />
        <ImageUpload label="Image upload" images={images} setImages={setImages}/>
        <Button onClick={saveData}>Save</Button>
    </Stack>
}