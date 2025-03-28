package team2530.turbo_discord.store;

import net.dv8tion.jda.api.entities.Message;
import team2530.turbo_discord.store.DataStore.TurboScoutDataFile;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.imageio.ImageIO;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.google.gson.Gson;

/**
 * A generic store class used for storing files in a directory
 */
public class Store {

    // The folder in which all files related to this store are located.
    protected final File directory;

    protected final ArrayList<String> hashes;
    
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
                Gson gson = new Gson();

                for (File file : this.directory.listFiles()) {
		    if(!file.getName().endsWith("json")) continue;
                    List<DataStore.Entry> entries = gson.fromJson(new FileReader(file),TurboScoutDataFile.class).getEntries();
                    for (DataStore.Entry entry: entries) {
                        deduplicateEntry(entry);
                    }
                }
            } catch (IOException exception) {
                System.out.printf("exception: %s\n", exception.toString());
            }
        }
    }

    private String makePrefix(DataStore.Entry entry) {
        return String.valueOf(entry.getTeamNumber())
            + "-" + entry.getUser()
            + "-" + entry.getTeamNumber()
            + "-" + entry.getType()
            + (entry.getType().equals("match")
                ? entry.getData().get("match_number").toString()
                : ""
            ) + "-";
    }

    private DataStore.Entry deduplicateEntry(DataStore.Entry entry) {
        try {
            MessageDigest digester = MessageDigest.getInstance("SHA-256");

            HashMap<String, Object> data = entry.getData();
            HashMap<String, Object> deduplicated = new HashMap<String, Object>(data);

            String prefix = makePrefix(entry);

            for (Map.Entry<String, Object> dataEntry: data.entrySet()) {
                String key = dataEntry.getKey();
                String value = dataEntry.getValue().toString();

                String undigested = prefix 
                    + key + ":" + value;

                String digest = Arrays.toString(digester.digest(undigested.getBytes()));

                if (hashes.contains(digest)) {
                    deduplicated.remove(key);
                } else {
                    hashes.add(digest);
                }
            }   

            return new DataStore.Entry(
                entry.getTeamNumber(), 
                deduplicated, 
                entry.getType(), 
                entry.getUser(), 
                entry.getTimestamp()
            );
        } catch (NoSuchAlgorithmException exception) {
            System.out.printf("exception: %s\n", exception.toString());
            return entry;
        }
    }

    private boolean isUnique(BufferedImage image) {
        try {
            MessageDigest digester = MessageDigest.getInstance("SHA-256");

            ByteArrayOutputStream undigested = new ByteArrayOutputStream();
            ImageIO.write(image, "png", undigested);

            String digest = Arrays.toString(digester.digest(undigested.toByteArray()));
            
            if (hashes.contains(digest)) {
                return false;
            } else {
                hashes.add(digest);
                return true;
            }

        } catch (NoSuchAlgorithmException | IOException exception) {
            System.out.printf("exception: %s\n", exception.toString());
            return false;
        }
    }

    public void downloadAttachment(Message.Attachment attachment) {
        Path downloadPath = Paths.get(this.directory.getAbsolutePath() + File.separator + attachment.getFileName());
	
        try {
            InputStream attachmentData = attachment.getProxy().download().get();

            if (attachment.getFileExtension().equals("json")) {
                Gson gson = new Gson();
                
                List<DataStore.Entry> entries = gson.fromJson(new InputStreamReader(attachmentData), TurboScoutDataFile.class).getEntries();
                List<DataStore.Entry> deduplicated = new ArrayList<>();

                for (DataStore.Entry entry: entries) {
                    DataStore.Entry deduplicateEntry = deduplicateEntry(entry);
                    if (!deduplicateEntry.getData().isEmpty()) {
                        deduplicated.add(deduplicateEntry);
                    }
                }
            
                if (!deduplicated.isEmpty()) {
                    Files.write(downloadPath, gson.toJson(new TurboScoutDataFile(deduplicated)).getBytes());
                }
            } else { // assume its an image 
                BufferedImage image = ImageIO.read(attachmentData);
                if (isUnique(image)) {
                    ImageIO.write(image, attachment.getFileExtension(), downloadPath.toFile());
                }
            }
        } catch(IOException | InterruptedException | ExecutionException exception) {
            System.out.printf("exception: %s\n", exception.toString());
        }

    }

	    
}
