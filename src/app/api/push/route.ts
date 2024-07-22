import { MD5 } from "crypto-js";
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync, writeFileSync } from "fs";

interface Entry {
    type: string;
    user: string;
    team: string;
    event: string;
    timestamp: string;
    data: any;
}

const prismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
    const contentType: string | null = request.headers.get("Content-Type");

    if (contentType == null) return NextResponse.error();

    if (contentType === "application/json") {
        return handleDocuments(request);
    } else if (contentType.startsWith("image")) {
        return handleImage(request);
    }
    return NextResponse.error();
}

async function handleDocuments(request: NextRequest): Promise<Response> {
    const data: Entry[] = await request.json();
    const checksum = MD5(JSON.stringify(data)).toString();

    const entryIds = (await prismaClient.entry.createManyAndReturn({
        data: data.map(entry => ({
            type: entry.type,
            teamNumber: parseInt(entry.team)
        })),
        select: {
            id: true
        }
    })).map(entry => entry.id);

    entryIds.forEach((id, index) => writeEntry(id, data[index]));

    if (entryIds.length == data.length) {
        return NextResponse.json({
            hash: checksum,
            entryIds: entryIds
        })
    }

    return NextResponse.error();
}

async function handleImage(request: NextRequest): Promise<Response> {
    const imageContents: string = await request.text();
    const { imagesDir } = getDataDir();

    const id: string = (await prismaClient.image.create({ select: { id: true } })).id;

    writeFileSync(`${imagesDir}/${id}.turbo.image`, imageContents);

    const checksum = MD5(JSON.stringify(imageContents)).toString();

    return NextResponse.json({
        id: id,
        checksum: checksum
    });
}

function writeEntry(id: string, entry: Entry) {
    const { documentsDir } = getDataDir();

    writeFileSync(`${documentsDir}/${id}.turbo.json`, JSON.stringify(entry));
}

function getDataDir() {
    const dataDir = "./turbo-data"; // For config files, data is in subfolders.

    if (!existsSync(dataDir)) {
        mkdirSync(dataDir);
    }

    const documentsDir = "./turbo-data/documents"; // For document-based storage- e.g. entries

    if (!existsSync(documentsDir)) {
        mkdirSync(documentsDir);
    }

    const imagesDir = "./turbo-data/images";

    if (!existsSync(imagesDir)) {
        mkdirSync(imagesDir);
    }

    return { dataDir: dataDir, documentsDir: documentsDir, imagesDir: imagesDir };
}
