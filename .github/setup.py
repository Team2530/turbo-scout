from argparse import ArgumentParser
from yaml import load as load_yaml
from tbapy import TBA

parser = ArgumentParser()
parser.add_argument("config", help="Path to a YAML config file")

args = parser.parse_args()

config = yaml_load(open(args.config, "r").read())

scouters = config.scouters

print("scouters=", scouters)

#TODO: support adding manual regionals

tba = TBA("KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw")
info = tba.event(config.event)
teams = tba.event_teams(config.event)

obj = {
    "event": config.event,
    "info": info,
    "teams": teams,
    "scouters": scouters
}

with open("turbo-discord/src/main/resources/teams.json", "w") as fp:
    json.dump(teams, fp)
    print("Saved turbo-discord config")

with open("turbo-scout/src/config/event.json", "w") as fp:
    json.dump(obj, fp)
    print("Saved turbo-scout config")