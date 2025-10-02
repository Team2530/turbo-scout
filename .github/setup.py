from argparse import ArgumentParser
#TODO: from tbapy import TBA

parser = ArgumentParser()
parser.add_argument("config", help="Path to a YAML config file")

args = parser.parse_args()

print("config_path =", args.config)

with open(args.config, "r") as fp:
    config = fp.read()

    print(config)