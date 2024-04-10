"use server";

import { MD5 } from "crypto-js";
import { existsSync, mkdirSync, writeFileSync } from "fs";

export async function uploadImage(content: string) {
    if (!existsSync("turbo-image")) {
        mkdirSync("turbo-image");
    }

    const fileName = MD5(content).toString();

    writeFileSync("turbo-image/" + fileName, content);

    return fileName;
}