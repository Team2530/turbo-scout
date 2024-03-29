/**
 * This route will return all of the data on the server.
 */
import { readFile, readFileSync, readdirSync } from "fs";
import { NextResponse } from "next/server";

export async function GET() {
    const dataDir = "./turbo-data/";
    let files = readdirSync(dataDir);
    return NextResponse.json(files.map((path: any) => readFileSync(dataDir+path, {encoding: 'utf-8', flag: 'r'})));
}