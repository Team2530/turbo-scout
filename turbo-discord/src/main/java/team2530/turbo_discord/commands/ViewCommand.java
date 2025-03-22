package team2530.turbo_discord.commands;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.utils.FileUpload;
import team2530.turbo_discord.Command;
import team2530.turbo_discord.CommandOption;
import team2530.turbo_discord.store.DataStore;
import team2530.turbo_discord.Main;

public class ViewCommand extends Command {

    private static final Gson gson = new GsonBuilder().create();

    public ViewCommand() {
        super("view", "View data json", new CommandOption[]{
                new CommandOption(OptionType.INTEGER, "team", "Filter by team", true)
        });
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        Stream<DataStore.Entry> entryStream = Main.DATA_STORE.getEntries().stream();

        if (event.getOption("team") != null)
            entryStream = entryStream.filter(entry -> entry.getTeamNumber() == event.getOption("team", OptionMapping::getAsInt));


        List<DataStore.Entry> entries = entryStream.collect(Collectors.toList());

        // String s = gson.toJson(entries);
        String s = humanize(entries);

        if (s.length() < 1800) {
            event.reply("```markdown\n" + s + "\n```").queue();
        } else {
            event.replyFiles(FileUpload.fromData(s.getBytes(StandardCharsets.UTF_8), "turbo-view-" + event.getOption("team").getAsInt() + ".md")).queue();
        }

        List<String> fileIds = getFileIds(entries);
        fileIds.forEach(fileId -> {
            event.getChannel().sendFiles(FileUpload.fromData(Main.FILE_STORE.getFile(fileId).get())).queue();
        });
    }

    /**
     * Makes a list of entries more human readable
     */
    public static String humanize(List<DataStore.Entry> entries) {
        StringBuilder sb = new StringBuilder();

        for (DataStore.Entry entry : entries) {
            sb.append("---\n");
            sb.append("type: ").append(entry.getType()).append("\n");
            sb.append("user: ").append(entry.getUser()).append("\n");
            sb.append("timestamp: ").append(entry.getTimestamp()).append("\n");
            sb.append("\n");

            for (Map.Entry<String, Object> data : entry.getData().entrySet()) {
                sb.append("- ").append(data.getKey()).append(": ").append(data.getValue()).append("\n");
            }

            sb.append("\n");
        }

        return sb.toString();
    }

    private List<String> getFileIds(List<DataStore.Entry> entries) {
        List<String> images = new ArrayList<>();

        for (DataStore.Entry entry : entries) {
            if (entry.getType().equals("strategy")) {
                images.add(entry.getData().get("files").toString());
            }
            else if(entry.getType().equals("pit") && entry.getData().containsKey("photos")) {
                images.addAll((Collection<? extends String>) entry.getData().get("photos"));
            }
        }

        return images;
    }

}
