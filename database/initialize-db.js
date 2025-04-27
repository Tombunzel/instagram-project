import fs from "fs";
import { db } from "./db.js";

const initializeDatabase = () => {
  const schema = fs.readFileSync("database/schema.sql", "utf8");
  db.exec(schema);
};

initializeDatabase();
