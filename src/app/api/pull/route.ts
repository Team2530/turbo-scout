"use server";

import { existsSync, writeFileSync } from "fs";
import { NextResponse } from "next/server";

export async function GET() {
    return new NextResponse("The pull route does not exist.");
}

export async function POST() {
    //TODO: do this in a better way
    // The purpose of this function is to prevent NextJS from 
    // turning this route into a static file
    if (!existsSync("./README.MD")) {
        writeFileSync("README.MD", "blah");
    }
}