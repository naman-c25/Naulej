import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.memoryStorage();

export const upload = multer({ storage });