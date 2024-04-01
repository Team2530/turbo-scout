"use server";

/**
 * This route returns all data on the server.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
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

export async function POST() {
    //TODO: do this in a better way
    // The purpose of this function is to prevent NextJS from 
    // taking a look at this file and saying: 'Oh hey, that looks like it can be exported statically because it only *reads* files.'
    if(!existsSync("./README.MD")) {
        writeFileSync("README.MD", "blah");
    }
}