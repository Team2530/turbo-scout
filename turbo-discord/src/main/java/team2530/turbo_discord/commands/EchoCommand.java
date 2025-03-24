package team2530.turbo_discord.commands;

import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;

public class EchoCommand extends Command {

    public EchoCommand() {
        super("echo", "Tell the turbo-scout bot to say something",
                new CommandOption(OptionType.STRING, "message", "The message for the bot to send.", true));
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        if(event.getMember().hasPermission(Permission.ADMINISTRATOR))
            event.reply(event.getOption("message", OptionMapping::getAsString)).queue();
    }
}
