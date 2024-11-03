package team2530.turbo_discord.store;

import team2530.turbo_discord.store.Store;

import java.io.File;

public class ImageStore extends Store {

    private File directory;


    /**
     * Initializes a new image store
     *
     * @param directory The directory images are stored in
     */
    public ImageStore(File directory) {
        super(directory);
    }

}
