/**
 * This route will return all of the data on the server.
 */
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "The pull route is not yet finished!"});
}