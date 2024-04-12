import { readFileSync, writeFileSync } from "fs";

const data = JSON.parse(readFileSync("./pull", {encoding: 'utf8'}));

for(const [index, entry] of data.entries()) {
  writeFileSync(`downloaded-${index}.json`, JSON.stringify(entry));
}