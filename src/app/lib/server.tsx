"use client";


import { modals } from "@mantine/modals";
import { Code, Stack, Text } from "@mantine/core";
import MD5 from "crypto-js/md5";
import React from "react";

export async function exportData(sendQueue: any, clearSendQueue: any) {
    fetch("/api/push", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendQueue)
    }).then(resp => resp.json()).then(response => {

        const clientHash = MD5(JSON.stringify(sendQueue)).toString();

        if (clientHash == undefined) {
            throw new Error("Failed to compute client checksum!");
        }

        const serverHash = response['hash'];

        if (serverHash == undefined) {
            if (response['error_message']) {
                throw new Error("Server returned error: " + response['error_message']);
            }
            throw new Error("Server returned an undefined checksum!");
        }

        if (clientHash != serverHash) {
            throw new Error("Checksums do not match! The data must have been corrupted along the way somehow!");
        }

        //TODO: backup the sendQueue in another way, to be absolutely sure
        clearSendQueue();

        modals.open({
            title: "Success!",
            children: <p>Your data was sent to the server, and everything worked!</p>
        });

    }).catch(err => {
        modals.open({
            title: "An error has occured while trying to send your data to the server!",
            children: (<Stack>
                Show this to Michael so he can fix it!
                <Code block>{err.message}</Code>
            </Stack>)
        })
    }).finally(() => {
        modals.close("uploadModal")
    });

    modals.open({
        title: "Uploading...",
        children: (
            <>
                <Text>{sendQueue.filter((x:any) => x.type == "match").length} match forms, {sendQueue.filter((x:any) => x.type == "pit").length} pit forms, and {sendQueue.filter((x:any) => x.type == "note").length} notes</Text>
            </>
        ),
        modalId: "uploadModal"
    });
}