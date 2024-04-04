"use client";

import '@mantine/tiptap/styles.css';
import { Button, Select, Stack } from "@mantine/core";

import { RichTextEditor, Link } from '@mantine/tiptap';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { TurboContext } from '../lib/context';

export default function NotesPage() {
    const { teams, addToSendQueue, username, currentEvent } = React.useContext(TurboContext);
    const [currentTeam, setCurrentTeam] = React.useState<string | undefined>();

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
                html: editor?.getHTML()
            }
        });
    };

    return <Stack>
        <Select searchable label="Select a team" value={currentTeam} onChange={(v: string | null) => setCurrentTeam((v != null) ? v : undefined)} data={teams!.map(team => {
            return {
                value: team['key'].substring(3),
                label: `${team['key'].substring(3)}: ${team['nickname']}`
            }
        })} />
        <BasicRichTextEditor editor={editor} />
        <Button onClick={saveData}>Save</Button>
    </Stack>
}

function BasicRichTextEditor(props: { editor: Editor | null }) {
    return <RichTextEditor editor={props.editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
    </RichTextEditor>;
}