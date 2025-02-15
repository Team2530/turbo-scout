package team2530.turbo_discord.commands;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.Main;

public class ProgressCommand extends Command {
    private static final Gson gson = new GsonBuilder().create();

    public ProgressCommand() {
        super("progress", "Get a list of teams that still need to be pit scouted");
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        InputStream is = this.getClass().getResourceAsStream("/teams.json");
        Stream<Team> teams = Arrays.stream(gson.fromJson(new InputStreamReader(is), Team[].class));

        teams = teams.filter(team -> !hasPitEntry(team.team_number));

        event.reply("Unscouted pit teams:\n" + String.join("\n", teams.map(team -> String.format("%d: %s", team.team_number, team.nickname)).collect(Collectors.toList()))).queue();
    }

    private static boolean hasPitEntry(int number) {
        return Main.DATA_STORE.getEntries().stream().anyMatch(entry -> entry.getTeamNumber() == number && entry.getType().equals("pit"));
    }

    public static class Team {
        private final int team_number;
        private final String nickname;

        public Team(int n, String nickname) {
            this.team_number = n;
            this.nickname = nickname; 
        }

        public String getNickname() {
            return nickname;
        }

        public int getTeamNumber()  { return this.team_number; }
    }
}
