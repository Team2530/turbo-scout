package team2530.turbo_discord.commands;


import java.time.LocalDateTime;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.Main;
import team2530.turbo_discord.Team;
import java.util.stream.IntStream;

public class ProgressMatchCommand extends Command {
    private static final int[] DIVISION_TEAMS = {
16, 34, 59, 176, 180, 190, 201, 233, 353, 498, 620, 706, 834, 971, 1002, 1218, 1501, 1538, 1540, 1561, 1625, 1792, 1868, 1986, 2230, 2370, 2530, 2614, 2813, 2883, 2992, 3035, 3128, 3459, 3506, 3536, 3572, 3863, 3990, 4039, 4135, 4381, 4476, 4522, 4680, 4946, 5348, 5411, 5712, 5847, 6401, 6429, 6436, 6574, 6989, 7539, 7558, 7709, 7769, 8214, 8503, 8573, 8708, 8711, 9008, 9016, 9037, 9077, 9140, 9483, 9692, 9785, 10011, 10589, 10690
    };

    public ProgressMatchCommand() {
        super(
            "progressmatch",
            "Get a list of teams that still need to be match scouted"
        );
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
	IntStream intStream = Arrays.stream(DIVISION_TEAMS);
        Stream<Integer> teams = intStream.boxed();

        teams = teams.filter(team -> !hasPitEntry(team));

        event.reply(
                String.format("**Unscouted match teams as of %s**:\n", LocalDateTime.now()) +
                        teams.map(team ->
                                String.format("%d", team))
                                .collect(Collectors.joining("\n")))
                .queue();
    }

    private static boolean hasPitEntry(int number) {
        return Main.DATA_STORE.getEntries().stream()
                .anyMatch(entry -> entry.getTeamNumber() == number
                        && entry.getType().equals("match"));
    }

}
