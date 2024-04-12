"use client";

import { TurboContext } from "../lib/context";
import React from "react";
import { Button, Center, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function ClearDataPage() {
    const { clearSendQueue } = React.useContext(TurboContext)

    function openModal() {
        modals.openConfirmModal({
            title: "Are you sure?",
            children: (
                <Text>
                    This action is irreversable. Verify with your lead or Michael.
                </Text>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel"},
            onConfirm: () => {if (clearSendQueue) {clearSendQueue()}},
            onCancel: () => {},
            centered: true
        })
    }

    return (
        <Center>
            <Button size="xl" variant="filled" onClick={openModal}>Erase Data</Button>
        </Center>
    );
}