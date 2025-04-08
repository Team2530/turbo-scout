package team2530.turbo_discord.commands;

import java.util.Objects;
import java.io.BufferedReader;
import java.io.IOException; 
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets; 
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.Base64;
import java.util.Iterator;
import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName; 
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.utils.FileUpload;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;
import team2530.turbo_discord.store.DataStore;
import team2530.turbo_discord.Main;

public class ViewCommand extends Command {

    public ViewCommand() {
        super(
                "view",
                "View data json",
                new CommandOption[]{
                        new CommandOption(OptionType.INTEGER, "team", "Filter by team", true)
                }
        );
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        Stream<DataStore.Entry> entryStream = Main.DATA_STORE.getEntries().stream();

        OptionMapping teamOption = event.getOption("team");
        if (teamOption == null) {
             event.reply("Error: Team number is required.").setEphemeral(true).queue();
             return;
        }
        int teamNumber = teamOption.getAsInt();

        entryStream = entryStream.filter(entry -> entry.getTeamNumber() == teamNumber);

        List<DataStore.Entry> entries = entryStream
            .sorted((entryA, entryB) -> entryA.getType().compareTo(entryB.getType()))
            .collect(Collectors.toList());
        

        // String s = gson.toJson(entries); // Keep commented if humanize is preferred
        String s = humanize(entries);
	    
        String imgLink = getFiles(s) == null ? " " : getFiles(s);
        String epa = "EPA data unavailable."; // Default message
        try{
            epa = getEPA(teamNumber); // Use the extracted teamNumber
        }
        catch(IOException e) {
            System.err.println("IOException fetching EPA for team " + teamNumber + ": " + e.getMessage());
            // Optionally log the stack trace: e.printStackTrace();
             epa = "Error fetching EPA data (IOException).";
        }
        catch(Exception e) { // Catch other potential runtime exceptions during EPA fetching/parsing
             System.err.println("Unexpected error fetching EPA for team " + teamNumber + ": " + e.getMessage());
             // Optionally log the stack trace: e.printStackTrace();
             epa = "Error fetching EPA data (Unexpected).";
        }


        String replyContent = "```markdown\n" + s + "\n" + epa + "\n```" + imgLink; // Combine humanized data and EPA

        if (replyContent.length() < 1950) { // Discord limit is 2000, leave some buffer
             event.reply(replyContent).queue();
        } else {
             // If the combined content is too long, send humanized data as file and EPA in message
             event.reply(epa) // Send EPA data first
                  .addFiles(FileUpload.fromData(s.getBytes(StandardCharsets.UTF_8), "turbo-view-" + teamNumber + ".md")) // Then attach the file
                  .queue();
             // Or send both as files if EPA string can also be long
             // event.replyFiles(
             //     FileUpload.fromData(s.getBytes(StandardCharsets.UTF_8), "turbo-view-" + teamNumber + ".md"),
             //     FileUpload.fromData(epa.getBytes(StandardCharsets.UTF_8), "turbo-epa-" + teamNumber + ".txt")
             // ).queue();
        }

        // Consider sending files after the initial reply confirmation for better user experience
        // However, the current logic sends them within the execute method.
        List<String> fileIds = getFileIds(entries);
        fileIds.forEach(fileId -> {
            try {
                 Main.FILE_STORE.getFileURL(fileId).ifPresent(fileURL ->
                     event.getChannel().sendMessage(fileURL).queue()
                 );
            } catch (Exception e) {
                 System.err.println("Error sending file with ID " + fileId + ": " + e.getMessage());
                 // Maybe notify user on Discord? event.getChannel().sendMessage("Failed to send file: " + fileId).queue();
            }
        });
    }

    /**
     * Makes a list of entries more human readable
     */
    public static String humanize(List<DataStore.Entry> entries) {
        StringBuilder sb = new StringBuilder();
        if (entries.isEmpty()) {
            return "No data entries found for this team.";
        }

        for (DataStore.Entry entry : entries) {
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
        }

        return sb.toString();
    }


String getFiles(String data) {
    if (data == null) {
        return null; 
    }

    int markerIndex = data.indexOf("photos: [");

    if (markerIndex == -1) {
        System.err.println("No luck finding file hash");
        return null; 
    }

    int beginChar = markerIndex + 9;
    int endChar = data.indexOf(']', beginChar);

    String fileHash;
    if (endChar == -1) {
        fileHash = "Error! endChar is -1"; 
	return null;
    } else {
        fileHash = data.substring(beginChar, endChar).trim();
    }

    if (fileHash.isEmpty()) {
         System.err.println("Extracted file hash is empty.");
         return null;
    }

    String url = "https://images.goonsite.org/" + fileHash + ".png";
    return url;
}

    // --- New Data Classes for Statbotics Response ---
    static class StatboticsTeamYearResponse {
        int team;
        int year;
        String name;
        String country;
        String state;
        String district; // Can be null
        Epa epa; // Nested EPA object
        TeamRecord record; // Nested Record object
        Competing competing; // Nested Competing object
        // Add other fields if needed (e.g., district_points, district_rank)
    }

    static class Epa {
        Breakdown breakdown;
    }

    static class Breakdown {
        double total_points;
        double auto_points;
        double teleop_points;
        double endgame_points;
    }

    static class TeamRecord {
        int wins;
        int losses;
        int ties;
        int count;
        double winrate;
    }

     static class Competing {
         @SerializedName("this_week") // Use if Java variable name differs from JSON key
         boolean thisWeek;
         String next_event_key;
         String next_event_name;
         int next_event_week;
     }
    // Add more nested classes if you need fields from 'breakdown', etc.

    // --- End of Data Classes ---


    public static String getEPA(int teamNum) throws IOException { // Added throws IOException
        String usersURL = "https://api.statbotics.io/v3/team_year/" + teamNum + "/2025"; // Still hardcoded 2025 - consider making dynamic?
        URL url = new URL(usersURL);
        HttpURLConnection conn = null;
        String epaString = "EPA N/A"; // Default value

        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            // Optional: Set connect and read timeouts
            conn.setConnectTimeout(2000);
            conn.setReadTimeout(2000); 


            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                 System.err.println("Statbotics API Error: HTTP " + responseCode + " for URL: " + usersURL);
                // Read error stream for more details if available
                try (InputStreamReader errIn = new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8);
                     BufferedReader errBr = new BufferedReader(errIn)) {
                     StringBuilder errorResponse = new StringBuilder();
                     String errorLine;
                     while ((errorLine = errBr.readLine()) != null) {
                         errorResponse.append(errorLine.trim());
                     }
                     System.err.println("Statbotics Error Body: " + errorResponse.toString());
                 } catch (Exception e) { /* Ignore if error stream is unavailable */ }

                 return "Error fetching EPA: HTTP " + responseCode; // Return error message
            }

            // Use try-with-resources for readers
            StringBuilder response = new StringBuilder();
            try (InputStreamReader in = new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8);
                 BufferedReader br = new BufferedReader(in)) {

                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            } // Readers are auto-closed here

            String completeJsonResponse = response.toString();
            // System.out.println("Statbotics Response: " + completeJsonResponse); // Keep for debugging if needed

            if (!completeJsonResponse.isEmpty()) {
                Gson gson = new Gson();
                try {
                    StatboticsTeamYearResponse stats = gson.fromJson(completeJsonResponse, StatboticsTeamYearResponse.class);

                    if (stats != null && stats.epa != null) {
                        epaString = "EPA Total: " + String.format("%.2f", stats.epa.breakdown.total_points);
                        epaString += "\nAuto EPA: " + String.format("%.2f", stats.epa.breakdown.auto_points);
                        epaString += "\nTeleop EPA: " + String.format("%.2f", stats.epa.breakdown.teleop_points);
                        epaString += "\nEndgame EPA: " + String.format("%.2f", stats.epa.breakdown.endgame_points);
                    } else {
                        epaString = "EPA data structure incomplete in response.";
                    }

                } catch (com.google.gson.JsonSyntaxException e) {
                    // This error should be less likely now, but good to keep
                    System.err.println("Failed to parse JSON from Statbotics: " + e.getMessage());
                    System.err.println("Received JSON: " + completeJsonResponse); // Log the problematic JSON
                    epaString = "Error parsing EPA JSON data.";
                } catch (Exception e) { // Catch potential NullPointerExceptions if structure is missing parts
                     System.err.println("Error processing parsed Statbotics data: " + e.getMessage());
                     epaString = "Error processing EPA data.";
                }
            } else {
                epaString = "Empty response from Statbotics.";
            }

        } finally {
            if (conn != null) {
                conn.disconnect(); // Disconnect the connection
            }
        }
        return epaString; // Return the processed string
    }


    private List<String> getFileIds(List<DataStore.Entry> entries) {
        List<String> images = new ArrayList<>();

        for (DataStore.Entry entry : entries) {
             if (entry == null || entry.getData() == null) continue; // Add null checks

            Object filesObj;
            if ("strategy".equals(entry.getType()) && (filesObj = entry.getData().get("files")) != null) {
                 // Handle case where "files" might be a single String or a Collection
                 if (filesObj instanceof String) {
                     images.add((String) filesObj);
                 } else if (filesObj instanceof Collection) {
                     // Assuming it's a Collection of Strings. Add type safety if possible.
                     try {
                          images.addAll((Collection<? extends String>) filesObj);
                     } catch (ClassCastException e) {
                          System.err.println("Warning: 'files' field in strategy entry is not a String or Collection of Strings.");
                     }
                 }
            } else if ("pit".equals(entry.getType()) && entry.getData().containsKey("photos")) {
                Object photosObj = entry.getData().get("photos");
                 if (photosObj instanceof Collection) {
                     // Assuming it's a Collection of Strings. Add type safety if possible.
                      try {
                           images.addAll((Collection<? extends String>) photosObj);
                      } catch (ClassCastException e) {
                           System.err.println("Warning: 'photos' field in pit entry is not a Collection of Strings.");
                      }
                 } else if (photosObj != null) {
                     System.err.println("Warning: 'photos' field in pit entry is not a Collection.");
                 }
            }
        }
        return images;
    }
}
