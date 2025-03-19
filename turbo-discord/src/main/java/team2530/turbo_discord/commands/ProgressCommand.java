package team2530.turbo_discord.commands;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.Main;
import team2530.turbo_discord.Team;

public class ProgressCommand extends Command {
    private final Team[] teamList = Main.TEAMS;

    public ProgressCommand() {
        super(
            "progress", 
            "Get a list of teams that still need to be pit scouted"
        );
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        Stream<Team> teams = Arrays.stream(teamList);

        teams = teams.filter(team -> !hasPitEntry(team.getTeamNumber()));

        event.reply("Unscouted pit teams:\n" + String.join("\n", teams.map(team -> String.format("%d: %s", team.getTeamNumber(), team.getNickname())).collect(Collectors.toList()))).queue();
    }

    private static boolean hasPitEntry(int number) {
        return Main.DATA_STORE.getEntries().stream().anyMatch(entry -> entry.getTeamNumber() == number && entry.getType().equals("pit"));
    }

}
