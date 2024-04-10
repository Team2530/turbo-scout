/**
 * This route allows the client to send data with the server
 */
import { MD5 } from "crypto-js";
import { existsSync, mkdirSync, writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../../lib/images";

export async function GET() {
    return NextResponse.json({ "error_message": "You cannot GET this api route!" });
}

export async function POST(
    req: NextRequest
) {
    const dataDir = useDataDir();

    if (req.body == null) {
        return NextResponse.json({ "error_message": "You must send some data!" });
    }

    //TODO: check if data is blank but not null, e.g. {} or []

    let data: any[] = await req.json();

    if ((data as any[]).length == 0) {
        return NextResponse.json({ "error_message": "You must send some data!" });
    }

    const checksum = MD5(JSON.stringify(data)).toString();

    // data = data.map(transformEntryImages);
    for(let entry of data) {
        entry = await transformEntryImages(entry);
    }

    const fileName = "data-" + btoa(new Date().toISOString()) + ".json";
    writeFile(dataDir + fileName, JSON.stringify(data), () => { });

    return NextResponse.json({ "fileName": fileName, "hash": checksum });
}

async function transformEntryImages(entry: any) {
    // Excessive checking of nulls and stuff
    if (entry == null || entry == undefined) return entry;
    if (!Object.keys(entry).includes("data")) return entry; //TODO: maybe return some kind of error in this case?
    if (entry['data'] == null || entry['data'] == undefined) return entry;
    if (!Object.keys(entry).includes("type") || entry['type'] != 'pit') return entry;
    if (!Object.keys(entry['data']).includes("Photos")) return entry;

    const photoQuestions: any = entry['data']['Photos'];

    if (photoQuestions == null || photoQuestions.length == 0 || photoQuestions == undefined) return entry;

    entry['data']['Photos'] = await fixPhotoQuestions(photoQuestions);

    return entry;
}

async function fixPhotoQuestions(photoQuestions: any) {
    let result: any = {};

    for(const [questionName, photos] of Object.entries(photoQuestions)) {
        let photoIds: string[] = [];

        for(const photo of (photos as Array<any>)) {
            const id: string = await uploadImage(photo);
            console.log("got id: " + id);
            photoIds.push(id);
        }

        result[questionName] = photoIds;
    }

    return result;
}

function useDataDir() {
    const dataDir = "./turbo-data/";

    if (!existsSync(dataDir)) {
        mkdirSync(dataDir);
    }

    return dataDir;
}