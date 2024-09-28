package team2530.turbo_discord.commands;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import team2530.turbo_discord.Command;

public class ProgressCommand extends Command {
    private static final Gson gson = new GsonBuilder().create();

    public ProgressCommand() {
        super("progress", "Get a list of teams that still need to be pit scouted");
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        //this.getClass().getResourceAsStream("/teams.json");
    }
}
