package team2530.turbo_discord.commands;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;
import team2530.turbo_discord.Main;
import team2530.turbo_discord.Team;
import team2530.turbo_discord.store.DataStore;

public class ReportCommand extends Command {
    public ReportCommand() {
        super("report", "Generate a report",
                new CommandOption[] {
                        new CommandOption(OptionType.INTEGER, "match_number", "The match number", true),
                        new CommandOption(OptionType.INTEGER, "red1", "Red 1", true),
                        new CommandOption(OptionType.INTEGER, "red2", "Red 2", true),
                        new CommandOption(OptionType.INTEGER, "red3", "Red 3", true),
                        new CommandOption(OptionType.INTEGER, "blue1", "Blue 1", true),
                        new CommandOption(OptionType.INTEGER, "blue2", "Blue 2", true),
                        new CommandOption(OptionType.INTEGER, "blue3", "Blue 3", true),
                });
    }

    /**
     * @param event The {@link SlashCommandInteractionEvent} object
     * @param key   The 'name' of the option to lookup
     * @return The integer value, or 0 if there is none.
     */
    public int getIntOption(SlashCommandInteractionEvent event, String position) {
        OptionMapping teamOption = event.getOption(position);
        if (teamOption == null) {
            return 0;
        }
        return teamOption.getAsInt();
    }

    public Team getTeam(int teamNumber) {
        return Arrays.stream(Main.TEAMS).filter(team -> team.getTeamNumber() == teamNumber).findFirst().orElse(null);
    }

    public List<DataStore.Entry> getEntries(int teamNumber) {
        return Main.DATA_STORE.getEntries().stream()
                .filter(entry -> entry.getTeamNumber() == teamNumber)
                .collect(Collectors.toList());
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        int matchNumber = getIntOption(event, "match_number");
        int r1 = getIntOption(event, "red1");
        int r2 = getIntOption(event, "red2");
        int r3 = getIntOption(event, "red3");
        int b1 = getIntOption(event, "blue1");
        int b2 = getIntOption(event, "blue2");
        int b3 = getIntOption(event, "blue3");

        int[] redAlliance = { r1, r2, r3 };
        int[] blueAlliance = { b1, b2, b3 };
        int[][] alliances = { redAlliance, blueAlliance };

        StringBuilder out = new StringBuilder();

        out.append("# Match Report for Q").append(matchNumber).append("\n\n");

        boolean swap = false;

        for (int[] alliance : alliances) {
            out.append("## ").append(swap ? "Blue" : "Red").append(" Alliance").append("\n");
            swap = true;

            for (int teamNumber : alliance) {

                Team team = getTeam(teamNumber);

                if (team == null) {
                    out.append("ERROR: Missing team in teams list! Double check that team " + teamNumber
                            + " is at this event.\n");
                    continue;
                }

                out.append("### ").append(teamNumber).append(": ").append(team.getNickname()).append("\n");
                try {
                    String epa = ViewCommand.getEPA(teamNumber);
                    out.append(epa).append("\n");
                } catch (IOException e) {
                    e.printStackTrace();
                    out.append("Failed to find EPA\n");
                }

                // TODO: images

                List<DataStore.Entry> entries = getEntries(teamNumber);

                DataStore.Entry pitEntry = entries.stream().filter(entry -> entry.getType().equals("pit")).findFirst()
                        .orElse(null);

                if (pitEntry != null) {
                    out.append("```\n");
                    out.append(entryToString(pitEntry));
                    out.append("```\n");
                }

            }

        }

        event.reply(out.toString()).queue();
    }

    public String entryToString(DataStore.Entry entry) {
        StringBuilder sb = new StringBuilder();
        sb.append("---\n");
        sb.append("type: ").append(entry.getType()).append("\n");
        sb.append("user: ").append(entry.getUser()).append("\n");
        sb.append("timestamp: ").append(entry.getTimestamp()).append("\n");
        sb.append("\n");

        if (entry.getData() != null) { // Check if data map exists
            for (Map.Entry<String, Object> data : entry.getData().entrySet()) {
                sb.append("- ").append(data.getKey()).append(": ").append(data.getValue()).append("\n");
            }
        } else {
            sb.append("- No data associated with this entry.\n");
        }

        sb.append("\n");
        return sb.toString();
    }
}
