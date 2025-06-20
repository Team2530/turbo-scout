package team2530.turbo_discord;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.OptionData;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.requests.restaction.CommandListUpdateAction;
import team2530.turbo_discord.commands.*;
import team2530.turbo_discord.store.DataStore;
import team2530.turbo_discord.store.FileStore;

import java.io.File;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.stream.Collectors;

import com.google.gson.Gson;

public class Main {

    public static final DataStore DATA_STORE = new DataStore(new File("./2025mshsl"));
    public static final FileStore FILE_STORE = new FileStore(new File("./2025mshsl-files"));

    private static final Gson gson = new Gson();
    public static final Team[] TEAMS = gson.fromJson(
        new InputStreamReader(
                Main.class.getResourceAsStream("/teams.json")
        ),
        Team[].class
    );

    public static Command[] COMMANDS = {
            new EchoCommand(),
            new EntryListCommand(),
            new ProgressCommand(),
            new ProgressMatchCommand(),
            new ViewCommand(),
            new CreateAssignmentCommand(),
            new SpreadsheetCommand(),
            new SpreadsheetPitCommand(),
            new SpreadsheetStrategyCommand()

    };

    public static void main(String[] args) {

        JDA jda = JDABuilder.createLight(EnvHelper.getDiscordBotToken(), EnumSet.allOf(GatewayIntent.class))
                .addEventListeners(new TurboListener())
                .setActivity(Activity.watching("everything"))
                .build();

        CommandListUpdateAction commands = jda.updateCommands();

        commands.addCommands(Arrays.stream(COMMANDS)
                .map(Main::getCommandData)
                .collect(Collectors.toList()));

        commands.queue();
    }

    /**
     * Converts a {@link Command} to a JDA {@link SlashCommandData}
     * @param command The command to convert
     * @return {@link SlashCommandData}
     */
    public static SlashCommandData getCommandData(Command command) {
        return Commands.slash(command.getName(), command.getDescription())
                .addOptions(Arrays.stream(command.getCommandOptions())
                        .map(Main::getOptionData)
                        .collect(Collectors.toList()));
    }

    /**
     * Converts a {@link CommandOption} to a JDA {@link OptionData}
     * @param option The option to convert.
     * @return {@link OptionData}
     */
    public static OptionData getOptionData(CommandOption option) {
        return new OptionData(option.getType(), option.getName(), option.getDescription(), option.isRequired());
    }
}
