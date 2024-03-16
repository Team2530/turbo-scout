# turbo-scout

### Naming

A random name generator was used for the temporary project name `turbo-scout`.

### Priority Objectives

- Having a server [team website or github]
- Sending text data to that server
  - Pit scouting
  - Match scouting
    - Position-based by default
    - More options if they are required
- PWA & Make it work *almost* entirely offline
- Data viewer / exporter
  - This will require a lot of thought
  - Might be nice to stick with a sharable PDF file that can be posted in discord- although that limits our options for display.
  - Use TBA and/or statbotics data alongside our own
- Getting team info from TBA
  - Clear process for setting user's team # and event
- Client-side method to select current event.
  - Server can hold data for each of these events, user can sync to respective data sets
- Separate menus for scouting and viewing data (obviously)
- In-depth bugfix process involving multiple different people's phones

### Extra

* Easy-to-read documentation sorted by function for users who don't know how to use the thing
  - Extremely helpful if we have time
  - Add lots of screenshots with large red arrows
* Image uploading
  * Different fields for photos of the bot, photos of their pit and photos of their auto routines.
* A system of 'configurations' like swerve-scout has for different seasons or years
* Support for a pit map within the app
  * Some vision system that highlights the pit location of a team you want to look at
  * Pathfinding, if we have a lot of extra time or people

* Editable lists of details to scout
  * When match or pit scouting there's a default list of things that are ideal to scout. This should be easily editable on client-side in the case that the scouter thinks it's useful.
    * Like Google Form's creation system?
* Button to clear data from device?
  * Might not be needed if the client can calculate a data differential and then use that to sync
* Make the service check its parent page for changes, and if so bring up a window that the user can see which states that there's an update.
  * A force update should still be available.
* Searchable dropdown for selecting events