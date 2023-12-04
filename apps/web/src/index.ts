import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.WEB_PORT ?? 5000;
const PUBLIC_DIR = path.join(process.cwd(), "static");
app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});
