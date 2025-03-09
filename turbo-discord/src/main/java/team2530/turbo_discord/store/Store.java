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
import java.util.Map;
import java.util.Set;

import com.google.gson.reflect.TypeToken;

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
              	Gson gson = new gson(); 

                for (File file: this.directory.listFiles()) {
		    Set<Map.Entry<String, String>> entries = gson.fromJson(Files.readString(file.toPath()).entrySet();
		    for (Map.Entry<String, String> entry: entries) {
			byte[] hash = digest.digest((file.toPath().toString() + entry.getKey() + entry.getValue()).getBytes());
			hashes.add(hash);
		    }
                }
            } catch(NoSuchAlgorithmException | IOException exception){
                System.out.printf("exception: %s", exception.toString());
            }
        }
    }

    private static Type jsonMap = new TypeToken<Map<String, String>>(){}.getType(); 
	    
    public void downloadAttachment(Message.Attachment attachment) {
        Path downloadPath = Paths.get(this.directory.getAbsolutePath() + File.separator + attachment.getFileName());
        attachment.getProxy().downloadToPath(downloadPath);
	
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
	    Gson gson = new Gson();

	    Set<Map.Entry<String, String>> entries = gson.fromJson(Files.readString(downloadPath)).entrySet();
 	    Set<Map.Entry<String, String>> newEntries = new Set<>();	    

	    for (Map.Entry<String, String> entry: entries) {
		byte[] hash = digest.digest((downloadPath.toString() + entry.getKey() + entry.getValue()).getBytes());

		if (!hashes.contains(hash)) {
		    newEntries.add(entry); 
		    hashes.add(hash);
		}
	    }

	    if (newEntries.size() > 0) {
		Files.writeString(downloadPath, gson.toJson(newEntries));
	    } else {
		Files.delete(downloadPath);
	    }



        } catch(NoSuchAlgorithmException | IOException exception) {
            System.out.printf("exception: %s", exception.toString());
        }

    }

}
