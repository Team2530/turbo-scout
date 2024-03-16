/**
 * This route will return a compact version of all the collected data. It will probably be a PDF.
 */
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "The download route is not yet finished!"});
}