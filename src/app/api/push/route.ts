/**
 * This route allows the client to send data with the server
 */
import { MD5 } from "crypto-js";
import { existsSync, mkdirSync, writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ "error_message": "You cannot GET this api route!" });
}

export async function POST(
    req: NextRequest
) {
    const dataDir = "./turbo-data/";

    if (!existsSync(dataDir)) {
        mkdirSync(dataDir);
    }

    if (req.body == null) {
        return NextResponse.json({ "error_message": "You must send some data!" });
    }

    //TODO: check if data is blank but not null, e.g. {} or []

    const data = await req.json();

    if((data as any[]).length == 0) {
        return NextResponse.json({ "error_message": "You must send some data!" });
    }

    const fileName = "data-" + btoa(new Date().toISOString()) + ".json";
    writeFile(dataDir + fileName, JSON.stringify(data), () => { });

    return NextResponse.json({ "fileName": fileName, "hash": MD5(JSON.stringify(data)).toString() });
}