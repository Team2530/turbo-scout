import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

// { params }: { params: { slug: string } }
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    if (params.id.includes("/")) return NextResponse.error(); //TODO: make this more secure

    const content: string = readFileSync("./turbo-image/" + params.id, { encoding: 'utf8' });
    return NextResponse.json({ content: content });
}