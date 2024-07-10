import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ "error_message": "You cannot GET this api route!" });
}

export async function POST() {
    return new NextResponse("The push route does not exist!");
}