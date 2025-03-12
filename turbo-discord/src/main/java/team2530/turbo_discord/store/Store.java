package team2530.turbo_discord.store;

import net.dv8tion.jda.api.entities.Message;
import team2530.turbo_discord.TurboListener;
import team2530.turbo_discord.store.DataStore;
import team2530.turbo_discord.store.DataStore.TurboScoutDataFile;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.google.gson.Gson;

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
                Gson gson = new Gson();

                for (File file : this.directory.listFiles()) {
                    List<DataStore.Entry> entries = gson.fromJson(new FileReader(file),TurboScoutDataFile.class).getEntries();
                    for (DataStore.Entry entry: entries) {
                        deduplicateEntry(entry);
                    }
                }
            } catch (IOException exception) {
                System.out.printf("exception: %s", exception.toString());
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

            String prefix = makePrefix(entry);

            for (Map.Entry<String, Object> dataEntry: data.entrySet()) {
                String key = dataEntry.getKey();
                String value = dataEntry.getValue().toString();

                String undigested = prefix 
                    + key + ":" + value;

                byte[] digest = digester.digest(undigested.getBytes());

                if (hashes.contains(digest)) {
                    data.remove(key);
                } else {
                    hashes.add(digest);
                }
            }   

            return new DataStore.Entry(
                entry.getTeamNumber(), 
                data, 
                entry.getType(), 
                entry.getUser(), 
                entry.getTimestamp()
            );
        } catch (NoSuchAlgorithmException exception) {
            System.out.printf("exception: %s", exception.toString());
            return entry;
        }
    }

    public void downloadAttachment(Message.Attachment attachment) {
        Path downloadPath = Paths.get(this.directory.getAbsolutePath() + File.separator + attachment.getFileName());
	
        try {
            Gson gson = new Gson();

            InputStream attachmentData = attachment.getProxy().download().get();
            List<DataStore.Entry> entries = gson.fromJson(new InputStreamReader(attachmentData), TurboScoutDataFile.class).getEntries();
            List<DataStore.Entry> deduplicated = new ArrayList<>();

            for (DataStore.Entry entry: entries) {
                deduplicated.add(deduplicateEntry(entry));
            }
            
            Files.write(downloadPath, gson.toJson(new TurboScoutDataFile(deduplicated)).getBytes());

        } catch(IOException | InterruptedException | ExecutionException exception) {
            System.out.printf("exception: %s", exception.toString());
        }

    }

}
