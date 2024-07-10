import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {

    if (params.id.length > 35 || params.id.length < 32) return NextResponse.error();
    if (params.id.includes("/")) return NextResponse.error();

    return new NextResponse(readFileSync("./turbo-image/" + params.id));
}