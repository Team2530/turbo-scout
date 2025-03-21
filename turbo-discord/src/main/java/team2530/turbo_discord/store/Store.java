package team2530.turbo_discord.store;

import net.dv8tion.jda.api.entities.Message;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

/**
 * A generic store class used for storing files in a directory
 */
public class Store {

    // The folder in which all files related to this store are located.
    protected final File directory;

    protected final ArrayList<byte[]> hashes;
    
    /**
     * Initialize a new data store
     * @param directory
     */
    protected Store(File directory) {
        this.directory = directory;
        this.hashes = new ArrayList<>();

        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

	    
    public void downloadAttachment(Message.Attachment attachment) {
        Path downloadPath = Paths.get(this.directory.getAbsolutePath() + File.separator + attachment.getFileName());
        attachment.getProxy().downloadToPath(downloadPath);
    }

}
