import { modals } from "@mantine/modals";
import { Code, Space, Stack, Text } from "@mantine/core";

export const SERVER_HOST: string = "http://154.53.40.38";

export async function exportData(sendQueue: any, clearSendQueue: any) {

    //TODO: send to discord webhook

    fetch(SERVER_HOST + "/push", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendQueue)
    }).then(resp => resp.json()).then(response => {
        clearSendQueue();
    }).catch(err => {
        modals.open({
            title: "An error has occured while trying to send your data to the server!",
            children: (<Stack>
                Show this to Michael so he can fix it!
                <Code block>{err.message}</Code>
            </Stack>)
        })
    });
}

export async function getAllData(setterFunction: Function) {
    fetch(SERVER_HOST + "/pull", {
        method: 'get'
    }).then(r => r.json()).then((data: any) => {
        setterFunction(data);
    });
}