package team2530.turbo_discord.commands;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.Main;

import java.util.stream.Collectors;

public class EntryListCommand extends Command {
    public EntryListCommand() {
        super("entrylist", "Display a (large) list of all the entries");
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        final String contents = String.join("\n", Main.DATA_STORE.getEntries().stream()
                .map(entry -> String.format("%s entry for team %d by %s",
                        entry.getType(), entry.getTeamNumber(), entry.getUser()))
                .collect(Collectors.toList()));

        event.reply(contents).queue();
    }
}
