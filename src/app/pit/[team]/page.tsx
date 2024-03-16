export default function TeamPitScouting({ params }: { params: { team: string } }) {
    return <p>This is the menu for team {params.team}</p>;
}