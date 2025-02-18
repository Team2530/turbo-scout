package team2530.turbo_discord.store;

import net.dv8tion.jda.api.entities.Message;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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
        } else { // hash all preexisting files
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                
                for (File file: this.directory.listFiles()) {
                    byte[] hash = digest.digest(Files.readAllBytes(file.toPath()));
                    hashes.add(hash);
                }
            } catch(NoSuchAlgorithmException | IOException exception){
                System.out.printf("exception: %s", exception.toString());
            }
        }
    }

    public void downloadAttachment(Message.Attachment attachment) {
        Path downloadPath = Paths.get(this.directory.getAbsolutePath() + File.separator + attachment.getFileName());
        attachment.getProxy().downloadToPath(downloadPath);

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(Files.readAllBytes(downloadPath));

            if (hashes.contains(hash)) {
                Files.delete(downloadPath);
            }
        } catch(NoSuchAlgorithmException | IOException exception) {
            System.out.printf("exception: %s", exception.toString());
        }

    }

}
