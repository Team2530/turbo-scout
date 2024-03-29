import MD5 from "crypto-js/md5";

export async function exportData(sendQueue: any, clearSendQueue: any) {
    fetch("/api/push", {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendQueue)
    }).then(resp => resp.json()).then(response => {
        //TODO: get the hashes to match properly... encoding or whitespace makes them different on the server and client.
        // console.log(response);
        // console.log("Client-side: " + MD5(sendQueue) + " - " + JSON.stringify(sendQueue));
    });
}

export async function getAllData(setterFunction: Function) {
    fetch("/api/pull", {
        method: 'get'
    }).then(r => r.json()).then((data: any) => {
        setterFunction(data);
    });
}