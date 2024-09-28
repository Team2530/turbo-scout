package team2530.turbo_discord;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;

/**
 * Encapsulates the execution logic, metadata and options of a JDA command.
 */
public abstract class Command {
    protected final String name;
    protected final String description;

    protected final CommandOption[] options;

    public Command(String name, String description, CommandOption... options) {
        this.name = name;
        this.description = description;
        this.options = options;
    }

    /**
     * Runs an arbitrary command
     */
    public abstract void execute(SlashCommandInteractionEvent event);

    /**
     * @return The command name
     */
    public String getName() {
        return name;
    }

    /**
     * @return A short description of the command.
     */
    public String getDescription() {
        return description;
    }

    /**
     * @return An array of {@link CommandOption}'s for this command.
     */
    public CommandOption[] getOptions() {
        return options;
    }
}
