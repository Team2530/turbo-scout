import { TBA_BASE, TBA_OPTS } from "@/app/lib/tba_api";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient();

interface TeamSimple {
    key: string;

    team_number: number;
    name: string;
    nickname: string;

    city: string;
    state_prov: string;
    country: string;
}

export async function GET(req: NextRequest) {
    const teams: TeamSimple[] = (await Promise.all([...Array(40).keys()].map(async (pageNumber) => {
        return await fetch(TBA_BASE + `/teams/${pageNumber}/simple`, TBA_OPTS).then(resp => resp.json());
    }))).flat();

    const result = await prismaClient.team.createMany({
        data: teams.map(team => ({
            id: team.team_number,
            name: team.nickname,
            city: team.city,
            state_prov: team.state_prov,
            country: team.country
        }))
    });

    return NextResponse.json({msg: "Added " + result.count + " teams!"});
}