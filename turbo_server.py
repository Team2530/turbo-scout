"""
turbo_server.py

Turbo Scout's HTTP(s)-based server.

See turbo_server.md for documentation.
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
from http.client import HTTPSConnection

import os
import sys
import mimetypes
import re
from hashlib import md5

from time import time
from json import dumps as json_str, loads as load_json

# These control the server host address and port.
# They must be changed manually in this source file, and are not able to be set through the CLI.
SERVER_ADDR = "0.0.0.0"
SERVER_PORT = 2530

# Regular expression for validating paths in team folders
PATH_VALIDATION_REGEX = "[a-zA-Z0-9\\.-_]{4,80}"

HEADER = """\
████████╗██╗   ██╗██████╗ ██████╗  ██████╗     ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗
╚══██╔══╝██║   ██║██╔══██╗██╔══██╗██╔═══██╗    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
   ██║   ██║   ██║██████╔╝██████╔╝██║   ██║    ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
   ██║   ██║   ██║██╔══██╗██╔══██╗██║   ██║    ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
   ██║   ╚██████╔╝██║  ██║██████╔╝╚██████╔╝    ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
"""

# The current event key. It is the same format used by the blue alliance.
# This is used for the 'start' command only, and is set from a cli argument.
event = None

"""
The main Turbo server class. 

This is an HTTP Request handler that implements methods defined by Python's http.server module.

See https://docs.python.org/3/library/http.server.html for more information.
"""
class TurboServer(BaseHTTPRequestHandler):

    # Utility function for sending responses in a single line
    def respond(self, code: int, mime: str, content: str):
        self.send_response(code)
        self.send_header("Content-type", mime)
        self.end_headers()
        self.wfile.write(bytes(content, "utf8"))

    def do_GET(self):
        if event is None:
            print("Event is not defined! This should not happen!")
            sys.exit(1)

        if self.path == "/status":
            self.respond(200, "application/json", json_str({
                'status': 'up',
                'event': event
            }))

        elif self.path == "/teams":
            with open(f"{event}/index", "r", encoding='utf-8') as fp:
                self.respond(200, "application/json", json_str([{
                    'team': int(entry.strip().split(":")[0]),
                    'updated': int(entry.strip().split(":")[1])
                } for entry in fp.readlines()]))

        elif self.path.startswith("/team/"):
            team_id = int(self.path.split("/")[2])

            if not os.path.exists(f"{event}/{team_id}"):
                self.respond(400, "plain/text", "The team '" +
                             team_id + "' is not at this regional!")
                return

            base_dir = f"{event}/{team_id}"
            team_path = self.path[(len(f"/team/{team_id}")):]

            if team_path == "" or team_path == "/":
                with open(f"{base_dir}/{team_id}.json", "r", encoding='utf-8') as fp:
                    self.respond(200, "application/json", fp.read())
            else:

                if not re.fullmatch(PATH_VALIDATION_REGEX,
                                    team_path[1:]) or team_path == f"/{team_id}.json":
                    self.respond(
                        400,
                        "text/plain",
                        "Invalid team file path! It must match the regular expression '%s', and it cannot be TEAM.json!" %
                        PATH_VALIDATION_REGEX)
                    return
                if not os.path.exists(f"{base_dir}/{team_path[1:]}"):
                    self.respond(404, "text/plain", "File not found")
                    return
                with open(f"{base_dir}/{team_path[1:]}", "r", encoding='utf-8') as fp:
                    self.respond(200, mimetypes.guess_type(
                        team_path), fp.read())
        else:
            self.respond(404, "text/plain", "Resource not found.")

    def do_POST(self):
        if event is None:
            print("Event is not defined! This should not happen!")
            sys.exit(1)

        if not self.path.startswith("/team/"):
            self.respond(404, "text/plain", "Resource not found")

        team_id = int(self.path.split("/")[2])
        team_path = self.path[(len(f"/team/{team_id}")):]
        base_dir = f"{event}/{team_id}"

        content_length = int(self.headers['Content-Length'])
        if content_length <= 0 or content_length > 12 * 1024 * 1024:  # 12MB
            self.respond(400, "text/plain", "Invalid content-length!")
            return
        file_content = self.rfile.read(content_length).decode("utf-8")

        if team_path == "" or team_path == "/":
            # Update the index
            with open(f"{event}/index", "r+", encoding='utf-8') as fp:
                entries = [{'team': int(line.strip().split(":")[0]), 'timestamp': line.strip(
                ).split(":")[1]} for line in fp.readlines()]
                entries = map(
                    lambda entry: {
                        'team': entry['team'],
                        'timestamp': int(
                            time())} if entry['team'] == team_id else entry,
                    entries)
                print(entries)
                fp.seek(0)
                for entry in entries:
                    fp.write(f"{entry['team']}:{entry['timestamp']}\n")
                fp.truncate()

            # Append the entry to the entry list
            with open(f"{base_dir}/{team_id}.json", "r+", encoding='utf-8') as fp:
                manifest = load_json(fp.read())
                manifest['entries'].append(load_json(file_content))
                fp.seek(0)
                fp.write(json_str(manifest))
                fp.truncate()

                self.respond(200, "text/plain",
                             md5(file_content.encode('utf-8')).hexdigest())
                return
        else:
            if not re.fullmatch(PATH_VALIDATION_REGEX,
                                team_path[1:]) or team_path == f"/{team_id}.json":
                self.respond(
                    400,
                    "text/plain",
                    "Invalid team file path! It must match the regular expression '%s', and it cannot be TEAM.json!" %
                    PATH_VALIDATION_REGEX)
                return

            with open(f"{base_dir}/{team_path[1:]}", "w", encoding='utf-8') as fp:
                fp.write(file_content)
                self.respond(200, "text/plain",
                             md5(file_content.encode("utf-8")).hexdigest())
                return

        self.respond(200, "text/plain", "Hello world")

"""
Gets a list of teams at an event from The Blue Alliance
"""
def get_teams(event: str):
    conn = HTTPSConnection("www.thebluealliance.com")
    conn.request(
        "GET",
        f"/api/v3/event/{event}/teams",
        headers={
            "X-TBA-Auth-Key": "KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw"})

    return load_json(conn.getresponse().read())


def handle_create():
    event_code = input("Event code: ")

    if os.path.exists(event_code):
        print("The directory for event '" + event_code + "' already exists!")
        sys.exit(1)

    os.mkdir(event_code)

    teams = get_teams(event_code)

    with open(event_code + "/index", "w", encoding='utf-8') as fp:
        for team in teams:
            fp.write(f"{team['team_number']}:0\n")

    with open(event_code + "/teams.json", "w", encoding='utf-8') as fp:
        fp.write(json_str(teams))

    for team in teams:
        os.mkdir(event_code + "/" + str(team['team_number']))

        with open(event_code + "/" + str(team['team_number']) + "/" + str(team['team_number']) + ".json", "w", encoding='utf-8') as fp:
            doc = {"id": team['team_number'],
                   "name": team['nickname'], "entries": []}
            fp.write(json_str(doc))


if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("Usage: python3 turbo-server.py create")
        print("Usage: python3 turbo-server.py start [event]")
        sys.exit(0)

    command = sys.argv[1]

    if command == "create":
        handle_create()
    elif command == "start":
        if len(sys.argv) != 3:
            print("Usage: python3 turbo-server.py start [event]")
            sys.exit(0)
        event = sys.argv[2]
        server = HTTPServer((SERVER_ADDR, SERVER_PORT), TurboServer)

        print(HEADER)

        print(
            f"[turbo-server] Started HTTP server at http://{SERVER_ADDR}:{SERVER_PORT} for event {event}")
        server.serve_forever()
        server.server_close()
        print("[turbo-server] Server stopped.")
    else:
        print("Unsupported command '" + command + "'!")
