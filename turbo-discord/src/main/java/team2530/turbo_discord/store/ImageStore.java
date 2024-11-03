package team2530.turbo_discord.store;

import team2530.turbo_discord.store.Store;

import java.io.File;
import java.nio.file.Paths;
import java.util.Optional;

public class ImageStore extends Store {

    /**
     * Initializes a new image store
     *
     * @param directory The directory images are stored in
     */
    public ImageStore(File directory) {
        super(directory);
    }

    public Optional<File> getImageFile(String id) {
        File file = Paths.get(this.directory.getAbsolutePath(), String.format("image-%s.png", id)).toFile();

        if(file.exists()) {
            return Optional.of(file);
        }

        return Optional.empty();
    }

}
