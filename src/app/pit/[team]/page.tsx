export default function TeamPitScouting({ params }: { params: { team: string } }) {
    return <p>This is the pit scouting menu for team {params.team}</p>;
}