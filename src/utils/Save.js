import fs from "fs";

export default function Save(item, filePath) {
    const dataString = JSON.stringify(item);
    return fs.writeFileSync(filePath, dataString);
}