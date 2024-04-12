const { readFileSync } = require("fs");

const inputData = readFileSync("./rc_schema.txt", { encoding: 'utf8' })
    .split("\n")
    .filter(line => line != '')
    .map(line => line.split(/[ ]+/)[0].replace(",", ""));


const output = inputData.map(entry => {
    return {
        "rc_name": entry
    }
});

console.log(JSON.stringify(output));