const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db/db");
const authRouter = require("./routes/auth.router");
const storyRouter = require("./routes/story.router");
const errorMiddleware = require("./middlewares/error.middleware");
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/story", storyRouter);

app.get("/api/health", (req, res) => {
  res.json({
    service: "Swiptory Backend API Server",
    status: "true",
    time: new Date(),
  });
});

app.use("/*", (req, res, next) => {
  res.status(404).json({ message: "page not found" });
  next();
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running at http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`database connection error`);
  });
