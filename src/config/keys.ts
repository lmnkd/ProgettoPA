import fs from "fs";
import path from "path";

export const privateKey = fs.readFileSync(
    path.resolve(process.env.JWT_PRIVATE_KEY_PATH!),
    "utf8"
);

export const publicKey = fs.readFileSync(
    path.resolve(process.env.JWT_PUBLIC_KEY_PATH!),
    "utf8"
);