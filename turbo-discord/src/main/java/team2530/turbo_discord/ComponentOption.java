package team2530.turbo_discord;

import net.dv8tion.jda.api.interactions.components.Component;

public class ComponentOption {

    private final Component.Type type;

    private final String idSuffix;

    public ComponentOption(Component.Type type, String idSuffix) {
        this.type = type;
        this.idSuffix = idSuffix;
    }

    public Component.Type getType() {
        return type;
    }

    public String getSuffix() {
        return idSuffix;
    }

}
