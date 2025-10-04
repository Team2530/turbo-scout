package team2530.turbo_discord.store;

import java.io.File;
import java.io.FileFilter;
import java.nio.file.Paths;
import java.util.Optional;

public class FileStore extends Store {

    /**
     * Initializes a new file store
     *
     * @param directory The directory files are stored in
     */
    public FileStore(File directory) {
        super(directory);
    }

    public Optional<File> getFile(String id) {
        File file = this.directory.listFiles(new FileFilter() {
            @Override
            public boolean accept(File suspect) {
                return suspect.getName().startsWith(id);
            }
        })[0];

        if (file.exists()) {
            return Optional.of(file);
        }

        return Optional.empty();
    }

    public Optional<String> getFileURL(String id) {
        Optional<File> file = getFile(id);
        if (file.isPresent()) {
            // hash-(channelId#messageId).png
            // https://cdn.discordapp.com/attachments/channelId/messageId/filename
            String filename = file.get().getName();
            String hash = filename.replaceAll("-.*$", "");
            String ids = filename.replaceAll(".*-\\(", "") // remove hash and -(
                    .replaceAll("\\)\\..*$", "") // remove ) and file extension
                    .replace('#', '/'); // url formatting
            String fileExtension = filename.replaceAll("^.*?\\.", "");

            return Optional.of(
                    "https://cdn.discordapp.com/attachments/"
                            + ids + "/"
                            + hash
                            + "." + fileExtension);
        } else {
            return Optional.empty();
        }

    }

}
