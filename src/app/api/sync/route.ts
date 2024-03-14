import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "The sync route is not yet finished!"});
}