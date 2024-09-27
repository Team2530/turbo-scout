# Turbo Server

A zero-dependency, single python file server for turbo scout.

## Usage

```bash

# Install Python
sudo apt install python3 # Debian, Ubuntu
sudo dnf install python3 # Fedora
sudo pacman -S python    # Arch Linux


# Setup for a new event
python3 turbo-server.py create

# Start the server for the event '2023mnmi'
python3 turbo-server.py start 2023mndu
```

## HTTP Routes

### GET `/status`

This route returns the current status of the server.  

An example response from this route might look like the following:

```json
{
  "status": "up",
  "event": "2023mndu"
}
```

### GET `/teams`

This route returns the list of teams and update timestamps.

The index file is in an unusual format to save space, but the result of `GET`ing `/teams` is in JSON.

An example response might look like this:

```json
  {
    "team": 1714,
    "updated": 1724630141
  },
  {
    "team": 1716,
    "updated": 1724630148
  },
  {
    "team": 1732,
    "updated": 1724630155
  },
  {
    "team": 1816,
    "updated": 1724630162
  },
  {
    "team": 2177,
    "updated": 1724630168
  },
  ...
]
```

### GET `/team/{TEAM}`

This route returns the contents of a specified team's manifest file. An example response might look like the following:

```jsonc
{
  "id": 2530,
  "name": "Inconceivable",
  "entries": [
    // Entry objects will be in here
  ]
}
```

### GET `/team/{TEAM}/{FILE}`

This route returns the contents of a specific file in a specified team's folder. It can be used to embed images in a data viewer, for example.

### POST `/team/{TEAM}`

Adds an entry to a team's entry list (located in the manifest file) and returns the MD5 checksum of the entry. The entry is send in the POST request body.

### POST `/team/{TEAM}/{FILE}`

Uploads a file to a team's folder. Like the main post route, this route also returns a MD5 checksum of the POST request body.

## Data Layout

`turbo-server.py` creates a directory for each event created by the create command, and inside it are subdirectories for each team at that event. Each team folder has a file with the same name as the folder, but with `.json` appended to the end. This file is the manifest file for that team and contains most of the information about it. It can like to attachments that are also in that folder, like images. There is also an index file for each event called `index`, and a JSON list of teams called `teams.json`. The index file contains a list of teams at the event with the timestamp at which they were last updated. This list is used by viewing programs to only download the data that is not already downloaded. The `teams.json` file is a response from the [Blue Alliance API Route `/event/{event}/teams`](https://www.thebluealliance.com/apidocs/v3#operations-list-getEventTeams).

```text
 2023mndu
 ├── 1816
 │   └── 1816.json
 ├── 2530
 │   └── 2530.json
 ├── index
 └── teams.json
```

### Index file

The file `{EVENT}/index` is not in a typical file format. It looks like this:

```text
1714:1724630141
1716:1724630148
1732:1724630155
1816:1724630162
2177:1724630168
...
```

Every line is a team number, followed by the colon character (`:`), and then the timestamp. Timestamps are created by calling [Python's `time.time()` function](https://docs.python.org/3/library/time.html#time.time), and casting it to an integer to save space.
