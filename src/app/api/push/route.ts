/**
 * This route allows the client to send data with the server
 */
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "The push route is not yet finished!"});
}