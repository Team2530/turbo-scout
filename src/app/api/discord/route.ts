import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers"
import { verifyKey } from "discord-interactions";

const verifySignature = async (body: any) => {
    const signature = headers()?.get('X-Signature-Ed25519') as string;
    const timestamp = headers()?.get('X-Signature-Timestamp') as string;
    const isValidRequest = verifyKey(JSON.stringify(body), signature, timestamp, process.env.NEXT_PRIVATE_DISCORD_PUBLIC_KEY!)
    if (!isValidRequest) {
        throw new ValidationException("Invalid request signature", 401);
    }
}

const handleResponse = async (body: any) => {
    const { data } = body;

    switch(data.name) {
        case "PING":
            return NextResponse.json({type: 1});
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        await verifySignature(body);
        return await handleResponse(body);
    } catch (e: any) {
        console.error("Error found while validating discord bot", e?.message);
        if (e.errorType === 'Validation') {
            return NextResponse.json({
                message: e.message
            }, {
                status: e.status
            })
        }
    }

}

class ValidationException extends Error {
    public errorType: string;
    public status: number;
    constructor(public message: string, public statusNumber: number) {
        super(message);
        this.errorType = 'Validation'
        this.status = statusNumber
    }
}