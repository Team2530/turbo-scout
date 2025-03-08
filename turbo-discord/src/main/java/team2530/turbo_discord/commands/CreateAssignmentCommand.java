package team2530.turbo_discord.commands;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.dv8tion.jda.api.events.interaction.ModalInteractionEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.interactions.callbacks.IReplyCallback;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.components.ActionRow;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.interactions.components.text.TextInput;
import net.dv8tion.jda.api.interactions.components.text.TextInputStyle;
import net.dv8tion.jda.api.interactions.modals.Modal;
import net.dv8tion.jda.api.interactions.modals.ModalMapping;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;
import team2530.turbo_discord.ComponentOption;

public class CreateAssignmentCommand extends Command{

    private final Map<String, String[]> instances = new HashMap<>();

    private final Pattern inputPattern = Pattern.compile("\\d{1,5}");

    public CreateAssignmentCommand() {
        super(
            "assignment", 
            "Create a QR code containing assigned teams",
            new CommandOption[] {
                new CommandOption(OptionType.STRING, "teams", "Teams to assign", false),
            },
            new ComponentOption[] {
                new ComponentOption(".addAssignment"),
                new ComponentOption(".removeAssignment"),
                new ComponentOption(".completeAssignment"),
                new ComponentOption(".teamsAddedAssignment"),
                new ComponentOption(".teamsRemovedAssignment")
            }
        );
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        OptionMapping startValue = event.getOption("teams");

        ArrayList<String> selectedTeams = startValue != null
                ? new ArrayList<>(Arrays.asList(
                        startValue.getAsString().replace(" ", "").split(",")))
                : new ArrayList<>();

        String userId = event.getUser().getId();
        instances.put(userId, selectedTeams.toArray(new String[selectedTeams.size()]));

        standardReply(event);
    }
    
    private void standardReply(IReplyCallback event) {
        String userId = event.getUser().getId();

        event.reply(
                "Selected teams:\n```\n - "
                        + String.join("\n - ", instances.get(userId))
                        + "\n```\n")
                .addActionRow(
                        Button.success(userId + ".addAssignment", "Add"),
                        Button.danger(userId + ".removeAssignment", "Remove"),
                        Button.primary(userId + ".completeAssignment", "Generate"))
                .queue();
    }

    @Override
    public void buttonExecute(ButtonInteractionEvent event) {
        String id = event.getComponentId();
        String suffix = id.substring(id.lastIndexOf("."));
        
        switch (suffix) {
            case ".addAssignment":
                addAssignment(event);
                break;
            case ".removeAssignment":
                removeAssignment(event);
                break;
            case ".completeAssignment":
                completeAssignment(event);
                break;
        }
    }

    private void addAssignment(ButtonInteractionEvent event) {
        String user = event.getUser().getId();

        TextInput input = TextInput.create(
            "teams",
            "Teams to add",
            TextInputStyle.PARAGRAPH
        ).setPlaceholder("2530")
            .build();

        Modal modal = Modal.create(
            user + ".teamsAddedAssignment",
            "Add"
        ).addComponents(ActionRow.of(input))
            .build();

        event.replyModal(modal).queue();
    }

    private void removeAssignment(ButtonInteractionEvent event) {
        String user = event.getUser().getId();

        TextInput input = TextInput.create(
            "teams",
            "Teams to remove",
            TextInputStyle.PARAGRAPH
        ).setPlaceholder("2530")
            .build();

        Modal modal = Modal.create(
            user + ".teamsRemovedAssignment",
            "Remove"
        ).addComponents(ActionRow.of(input))
            .build();

        event.replyModal(modal).queue();
    }

    private void completeAssignment(ButtonInteractionEvent event) {
        String userId = event.getUser().getId();

        String assignment = "```\n{\"assignments\":  [" + String.join(",", instances.get(userId)) + "]}\n ```";
        event.reply(assignment).queue();
    }

    @Override
    public void modalSubmitExecute(ModalInteractionEvent event) {
        String id = event.getModalId();
        String suffix = id.substring(id.lastIndexOf("."));

        switch (suffix) {
            case ".teamsAddedAssignment":
                teamsAdded(event);
                break;
            case ".teamsRemovedAssignment":
                teamsRemoved(event);
                break;
        }
    }

    private void teamsAdded(ModalInteractionEvent event) {
        String userId = event.getUser().getId();

        ModalMapping value = event.getValue("teams");

        if (value != null) {
            ArrayList<String> selected = new ArrayList<>(Arrays.asList(instances.get(userId)));

            Matcher matcher = inputPattern.matcher(value.getAsString());
            while (matcher.find()) {
                selected.add(matcher.group());
            }
            instances.put(userId, selected.toArray(new String[selected.size()]));

            standardReply(event);
        } else {
            event.reply("```\nFailed to retrieve input\n");
        }
    }

    private void teamsRemoved(ModalInteractionEvent event) {
        String userId = event.getUser().getId();

        ModalMapping value = event.getValue("teams");

        if (value != null) {
            ArrayList<String> selected = new ArrayList<>(Arrays.asList(instances.get(userId)));

            Matcher matcher = inputPattern.matcher(value.getAsString());
            while (matcher.find()) {
                selected.remove(matcher.group());
            }
            instances.put(userId, selected.toArray(new String[selected.size()]));

            standardReply(event);
        } else {
            event.reply("```\nFailed to retrieve input\n");
        }
    }
}
