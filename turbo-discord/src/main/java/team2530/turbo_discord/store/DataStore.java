package team2530.turbo_discord.store;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.SerializedName;

import java.io.*;
import java.nio.file.*;
import java.util.*;

import static java.nio.file.StandardWatchEventKinds.*;

/**
 * Manage the turbo-scout data storage directory
 */
public class DataStore extends Store {
    private static final Gson gson = new GsonBuilder().create();

    /**
     * An ArrayList of entries that are loaded in memory
     */
    private final ArrayList<DataStore.Entry> entries;

    /**
     * Create a new data store.
     *
     * @param directory The directory to use
     */
    public DataStore(File directory) {
        super(directory);

        this.entries = new ArrayList<>();

        // Load all existing entries into memory
        loadDataStore();

        // Watch for new files in the data directory
        new Thread(this::watchDataStoreForChanges, "watcher").start();
    }

    /**
     * Load everything in the data directory.
     */
    private void loadDataStore() {
        Arrays.stream(this.directory.listFiles()).forEach(this::loadEntriesFromFile);
    }

    /**
     * Load all entries from a file
     *
     * @param file The file to load from
     */
    private void loadEntriesFromFile(File file) {
        try {
            gson.fromJson(new FileReader(file), TurboScoutDataFile.class).entries.forEach(this.entries::add);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException(String.format("Failed to load entries from file '%s'!", file.getAbsoluteFile()),
                    e);
        }
    }

    /**
     * Watch for paths created in the data directory, then load things that are
     * added.
     */
    private void watchDataStoreForChanges() {
        final Path path = this.directory.toPath();
        final FileSystem fileSystem = path.getFileSystem();

        try (WatchService service = fileSystem.newWatchService()) {

            path.register(service, ENTRY_CREATE);

            WatchKey key = null;
            while (true) {
                key = service.take();

                WatchEvent.Kind<?> kind = null;
                for (WatchEvent<?> watchEvent : key.pollEvents()) {
                    kind = watchEvent.kind();

                    if (kind != ENTRY_CREATE)
                        continue; // We only care about file creations.

                    try {
                        new Thread(() -> {
                            try {
                                Thread.sleep(5000);
                            } catch (InterruptedException e) {
                                throw new RuntimeException(e);
                            }
                            Path path1 = ((WatchEvent<Path>) watchEvent).context();
                            this.loadEntriesFromFile(new File(this.directory, path1.toString()));
                            System.out.println("Loaded new data!");
                        }, "downloader-thread").start();
                    } catch (Exception e) {
                        System.err.println("Failed to load data file: " + e.getMessage());
                    }
                }

                if (!key.reset()) {
                    break;
                }
            }

        } catch (IOException | InterruptedException ex) {
            ex.printStackTrace();
        }
    }

    public ArrayList<Entry> getEntries() {
        return entries;
    }

    public static class TurboScoutDataFile {
        private final List<Entry> entries;

        public TurboScoutDataFile(List<Entry> entries) {
            this.entries = entries;
        }

        public List<Entry> getEntries() {
            return entries;
        }
    }

    public static class Entry {
        @SerializedName("team")
        private final int teamNumber;
        private final HashMap<String, Object> data;
        private final String type;
        private final String user;
        private final String timestamp;

        public Entry(int teamNumber, HashMap<String, Object> data, String type, String user, String timestamp) {
            this.teamNumber = teamNumber;
            this.data = data;
            this.type = type;
            this.user = user;
            this.timestamp = timestamp;
        }

        public int getTeamNumber() {
            return teamNumber;
        }

        public HashMap<String, Object> getData() {
            return data;
        }

        public String getType() {
            return type;
        }

        public String getUser() {
            return user;
        }

        public String getTimestamp() {
            return timestamp;
        }
    }

}
