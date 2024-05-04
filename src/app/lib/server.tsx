"use client";


import { modals } from "@mantine/modals";
import { Code, Stack, Text } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
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

/**
 * Returns all active data on the server in one huge array. 
 * This specific function is meant to be used from the 
 * client-side only, as it receives the result over the network.
 * 
 * @param setterFunction A callback for the result
 */
export async function getAllData(setterFunction: Function) {
    fetch("/api/pull", {
        method: 'get'
    }).then(r => r.json()).then((data: any) => {
        setterFunction(data);
    });
}

/**
 * A hook for using all turbo-scout data. This is a better way 
 * of accessing this data than using the `getAllData` function directly.
 * 
 * @returns An array of entries.
 */
export function useTurboScoutData() {
    //const [data, setData] = React.useState<any[]>([]);
    const [ data, setData] = useSessionStorage({
        key: 'pulled-ts-data',
        defaultValue: []
    });

    React.useEffect(() => {
        if(data.length != 0) return;
        getAllData(setData);
    }, [data, setData]);

    return data;
}