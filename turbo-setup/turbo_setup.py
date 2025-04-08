from argparse import ArgumentParser
from tbapy import TBA
import json

parser = ArgumentParser()
parser.add_argument("event", help="The TBA event code")
parser.add_argument("--scouters", help="A file containing a list of team members seperated by line breaks. If not specified, the tool will prompt you for team members.")

args = parser.parse_args()

scouters = []

if args.scouters:
    # load from file
    with open(args.scouters, "r") as fp:
        scouters = [name.strip() for name in fp.readlines()]
else:
    print("Please enter a list of scouters, seperated by newlines. Use two newlines to exit.")
    while True:
        name = input(">> ")
        if len(name.strip()) == 0:
            break
        scouters.append(name)

tba = TBA("KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw")

obj = {
    "event": args.event,
    "info": tba.event(args.event),
    "teams": tba.event_teams(args.event), 
    "scouters": scouters
}

with open("teams.json", "w") as fp:
    json.dump(tba.event_teams(args.event), fp)

with open("event.json", "w") as fp:
    json.dump(obj, fp)
