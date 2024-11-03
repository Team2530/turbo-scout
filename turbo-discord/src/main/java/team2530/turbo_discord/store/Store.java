package team2530.turbo_discord.store;

import net.dv8tion.jda.api.entities.Message;

import java.io.File;
import java.nio.file.Paths;

/**
 * A generic store class used for storing files in a directory
 */
public class Store {

    // The folder in which all files related to this store are located.
    protected final File directory;

    /**
     * Initialize a new data store
     * @param directory
     */
    protected Store(File directory) {
        this.directory = directory;

        if (!directory.exists())
            directory.mkdirs();
    }

    public void downloadAttachment(Message.Attachment attachment) {
        attachment.getProxy().downloadToFile(Paths.get(this.directory.getAbsolutePath() + File.separator + attachment.getFileName()).toFile());
    }

}
