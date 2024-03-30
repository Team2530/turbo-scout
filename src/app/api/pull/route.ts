/**
 * This route returns all data on the server.
 */
import { readFileSync, readdirSync } from "fs";
import { NextResponse } from "next/server";

export async function GET() {
    const dataDir = "./turbo-data/";

    const files: string[] = readdirSync(dataDir);
    let result: any[] = [];

    files.map(filePath => {
        const fileContents: string = readFileSync(dataDir + filePath, {encoding: 'utf-8', flag: 'r'});
        const fileDataEntries: any[] = JSON.parse(fileContents);

        for(let entry of fileDataEntries) {
            result.push(entry);
        }
    });

    return NextResponse.json(result);
}