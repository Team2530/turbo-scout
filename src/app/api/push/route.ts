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

    if (entryIds.length == data.length) return NextResponse.json({
        hash: checksum,
        entryIds: entryIds
    });

    return NextResponse.error();
}

function writeEntry(id: string, entry: Entry) {
    const { documentsDir } = useDataDir();

    writeFileSync(`${documentsDir}/${id}.turbo.json`, JSON.stringify(entry));
}

function useDataDir() {
    const dataDir = "./turbo-data"; // For config files, data is in subfolders.

    if (!existsSync(dataDir)) {
        mkdirSync(dataDir);
    }

    const documentsDir = "./turbo-data/documents"; // For document-based storage- e.g. entries

    if (!existsSync(documentsDir)) {
        mkdirSync(documentsDir);
    }

    return { dataDir: dataDir, documentsDir: documentsDir };
}
