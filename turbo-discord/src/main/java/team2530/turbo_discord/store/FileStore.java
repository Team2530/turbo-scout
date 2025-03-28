package team2530.turbo_discord.store;

import java.io.File;
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
        File file = Paths.get(this.directory.getAbsolutePath(), String.format("image-%s.png", id)).toFile();

        if(file.exists()) {
            return Optional.of(file);
        }

        return Optional.empty();
    }

}
