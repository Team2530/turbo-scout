package team2530.turbo_discord.commands;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.utils.FileUpload;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;
import team2530.turbo_discord.store.DataStore;
import team2530.turbo_discord.Main;

import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class EntryListCommand extends Command {
    public EntryListCommand() {
        super(
                "entries",
                "Display a list of entries",
                new CommandOption[] {
                        new CommandOption(OptionType.INTEGER, "team", "Filter by team number", false)
                });
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        Stream<DataStore.Entry> entries = Main.DATA_STORE.getEntries().stream();

        if (event.getOption("team") != null)
            entries = entries
                    .filter(entry -> entry.getTeamNumber() == event.getOption("team", OptionMapping::getAsInt));

        final String contents = entries
                .map(entry -> String.format("%s entry for team %d by %s",
                        entry.getType(), entry.getTeamNumber(), entry.getUser()))
                .collect(Collectors.joining("\n"));

        if (contents.length() < 2000) {
            event.reply("```\n" + contents + "\n```").queue();
        } else {
            event.replyFiles(FileUpload.fromData(contents.getBytes(StandardCharsets.UTF_8), "entrylist.txt")).queue();
        }

    }
}
