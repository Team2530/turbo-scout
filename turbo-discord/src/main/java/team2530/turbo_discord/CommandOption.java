package team2530.turbo_discord;

import net.dv8tion.jda.api.interactions.commands.OptionType;

public class CommandOption {
    private final OptionType type;

    private final String name;

    private final String description;

    private final boolean required;

    public CommandOption(OptionType type, String name, String description, boolean required) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.required = required;
    }

    /**
     * @return The {@link OptionType} for this option.
     */
    public OptionType getType() {
        return type;
    }

    /**
     * @return The option name
     */
    public String getName() {
        return name;
    }

    /**
     * @return A short description of the option
     */
    public String getDescription() {
        return description;
    }

    public boolean isRequired() {
        return required;
    }
}
