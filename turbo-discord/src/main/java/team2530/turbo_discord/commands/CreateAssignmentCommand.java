package team2530.turbo_discord.commands;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.interactions.components.selections.StringSelectMenu;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;
import team2530.turbo_discord.Main;
import team2530.turbo_discord.Team;

public class CreateAssignmentCommand extends Command{

    private final Team[] teams = Main.TEAMS;
    
    private final Map<String, String[]> instances = new HashMap<>();

    public CreateAssignmentCommand() {
        super(
            "assignment", 
            "Create a QR code containing assigned teams",
            new CommandOption[] {
                new CommandOption(OptionType.STRING, "teams", "Teams to assign", false),
            }
        );
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        String startValue = event.getOption("teams").getAsString();
        ArrayList<String> selectedTeams = startValue != null
            ? new ArrayList<>(Arrays.asList(
                startValue.replace(" ", "").split(",")
            ))
            : new ArrayList<>();
        
        String user = event.getUser().getId();
        StringSelectMenu.Builder selectMenu = StringSelectMenu.create(user + ".selectAssignment")
            .setPlaceholder("Choose teams") 
            .setRequiredRange(1, teams.length);

        for (Team team: teams) {
            selectMenu.addOption(
                team.getTeamNumber() + " - " + team.getNickname(), 
                String.valueOf(team.getTeamNumber())
            );    
        }
        selectMenu.setDefaultValues(selectedTeams);

        instances.put(user, selectedTeams.toArray(new String[selectedTeams.size()]));

        event.reply("Select teams:")
            .addActionRow(selectMenu.build())
            .addActionRow(
                Button.primary(user + ".completeAssignment", "Generate")
            );
    }

    @Override
    public void stringSelectExecute(StringSelectInteractionEvent event) {
        String eventId = event.getComponentId();
        List<String> values = event.getValues();
        instances.put(
            eventId.substring(0, eventId.lastIndexOf(".")), // cut the suffix
            values.toArray(new String[values.size()])
        );
    }

    @Override
    public void buttonExecute(ButtonInteractionEvent event) {
        // something something do later
    }
}
