import { AreaChart } from "@mantine/charts";
import { Container, SimpleGrid, Stack, Title, Paper, Accordion } from "@mantine/core";
import { MD5 } from "crypto-js";
import { TurboImage } from "./turbo-image";
import { useTurboScoutData } from "../lib/server";
import { useExtendedTBA } from "../lib/tba_api";
import { EntryViewer } from "./entries";

export function TeamViewer(props: { team: any }) {
    const team: any = props.team;
    const data: any[] = useTurboScoutData();
    const tbaData: any = useExtendedTBA();

    const pitEntries = data
        .filter(entry => entry['type'] == 'pit')
        .filter(entry => entry['team'] == team['key'].substring(3));

    const matchEntries = data
        .filter(entry => entry['type'] == 'match')
        .filter(entry => entry['team'] == team['key'].substring(3));

    const noteEntries = data
        .filter(entry => entry['type'] == 'note')
        .filter(entry => entry['team'] == team['key'].substring(3));

    //TODO: use match data entries [comments, etc.]
    //TODO: use the blue alliance data

    return <Stack align="stretch">
        <Title order={2}>Team {team['key'].substring(3)}: {team['nickname']}</Title>
        {noteEntries.map(note => <NoteDisplay note={note} />)}
        {pitEntries.map(pitEntry => <PitDataDisplay entry={pitEntry} key={pitEntry['timestamp'] + "." + pitEntry['team']} />)}
        <ChartDataDisplay team={team} matchEntries={matchEntries} tbaData={tbaData} />
        <MatchDataDisplay matches={matchEntries} />
    </Stack>
}

function MatchDataDisplay(props: {matches: any[]}) {

    const { matches } = props;

    return <Accordion>
        {matches.map((match: any) => {
            return <Accordion.Item key={match['timestamp']} value={match['timestamp'] + match['user']}>
                <Accordion.Control>Match {match['matchNumber']}</Accordion.Control>
                <Accordion.Panel><EntryViewer entry={match} /></Accordion.Panel>
            </Accordion.Item>
        })}
    </Accordion>
}

function NoteDisplay(props: { note: any }) {
    const { note } = props;
    return <Paper key={`note-${note['timestamp']}-${note['user']}`} withBorder p="lg">
        Note by {note['user']}
        <br /><br />
        {note['data']['text']}
        {note['data']['photos'] && note['data']['photos'].map((image: string) => <TurboImage src={image} key={image} w={200} />)}
    </Paper>
}

function PitDataDisplay(props: { entry: any }) {
    //TODO: add more data
    //TODO: make it look nicer
    return <Container>
        <Title order={4}>Pit Data Entry</Title>
        <p>Scouted by {props.entry['user']}</p>
        {Object.entries(props.entry['data']).map(([category, values]: any) => {
            return <Stack key={category}>
                <Title order={5}>{category}</Title>
                {Object.entries(values).map(([question, answer]: any) => {
                    if (category == "Photos") {
                        return <SimpleGrid cols={4} key={question}>
                            {answer.map((image: string) => {
                                return <TurboImage src={image} key={MD5(image).toString()} w={100} />
                            })}
                        </SimpleGrid>
                    }
                    return <p key={question}>{question} {answer}</p>
                })}
            </Stack>
        })}
    </Container>
}

function extractFromEntry(entry: any, path: string[]) {
    if (entry == null || entry == undefined) return undefined;

    let current = entry;

    for (const pathPart of path) {
        if (current[pathPart] == undefined) return undefined;
        current = current[pathPart];
    }

    return current;
}

function ChartDataDisplay(props: { team: any, matchEntries: any[], tbaData: any }) {
    const data: any[] = props.matchEntries;

    //TODO: get tba data for charts

    const charts = [
        {
            "name": "Speaker notes in auto",
            "extract": (entry: any) => extractFromEntry(entry, ["data", "During Match", "How many notes did they score in the speaker during auto?"]),
            "tba": (entry: any) => 0
        },
        {
            "name": "Amp notes in auto",
            "extract": (entry: any) => extractFromEntry(entry, ["data", "During Match", "How many notes did they score in the amp during auto?"]),
            "tba": (entry: any) => 0
        },
        {
            "name": "Speaker notes in teleop",
            "extract": (entry: any) => extractFromEntry(entry, ["data", "During Match", "How many notes did they score in the speaker during teleop?"]),
            "tba": (entry: any) => 0
        },
        {
            "name": "Amp notes in teleop",
            "extract": (entry: any) => extractFromEntry(entry, ["data", "During Match", "How many notes did they score in the amp during teleop?"]),
            "tba": (entry: any) => 0
        }
    ];

    return <>
        {charts.map((chart: any) => {
            return <ChartDisplay value={chart['name']} matchEntries={data} tbaData={props.tbaData} extract={chart['extract']} tbaExtract={chart['tba']} key={chart['name']} />
        })}
    </>
}

function ChartDisplay(props: { value: string, matchEntries: any[], tbaData: any, extract: any, tbaExtract: any }) {
    const teleopSpeakerNotes = props.matchEntries.map((entry: any) => {
        return {
            "Turbo Scout": props.extract(entry),
            "Blue Alliance": props.tbaExtract(entry),
            "Match Number": entry['matchNumber']
        }
    });

    return <>
        <Title order={5}>{props.value}</Title>
        <AreaChart h={300} data={teleopSpeakerNotes} dataKey="Match Number" series={[
            { name: "Turbo Scout", color: 'blue' },
            // { name: "Blue Alliance", color: 'indigo' } //TODO: fix this
        ]}
            curveType="monotone"
            tickLine="xy"
            xAxisLabel="Match Number"
            yAxisLabel={props.value}
            withXAxis
        />
    </>
}