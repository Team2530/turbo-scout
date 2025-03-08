package team2530.turbo_discord;

import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.events.interaction.ModalInteractionEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.StringSelectInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.util.Arrays;

import javax.annotation.Nonnull;

public class TurboListener extends ListenerAdapter {
    @Override
    public void onSlashCommandInteraction(@Nonnull SlashCommandInteractionEvent event) {
        final Command command = Arrays.stream(Main.COMMANDS)
                .filter(c -> c.getName().equals(event.getName()))
                .findFirst()
                .orElseThrow(RuntimeException::new);

        command.execute(event);
    }

    private Command findCommand(String id) {
        String suffix = id.substring(id.lastIndexOf("."));
       return Arrays.stream(Main.COMMANDS)
            .filter(c -> Arrays.stream(c.getComponentOptions())
                .anyMatch(component -> 
                    component.getSuffix().equals(suffix)
                )
            ).findFirst()
            .orElseThrow(RuntimeException::new);
    }

    @Override
    public void onButtonInteraction(@Nonnull ButtonInteractionEvent event) {
        final Command command = findCommand(event.getComponentId());
        command.buttonExecute(event);
    }

    @Override
    public void onStringSelectInteraction(@Nonnull StringSelectInteractionEvent event) {
        final Command command = findCommand(event.getComponentId());
        command.stringSelectExecute(event);
    }

    @Override
    public void onModalInteraction(@Nonnull ModalInteractionEvent event) {
        final Command command = findCommand(event.getModalId());
        command.modalSubmitExecute(event);
    }

    @Override
    public void onMessageReceived(@Nonnull MessageReceivedEvent event) {
        super.onMessageReceived(event);

        // We only care about webhook messages from turbo scout in the webhook-data channel
        if(!event.isWebhookMessage()) return;
        if (event.getGuildChannel().getIdLong() != 1289016808845738058L) return;

        // Download all attachments
        for (Message.Attachment attachment : event.getMessage().getAttachments()) {

            // Images are a special case and must be handled separately
            if (attachment.getContentType().startsWith("image/")) {
                Main.IMAGE_STORE.downloadAttachment(attachment);
                continue;
            }

            Main.DATA_STORE.downloadAttachment(attachment);
        }
    }

}
