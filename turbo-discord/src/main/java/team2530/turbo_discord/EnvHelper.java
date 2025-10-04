package team2530.turbo_discord;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

public class EnvHelper {

    /**
     * Gets the discord token from a .env file.
     *
     * @return The discord bot token
     */
    public static String getDiscordBotToken() {
        final Path path = Paths.get(".env");
        final String key = "DISCORD_BOT_TOKEN";

        if (!path.toFile().exists())
            throw new RuntimeException(
                    "Cannot load '.env' file! Please create a .env file with the discord bot token.");

        try (BufferedReader reader = new BufferedReader(new FileReader(path.toFile()))) {
            String line = reader.readLine();

            while (line != null) {
                if (line.startsWith(key))
                    return line.substring(key.length() + 1); // The +1 accounts for the equals sign
                line = reader.readLine();
            }
        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to load '.env' file! Make sure that it exists and has your discord bot token!", e);
        }

        throw new RuntimeException(String.format("Could not find '%s'!", key));
    }

}
