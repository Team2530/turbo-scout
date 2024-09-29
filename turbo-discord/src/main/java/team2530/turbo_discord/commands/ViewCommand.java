package team2530.turbo_discord.commands;

import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.utils.FileUpload;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;
import team2530.turbo_discord.DataStore;
import team2530.turbo_discord.Main;

public class ViewCommand extends Command {

    private static final Gson gson = new GsonBuilder().create();

    public ViewCommand() {
        super("view", "View data json", new CommandOption[] {
            new CommandOption(OptionType.INTEGER, "team", "Filter by team", true)
        });
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        Stream<DataStore.Entry> entries = Main.DATA_STORE.getEntries().stream();

        if (event.getOption("team") != null)
            entries = entries.filter(entry -> entry.getTeamNumber() == event.getOption("team", OptionMapping::getAsInt));
       
        String s = gson.toJson(entries.collect(Collectors.toList()));

        if (s.length() < 2000) {
            event.reply("```json\n" + s + "\n```").queue();
        } else {
            event.replyFiles(FileUpload.fromData(s.getBytes(StandardCharsets.UTF_8), "turbo-view-" + event.getOption("team").getAsInt() + ".json")).queue();
        }
    }
    
}
