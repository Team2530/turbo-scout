package team2530.turbo_discord;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.util.Arrays;

public class TurboListener extends ListenerAdapter {
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        final Command command = Arrays.stream(Main.COMMANDS)
                .filter(c -> c.getName().equals(event.getName()))
                .findFirst()
                .orElseThrow(RuntimeException::new);

        command.execute(event);
    }
}
