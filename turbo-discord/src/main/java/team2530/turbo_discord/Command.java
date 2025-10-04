package team2530.turbo_discord;

import net.dv8tion.jda.api.events.interaction.ModalInteractionEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent;

/**
 * Encapsulates the execution logic, metadata and options of a JDA command.
 */
public abstract class Command {
    protected final String name;
    protected final String description;

    protected final CommandOption[] commandOptions;
    protected final ComponentOption[] componentOptions;

    public Command(
            String name,
            String description) {
        this.name = name;
        this.description = description;
        this.commandOptions = new CommandOption[] {};
        this.componentOptions = new ComponentOption[] {};
    }

    public Command(
            String name,
            String description,
            CommandOption[] commandOptions) {
        this.name = name;
        this.description = description;
        this.commandOptions = commandOptions;
        this.componentOptions = new ComponentOption[] {};
    }

    public Command(
            String name,
            String description,
            CommandOption[] commandOptions,
            ComponentOption[] componentOptions) {
        this.name = name;
        this.description = description;
        this.commandOptions = commandOptions;
        this.componentOptions = componentOptions;
    }

    /**
     * Runs an arbitrary command
     */
    public abstract void execute(SlashCommandInteractionEvent event);

    /**
     * Called when a command's component options match a string select menu
     * interaction
     */
    public void stringSelectExecute(StringSelectInteractionEvent event) {
    };

    /**
     * Called when a command's component options match a button interaction
     */
    public void buttonExecute(ButtonInteractionEvent event) {
    };

    /**
     * Called when a command's component options match a modal submission
     */
    public void modalSubmitExecute(ModalInteractionEvent event) {
    };

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
    public CommandOption[] getCommandOptions() {
        return commandOptions;
    }

    /**
     * @return An array of {@link ComponentOptions}'s for this command.
     */
    public ComponentOption[] getComponentOptions() {
        return componentOptions;
    }
}
