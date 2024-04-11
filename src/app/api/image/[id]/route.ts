import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    if (params.id.length > 300) return NextResponse.error(); //TODO: MD5 hashes are probably all the same length, so checking against that would be better.
    if (params.id.includes("/")) return NextResponse.error(); //TODO: make this more secure

    return NextResponse.json({ content: readFileSync("./turbo-image/" + params.id, { encoding: 'utf8' }) });
}