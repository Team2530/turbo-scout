// Returns data from team 4198. This needs to be in the server code because of cross-origin protections.

// import { existsSync, writeFileSync } from "fs";
// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({message: "This route has been shut down for worlds!"});
}

// export async function GET() {
//     return await fetch("https://data.team4198.org/scouting_data/current/data.csv").then(async (resp: Response) => {
//         const content = await resp.text();

//         console.log("got " + content.length + " bytes from robocat data server");
//         return NextResponse.json({"content": content});
//     }).catch((err) => {
//         return NextResponse.error();
//     });
// }

// export async function POST() {
//     //TODO: do this in a better way
//     // The purpose of this function is to prevent NextJS from 
//     // taking a look at this file and saying: 'Oh hey, that looks like it can be exported statically because it only *reads* files.'
//     if(!existsSync("./README.MD")) {
//         writeFileSync("README.MD", "blah");
//     }
// }