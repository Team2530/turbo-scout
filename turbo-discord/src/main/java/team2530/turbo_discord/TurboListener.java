package team2530.turbo_discord;

import net.dv8tion.jda.api.entities.Message;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;

public class TurboListener extends ListenerAdapter {
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        final Command command = Arrays.stream(Main.COMMANDS)
                .filter(c -> c.getName().equals(event.getName()))
                .findFirst()
                .orElseThrow(RuntimeException::new);

        command.execute(event);
    }

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
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
