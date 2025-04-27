import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join("src", ".")));

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

app.use("/static", express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: { message: "Something went wrong!", code: 500 } });
});

app.use((req, res) => {
  res.status(404).json({ error: { message: "Page not found", code: 404 } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app };
