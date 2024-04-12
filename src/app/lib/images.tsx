"use server";

import { MD5 } from "crypto-js";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const IMAGE_DATA_DIR: string = "turbo-image";

export async function uploadImage(content: string) {
    if (!existsSync(IMAGE_DATA_DIR)) {
        mkdirSync(IMAGE_DATA_DIR);
    }

    const fileName = MD5(content).toString();

    writeFileSync(IMAGE_DATA_DIR + "/" + fileName, content);

    return fileName;
}