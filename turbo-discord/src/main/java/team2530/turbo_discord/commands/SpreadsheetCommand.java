package team2530.turbo_discord.commands;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.utils.FileUpload;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.Main;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * This command generates a CSV (comma-separated values) spreadsheet of all match data and sends it back through discord.
 */
public class SpreadsheetCommand extends Command {
    public SpreadsheetCommand() {
        super("spreadsheet", "Generates a spreadsheet from match reports");
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {

        // The keys that will be in the spreadsheet.
        // TODO: put this in a config file
        String[] keys = {
                "match_number",
                "auto",
                "auto_scoring",
                "teleop_coral",
                "teleop_coral_dropped",
                "teleop_coral_locations",
                "teleop_algae",
                "teleop_algae_dropped",
                "teleop_algae_barge_processor",
                "endgame",
                "reefLocations",
                "comments",
                "performance"
        };

        FileUpload spreadsheetFile = FileUpload.fromData(("team,user,time," + String.join(",", keys) + "\n" + Main.DATA_STORE.getEntries().stream()
                        .filter(entry -> entry.getType().equals("match")).map(entry -> {
                            StringBuilder sb = new StringBuilder();

                            sb.append(entry.getTeamNumber()).append(",")
                                    .append(entry.getUser()).append(",")
                                    .append(entry.getTimestamp()).append(",");

                            for (String key : keys)
                                sb.append("\"").append(entry.getData().getOrDefault(key, "null")).append("\",");

                            return sb.toString();
                        }).collect(Collectors.joining("\n"))).getBytes(StandardCharsets.UTF_8),
                String.format("turbo-spreadsheet-%s.csv", LocalDateTime.now()));

        event.reply("Spreadsheet generated.")
                .addFiles(spreadsheetFile)
                .setTTS(true)
                .queue();
    }
}
