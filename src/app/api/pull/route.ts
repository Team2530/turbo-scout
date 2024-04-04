"use server";

/**
 * This route returns all data on the server.
 */
import { existsSync, writeFileSync } from "fs";
import { readFile, readdir } from "fs/promises";
import { NextResponse } from "next/server";

export async function GET() {
    const dataDir: string = "./turbo-data/";

    return await readdir(dataDir, {}).then(async (files: string[]) => {
        return NextResponse.json((await Promise.all(files.map(async (filePath: string) => {
            let json = JSON.parse(await readFile(dataDir + filePath, { encoding: 'utf8', flag: 'r' }));
            if(json != undefined && json != null 
                && Object.keys(json).includes("data") 
                && json['data'] != null 
                && Object.keys(json['data']).includes('Photos') 
                && json['data']['Photos'] != null) {
                json["data"]["Photos"] = undefined;
            }
            
            return json;
        }))).flat());
    });
}

export async function POST() {
    //TODO: do this in a better way
    // The purpose of this function is to prevent NextJS from 
    // taking a look at this file and saying: 'Oh hey, that looks like it can be exported statically because it only *reads* files.'
    if (!existsSync("./README.MD")) {
        writeFileSync("README.MD", "blah");
    }
}