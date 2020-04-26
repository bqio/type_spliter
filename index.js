const fs = require("fs");
const readDir = require("fs-readdir-recursive");
const re_byte = /b\[(\d)\]/g;
const re_ubyte = /ub\[(\d)\]/g;
const re_int = /i\[(\d)\]/g;
const re_uint = /u\[(\d)\]/g;
const re_str = /s\[(\w+)\s?,\s?(\w+)\]/g;

const types = JSON.parse(fs.readFileSync("types.json", { encoding: "utf8" }));
const path = "example\\";
const files = readDir(path);

const json = {};
for (let file of files) {
  const buffer = fs.readFileSync(path + file);
  if (buffer.length < 4) {
    console.log(`[${file}]: Min length buffer eq 4.`);
    continue;
  }
  for (let type of types) {
    let result;
    let condition = type.if;
    if (json[type.name] == undefined) {
      json[type.name] = [];
    }
    while ((result = re_byte.exec(condition)) !== null) {
      condition = condition.replace(
        result[0],
        buffer.readInt8(Number(result[1]))
      );
    }
    while ((result = re_ubyte.exec(condition)) !== null) {
      condition = condition.replace(
        result[0],
        buffer.readUInt8(Number(result[1]))
      );
    }
    while ((result = re_int.exec(condition)) !== null) {
      condition = condition.replace(
        result[0],
        buffer.readInt32LE(Number(result[1] * 4))
      );
    }
    while ((result = re_uint.exec(condition)) !== null) {
      condition = condition.replace(
        result[0],
        buffer.readUInt32LE(Number(result[1] * 4))
      );
    }
    while ((result = re_str.exec(condition)) !== null) {
      const start = Number(result[1]);
      const end = Number(result[2]);
      const str = `'${buffer.slice(start, end).toString("utf8")}'`;

      condition = condition.replace(result[0], str);
    }

    console.log(`[${file}][${type.name}]: (${condition}) = ${eval(condition)}`);

    if (eval(condition)) {
      json[type.name].push(file);
    }
  }
}
fs.writeFileSync("data.json", JSON.stringify(json, null, " "));
